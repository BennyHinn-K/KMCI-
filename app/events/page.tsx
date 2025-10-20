import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { EventsCalendar } from "@/components/events/events-calendar"
import { EventsList } from "@/components/events/events-list"

export const metadata = {
  title: "Events | Kingdom Missions Center International",
  description: "Join us for worship services, conferences, outreach programs, and community events at KMCI.",
}

export default function EventsPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary to-primary/90 text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-serif font-bold text-5xl md:text-6xl mb-6 animate-fade-in-up">Events</h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed animate-fade-in-up">
              Join us for worship, fellowship, and community transformation
            </p>
          </div>
        </section>

        <EventsCalendar />
        <EventsList />
      </main>
      <SiteFooter />
    </div>
  )
}
