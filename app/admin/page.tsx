import { getSupabaseServerClient } from "@/lib/supabase/server"
import { StatsCard } from "@/components/admin/stats-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  FileText,
  Mic2,
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  Mail,
  Eye,
} from "lucide-react"
import { RecentActivity } from "@/components/admin/recent-activity"
import { QuickActions } from "@/components/admin/quick-actions"

export default async function AdminDashboard() {
  const supabase = await getSupabaseServerClient()

  // Fetch stats
  const [
    { count: blogCount },
    { count: sermonCount },
    { count: eventCount },
    { count: messageCount },
    { data: donations },
  ] = await Promise.all([
    supabase.from("blog_posts").select("*", { count: "exact", head: true }),
    supabase.from("sermons").select("*", { count: "exact", head: true }),
    supabase.from("events").select("*", { count: "exact", head: true }),
    supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("donations").select("amount, currency").eq("status", "completed"),
  ])

  // Calculate total donations
  const totalDonations = donations?.reduce((sum, d) => sum + Number(d.amount), 0) || 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's what's happening with your organization.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Donations"
          value={`KES ${totalDonations.toLocaleString()}`}
          description="All time"
          icon={DollarSign}
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatsCard
          title="Blog Posts"
          value={blogCount || 0}
          description="Published articles"
          icon={FileText}
        />
        <StatsCard
          title="Sermons"
          value={sermonCount || 0}
          description="Total sermons"
          icon={Mic2}
        />
        <StatsCard
          title="Upcoming Events"
          value={eventCount || 0}
          description="Scheduled events"
          icon={Calendar}
        />
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <QuickActions />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentActivity />
          </CardContent>
        </Card>
      </div>

      {/* New Messages Alert */}
      {messageCount && messageCount > 0 && (
        <Card className="border-l-4 border-l-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              You have {messageCount} new message{messageCount > 1 ? "s" : ""}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Check your messages to respond to inquiries from visitors.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}



