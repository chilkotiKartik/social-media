"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Phone, Video, PhoneIncoming, PhoneOutgoing, PhoneMissed, Clock } from "lucide-react"

interface CallRecord {
  id: string
  caller_id: string
  receiver_id: string
  call_type: "audio" | "video"
  status: "pending" | "accepted" | "declined" | "ended" | "missed"
  started_at: string
  ended_at?: string
  duration_seconds: number
  caller_profile?: {
    display_name: string
    avatar_url?: string
  }
  receiver_profile?: {
    display_name: string
    avatar_url?: string
  }
}

interface CallHistoryProps {
  currentUserId: string
}

const demoCallHistory: CallRecord[] = [
  {
    id: "demo-call-1",
    caller_id: "demo-1",
    receiver_id: "current-user",
    call_type: "video",
    status: "ended",
    started_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    ended_at: new Date(Date.now() - 2 * 60 * 60 * 1000 + 12 * 60 * 1000).toISOString(),
    duration_seconds: 720,
    caller_profile: {
      display_name: "Priya Sharma",
      avatar_url: "/indian-woman-software-engineer-smiling.jpg",
    },
  },
  {
    id: "demo-call-2",
    caller_id: "current-user",
    receiver_id: "demo-2",
    call_type: "audio",
    status: "ended",
    started_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    ended_at: new Date(Date.now() - 5 * 60 * 60 * 1000 + 18 * 60 * 1000).toISOString(),
    duration_seconds: 1080,
    receiver_profile: {
      display_name: "Arjun Patel",
      avatar_url: "/indian-man-marketing-professional-friendly.jpg",
    },
  },
  {
    id: "demo-call-3",
    caller_id: "demo-4",
    receiver_id: "current-user",
    call_type: "video",
    status: "missed",
    started_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    duration_seconds: 0,
    caller_profile: {
      display_name: "Rohit Singh",
      avatar_url: "/indian-man-fitness-trainer-yoga-instructor.jpg",
    },
  },
  {
    id: "demo-call-4",
    caller_id: "current-user",
    receiver_id: "demo-6",
    call_type: "audio",
    status: "ended",
    started_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    ended_at: new Date(Date.now() - 24 * 60 * 60 * 1000 + 25 * 60 * 1000).toISOString(),
    duration_seconds: 1500,
    receiver_profile: {
      display_name: "Vikram Gupta",
      avatar_url: "/indian-man-chef-cooking-traditional-food.jpg",
    },
  },
  {
    id: "demo-call-5",
    caller_id: "demo-7",
    receiver_id: "current-user",
    call_type: "video",
    status: "ended",
    started_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    ended_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 8 * 60 * 1000).toISOString(),
    duration_seconds: 480,
    caller_profile: {
      display_name: "Meera Joshi",
      avatar_url: "/indian-woman-medical-student-professional.jpg",
    },
  },
  {
    id: "demo-call-6",
    caller_id: "current-user",
    receiver_id: "demo-5",
    call_type: "audio",
    status: "ended",
    started_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    ended_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 35 * 60 * 1000).toISOString(),
    duration_seconds: 2100,
    receiver_profile: {
      display_name: "Ananya Iyer",
      avatar_url: "/indian-woman-classical-dancer-traditional.jpg",
    },
  },
]

export function CallHistory({ currentUserId }: CallHistoryProps) {
  const [calls, setCalls] = useState<CallRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [isDemoMode, setIsDemoMode] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    fetchCallHistory()
  }, [])

  const fetchCallHistory = async () => {
    try {
      const { data, error } = await supabase
        .from("calls")
        .select(`
          *,
          caller_profile:profiles!calls_caller_id_fkey(display_name, avatar_url),
          receiver_profile:profiles!calls_receiver_id_fkey(display_name, avatar_url)
        `)
        .or(`caller_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`)
        .order("started_at", { ascending: false })
        .limit(20)

      if (error) throw error

      // If no real call history, use demo data
      if (!data || data.length === 0) {
        setCalls(demoCallHistory)
        setIsDemoMode(true)
      } else {
        setCalls(data)
        setIsDemoMode(false)
      }
    } catch (error) {
      console.error("Error fetching call history:", error)
      // Fallback to demo data on error
      setCalls(demoCallHistory)
      setIsDemoMode(true)
    } finally {
      setLoading(false)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDuration = (seconds: number) => {
    if (seconds === 0) return "0:00"
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (diffInDays === 1) {
      return "Yesterday"
    } else if (diffInDays < 7) {
      return date.toLocaleDateString([], { weekday: "long" })
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" })
    }
  }

  const getCallIcon = (call: CallRecord) => {
    const isOutgoing = call.caller_id === currentUserId || call.caller_id === "current-user"
    const iconClass = "h-4 w-4"

    if (call.status === "missed") {
      return <PhoneMissed className={`${iconClass} text-red-500`} />
    } else if (isOutgoing) {
      return <PhoneOutgoing className={`${iconClass} text-green-500`} />
    } else {
      return <PhoneIncoming className={`${iconClass} text-blue-500`} />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "secondary",
      accepted: "default",
      declined: "destructive",
      ended: "default",
      missed: "destructive",
    } as const

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"} className="text-xs">
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  if (loading) {
    return (
      <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Call History
          </CardTitle>
          {isDemoMode && (
            <Badge variant="outline" className="text-xs border-primary/30 text-primary">
              Demo Data
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {calls.length === 0 ? (
          <div className="p-6 text-center">
            <Phone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No calls yet</h3>
            <p className="text-muted-foreground">Your call history will appear here</p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {calls.map((call) => {
              const isOutgoing = call.caller_id === currentUserId || call.caller_id === "current-user"
              const otherProfile = isOutgoing ? call.receiver_profile : call.caller_profile

              return (
                <div key={call.id} className="p-4 hover:bg-muted/20 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      {getCallIcon(call)}
                      <Avatar className="h-10 w-10 ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                        <AvatarImage
                          src={otherProfile?.avatar_url || "/placeholder.svg"}
                          alt={otherProfile?.display_name || "Unknown"}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {getInitials(otherProfile?.display_name || "U")}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium truncate">{otherProfile?.display_name || "Unknown User"}</h4>
                        {call.call_type === "video" ? (
                          <Video className="h-3 w-3 text-muted-foreground" />
                        ) : (
                          <Phone className="h-3 w-3 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{isOutgoing ? "Outgoing" : "Incoming"}</span>
                        <span>•</span>
                        <span>{formatDate(call.started_at)}</span>
                        {call.duration_seconds > 0 && (
                          <>
                            <span>•</span>
                            <span>{formatDuration(call.duration_seconds)}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {getStatusBadge(call.status)}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        {call.call_type === "video" ? <Video className="h-4 w-4" /> : <Phone className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
