import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProjectsGrid } from "@/components/projects/projects-grid"
import { ImpactStats } from "@/components/projects/impact-stats"

export const metadata = {
  title: "Projects | Kingdom Missions Center International",
  description:
    "Support KMCI's development projects: Missionary Training Base, Children's Home, and Outreach Vehicles. Make an eternal impact.",
}

export default function ProjectsPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary to-primary/90 text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-serif font-bold text-5xl md:text-6xl mb-6 animate-fade-in-up">Our Projects</h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed animate-fade-in-up">
              Building infrastructure for sustainable ministry and community transformation
            </p>
          </div>
        </section>

        <ImpactStats />
        <ProjectsGrid />
      </main>
      <SiteFooter />
    </div>
  )
}
