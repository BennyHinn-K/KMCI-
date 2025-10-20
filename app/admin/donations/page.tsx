import { getSupabaseServerClient } from "@/lib/supabase/server"
import { DonationsOverview } from "@/components/admin/donations-overview"
import { DonationsTable } from "@/components/admin/donations-table"
import { DonationReports } from "@/components/admin/donation-reports"

export default async function AdminDonationsPage() {
  const supabase = await getSupabaseServerClient()

  // Fetch donations data
  const [
    { data: donations },
    { data: projects }
  ] = await Promise.all([
    supabase.from("donations").select(`
      *,
      projects (
        id,
        title
      )
    `).order("created_at", { ascending: false }),
    supabase.from("projects").select("id, title, goal_amount, raised_amount").order("created_at", { ascending: false })
  ])

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold text-navy">Donations</h1>
        <p className="text-navy/60 mt-1">Manage and track all financial contributions</p>
      </div>

      <DonationsOverview 
        donations={donations || []}
        projects={projects || []}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DonationsTable donations={donations || []} />
        </div>
        <div>
          <DonationReports 
            donations={donations || []}
            projects={projects || []}
          />
        </div>
      </div>
    </div>
  )
}



