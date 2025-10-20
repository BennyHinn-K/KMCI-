"use client"

import { useEffect, useRef, useState } from "react"
import { CheckCircle2 } from "lucide-react"

const milestones = [
  {
    year: "2010",
    title: "Ministry Founded",
    description: "KMCI established with a vision to transform communities through the Gospel.",
  },
  {
    year: "2012",
    title: "First Outreach Program",
    description: "Launched community outreach serving 50 families in Kinoo and Muthiga.",
  },
  {
    year: "2015",
    title: "Children's Home Opened",
    description: "Opened our first children's home, providing shelter and care for 15 orphans.",
  },
  {
    year: "2017",
    title: "Missionary Training Begins",
    description: "Started formal missionary training program, equipping 20 missionaries annually.",
  },
  {
    year: "2019",
    title: "Strategic Plan Launched",
    description: "Developed comprehensive 5-year strategic plan for sustainable growth.",
  },
  {
    year: "2022",
    title: "Expanded Ministries",
    description: "Grew to six active ministries serving over 1,000 people monthly.",
  },
  {
    year: "2024",
    title: "New Facility Construction",
    description: "Broke ground on new missionary training base and expanded children's home.",
  },
  {
    year: "2025",
    title: "Continued Growth",
    description: "Reaching 25+ communities with plans to train 100 missionaries annually.",
  },
]

export function TimelineSection() {
  const [visibleMilestones, setVisibleMilestones] = useState<number[]>([])
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            milestones.forEach((_, index) => {
              setTimeout(() => {
                setVisibleMilestones((prev) => [...prev, index])
              }, index * 200)
            })
            observer.disconnect()
          }
        })
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif font-bold text-4xl md:text-5xl text-foreground mb-4">Our Journey</h2>
          <p className="text-lg text-muted-foreground">Key milestones in KMCI's history</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border md:left-1/2" />

            {/* Milestones */}
            <div className="space-y-12">
              {milestones.map((milestone, index) => {
                const isVisible = visibleMilestones.includes(index)
                const isEven = index % 2 === 0

                return (
                  <div
                    key={index}
                    className={`relative flex items-center ${isEven ? "md:flex-row" : "md:flex-row-reverse"} ${
                      isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
                    }`}
                    style={{
                      transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
                    }}
                  >
                    {/* Content */}
                    <div className={`flex-1 ${isEven ? "md:pr-12 md:text-right" : "md:pl-12"} pl-16 md:pl-0`}>
                      <div className="inline-block bg-card border-2 border-border rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                        <div className="font-bold text-2xl text-accent mb-2">{milestone.year}</div>
                        <h3 className="font-serif font-bold text-xl text-foreground mb-2">{milestone.title}</h3>
                        <p className="text-muted-foreground text-sm">{milestone.description}</p>
                      </div>
                    </div>

                    {/* Timeline marker */}
                    <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary border-4 border-background flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-primary-foreground" />
                    </div>

                    {/* Spacer for alternating layout */}
                    <div className="hidden md:block flex-1" />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
