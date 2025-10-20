import { Card, CardContent } from "@/components/ui/card"
import { Heart, Users, BookOpen, Home } from "lucide-react"

const impactAreas = [
  {
    icon: Heart,
    title: "General Ministry",
    description: "Support all areas of ministry including worship, discipleship, and community outreach",
  },
  {
    icon: Users,
    title: "Missionary Training",
    description: "Equip and send missionaries to unreached communities across Kenya and beyond",
  },
  {
    icon: BookOpen,
    title: "Children's Education",
    description: "Provide quality Christian education and care for vulnerable children",
  },
  {
    icon: Home,
    title: "Infrastructure Development",
    description: "Build facilities that enable sustainable ministry and community transformation",
  },
]

export function DonationImpact() {
  return (
    <section className="py-16 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif font-bold text-3xl text-foreground mb-4">Where Your Donation Goes</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Every gift makes an eternal impact in the lives of individuals and communities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {impactAreas.map((area, index) => {
            const Icon = area.icon
            return (
              <Card key={index} className="border-2 hover:border-accent transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-6 text-center space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-serif font-bold text-lg text-foreground">{area.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{area.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
