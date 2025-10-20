import { getSupabaseServerClient } from "@/lib/supabase/server"
import { GeneralSettings } from "@/components/admin/general-settings"
import { EmailSettings } from "@/components/admin/email-settings"
import { PaymentSettings } from "@/components/admin/payment-settings"
import { SecuritySettings } from "@/components/admin/security-settings"
import { SiteSettings } from "@/components/admin/site-settings"

export default async function AdminSettingsPage() {
  const supabase = await getSupabaseServerClient()

  // Fetch site settings
  const { data: settings } = await supabase
    .from("site_settings")
    .select("*")
    .order("key")

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold text-navy">Settings</h1>
        <p className="text-navy/60 mt-1">Configure application-wide preferences and system settings</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <GeneralSettings settings={settings || []} />
        <SiteSettings settings={settings || []} />
        <EmailSettings settings={settings || []} />
        <PaymentSettings settings={settings || []} />
        <SecuritySettings settings={settings || []} />
      </div>
    </div>
  )
}



