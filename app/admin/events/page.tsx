import { getSupabaseServerClient } from "@/lib/supabase/server"
import { EventsManager } from "@/components/admin/events-manager"

export default async function AdminEventsPage() {
  const supabase = await getSupabaseServerClient()

  const { data: events } = await supabase.from("events").select("*").order("event_date", { ascending: false })

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold text-navy">Events Management</h1>
        <p className="text-navy/60 mt-1">Create and manage church events</p>
      </div>
      <EventsManager initialEvents={events || []} />
    </div>
  )
}
