import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { VisionMissionSection } from "@/components/about/vision-mission-section"
import { ValuesSection } from "@/components/about/values-section"
import { LeadershipSection } from "@/components/about/leadership-section"
import { FoundingStorySection } from "@/components/about/founding-story-section"
import { TimelineSection } from "@/components/about/timeline-section"
import { StrategicPlanSection } from "@/components/about/strategic-plan-section"

export const metadata = {
  title: "About Us | Kingdom Missions Center International",
  description:
    "Learn about KMCI's vision, mission, values, and leadership. Discover our story and commitment to transformation.",
}

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary to-primary/90 text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-serif font-bold text-5xl md:text-6xl mb-6 animate-fade-in-up">About KMCI</h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed animate-fade-in-up">
              Committed to discipling communities and transforming lives for Christ's service since 2010
            </p>
          </div>
        </section>

        <VisionMissionSection />
        <ValuesSection />
        <FoundingStorySection />
        <TimelineSection />
        <LeadershipSection />
        <StrategicPlanSection />
      </main>
      <SiteFooter />
    </div>
  )
}
