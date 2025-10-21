import type React from "react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
          <header className="bg-white shadow-sm p-6">
            <h1 className="text-2xl font-bold text-navy">Admin Dashboard</h1>
          </header>
          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  )
}
