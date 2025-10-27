import { getSupabaseServerClient } from "@/lib/supabase/server"
import { DonationsManager } from "@/components/admin/donations-manager"
import { DonationStats } from "@/components/admin/donation-stats"

export default async function AdminDonationsPage() {
  const supabase = await getSupabaseServerClient()

  const { data: donations } = await supabase
    .from("donations")
    .select(`
      *,
      projects (title)
    `)
    .order("created_at", { ascending: false })

  // Calculate stats
  const totalDonations = donations?.reduce((sum, d) => sum + Number(d.amount), 0) || 0
  const completedDonations = donations?.filter(d => d.status === "completed").length || 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Donations</h1>
        <p className="text-muted-foreground">
          Track and manage all donation transactions
        </p>
      </div>

      <DonationStats 
        total={totalDonations}
        count={completedDonations}
        donations={donations || []}
      />

      <DonationsManager donations={donations || []} />
    </div>
  )
}



