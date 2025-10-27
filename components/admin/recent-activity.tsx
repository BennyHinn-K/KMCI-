import { getSupabaseServerClient } from "@/lib/supabase/server"
import { formatDistanceToNow } from "date-fns"
import { ScrollArea } from "@/components/ui/scroll-area"

export async function RecentActivity() {
  const supabase = await getSupabaseServerClient()

  // Fetch recent audit logs
  const { data: logs } = await supabase
    .from("audit_logs")
    .select(`
      *,
      profiles:user_id (full_name, email)
    `)
    .order("created_at", { ascending: false })
    .limit(10)

  if (!logs || logs.length === 0) {
    return (
      <div className="text-sm text-muted-foreground text-center py-8">
        No recent activity
      </div>
    )
  }

  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-4">
        {logs.map((log) => (
          <div key={log.id} className="flex items-start gap-3 text-sm">
            <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
            <div className="flex-1 space-y-1">
              <p className="font-medium">
                {log.profiles?.full_name || log.profiles?.email || "System"}
              </p>
              <p className="text-muted-foreground">{log.action}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}



