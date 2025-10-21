export default function AdminAuditPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold text-navy">Audit Log</h1>
        <p className="text-navy/60 mt-1">Track all admin actions and system changes</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-navy mb-4">Audit Log</h3>
        <p className="text-navy/60 mb-4">View all admin actions and system changes</p>
        <div className="space-y-2">
          <button className="w-full p-3 bg-ivory rounded-lg hover:bg-ivory-light transition-colors text-left">
            View All Logs
          </button>
          <button className="w-full p-3 bg-ivory rounded-lg hover:bg-ivory-light transition-colors text-left">
            Filter by User
          </button>
          <button className="w-full p-3 bg-ivory rounded-lg hover:bg-ivory-light transition-colors text-left">
            Export Logs
          </button>
        </div>
      </div>
    </div>
  )
}