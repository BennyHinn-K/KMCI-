export default function AdminDashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold text-navy">Admin Dashboard</h1>
        <p className="text-navy/60 mt-1">Welcome to your ministry management system</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-navy">Blog Posts</h3>
          <p className="text-2xl font-bold text-primary mt-2">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-navy">Events</h3>
          <p className="text-2xl font-bold text-primary mt-2">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-navy">Sermons</h3>
          <p className="text-2xl font-bold text-primary mt-2">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-navy">Donations</h3>
          <p className="text-2xl font-bold text-primary mt-2">$0</p>
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
