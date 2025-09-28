"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Phone, Video, Search, Filter, Users, Clock, Heart, Star } from "lucide-react"
import { CallDialog } from "@/components/call-dialog"
import { DemoBanner } from "@/components/demo-banner"

interface Profile {
  id: string
  display_name: string
  gender: string
  date_of_birth: string
  avatar_url?: string
  bio?: string
  is_online: boolean
  last_seen: string
}

interface UserDirectoryProps {
  currentUserId: string
  currentProfile: Profile
}

const demoUsers: Profile[] = [
  {
    id: "demo-1",
    display_name: "Priya Sharma",
    gender: "female",
    date_of_birth: "1995-07-12",
    bio: "Software engineer from Bangalore who loves classical music and exploring new cafes. Always excited to discuss technology, travel, and Bollywood movies!",
    is_online: true,
    last_seen: new Date().toISOString(),
    avatar_url: "/indian-woman-software-engineer-smiling.jpg",
  },
  {
    id: "demo-2",
    display_name: "Arjun Patel",
    gender: "male",
    date_of_birth: "1992-11-28",
    bio: "Digital marketing professional from Mumbai. Cricket enthusiast and foodie who enjoys trying street food and discussing startup ideas over chai.",
    is_online: true,
    last_seen: new Date().toISOString(),
    avatar_url: "/indian-man-marketing-professional-friendly.jpg",
  },
  {
    id: "demo-3",
    display_name: "Kavya Reddy",
    gender: "female",
    date_of_birth: "1997-03-15",
    bio: "Graphic designer and artist from Hyderabad. Love creating digital art, watching regional cinema, and having deep conversations about creativity and culture.",
    is_online: false,
    last_seen: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    avatar_url: "/indian-woman-graphic-designer-artistic.jpg",
  },
  {
    id: "demo-4",
    display_name: "Rohit Singh",
    gender: "male",
    date_of_birth: "1994-09-08",
    bio: "Fitness trainer from Delhi who's passionate about yoga and healthy living. Love sharing wellness tips and discussing philosophy, sports, and adventure travel.",
    is_online: true,
    last_seen: new Date().toISOString(),
    avatar_url: "/indian-man-fitness-trainer-yoga-instructor.jpg",
  },
  {
    id: "demo-5",
    display_name: "Ananya Iyer",
    gender: "female",
    date_of_birth: "1996-01-22",
    bio: "Classical dancer and music teacher from Chennai. Love sharing stories about Indian traditions, teaching Bharatanatyam, and exploring fusion music.",
    is_online: false,
    last_seen: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    avatar_url: "/indian-woman-classical-dancer-traditional.jpg",
  },
  {
    id: "demo-6",
    display_name: "Vikram Gupta",
    gender: "male",
    date_of_birth: "1993-05-17",
    bio: "Chef and food blogger from Pune specializing in regional Indian cuisine. Love experimenting with traditional recipes and sharing culinary adventures!",
    is_online: true,
    last_seen: new Date().toISOString(),
    avatar_url: "/indian-man-chef-cooking-traditional-food.jpg",
  },
  {
    id: "demo-7",
    display_name: "Meera Joshi",
    gender: "female",
    date_of_birth: "1998-12-03",
    bio: "Medical student from Jaipur with a passion for community health. Enjoy reading, volunteering, and discussing healthcare innovations and social impact.",
    is_online: true,
    last_seen: new Date().toISOString(),
    avatar_url: "/indian-woman-medical-student-professional.jpg",
  },
  {
    id: "demo-8",
    display_name: "Karan Malhotra",
    gender: "male",
    date_of_birth: "1991-08-14",
    bio: "Travel photographer from Goa capturing India's diverse landscapes. Love sharing travel stories, discussing photography techniques, and planning adventures.",
    is_online: false,
    last_seen: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    avatar_url: "/indian-man-photographer-travel-adventure.jpg",
  },
]

