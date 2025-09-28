"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { WebRTCManager } from "@/lib/webrtc/webrtc-manager"
import { AudioProcessor } from "@/lib/webrtc/audio-processor"

export interface UseWebRTCOptions {
  onRemoteStream?: (stream: MediaStream) => void
  onConnectionStateChange?: (state: RTCPeerConnectionState) => void
  onError?: (error: Error) => void
}

export function useWebRTC(options: UseWebRTCOptions = {}) {
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [connectionState, setConnectionState] = useState<RTCPeerConnectionState>("closed")
  const [audioLevel, setAudioLevel] = useState(0)

  const webrtcManager = useRef<WebRTCManager | null>(null)
  const audioProcessor = useRef<AudioProcessor | null>(null)

  // Initialize WebRTC manager
  useEffect(() => {
    webrtcManager.current = new WebRTCManager()
    audioProcessor.current = new AudioProcessor()

    // Set up event handlers
    webrtcManager.current.onRemoteStream((stream) => {
      console.log("[v0] Remote stream received in hook")
      setRemoteStream(stream)
      options.onRemoteStream?.(stream)
    })

    webrtcManager.current.onConnectionStateChange((state) => {
      console.log("[v0] Connection state changed in hook:", state)
      setConnectionState(state)
      setIsConnected(state === "connected")
      setIsConnecting(state === "connecting")
      options.onConnectionStateChange?.(state)
    })

    return () => {
      webrtcManager.current?.cleanup()
      audioProcessor.current?.cleanup()
    }
  }, [])

  // Audio level monitoring
  useEffect(() => {
    if (!audioProcessor.current) return

    const interval = setInterval(() => {
      const level = audioProcessor.current!.getAudioLevel()
      setAudioLevel(level)
    }, 100)

    return () => clearInterval(interval)
  }, [localStream])

  // Start call
  const startCall = useCallback(
    async (constraints: { video: boolean; audio: boolean }) => {
      if (!webrtcManager.current || !audioProcessor.current) {
        throw new Error("WebRTC not initialized")
      }

      try {
        setIsConnecting(true)
        console.log("[v0] Starting call with constraints:", constraints)

        // Get user media
        const rawStream = await webrtcManager.current.getUserMedia(constraints)

        // Process audio stream for noise cancellation
        const processedStream = await audioProcessor.current.processAudioStream(rawStream)

        setLocalStream(processedStream)
        setIsVideoEnabled(constraints.video)

        // Create offer
        await webrtcManager.current.createOffer()

        // In demo mode, simulate connection after 2 seconds
        setTimeout(() => {
          setIsConnected(true)
          setIsConnecting(false)
          console.log("[v0] Demo call connected")
        }, 2000)
      } catch (error) {
        console.error("[v0] Error starting call:", error)
        setIsConnecting(false)
        options.onError?.(error as Error)
        throw error
      }
    },
    [options],
  )

  // End call
  const endCall = useCallback(() => {
    console.log("[v0] Ending call")

    webrtcManager.current?.cleanup()
    audioProcessor.current?.cleanup()

    setLocalStream(null)
    setRemoteStream(null)
    setIsConnected(false)
    setIsConnecting(false)
    setConnectionState("closed")
    setAudioLevel(0)

    // Reinitialize for next call
    webrtcManager.current = new WebRTCManager()
    audioProcessor.current = new AudioProcessor()
  }, [])

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (webrtcManager.current) {
      const newMutedState = !isMuted
      webrtcManager.current.toggleAudio(newMutedState)
      setIsMuted(newMutedState)
      console.log("[v0] Mute toggled:", newMutedState)
    }
  }, [isMuted])

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (webrtcManager.current) {
      const newVideoState = !isVideoEnabled
      webrtcManager.current.toggleVideo(newVideoState)
      setIsVideoEnabled(newVideoState)
      console.log("[v0] Video toggled:", newVideoState)
    }
  }, [isVideoEnabled])

  // Send message
  const sendMessage = useCallback((message: string) => {
    webrtcManager.current?.sendMessage(message)
  }, [])

  // Get connection stats
  const getStats = useCallback(async () => {
    return webrtcManager.current?.getStats() || null
  }, [])

  return {
    // State
    isConnected,
    isConnecting,
    localStream,
    remoteStream,
    isMuted,
    isVideoEnabled,
    connectionState,
    audioLevel,

    // Actions
    startCall,
    endCall,
    toggleMute,
    toggleVideo,
    sendMessage,
    getStats,
  }
}
