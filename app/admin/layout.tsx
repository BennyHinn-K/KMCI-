"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const supabase = getSupabaseBrowserClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push("/admin/login")
        return
      }
      
      setUser(user)
      setLoading(false)
    }

    checkUser()
  }, [router])

  const handleLogout = async () => {
    const supabase = getSupabaseBrowserClient()
    await supabase.auth.signOut()
    router.push("/admin/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-ivory">
      <div className="flex">
        <div className="w-64 bg-white shadow-sm min-h-screen p-6">
          <h2 className="text-xl font-bold text-navy mb-6">Admin Panel</h2>
          <nav className="space-y-2">
            <a href="/admin" className="block p-3 bg-ivory rounded-lg hover:bg-ivory-light transition-colors">
              Dashboard
            </a>
            <a href="/admin/blog" className="block p-3 bg-ivory rounded-lg hover:bg-ivory-light transition-colors">
              Blog Posts
            </a>
            <a href="/admin/events" className="block p-3 bg-ivory rounded-lg hover:bg-ivory-light transition-colors">
              Events
            </a>
            <a href="/admin/sermons" className="block p-3 bg-ivory rounded-lg hover:bg-ivory-light transition-colors">
              Sermons
            </a>
            <a href="/admin/projects" className="block p-3 bg-ivory rounded-lg hover:bg-ivory-light transition-colors">
              Projects
            </a>
            <a href="/admin/donations" className="block p-3 bg-ivory rounded-lg hover:bg-ivory-light transition-colors">
              Donations
            </a>
            <a href="/admin/users" className="block p-3 bg-ivory rounded-lg hover:bg-ivory-light transition-colors">
              Users
            </a>
            <a href="/admin/analytics" className="block p-3 bg-ivory rounded-lg hover:bg-ivory-light transition-colors">
              Analytics
            </a>
            <a href="/admin/settings" className="block p-3 bg-ivory rounded-lg hover:bg-ivory-light transition-colors">
              Settings
            </a>
          </nav>
        </div>
        <div className="flex-1">
          <header className="bg-white shadow-sm p-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-navy">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user.email}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </header>
          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  )
}