export function UserDirectory({ currentUserId, currentProfile }: UserDirectoryProps) {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [genderFilter, setGenderFilter] = useState("all")
  const [onlineFilter, setOnlineFilter] = useState("all")
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null)
  const [callDialogOpen, setCallDialogOpen] = useState(false)
  const [isDemoMode, setIsDemoMode] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    fetchProfiles()
  }, [])

  useEffect(() => {
    filterProfiles()
  }, [profiles, searchTerm, genderFilter, onlineFilter])

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .neq("id", currentUserId)
        .order("is_online", { ascending: false })
        .order("last_seen", { ascending: false })

      if (error) throw error

      // If no real users, use demo data
      if (!data || data.length === 0) {
        setProfiles(demoUsers)
        setIsDemoMode(true)
      } else {
        setProfiles(data)
        setIsDemoMode(false)
      }
    } catch (error) {
      console.error("Error fetching profiles:", error)
      // Fallback to demo data on error
      setProfiles(demoUsers)
      setIsDemoMode(true)
    } finally {
      setLoading(false)
    }
  }

  const filterProfiles = () => {
    let filtered = profiles

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((profile) => profile.display_name.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    // Gender filter
    if (genderFilter !== "all") {
      filtered = filtered.filter((profile) => profile.gender === genderFilter)
    }

    // Online status filter
    if (onlineFilter === "online") {
      filtered = filtered.filter((profile) => profile.is_online)
    } else if (onlineFilter === "offline") {
      filtered = filtered.filter((profile) => !profile.is_online)
    }

    setFilteredProfiles(filtered)
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const getAge = (dateOfBirth: string) => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const formatLastSeen = (lastSeen: string) => {
    const date = new Date(lastSeen)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const handleCall = (profile: Profile, callType: "audio" | "video") => {
    setSelectedProfile(profile)
    setCallDialogOpen(true)
  }

  const getCompatibilityScore = () => {
    return Math.floor(Math.random() * 30) + 70 // Random score between 70-99
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading users...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Demo Banner */}
      {isDemoMode && <DemoBanner />}

      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground text-balance">Discover People</h1>
        <p className="text-muted-foreground text-balance">Connect with others through meaningful conversations</p>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-11"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={genderFilter} onValueChange={setGenderFilter}>
                <SelectTrigger className="w-32 h-11">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genders</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <Select value={onlineFilter} onValueChange={setOnlineFilter}>
                <SelectTrigger className="w-32 h-11">
                  <Users className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredProfiles.length} {filteredProfiles.length === 1 ? "person" : "people"} found
        </p>
        {isDemoMode && (
          <Badge variant="outline" className="text-xs border-primary/30 text-primary">
            Demo Data
          </Badge>
        )}
      </div>

      {/* User Grid */}
      {filteredProfiles.length === 0 ? (
        <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No users found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfiles.map((profile) => (
            <Card
              key={profile.id}
              className="border-0 shadow-lg bg-card/80 backdrop-blur-sm hover:shadow-xl transition-all duration-200 group"
            >
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Profile Header */}
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12 ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                        <AvatarImage src={profile.avatar_url || "/placeholder.svg"} alt={profile.display_name} />
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {getInitials(profile.display_name)}
                        </AvatarFallback>
                      </Avatar>
                      {profile.is_online && (
                        <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-card rounded-full animate-pulse"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground truncate">{profile.display_name}</h3>
                        {Math.random() > 0.7 && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {getAge(profile.date_of_birth)} years old • {profile.gender}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {profile.is_online ? "Online now" : formatLastSeen(profile.last_seen)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  {profile.bio && (
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{profile.bio}</p>
                  )}

                  {/* Compatibility Score (Demo Feature) */}
                  {isDemoMode && (
                    <div className="flex items-center gap-2">
                      <Heart className="h-3 w-3 text-pink-500" />
                      <span className="text-xs text-muted-foreground">{getCompatibilityScore()}% compatibility</span>
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="flex items-center justify-between">
                    <Badge
                      variant={profile.is_online ? "default" : "secondary"}
                      className={`text-xs ${profile.is_online ? "bg-green-500 hover:bg-green-600" : ""}`}
                    >
                      {profile.is_online ? "Available" : "Away"}
                    </Badge>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 bg-transparent hover:bg-primary/5 hover:border-primary/30 transition-all"
                      onClick={() => handleCall(profile, "audio")}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 hover:shadow-md transition-all"
                      onClick={() => handleCall(profile, "video")}
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Video
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Call Dialog */}
      <CallDialog
        open={callDialogOpen}
        onOpenChange={setCallDialogOpen}
        targetProfile={selectedProfile}
        currentProfile={currentProfile}
      />
    </div>
  )
}
