export default function AdminUsersPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold text-navy">Users Management</h1>
        <p className="text-navy/60 mt-1">Manage admin users and permissions</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-navy mb-4">Users Management</h3>
        <p className="text-navy/60 mb-4">Manage admin users and their permissions</p>
        <div className="space-y-2">
          <button className="w-full p-3 bg-ivory rounded-lg hover:bg-ivory-light transition-colors text-left">
            View All Users
          </button>
          <button className="w-full p-3 bg-ivory rounded-lg hover:bg-ivory-light transition-colors text-left">
            Invite New User
          </button>
          <button className="w-full p-3 bg-ivory rounded-lg hover:bg-ivory-light transition-colors text-left">
            Manage Permissions
          </button>
        </div>
      </div>
    </div>
  )
}