import { getSupabaseServerClient } from "@/lib/supabase/server"
import { SermonsManager } from "@/components/admin/sermons-manager"

export default async function AdminSermonsPage() {
  const supabase = await getSupabaseServerClient()

  const { data: sermons } = await supabase
    .from("sermons")
    .select("*")
    .order("sermon_date", { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sermons</h1>
        <p className="text-muted-foreground">
          Manage sermon videos and audio recordings
        </p>
      </div>

      <SermonsManager sermons={sermons || []} />
    </div>
  )
}



