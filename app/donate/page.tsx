import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { DonationForm } from "@/components/donate/donation-form"
import { DonationImpact } from "@/components/donate/donation-impact"
import { DonationPolicy } from "@/components/donate/donation-policy"

export const metadata = {
  title: "Donate | Kingdom Missions Center International",
  description:
    "Support KMCI's mission to transform lives and communities. Your generous gift makes an eternal difference.",
}

export default function DonatePage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary to-primary/90 text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-serif font-bold text-5xl md:text-6xl mb-6 animate-fade-in-up">Make a Difference</h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed animate-fade-in-up">
              Your generous support enables us to reach more communities, disciple more believers, and bring hope to
              those who need it most
            </p>
          </div>
        </section>

        <DonationImpact />
        <DonationForm />
        <DonationPolicy />
      </main>
      <SiteFooter />
    </div>
  )
}
