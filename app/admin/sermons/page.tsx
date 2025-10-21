export default function AdminSermonsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold text-navy">Sermons Management</h1>
        <p className="text-navy/60 mt-1">Upload and manage sermon content</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-navy mb-4">Sermons Management</h3>
        <p className="text-navy/60 mb-4">Manage your sermon recordings and content</p>
        <div className="space-y-2">
          <button className="w-full p-3 bg-ivory rounded-lg hover:bg-ivory-light transition-colors text-left">
            Upload New Sermon
          </button>
          <button className="w-full p-3 bg-ivory rounded-lg hover:bg-ivory-light transition-colors text-left">
            View All Sermons
          </button>
          <button className="w-full p-3 bg-ivory rounded-lg hover:bg-ivory-light transition-colors text-left">
            Manage Categories
          </button>
        </div>
      </div>
    </div>
  )
}
