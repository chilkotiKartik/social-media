"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Info, Users, Phone, Video } from "lucide-react"

export function DemoBanner() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <Card className="border-primary/20 bg-primary/5 backdrop-blur-sm mb-6">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <Info className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                Demo Mode
              </Badge>
              <h3 className="font-semibold text-foreground">Welcome to SocialCall Demo!</h3>
            </div>
            <p className="text-sm text-muted-foreground text-balance">
              This is a demonstration of the social calling app. All calls are simulated and no real connections are
              made. Try the features below:
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Users className="h-3 w-3" />
                <span>Browse users</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Phone className="h-3 w-3" />
                <span>Make voice calls</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Video className="h-3 w-3" />
                <span>Start video calls</span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
            onClick={() => setIsVisible(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
