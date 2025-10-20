import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { MinistriesGrid } from "@/components/ministries/ministries-grid"

export const metadata = {
  title: "Ministries | Kingdom Missions Center International",
  description:
    "Explore KMCI's six core ministries: Children, Youth, Women, Men, Missions, and Worship. Discover how we serve and disciple our community.",
}

export default function MinistriesPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary to-primary/90 text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-serif font-bold text-5xl md:text-6xl mb-6 animate-fade-in-up">Our Ministries</h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed animate-fade-in-up">
              Serving every generation with purpose, passion, and the power of God's love
            </p>
          </div>
        </section>

        <MinistriesGrid />
      </main>
      <SiteFooter />
    </div>
  )
}
