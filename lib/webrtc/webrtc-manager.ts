// WebRTC Manager for handling peer-to-peer connections
export class WebRTCManager {
  private peerConnection: RTCPeerConnection | null = null
  private localStream: MediaStream | null = null
  private remoteStream: MediaStream | null = null
  private dataChannel: RTCDataChannel | null = null
  private onRemoteStreamCallback?: (stream: MediaStream) => void
  private onConnectionStateChangeCallback?: (state: RTCPeerConnectionState) => void
  private onDataChannelMessageCallback?: (message: string) => void

  // STUN servers for NAT traversal
  private readonly iceServers = [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
  ]

  constructor() {
    this.initializePeerConnection()
  }

  private initializePeerConnection() {
    this.peerConnection = new RTCPeerConnection({
      iceServers: this.iceServers,
    })

    // Handle remote stream
    this.peerConnection.ontrack = (event) => {
      console.log("[v0] Received remote stream")
      this.remoteStream = event.streams[0]
      if (this.onRemoteStreamCallback) {
        this.onRemoteStreamCallback(this.remoteStream)
      }
    }

    // Handle connection state changes
    this.peerConnection.onconnectionstatechange = () => {
      const state = this.peerConnection?.connectionState
      console.log("[v0] Connection state changed:", state)
      if (this.onConnectionStateChangeCallback && state) {
        this.onConnectionStateChangeCallback(state)
      }
    }

    // Handle ICE candidates
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("[v0] New ICE candidate:", event.candidate)
        // In a real app, send this to the remote peer via signaling server
        this.sendSignalingMessage({
          type: "ice-candidate",
          candidate: event.candidate,
        })
      }
    }

    // Create data channel for text messaging during calls
    this.dataChannel = this.peerConnection.createDataChannel("messages", {
      ordered: true,
    })

    this.dataChannel.onopen = () => {
      console.log("[v0] Data channel opened")
    }

    this.dataChannel.onmessage = (event) => {
      console.log("[v0] Data channel message:", event.data)
      if (this.onDataChannelMessageCallback) {
        this.onDataChannelMessageCallback(event.data)
      }
    }

    // Handle incoming data channel
    this.peerConnection.ondatachannel = (event) => {
      const channel = event.channel
      channel.onmessage = (event) => {
        if (this.onDataChannelMessageCallback) {
          this.onDataChannelMessageCallback(event.data)
        }
      }
    }
  }

  // Get user media with noise cancellation
  async getUserMedia(constraints: { video: boolean; audio: boolean }) {
    try {
      const audioConstraints = constraints.audio
        ? {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
            sampleRate: 48000,
            channelCount: 1,
          }
        : false

      const videoConstraints = constraints.video
        ? {
            width: { ideal: 1280, max: 1920 },
            height: { ideal: 720, max: 1080 },
            frameRate: { ideal: 30, max: 60 },
          }
        : false

      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: videoConstraints,
        audio: audioConstraints,
      })

      console.log("[v0] Got user media:", this.localStream)

      // Add tracks to peer connection
      if (this.peerConnection) {
        this.localStream.getTracks().forEach((track) => {
          this.peerConnection!.addTrack(track, this.localStream!)
        })
      }

      return this.localStream
    } catch (error) {
      console.error("[v0] Error getting user media:", error)
      throw error
    }
  }

  // Create offer for outgoing call
  async createOffer(): Promise<RTCSessionDescriptionInit> {
    if (!this.peerConnection) {
      throw new Error("Peer connection not initialized")
    }

    try {
      const offer = await this.peerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      })

      await this.peerConnection.setLocalDescription(offer)
      console.log("[v0] Created offer:", offer)

      // In a real app, send this offer to the remote peer via signaling server
      this.sendSignalingMessage({
        type: "offer",
        sdp: offer,
      })

      return offer
    } catch (error) {
      console.error("[v0] Error creating offer:", error)
      throw error
    }
  }

  // Create answer for incoming call
  async createAnswer(offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit> {
    if (!this.peerConnection) {
      throw new Error("Peer connection not initialized")
    }

    try {
      await this.peerConnection.setRemoteDescription(offer)

      const answer = await this.peerConnection.createAnswer()
      await this.peerConnection.setLocalDescription(answer)

      console.log("[v0] Created answer:", answer)

      // In a real app, send this answer to the remote peer via signaling server
      this.sendSignalingMessage({
        type: "answer",
        sdp: answer,
      })

      return answer
    } catch (error) {
      console.error("[v0] Error creating answer:", error)
      throw error
    }
  }

  // Handle remote answer
  async handleAnswer(answer: RTCSessionDescriptionInit) {
    if (!this.peerConnection) {
      throw new Error("Peer connection not initialized")
    }

    try {
      await this.peerConnection.setRemoteDescription(answer)
      console.log("[v0] Set remote description (answer)")
    } catch (error) {
      console.error("[v0] Error handling answer:", error)
      throw error
    }
  }

  // Handle ICE candidate
  async handleIceCandidate(candidate: RTCIceCandidateInit) {
    if (!this.peerConnection) {
      throw new Error("Peer connection not initialized")
    }

    try {
      await this.peerConnection.addIceCandidate(candidate)
      console.log("[v0] Added ICE candidate")
    } catch (error) {
      console.error("[v0] Error adding ICE candidate:", error)
    }
  }

  // Toggle audio mute
  toggleAudio(muted: boolean) {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach((track) => {
        track.enabled = !muted
      })
      console.log("[v0] Audio toggled:", muted ? "muted" : "unmuted")
    }
  }

  // Toggle video
  toggleVideo(enabled: boolean) {
    if (this.localStream) {
      this.localStream.getVideoTracks().forEach((track) => {
        track.enabled = enabled
      })
      console.log("[v0] Video toggled:", enabled ? "enabled" : "disabled")
    }
  }

  // Send message via data channel
  sendMessage(message: string) {
    if (this.dataChannel && this.dataChannel.readyState === "open") {
      this.dataChannel.send(message)
      console.log("[v0] Sent message:", message)
    }
  }

  // Simulate signaling server (in real app, this would be WebSocket/Socket.IO)
  private sendSignalingMessage(message: any) {
    console.log("[v0] Signaling message (would be sent to server):", message)
    // In demo mode, we'll simulate the signaling process
    // In production, this would send to a signaling server
  }

  // Event handlers
  onRemoteStream(callback: (stream: MediaStream) => void) {
    this.onRemoteStreamCallback = callback
  }

  onConnectionStateChange(callback: (state: RTCPeerConnectionState) => void) {
    this.onConnectionStateChangeCallback = callback
  }

  onDataChannelMessage(callback: (message: string) => void) {
    this.onDataChannelMessageCallback = callback
  }

  // Get connection stats
  async getStats(): Promise<RTCStatsReport | null> {
    if (!this.peerConnection) return null

    try {
      const stats = await this.peerConnection.getStats()
      return stats
    } catch (error) {
      console.error("[v0] Error getting stats:", error)
      return null
    }
  }

  // Cleanup
  cleanup() {
    console.log("[v0] Cleaning up WebRTC connection")

    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop())
      this.localStream = null
    }

    if (this.dataChannel) {
      this.dataChannel.close()
      this.dataChannel = null
    }

    if (this.peerConnection) {
      this.peerConnection.close()
      this.peerConnection = null
    }

    this.remoteStream = null
    this.onRemoteStreamCallback = undefined
    this.onConnectionStateChangeCallback = undefined
    this.onDataChannelMessageCallback = undefined
  }

  // Getters
  get localMediaStream() {
    return this.localStream
  }

  get remoteMediaStream() {
    return this.remoteStream
  }

  get connectionState() {
    return this.peerConnection?.connectionState || "closed"
  }
}
