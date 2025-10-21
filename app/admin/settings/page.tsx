export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold text-navy">Settings</h1>
        <p className="text-navy/60 mt-1">Configure site settings and preferences</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-navy mb-4">Site Settings</h3>
        <p className="text-navy/60 mb-4">Configure your website settings</p>
        <div className="space-y-2">
          <button className="w-full p-3 bg-ivory rounded-lg hover:bg-ivory-light transition-colors text-left">
            General Settings
          </button>
          <button className="w-full p-3 bg-ivory rounded-lg hover:bg-ivory-light transition-colors text-left">
            Email Settings
          </button>
          <button className="w-full p-3 bg-ivory rounded-lg hover:bg-ivory-light transition-colors text-left">
            Payment Settings
          </button>
        </div>
      </div>
    </div>
  )
}