import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { AppFooter } from "@/components/app-footer"
import "./globals.css"

export const metadata: Metadata = {
  title: "SocialCall - Connect Through Conversations",
  description:
    "Join our community and discover new connections through high-quality voice and video calls with advanced noise cancellation. Meet people, share stories, and build lasting friendships.",
  generator: "v0.app",
  keywords: [
    "social calling",
    "video calls",
    "voice calls",
    "meet people",
    "social networking",
    "WebRTC",
    "noise cancellation",
  ],
  authors: [{ name: "SocialCall Team" }],
  openGraph: {
    title: "SocialCall - Connect Through Conversations",
    description:
      "Join our community and discover new connections through high-quality voice and video calls with advanced noise cancellation.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased min-h-screen flex flex-col`}>
        <Suspense fallback={<div>Loading...</div>}>
          <main className="flex-1">{children}</main>
          <AppFooter />
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
