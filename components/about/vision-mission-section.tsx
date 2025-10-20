import { Card, CardContent } from "@/components/ui/card"
import { Eye, Target, Compass } from "lucide-react"

export function VisionMissionSection() {
  return (
    <section className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Vision */}
            <Card className="border-2 hover:border-accent transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-8 space-y-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <Eye className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-serif font-bold text-2xl text-foreground">Our Vision</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To be a transformative center that disciples communities and raises leaders who impact the world for
                  Christ.
                </p>
              </CardContent>
            </Card>

            {/* Mission */}
            <Card className="border-2 hover:border-accent transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-8 space-y-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <Target className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-serif font-bold text-2xl text-foreground">Our Mission</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To disciple believers, equip missionaries, and serve communities through holistic ministry that
                  transforms lives spiritually, socially, and economically.
                </p>
              </CardContent>
            </Card>

            {/* Purpose */}
            <Card className="border-2 hover:border-accent transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-8 space-y-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <Compass className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-serif font-bold text-2xl text-foreground">Our Purpose</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To fulfill the Great Commission by making disciples of all nations, teaching them to observe all that
                  Christ commanded.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
