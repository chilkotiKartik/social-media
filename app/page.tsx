import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Phone, Video, Users, Shield, Zap, Heart, Waves } from "lucide-react"
import { AppHeader } from "@/components/app-header"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
      <AppHeader />

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          {/* Logo/Brand */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="relative">
              <Phone className="h-12 w-12 text-primary" />
              <Video className="h-6 w-6 text-primary absolute -top-1 -right-1" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">SocialCall</h1>
          </div>

          {/* Hero Content */}
          <div className="space-y-6">
            <h2 className="text-5xl font-bold text-foreground text-balance leading-tight">
              Connect with people through <span className="text-primary">meaningful conversations</span>
            </h2>
            <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
              Join our community and discover new connections through high-quality voice and video calls with advanced
              noise cancellation. Meet people, share stories, and build lasting friendships.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="h-12 px-8 text-lg font-medium">
              <Link href="/auth/register">Get Started Free</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 px-8 text-lg bg-transparent">
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <Video className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">HD Video Calls</h3>
              <p className="text-muted-foreground text-balance">
                Crystal clear video quality with WebRTC technology for face-to-face conversations that feel natural and
                engaging.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <Waves className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Noise Cancellation</h3>
              <p className="text-muted-foreground text-balance">
                Advanced AI-powered noise cancellation and audio processing for crystal clear conversations in any
                environment.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Smart Matching</h3>
              <p className="text-muted-foreground text-balance">
                Find people with similar interests and preferences for more meaningful connections and conversations.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Safe & Secure</h3>
              <p className="text-muted-foreground text-balance">
                Your privacy and safety are our top priority with end-to-end encryption and comprehensive moderation.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Instant Connect</h3>
              <p className="text-muted-foreground text-balance">
                Quick and easy connections with just one tap. Real-time WebRTC technology with no complicated setup.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Build Relationships</h3>
              <p className="text-muted-foreground text-balance">
                Foster genuine connections and build lasting friendships through authentic conversations and shared
                experiences.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
