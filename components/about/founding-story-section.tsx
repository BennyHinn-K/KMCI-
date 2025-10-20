import { Card, CardContent } from "@/components/ui/card"
import { BookOpen } from "lucide-react"

export function FoundingStorySection() {
  return (
    <section className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <BookOpen className="w-12 h-12 mx-auto text-primary mb-4" />
            <h2 className="font-serif font-bold text-4xl md:text-5xl text-foreground mb-4">Our Story</h2>
            <p className="text-lg text-muted-foreground">How God birthed a vision for transformation</p>
          </div>

          <Card className="border-2">
            <CardContent className="p-8 md:p-12 space-y-6 text-muted-foreground leading-relaxed">
              <p className="text-lg">
                In 2010, a small group of believers gathered with a burning passion to see communities transformed by
                the Gospel. What started as weekly prayer meetings in a humble home soon grew into a movement of faith,
                hope, and love.
              </p>

              <p>
                The founders recognized that true transformation required more than just preaching—it demanded holistic
                ministry that addressed spiritual, social, and economic needs. This conviction led to the establishment
                of Kingdom Missions Center International.
              </p>

              <p>
                From the beginning, KMCI has been committed to three core pillars: discipleship that builds strong
                foundations of faith, missions that reach the unreached, and development that empowers communities. This
                integrated approach has enabled us to see lasting transformation in the lives of thousands.
              </p>

              <p>
                Today, KMCI stands as a testament to God's faithfulness. What began with a handful of believers has
                grown into a thriving ministry center that serves multiple communities, trains missionaries, and
                provides care for vulnerable children. Our journey continues as we pursue God's vision for even greater
                impact.
              </p>

              <div className="pt-6 border-t border-border">
                <p className="text-sm italic text-center">
                  "For I know the plans I have for you, declares the Lord, plans for welfare and not for evil, to give
                  you a future and a hope." - Jeremiah 29:11
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
