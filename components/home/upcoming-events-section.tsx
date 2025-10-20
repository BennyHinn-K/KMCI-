import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Clock } from "lucide-react"
import Link from "next/link"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function UpcomingEventsSection() {
  const supabase = await getSupabaseServerClient()

  const { data: events } = await supabase
    .from("events")
    .select("*")
    .gte("event_date", new Date().toISOString())
    .order("event_date", { ascending: true })
    .limit(3)

  const upcomingEvents = events || []

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif font-bold text-4xl md:text-5xl text-foreground mb-4">Upcoming Events</h2>
          <p className="text-lg text-muted-foreground">Join us for worship, fellowship, and community</p>
        </div>

        {upcomingEvents.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-8">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-6 space-y-4">
                    <h3 className="font-serif font-bold text-xl text-foreground group-hover:text-primary transition-colors">
                      {event.title}
                    </h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>
                          {new Date(event.event_date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      {event.event_time && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-primary" />
                          <span>{event.event_time}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors bg-transparent"
                      asChild
                    >
                      <Link href="/events">RSVP Now</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center">
              <Button asChild size="lg" variant="outline">
                <Link href="/events">View All Events</Link>
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No upcoming events at this time. Check back soon!</p>
          </div>
        )}
      </div>
    </section>
  )
}
