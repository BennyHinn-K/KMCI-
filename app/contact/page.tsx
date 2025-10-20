import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ContactForm } from "@/components/contact/contact-form"
import { ContactInfo } from "@/components/contact/contact-info"
import { LocationMap } from "@/components/contact/location-map"

export const metadata = {
  title: "Contact Us | Kingdom Missions Center International",
  description: "Get in touch with KMCI. Visit us, call us, or send us a message. We'd love to hear from you.",
}

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary to-primary/90 text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-serif font-bold text-5xl md:text-6xl mb-6 animate-fade-in-up">Contact Us</h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed animate-fade-in-up">
              We'd love to hear from you. Reach out with questions, prayer requests, or to learn more about KMCI
            </p>
          </div>
        </section>

        <ContactInfo />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          <ContactForm />
          <LocationMap />
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
