import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Download, Target, Building, GraduationCap } from "lucide-react"

const strategicGoals = [
  {
    icon: Target,
    title: "Ministry Structure",
    description: "Strengthen and expand our six core ministries to serve 2,000+ people monthly by 2025.",
  },
  {
    icon: Building,
    title: "Missionary Base",
    description: "Complete construction of a world-class missionary training facility by 2024.",
  },
  {
    icon: GraduationCap,
    title: "Academy Development",
    description: "Establish KMCI Academy to provide quality Christian education and vocational training.",
  },
]

export function StrategicPlanSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary to-primary/90 text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif font-bold text-4xl md:text-5xl mb-4">Strategic Plan 2019-2024</h2>
            <p className="text-xl text-primary-foreground/90">Our roadmap for sustainable growth and impact</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {strategicGoals.map((goal, index) => {
              const Icon = goal.icon
              return (
                <Card key={index} className="bg-card/10 backdrop-blur-sm border-primary-foreground/20">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="w-14 h-14 mx-auto rounded-full bg-accent flex items-center justify-center">
                      <Icon className="w-7 h-7 text-accent-foreground" />
                    </div>
                    <h3 className="font-serif font-bold text-xl text-primary-foreground">{goal.title}</h3>
                    <p className="text-sm text-primary-foreground/80 leading-relaxed">{goal.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="text-center">
            <Card className="inline-block bg-card/10 backdrop-blur-sm border-primary-foreground/20">
              <CardContent className="p-8">
                <p className="text-primary-foreground/90 mb-6 max-w-2xl">
                  Download our complete strategic plan to learn more about our vision, goals, and strategies for
                  transforming communities through Christ.
                </p>
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Download className="mr-2 h-5 w-5" />
                  Download Strategic Plan (PDF)
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
