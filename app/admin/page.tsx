export default function AdminDashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold text-navy">Admin Dashboard</h1>
        <p className="text-navy/60 mt-1">Welcome to your ministry management system</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-navy">Blog Posts</h3>
              <p className="text-2xl font-bold text-primary mt-2">0</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-navy">Events</h3>
              <p className="text-2xl font-bold text-primary mt-2">0</p>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-navy">Sermons</h3>
              <p className="text-2xl font-bold text-primary mt-2">0</p>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-navy">Donations</h3>
              <p className="text-2xl font-bold text-primary mt-2">$0</p>
            </div>
            <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-navy mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <a href="/admin/blog" className="block p-3 bg-ivory rounded-lg hover:bg-ivory-light transition-colors">
              📝 Manage Blog Posts
            </a>
            <a href="/admin/events" className="block p-3 bg-ivory rounded-lg hover:bg-ivory-light transition-colors">
              📅 Manage Events
            </a>
            <a href="/admin/sermons" className="block p-3 bg-ivory rounded-lg hover:bg-ivory-light transition-colors">
              🎤 Manage Sermons
            </a>
            <a href="/admin/projects" className="block p-3 bg-ivory rounded-lg hover:bg-ivory-light transition-colors">
              🏗️ Manage Projects
            </a>
            <a href="/admin/donations" className="block p-3 bg-ivory rounded-lg hover:bg-ivory-light transition-colors">
              💰 Track Donations
            </a>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-navy mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-navy/70">Website Status</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Online</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-navy/70">Database</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-navy/70">Payments</span>
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-navy/70">Last Backup</span>
              <span className="text-navy/70 text-sm">Today</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
