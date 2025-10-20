import { Card, CardContent } from "@/components/ui/card"

const leaders = [
  {
    name: "Pastor John Kamau",
    role: "Senior Pastor & Founder",
    bio: "Pastor John has over 20 years of ministry experience and a passion for discipleship and missions. He holds a Master's in Theology and has trained hundreds of church leaders.",
    image: "/african-pastor-smiling.jpg",
  },
  {
    name: "Pastor Sarah Wanjiru",
    role: "Associate Pastor",
    bio: "Pastor Sarah leads our women's ministry and oversees community outreach programs. Her heart for the vulnerable has transformed countless lives.",
    image: "/african-woman-pastor-smiling.jpg",
  },
  {
    name: "Rev. David Mwangi",
    role: "Missions Director",
    bio: "Rev. David coordinates all missionary training and outreach activities. He has personally planted 15 churches in rural Kenya.",
    image: "/african-man-ministry-leader.jpg",
  },
  {
    name: "Grace Njeri",
    role: "Children's Ministry Director",
    bio: "Grace oversees our children's programs and the children's home. Her dedication to nurturing young hearts has impacted hundreds of children.",
    image: "/african-woman-with-children.jpg",
  },
]

export function LeadershipSection() {
  return (
    <section className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif font-bold text-4xl md:text-5xl text-foreground mb-4">Our Leadership</h2>
          <p className="text-lg text-muted-foreground">Dedicated servants leading with vision and integrity</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {leaders.map((leader, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="aspect-square overflow-hidden">
                <img
                  src={leader.image || "/placeholder.svg"}
                  alt={leader.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <CardContent className="p-6 space-y-2">
                <h3 className="font-serif font-bold text-xl text-foreground">{leader.name}</h3>
                <p className="text-sm font-medium text-primary">{leader.role}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{leader.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
