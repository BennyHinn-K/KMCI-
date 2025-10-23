"use client"
import { useEffect, useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

interface DashboardStats {
  blogPosts: number
  events: number
  sermons: number
  totalDonations: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    blogPosts: 0,
    events: 0,
    sermons: 0,
    totalDonations: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const supabase = getSupabaseBrowserClient()
        
        // Fetch blog posts count
        const { count: blogCount } = await supabase
          .from('blog_posts')
          .select('*', { count: 'exact', head: true })

        // Fetch events count
        const { count: eventsCount } = await supabase
          .from('events')
          .select('*', { count: 'exact', head: true })

        // Fetch sermons count
        const { count: sermonsCount } = await supabase
          .from('sermons')
          .select('*', { count: 'exact', head: true })

        // Fetch total donations
        const { data: donations } = await supabase
          .from('donations')
          .select('amount')
          .eq('status', 'completed')

        const totalDonations = donations?.reduce((sum, donation) => sum + (donation.amount || 0), 0) || 0

        setStats({
          blogPosts: blogCount || 0,
          events: eventsCount || 0,
          sermons: sermonsCount || 0,
          totalDonations
        })
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-display font-bold text-navy">Admin Dashboard</h1>
          <p className="text-navy/60 mt-1">Loading dashboard data...</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm border animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold text-navy">Admin Dashboard</h1>
        <p className="text-navy/60 mt-1">Welcome to your ministry management system</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-navy">Blog Posts</h3>
          <p className="text-2xl font-bold text-primary mt-2">{stats.blogPosts}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-navy">Events</h3>
          <p className="text-2xl font-bold text-primary mt-2">{stats.events}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-navy">Sermons</h3>
          <p className="text-2xl font-bold text-primary mt-2">{stats.sermons}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-navy">Total Donations</h3>
          <p className="text-2xl font-bold text-primary mt-2">KES {stats.totalDonations.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-navy mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <a href="/admin/blog" className="block p-3 bg-ivory rounded-lg hover:bg-ivory-light transition-colors">
              Manage Blog Posts
            </a>
            <a href="/admin/events" className="block p-3 bg-ivory rounded-lg hover:bg-ivory-light transition-colors">
              Manage Events
            </a>
            <a href="/admin/sermons" className="block p-3 bg-ivory rounded-lg hover:bg-ivory-light transition-colors">
              Manage Sermons
            </a>
            <a href="/admin/projects" className="block p-3 bg-ivory rounded-lg hover:bg-ivory-light transition-colors">
              Manage Projects
            </a>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-navy mb-4">Recent Activity</h3>
          <p className="text-navy/60">No recent activity</p>
        </div>
      </div>
    </div>
  )
}
