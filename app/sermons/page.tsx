import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { SermonsGrid } from "@/components/sermons/sermons-grid"
import { SermonFilters } from "@/components/sermons/sermon-filters"

export const metadata = {
  title: "Sermons | Kingdom Missions Center International",
  description: "Watch and listen to inspiring messages from KMCI. Be encouraged and grow in your faith.",
}

export default function SermonsPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary to-primary/90 text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-serif font-bold text-5xl md:text-6xl mb-6 animate-fade-in-up">Sermons</h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed animate-fade-in-up">
              Be encouraged and inspired by God's Word
            </p>
          </div>
        </section>

        <SermonFilters />
        <SermonsGrid />
      </main>
      <SiteFooter />
    </div>
  )
}
