import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { HeroSection } from "@/components/home/hero-section"
import { CorePillarsSection } from "@/components/home/core-pillars-section"
import { UpcomingEventsSection } from "@/components/home/upcoming-events-section"
import { LatestSermonSection } from "@/components/home/latest-sermon-section"
import { DonationBannerSection } from "@/components/home/donation-banner-section"
import { NewsletterSection } from "@/components/home/newsletter-section"
import { StatsSection } from "@/components/home/stats-section"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main id="main-content">
        <HeroSection />
        <CorePillarsSection />
        <StatsSection />
        <UpcomingEventsSection />
        <LatestSermonSection />
        <DonationBannerSection />
        <NewsletterSection />
      </main>
      <SiteFooter />
    </div>
  )
}
