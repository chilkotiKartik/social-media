"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Phone, Video, Settings, LogOut, User, Menu, Bell, Search, Home, Users, History } from "lucide-react"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { useState } from "react"

interface Profile {
  id: string
  display_name: string
  gender: string
  avatar_url?: string
  is_online: boolean
}

interface AppHeaderProps {
  user?: SupabaseUser | null
  profile?: Profile | null
  showNavigation?: boolean
}

export function AppHeader({ user, profile, showNavigation = false }: AppHeaderProps) {
  const router = useRouter()
  const supabase = createClient()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-card/80 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <Link
            href={user ? "/dashboard" : "/"}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="relative">
              <Phone className="h-8 w-8 text-primary" />
              <Video className="h-4 w-4 text-primary absolute -top-1 -right-1" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">SocialCall</h1>
              <p className="text-xs text-muted-foreground">Connect & Call</p>
            </div>
          </Link>

          {/* Navigation (Desktop) */}
          {showNavigation && user && (
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <Home className="h-4 w-4" />
                Home
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <Users className="h-4 w-4" />
                People
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <History className="h-4 w-4" />
                History
              </Link>
            </nav>
          )}

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Search Button */}
            {showNavigation && user && (
              <Button variant="ghost" size="sm" className="hidden sm:flex">
                <Search className="h-4 w-4" />
              </Button>
            )}

            {/* Notifications */}
            {showNavigation && user && (
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </Button>
            )}

            {/* User Status */}
            {profile && (
              <div className="hidden sm:flex items-center gap-2">
                <Badge variant={profile.is_online ? "default" : "secondary"} className="text-xs">
                  {profile.is_online ? "Online" : "Offline"}
                </Badge>
              </div>
            )}

            {/* Mobile Menu Button */}
            {showNavigation && user && (
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="h-4 w-4" />
              </Button>
            )}

            {/* User Menu or Auth Buttons */}
            {user && profile ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={profile.avatar_url || "/placeholder.svg"} alt={profile.display_name} />
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {getInitials(profile.display_name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{profile.display_name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button asChild variant="ghost" size="sm">
                  <Link href="/auth/login">Sign In</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/auth/register">Get Started</Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {showNavigation && user && isMobileMenuOpen && (
          <nav className="md:hidden mt-4 pt-4 border-t border-border/50">
            <div className="flex flex-col gap-2">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Home className="h-4 w-4" />
                Home
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Users className="h-4 w-4" />
                People
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <History className="h-4 w-4" />
                History
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
