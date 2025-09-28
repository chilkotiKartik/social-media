import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { UserDirectory } from "@/components/user-directory"
import { CallHistory } from "@/components/call-history"
import { DashboardHeader } from "@/components/dashboard-header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get current user's profile
  const { data: currentProfile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  if (!currentProfile) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
      <DashboardHeader user={data.user} profile={currentProfile} />
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="directory" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="directory">Discover</TabsTrigger>
            <TabsTrigger value="history">Call History</TabsTrigger>
          </TabsList>

          <TabsContent value="directory" className="space-y-6">
            <UserDirectory currentUserId={data.user.id} currentProfile={currentProfile} />
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <div className="text-center space-y-2 mb-6">
              <h1 className="text-3xl font-bold text-foreground">Your Calls</h1>
              <p className="text-muted-foreground text-balance">Review your recent conversations</p>
            </div>
            <CallHistory currentUserId={data.user.id} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
