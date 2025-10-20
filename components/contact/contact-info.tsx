import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

const contactDetails = [
  {
    icon: MapPin,
    title: "Visit Us",
    details: ["Kinoo/Muthiga", "Kiambu County", "Kenya"],
  },
  {
    icon: Phone,
    title: "Call Us",
    details: ["+254 700 000 000", "+254 711 000 000"],
  },
  {
    icon: Mail,
    title: "Email Us",
    details: ["info@kmci.org", "prayer@kmci.org"],
  },
  {
    icon: Clock,
    title: "Service Times",
    details: ["Sunday: 9:00 AM - 12:00 PM", "Wednesday: 6:00 PM - 8:00 PM", "Friday: 6:00 AM - 7:00 AM (Prayer)"],
  },
]

export function ContactInfo() {
  return (
    <section className="py-16 bg-card">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {contactDetails.map((item, index) => {
            const Icon = item.icon
            return (
              <Card key={index} className="border-2 hover:border-accent transition-all duration-300 hover:shadow-lg">
                <CardContent className="p-6 text-center space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-serif font-bold text-lg text-foreground">{item.title}</h3>
                  <div className="space-y-1">
                    {item.details.map((detail, idx) => (
                      <p key={idx} className="text-sm text-muted-foreground">
                        {detail}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
