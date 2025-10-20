"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Zap, Heart, Shield, Globe, Music, ChevronDown, ChevronUp } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface Ministry {
  id: string
  title: string
  icon: LucideIcon
  shortDescription: string
  fullDescription: string
  programs: string[]
  color: string
}

const ministries: Ministry[] = [
  {
    id: "children",
    title: "Children Ministry",
    icon: Users,
    shortDescription: "Nurturing young hearts to know and love Jesus",
    fullDescription:
      "Our Children Ministry is dedicated to creating a safe, fun, and spiritually enriching environment where children can learn about God's love. Through engaging Bible stories, worship, crafts, and games, we help children build a strong foundation of faith that will guide them throughout their lives.",
    programs: [
      "Sunday School (Ages 3-12)",
      "Kids Worship Experience",
      "Vacation Bible School",
      "Children's Choir",
      "Scripture Memory Program",
    ],
    color: "from-blue-500 to-blue-600",
  },
  {
    id: "youth",
    title: "Youth Ministry",
    icon: Zap,
    shortDescription: "Empowering the next generation for Kingdom impact",
    fullDescription:
      "The Youth Ministry focuses on discipling teenagers and young adults, helping them navigate life's challenges while growing in their relationship with Christ. We provide mentorship, leadership training, and opportunities for service that prepare them to be world-changers for God.",
    programs: [
      "Friday Night Youth Service",
      "Leadership Development Program",
      "Youth Conferences & Camps",
      "Mentorship Groups",
      "Community Service Projects",
    ],
    color: "from-purple-500 to-purple-600",
  },
  {
    id: "women",
    title: "Women Ministry",
    icon: Heart,
    shortDescription: "Building strong, faith-filled women of God",
    fullDescription:
      "Our Women Ministry creates a supportive community where women can grow spiritually, emotionally, and relationally. Through Bible studies, prayer groups, and fellowship events, we encourage women to discover their God-given purpose and walk in their calling with confidence.",
    programs: [
      "Weekly Bible Study",
      "Prayer Breakfast Meetings",
      "Women's Conferences",
      "Mentorship & Discipleship",
      "Community Outreach",
    ],
    color: "from-pink-500 to-pink-600",
  },
  {
    id: "men",
    title: "Men Ministry",
    icon: Shield,
    shortDescription: "Raising godly men who lead with integrity",
    fullDescription:
      "The Men Ministry equips men to be spiritual leaders in their homes, workplaces, and communities. We focus on accountability, biblical manhood, and developing character that reflects Christ in every area of life.",
    programs: [
      "Men's Fellowship Meetings",
      "Accountability Groups",
      "Leadership Training",
      "Father-Son Events",
      "Community Service",
    ],
    color: "from-green-500 to-green-600",
  },
  {
    id: "missions",
    title: "Missions & Outreach",
    icon: Globe,
    shortDescription: "Taking the Gospel beyond our walls",
    fullDescription:
      "Our Missions & Outreach ministry is committed to sharing the love of Christ with unreached communities. Through evangelism, community development, and compassionate service, we bring hope and transformation to those who need it most.",
    programs: [
      "Missionary Training Program",
      "Community Evangelism",
      "Medical Outreach Camps",
      "Food Distribution",
      "Church Planting",
    ],
    color: "from-orange-500 to-orange-600",
  },
  {
    id: "worship",
    title: "Worship Ministry",
    icon: Music,
    shortDescription: "Leading hearts into God's presence",
    fullDescription:
      "The Worship Ministry creates an atmosphere where people can encounter God through music, prayer, and creative expression. Our team is dedicated to excellence in worship that honors God and draws people closer to Him.",
    programs: [
      "Sunday Worship Team",
      "Choir Ministry",
      "Instrument Training",
      "Worship Nights",
      "Creative Arts (Dance, Drama)",
    ],
    color: "from-indigo-500 to-indigo-600",
  },
]

export function MinistriesGrid() {
  const [expandedMinistry, setExpandedMinistry] = useState<string | null>(null)

  const toggleMinistry = (id: string) => {
    setExpandedMinistry(expandedMinistry === id ? null : id)
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {ministries.map((ministry) => {
            const Icon = ministry.icon
            const isExpanded = expandedMinistry === ministry.id

            return (
              <Card
                key={ministry.id}
                className={`group hover:shadow-xl transition-all duration-500 border-2 hover:border-accent overflow-hidden ${
                  isExpanded ? "md:col-span-2 lg:col-span-3" : ""
                }`}
              >
                <CardContent className="p-0">
                  {/* Card Header - Always Visible */}
                  <div className="p-6 space-y-4">
                    <div
                      className={`w-16 h-16 rounded-full bg-gradient-to-br ${ministry.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-2xl text-foreground mb-2">{ministry.title}</h3>
                      <p className="text-muted-foreground">{ministry.shortDescription}</p>
                    </div>

                    <Button
                      onClick={() => toggleMinistry(ministry.id)}
                      variant="outline"
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors bg-transparent"
                    >
                      {isExpanded ? (
                        <>
                          Show Less <ChevronUp className="ml-2 h-4 w-4" />
                        </>
                      ) : (
                        <>
                          Learn More <ChevronDown className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="px-6 pb-6 space-y-6 animate-fade-in-up border-t border-border pt-6">
                      <div>
                        <h4 className="font-semibold text-lg text-foreground mb-3">About This Ministry</h4>
                        <p className="text-muted-foreground leading-relaxed">{ministry.fullDescription}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-lg text-foreground mb-3">Current Programs</h4>
                        <ul className="space-y-2">
                          {ministry.programs.map((program, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                              <span className="text-muted-foreground">{program}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-4">
                        <Button className="bg-primary hover:bg-primary/90">Get Involved</Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
