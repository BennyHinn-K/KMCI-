"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Clock, Users } from "lucide-react"
import { RSVPModal } from "@/components/events/rsvp-modal"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

export function EventsList() {
  const [events, setEvents] = useState<any[]>([])
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null)
  const [isRSVPModalOpen, setIsRSVPModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    async function fetchEvents() {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("status", "published")
        .order("event_date", { ascending: true })

      if (!error && data) {
        setEvents(data)
      }
      setLoading(false)
    }
    fetchEvents()
  }, [])

  const handleRSVP = (event: any) => {
    setSelectedEvent(event)
    setIsRSVPModalOpen(true)
  }

  if (loading) {
    return (
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">Loading events...</p>
        </div>
      </section>
    )
  }

  if (events.length === 0) {
    return (
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">No upcoming events at this time. Check back soon!</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto space-y-6">
          {events.map((event, index) => (
            <Card
              key={event.id}
              className="group hover:shadow-xl transition-all duration-300 overflow-hidden animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="md:flex">
                {/* Event Image */}
                <div className="md:w-1/3 aspect-video md:aspect-square overflow-hidden">
                  <img
                    src={event.image_url || "/placeholder.svg?height=400&width=400&query=church event"}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Event Details */}
                <CardContent className="md:w-2/3 p-6 space-y-4">
                  <div>
                    <h3 className="font-serif font-bold text-2xl text-foreground mb-2 group-hover:text-primary transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">{event.description}</p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span>
                        {new Date(event.event_date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4 text-primary" />
                      <span>{event.event_time || "TBA"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{event.location}</span>
                    </div>
                    {event.max_attendees && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="w-4 h-4 text-primary" />
                        <span>
                          {event.current_attendees || 0} / {event.max_attendees} registered
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Progress Bar */}
                  {event.max_attendees && (
                    <div className="space-y-1">
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-500"
                          style={{ width: `${((event.current_attendees || 0) / event.max_attendees) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {event.max_attendees - (event.current_attendees || 0)} spots remaining
                      </p>
                    </div>
                  )}

                  <Button onClick={() => handleRSVP(event)} className="w-full md:w-auto bg-primary hover:bg-primary/90">
                    RSVP Now
                  </Button>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {selectedEvent && (
        <RSVPModal event={selectedEvent} isOpen={isRSVPModalOpen} onClose={() => setIsRSVPModalOpen(false)} />
      )}
    </section>
  )
}
