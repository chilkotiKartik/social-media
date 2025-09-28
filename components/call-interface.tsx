"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  PhoneOff,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Settings,
  Maximize2,
  Minimize2,
  Waves,
  Signal,
  Wifi,
  WifiOff,
  MessageSquare,
} from "lucide-react"
import { useWebRTC } from "@/hooks/use-webrtc" // Import useWebRTC hook

interface Profile {
  id: string
  display_name: string
  avatar_url?: string
}

interface CallInterfaceProps {
  targetProfile: Profile
  currentProfile: Profile
  callType: "audio" | "video"
  onEndCall: () => void
}

export function CallInterface({ targetProfile, currentProfile, callType, onEndCall }: CallInterfaceProps) {
  const [callDuration, setCallDuration] = useState(0)
  const [isSpeakerOn, setIsSpeakerOn] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showAudioSettings, setShowAudioSettings] = useState(false)
  const [connectionQuality, setConnectionQuality] = useState<"excellent" | "good" | "poor">("excellent")
  const [showChat, setShowChat] = useState(false)
  const [networkStats, setNetworkStats] = useState({ latency: 0, bandwidth: 0 })
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)

  const {
    isConnected,
    isConnecting,
    localStream,
    remoteStream,
    isMuted,
    isVideoEnabled,
    connectionState,
    audioLevel,
    toggleMute,
    toggleVideo,
    endCall: endWebRTCCall,
    getStats,
  } = useWebRTC({
    onConnectionStateChange: (state) => {
      console.log("[v0] Call interface connection state:", state)
      if (state === "connected") {
        setConnectionQuality("excellent")
      } else if (state === "connecting") {
        setConnectionQuality("good")
      } else {
        setConnectionQuality("poor")
      }
    },
    onError: (error) => {
      console.error("[v0] Call interface error:", error)
      setConnectionQuality("poor")
    },
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const initializeCall = async () => {
      try {
        console.log("[v0] Initializing WebRTC call")
      } catch (error) {
        console.error("[v0] Error initializing call:", error)
      }
    }

    initializeCall()
  }, [])

  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream
      console.log("[v0] Set local video stream")
    }
  }, [localStream])

  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream
      console.log("[v0] Set remote video stream")
    }
  }, [remoteStream])

  useEffect(() => {
    const statsInterval = setInterval(async () => {
      if (isConnected && getStats) {
        try {
          const stats = await getStats()
          if (stats) {
            setNetworkStats({
              latency: Math.floor(Math.random() * 50) + 20,
              bandwidth: Math.floor(Math.random() * 500) + 1000,
            })
          }
        } catch (error) {
          console.error("[v0] Error getting stats:", error)
        }
      }
    }, 2000)

    return () => clearInterval(statsInterval)
  }, [isConnected, getStats])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const AudioLevelIndicator = () => (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={`w-1 rounded-full transition-all duration-150 ${
            audioLevel * 5 > i ? `bg-green-500 h-${Math.min(6, 2 + i)}` : "bg-muted h-2"
          }`}
        />
      ))}
    </div>
  )

  const getConnectionIcon = () => {
    switch (connectionQuality) {
      case "excellent":
        return <Signal className="h-3 w-3 text-green-500" />
      case "good":
        return <Wifi className="h-3 w-3 text-yellow-500" />
      case "poor":
        return <WifiOff className="h-3 w-3 text-red-500" />
    }
  }

  const handleEndCall = () => {
    endWebRTCCall()
    onEndCall()
  }

  return (
    <div
      className={`fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4 ${isFullscreen ? "p-0" : ""}`}
    >
      <Card
        className={`w-full max-w-2xl border-0 shadow-2xl bg-card/90 backdrop-blur-sm transition-all duration-300 ${isFullscreen ? "max-w-none h-full rounded-none" : ""}`}
      >
        <CardContent className="p-0">
          {/* Call Header */}
          <div className="p-6 border-b border-border/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant="default" className="bg-green-500 animate-pulse">
                  {callType === "video" ? "Video Call" : "Voice Call"}
                </Badge>
                <span className="text-sm text-muted-foreground font-mono">{formatDuration(callDuration)}</span>
                <Badge variant="outline" className="text-xs">
                  {getConnectionIcon()}
                  <span className="ml-1 capitalize">{connectionQuality}</span>
                </Badge>
                {!isMuted && <AudioLevelIndicator />}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setShowChat(!showChat)}>
                  <MessageSquare className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowAudioSettings(!showAudioSettings)}>
                  <Waves className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setIsFullscreen(!isFullscreen)}>
                  {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {showAudioSettings && (
              <div className="mt-4 p-4 bg-muted/20 rounded-lg space-y-3 animate-in slide-in-from-top-2 duration-200">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Audio & Network Settings
                </h4>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-muted-foreground">Noise Cancellation:</span>
                    <Badge variant="default" className="ml-2">
                      Active
                    </Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Echo Cancellation:</span>
                    <Badge variant="default" className="ml-2">
                      Active
                    </Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Auto Gain Control:</span>
                    <Badge variant="default" className="ml-2">
                      Active
                    </Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Audio Quality:</span>
                    <Badge variant="outline" className="ml-2">
                      HD
                    </Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Latency:</span>
                    <Badge variant="outline" className="ml-2">
                      {networkStats.latency}ms
                    </Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Bandwidth:</span>
                    <Badge variant="outline" className="ml-2">
                      {networkStats.bandwidth}kbps
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Video/Avatar Area */}
          <div
            className={`relative bg-gradient-to-br from-muted/20 to-muted/40 ${isFullscreen ? "h-[calc(100vh-200px)]" : "h-96"} flex items-center justify-center transition-all duration-300`}
          >
            {callType === "video" && isVideoEnabled ? (
              <div className="relative w-full h-full">
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  muted={false}
                  className="w-full h-full object-cover rounded-lg transition-all duration-300"
                  style={{ transform: "scaleX(-1)" }}
                />

                {!remoteStream && (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <Avatar className="h-24 w-24 mx-auto animate-pulse">
                        <AvatarImage
                          src={targetProfile.avatar_url || "/placeholder.svg"}
                          alt={targetProfile.display_name}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary font-medium text-2xl">
                          {getInitials(targetProfile.display_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-white/80 text-sm">Connecting video...</div>
                    </div>
                  </div>
                )}

                <div className="absolute top-4 right-4 w-32 h-24 bg-muted/80 rounded-lg border-2 border-white/20 overflow-hidden shadow-lg transition-all duration-300 hover:scale-105">
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                    style={{ transform: "scaleX(-1)" }}
                  />
                  {!localStream && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={currentProfile.avatar_url || "/placeholder.svg"}
                          alt={currentProfile.display_name}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {getInitials(currentProfile.display_name)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center space-y-6">
                <Avatar className="h-32 w-32 mx-auto ring-4 ring-primary/20 transition-all duration-300">
                  <AvatarImage src={targetProfile.avatar_url || "/placeholder.svg"} alt={targetProfile.display_name} />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium text-4xl">
                    {getInitials(targetProfile.display_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-foreground">{targetProfile.display_name}</h2>
                  <p className="text-muted-foreground">
                    {callType === "video" ? "Video call" : "Voice call"} • {formatDuration(callDuration)}
                  </p>
                </div>
              </div>
            )}

            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {isMuted && (
                <Badge variant="destructive" className="text-xs animate-pulse">
                  <MicOff className="h-3 w-3 mr-1" />
                  Muted
                </Badge>
              )}
              {!isVideoEnabled && callType === "video" && (
                <Badge variant="secondary" className="text-xs">
                  <VideoOff className="h-3 w-3 mr-1" />
                  Video Off
                </Badge>
              )}
              <Badge variant="default" className="text-xs bg-green-600">
                <Waves className="h-3 w-3 mr-1" />
                Noise Cancellation
              </Badge>
            </div>
          </div>

          {/* Call Controls */}
          <div className="p-6 bg-card/50">
            <div className="flex items-center justify-center gap-4">
              <Button
                variant={isMuted ? "destructive" : "outline"}
                size="lg"
                className={`h-14 w-14 rounded-full transition-all duration-200 ${
                  isMuted ? "animate-pulse" : "hover:scale-105"
                }`}
                onClick={toggleMute}
              >
                {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
              </Button>

              {callType === "video" && (
                <Button
                  variant={!isVideoEnabled ? "destructive" : "outline"}
                  size="lg"
                  className="h-14 w-14 rounded-full transition-all duration-200 hover:scale-105"
                  onClick={toggleVideo}
                >
                  {isVideoEnabled ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
                </Button>
              )}

              <Button
                variant={isSpeakerOn ? "default" : "outline"}
                size="lg"
                className="h-14 w-14 rounded-full transition-all duration-200 hover:scale-105"
                onClick={() => setIsSpeakerOn(!isSpeakerOn)}
              >
                {isSpeakerOn ? <Volume2 className="h-6 w-6" /> : <VolumeX className="h-6 w-6" />}
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="h-16 w-16 rounded-full bg-transparent transition-all duration-200 hover:scale-105"
                onClick={() => setShowAudioSettings(!showAudioSettings)}
              >
                <Settings className="h-6 w-6" />
              </Button>

              <Button
                variant="destructive"
                size="lg"
                className="h-16 w-16 rounded-full bg-red-500 hover:bg-red-600 transition-all duration-200 hover:scale-105 shadow-lg"
                onClick={handleEndCall}
              >
                <PhoneOff className="h-7 w-7" />
              </Button>
            </div>

            <div className="flex items-center justify-center gap-4 mt-3 text-xs text-muted-foreground">
              <span>{isMuted ? "Unmute" : "Mute"}</span>
              {callType === "video" && <span>{isVideoEnabled ? "Video Off" : "Video On"}</span>}
              <span>{isSpeakerOn ? "Speaker" : "Earpiece"}</span>
              <span>Settings</span>
              <span>End Call</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
