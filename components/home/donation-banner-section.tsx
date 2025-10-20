import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import Link from "next/link"

export function DonationBannerSection() {
  return (
    <section className="py-16 bg-gradient-to-r from-primary via-primary/95 to-primary text-primary-foreground relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <Heart className="w-16 h-16 mx-auto text-accent animate-pulse" />
          <h2 className="font-serif font-bold text-3xl md:text-4xl">Partner With Us in Transforming Lives</h2>
          <p className="text-lg text-primary-foreground/90 leading-relaxed">
            Your generous support enables us to reach more communities, disciple more believers, and bring hope to those
            who need it most. Every gift makes an eternal difference.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/donate">Give Now</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
            >
              <Link href="/projects">View Projects</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
