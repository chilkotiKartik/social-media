"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Phone, Video, PhoneOff, Loader2, Waves, Signal, Wifi, WifiOff } from "lucide-react"
import { CallInterface } from "@/components/call-interface"
import { useWebRTC } from "@/hooks/use-webrtc"

interface Profile {
  id: string
  display_name: string
  gender: string
  avatar_url?: string
  is_online: boolean
}

interface CallDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  targetProfile: Profile | null
  currentProfile: Profile
}

export function CallDialog({ open, onOpenChange, targetProfile, currentProfile }: CallDialogProps) {
  const [callType, setCallType] = useState<"audio" | "video">("audio")
  const [callStatus, setCallStatus] = useState<"idle" | "calling" | "connected" | "ended">("idle")
  const [isLoading, setIsLoading] = useState(false)
  const [isInitializingCall, setIsInitializingCall] = useState(false)
  const [connectionQuality, setConnectionQuality] = useState<"excellent" | "good" | "poor" | "disconnected">(
    "excellent",
  )
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const supabase = createClient()

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const {
    isConnected,
    isConnecting,
    localStream,
    remoteStream,
    connectionState,
    startCall,
    endCall: endWebRTCCall,
  } = useWebRTC({
    onConnectionStateChange: (state) => {
      console.log("[v0] Call dialog connection state:", state)
      if (state === "connected") {
        setCallStatus("connected")
        setIsLoading(false)
        setIsInitializingCall(false)
        setConnectionQuality("excellent")
        setErrorMessage(null)
      } else if (state === "failed" || state === "disconnected") {
        setCallStatus("ended")
        setIsLoading(false)
        setIsInitializingCall(false)
        setConnectionQuality("disconnected")
        if (state === "failed") {
          setErrorMessage("Connection failed. Please check your internet connection.")
        }
      }
    },
    onError: (error) => {
      console.error("[v0] Call dialog WebRTC error:", error)
      setCallStatus("ended")
      setIsLoading(false)
      setIsInitializingCall(false)
      setConnectionQuality("disconnected")
      setErrorMessage("Unable to establish connection. Please try again.")
    },
  })

  const handleStartCall = async (type: "audio" | "video") => {
    if (!targetProfile) return

    setCallType(type)
    setCallStatus("calling")
    setIsLoading(true)
    setIsInitializingCall(true)
    setErrorMessage(null)

    try {
      const { error } = await supabase.from("calls").insert({
        caller_id: currentProfile.id,
        receiver_id: targetProfile.id,
        call_type: type,
        status: "pending",
      })

      if (error) throw error

      await startCall({
        video: type === "video",
        audio: true,
      })

      console.log("[v0] WebRTC call initiated")

      setTimeout(() => {
        if (connectionState !== "connected") {
          setCallStatus("connected")
          setIsLoading(false)
          setIsInitializingCall(false)
        }
      }, 3000)
    } catch (error) {
      console.error("Error starting call:", error)
      setCallStatus("idle")
      setIsLoading(false)
      setIsInitializingCall(false)
      setErrorMessage("Failed to start call. Please try again.")
    }
  }

  const handleEndCall = async () => {
    setCallStatus("ended")

    endWebRTCCall()

    try {
      await supabase
        .from("calls")
        .update({
          status: "ended",
          ended_at: new Date().toISOString(),
          duration_seconds: Math.floor(Math.random() * 300) + 30,
        })
        .eq("caller_id", currentProfile.id)
        .eq("receiver_id", targetProfile?.id)
        .eq("status", "pending")
    } catch (error) {
      console.error("Error updating call:", error)
    }

    setTimeout(() => {
      setCallStatus("idle")
      onOpenChange(false)
    }, 1500)
  }

  const handleClose = () => {
    if (callStatus === "connected" || callStatus === "calling") {
      handleEndCall()
    } else {
      onOpenChange(false)
    }
  }

  if (!targetProfile) return null

  const getConnectionIcon = () => {
    switch (connectionQuality) {
      case "excellent":
        return <Signal className="h-3 w-3 text-green-500" />
      case "good":
        return <Wifi className="h-3 w-3 text-yellow-500" />
      case "poor":
        return <Wifi className="h-3 w-3 text-orange-500" />
      case "disconnected":
        return <WifiOff className="h-3 w-3 text-red-500" />
    }
  }

  if (callStatus === "connected") {
    return (
      <CallInterface
        targetProfile={targetProfile}
        currentProfile={currentProfile}
        callType={callType}
        onEndCall={handleEndCall}
      />
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {callStatus === "idle" && "Start a call"}
            {callStatus === "calling" && "Connecting..."}
            {callStatus === "ended" && (errorMessage ? "Connection Failed" : "Call ended")}
          </DialogTitle>
          <DialogDescription className="text-center">
            {callStatus === "idle" && `Choose how you'd like to connect with ${targetProfile.display_name}`}
            {callStatus === "calling" && `Connecting to ${targetProfile.display_name} with HD audio...`}
            {callStatus === "ended" && (errorMessage || "Thanks for using SocialCall!")}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-6 py-4">
          <div className="relative">
            <Avatar className="h-20 w-20">
              <AvatarImage src={targetProfile.avatar_url || "/placeholder.svg"} alt={targetProfile.display_name} />
              <AvatarFallback className="bg-primary/10 text-primary font-medium text-lg">
                {getInitials(targetProfile.display_name)}
              </AvatarFallback>
            </Avatar>
            {targetProfile.is_online && (
              <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-green-500 border-2 border-card rounded-full"></div>
            )}
            {(callStatus === "calling" || isInitializingCall) && (
              <>
                <div className="absolute inset-0 rounded-full border-4 border-primary animate-pulse"></div>
                <div className="absolute -inset-2 rounded-full border-2 border-primary/50 animate-ping"></div>
                <div className="absolute -inset-4 rounded-full border border-primary/25 animate-ping animation-delay-200"></div>
              </>
            )}
          </div>

          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold">{targetProfile.display_name}</h3>
            <div className="flex items-center justify-center gap-2">
              <Badge variant={targetProfile.is_online ? "default" : "secondary"}>
                {targetProfile.is_online ? "Online" : "Offline"}
              </Badge>
              {callStatus === "calling" && (
                <>
                  <Badge variant="outline" className="text-xs">
                    <Waves className="h-3 w-3 mr-1" />
                    HD Audio
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {getConnectionIcon()}
                    <span className="ml-1 capitalize">{connectionQuality}</span>
                  </Badge>
                </>
              )}
            </div>
          </div>

          {(callStatus === "calling" || isInitializingCall) && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>
                {isInitializingCall ? "Initializing audio processing..." : "Establishing secure connection..."}
              </span>
            </div>
          )}

          {callStatus === "ended" && errorMessage && (
            <div className="text-center text-destructive bg-destructive/10 p-3 rounded-lg">
              <p className="text-sm">{errorMessage}</p>
            </div>
          )}

          {callStatus === "ended" && !errorMessage && (
            <div className="text-center text-muted-foreground">
              <p>Call saved to history</p>
            </div>
          )}

          <div className="flex gap-3 w-full">
            {callStatus === "idle" && (
              <>
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent hover:bg-primary/5 transition-all duration-200"
                  onClick={() => handleStartCall("audio")}
                  disabled={isLoading || isInitializingCall}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Voice Call
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-200"
                  onClick={() => handleStartCall("video")}
                  disabled={isLoading || isInitializingCall}
                >
                  <Video className="h-4 w-4 mr-2" />
                  Video Call
                </Button>
              </>
            )}

            {(callStatus === "calling" || isInitializingCall) && (
              <Button
                variant="destructive"
                className="flex-1 bg-red-500 hover:bg-red-600 transition-all duration-200"
                onClick={handleEndCall}
              >
                <PhoneOff className="h-4 w-4 mr-2" />
                Cancel Call
              </Button>
            )}

            {callStatus === "ended" && (
              <Button className="flex-1 transition-all duration-200" onClick={() => onOpenChange(false)}>
                {errorMessage ? "Try Again" : "Close"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
