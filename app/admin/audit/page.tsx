import { getSupabaseServerClient } from "@/lib/supabase/server"
import { AuditOverview } from "@/components/admin/audit-overview"
import { AuditTable } from "@/components/admin/audit-table"
import { AuditFilters } from "@/components/admin/audit-filters"

export default async function AdminAuditPage() {
  const supabase = await getSupabaseServerClient()

  // Fetch audit logs with user information
  const { data: auditLogs } = await supabase
    .from("audit_logs")
    .select(`
      *,
      profiles (
        id,
        full_name,
        email
      )
    `)
    .order("created_at", { ascending: false })
    .limit(100)

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold text-navy">Audit Log</h1>
        <p className="text-navy/60 mt-1">Track all admin actions and system changes</p>
      </div>

      <AuditOverview auditLogs={auditLogs || []} />
      <AuditFilters />
      <AuditTable auditLogs={auditLogs || []} />
    </div>
  )
}



