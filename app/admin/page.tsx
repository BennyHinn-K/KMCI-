import { getSupabaseServerClient } from "@/lib/supabase/server"
import { StatsCards } from "@/components/admin/stats-cards"
import { RecentActivity } from "@/components/admin/recent-activity"
import { DonationChart } from "@/components/admin/donation-chart"
import { QuickActions } from "@/components/admin/quick-actions"

export default async function AdminDashboard() {
  const supabase = await getSupabaseServerClient()

  // Fetch statistics
  const [{ count: blogCount }, { count: eventCount }, { count: sermonCount }, { data: donations }] = await Promise.all([
    supabase.from("blog_posts").select("*", { count: "exact", head: true }),
    supabase.from("events").select("*", { count: "exact", head: true }),
    supabase.from("sermons").select("*", { count: "exact", head: true }),
    supabase.from("donations").select("amount, created_at").order("created_at", { ascending: false }).limit(100),
  ])

  const totalDonations = donations?.reduce((sum, d) => sum + d.amount, 0) || 0

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold text-navy">Dashboard</h1>
        <p className="text-navy/60 mt-1">Overview of your ministry management system</p>
      </div>

      <StatsCards
        stats={{
          blogPosts: blogCount || 0,
          events: eventCount || 0,
          sermons: sermonCount || 0,
          donations: totalDonations,
        }}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <DonationChart donations={donations || []} />
        <RecentActivity />
      </div>

      <QuickActions />
    </div>
  )
}
