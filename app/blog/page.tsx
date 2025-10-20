import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { BlogGrid } from "@/components/blog/blog-grid"
import { BlogCategories } from "@/components/blog/blog-categories"

export const metadata = {
  title: "Blog | Kingdom Missions Center International",
  description: "Read stories of transformation, outreach updates, and leadership insights from KMCI.",
}

export default function BlogPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary to-primary/90 text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-serif font-bold text-5xl md:text-6xl mb-6 animate-fade-in-up">Blog</h1>
            <p className="text-xl md:text-2xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed animate-fade-in-up">
              Stories of transformation, faith, and community impact
            </p>
          </div>
        </section>

        <BlogCategories />
        <BlogGrid />
      </main>
      <SiteFooter />
    </div>
  )
}
