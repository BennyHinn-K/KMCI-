import { getSupabaseServerClient } from "@/lib/supabase/server"
import { EventsManager } from "@/components/admin/events-manager"

export default async function AdminEventsPage() {
  const supabase = await getSupabaseServerClient()

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Events</h1>
        <p className="text-muted-foreground">
          Manage upcoming and past events
        </p>
      </div>

      <EventsManager events={events || []} />
    </div>
  )
}



