export default function AdminDonationsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold text-navy">Donations Management</h1>
        <p className="text-navy/60 mt-1">Track and manage donations</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-navy mb-4">Donations Management</h3>
        <p className="text-navy/60 mb-4">Track and manage all donations</p>
        <div className="space-y-2">
          <button className="w-full p-3 bg-ivory rounded-lg hover:bg-ivory-light transition-colors text-left">
            View All Donations
          </button>
          <button className="w-full p-3 bg-ivory rounded-lg hover:bg-ivory-light transition-colors text-left">
            Generate Reports
          </button>
          <button className="w-full p-3 bg-ivory rounded-lg hover:bg-ivory-light transition-colors text-left">
            Manage Payment Methods
          </button>
        </div>
      </div>
    </div>
  )
}