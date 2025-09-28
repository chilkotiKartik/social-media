"use client"

import Link from "next/link"
import { Phone, Video, Heart, Shield, Zap, Users, Mail, MapPin, Twitter, Github, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function AppFooter() {
  return (
    <footer className="bg-card/50 border-t border-border/50 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Phone className="h-8 w-8 text-primary" />
                <Video className="h-4 w-4 text-primary absolute -top-1 -right-1" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">SocialCall</h3>
                <p className="text-xs text-muted-foreground">Connect & Call</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground text-balance">
              Connect with people through meaningful conversations. High-quality voice and video calls with advanced
              noise cancellation.
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                <Shield className="h-3 w-3 mr-1" />
                Secure
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Zap className="h-3 w-3 mr-1" />
                HD Quality
              </Badge>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Features</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Video className="h-3 w-3" />
                HD Video Calls
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-3 w-3" />
                Crystal Clear Audio
              </li>
              <li className="flex items-center gap-2">
                <Users className="h-3 w-3" />
                Smart Matching
              </li>
              <li className="flex items-center gap-2">
                <Shield className="h-3 w-3" />
                End-to-End Security
              </li>
              <li className="flex items-center gap-2">
                <Zap className="h-3 w-3" />
                Noise Cancellation
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-foreground transition-colors">
                  Support
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-foreground transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Connect</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-3 w-3" />
                hello@socialcall.app
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3" />
                Mumbai, India
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Github className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>© 2025 SocialCall. All rights reserved.</span>
            <Badge variant="outline" className="text-xs">
              <Heart className="h-3 w-3 mr-1 text-red-500" />
              Made in India
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Version 2.0</span>
            <Badge variant="default" className="text-xs bg-green-600">
              <Zap className="h-3 w-3 mr-1" />
              WebRTC Enabled
            </Badge>
          </div>
        </div>
      </div>
    </footer>
  )
}
