export default function AdminEventsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold text-navy">Events Management</h1>
        <p className="text-navy/60 mt-1">Create and manage church events</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-navy mb-4">Events Management</h3>
        <p className="text-navy/60 mb-4">Manage your church events and activities</p>
        <div className="space-y-2">
          <button className="w-full p-3 bg-ivory rounded-lg hover:bg-ivory-light transition-colors text-left">
            Create New Event
          </button>
          <button className="w-full p-3 bg-ivory rounded-lg hover:bg-ivory-light transition-colors text-left">
            View All Events
          </button>
          <button className="w-full p-3 bg-ivory rounded-lg hover:bg-ivory-light transition-colors text-left">
            Manage RSVPs
          </button>
        </div>
      </div>
    </div>
  )
}
