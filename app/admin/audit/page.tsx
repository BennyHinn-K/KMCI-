import { getSupabaseServerClient } from "@/lib/supabase/server"
import { AuditLogTable } from "@/components/admin/audit-log-table"

export default async function AdminAuditPage() {
  const supabase = await getSupabaseServerClient()

  const { data: logs } = await supabase
    .from("audit_logs")
    .select(`
      *,
      profiles:user_id (full_name, email)
    `)
    .order("created_at", { ascending: false })
    .limit(100)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Audit Log</h1>
        <p className="text-muted-foreground">
          Track all administrative actions and changes
        </p>
      </div>

      <AuditLogTable logs={logs || []} />
    </div>
  )
}



