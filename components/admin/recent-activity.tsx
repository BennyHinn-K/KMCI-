import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { formatDistanceToNow } from "date-fns"

export async function RecentActivity() {
  const supabase = await getSupabaseServerClient()

  const { data: activities } = await supabase
    .from("audit_logs")
    .select("*, profiles(full_name)")
    .order("created_at", { ascending: false })
    .limit(10)

  return (
    <Card className="shadow-premium">
      <CardHeader>
        <CardTitle className="text-navy">Recent Activity</CardTitle>
        <CardDescription>Latest actions in the system</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities?.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4 pb-4 border-b border-navy/10 last:border-0">
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-navy">{activity.profiles?.full_name || "Unknown User"}</p>
                <p className="text-sm text-navy/60">
                  {activity.action} {activity.table_name}
                </p>
                <p className="text-xs text-navy/40">
                  {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
          {!activities?.length && <p className="text-sm text-navy/60 text-center py-8">No recent activity</p>}
        </div>
      </CardContent>
    </Card>
  )
}
