import { getSupabaseServerClient } from "@/lib/supabase/server"
import { SermonsManager } from "@/components/admin/sermons-manager"

export default async function AdminSermonsPage() {
  const supabase = await getSupabaseServerClient()

  const { data: sermons } = await supabase.from("sermons").select("*").order("sermon_date", { ascending: false })

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold text-navy">Sermons Management</h1>
        <p className="text-navy/60 mt-1">Upload and manage sermon content</p>
      </div>
      <SermonsManager initialSermons={sermons || []} />
    </div>
  )
}
