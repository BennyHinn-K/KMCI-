"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Globe, Heart } from "lucide-react"

const pillars = [
  {
    icon: Users,
    title: "Ministry & Discipleship",
    description:
      "Building strong foundations of faith through intentional discipleship and spiritual growth across all age groups.",
  },
  {
    icon: Globe,
    title: "Missions & Outreach",
    description: "Taking the Gospel beyond our walls to reach unreached communities with the love and hope of Christ.",
  },
  {
    icon: Heart,
    title: "Development & Care",
    description: "Providing holistic care and development through education, healthcare, and community empowerment.",
  },
]

export function CorePillarsSection() {
  const [visibleCards, setVisibleCards] = useState<number[]>([])
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            pillars.forEach((_, index) => {
              setTimeout(() => {
                setVisibleCards((prev) => [...prev, index])
              }, index * 200)
            })
            observer.disconnect()
          }
        })
      },
      { threshold: 0.2 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif font-bold text-4xl md:text-5xl text-foreground mb-4">Our Core Pillars</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Three foundational areas that guide our mission and ministry
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon
            const isVisible = visibleCards.includes(index)

            return (
              <Card
                key={index}
                className={`group hover:shadow-xl transition-all duration-500 border-2 hover:border-accent ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{
                  transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
                }}
              >
                <CardContent className="p-8 text-center space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                    <Icon className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <h3 className="font-serif font-bold text-2xl text-foreground">{pillar.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{pillar.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
