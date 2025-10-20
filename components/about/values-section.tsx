"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"

const values = [
  {
    letter: "S",
    title: "Servanthood",
    description: "We lead by serving others with humility and compassion, following Christ's example.",
    color: "from-blue-500 to-blue-600",
  },
  {
    letter: "A",
    title: "Accountability",
    description: "We hold ourselves and each other accountable to God's Word and our commitments.",
    color: "from-purple-500 to-purple-600",
  },
  {
    letter: "T",
    title: "Teamwork",
    description: "We work together in unity, recognizing that we are stronger when we collaborate.",
    color: "from-green-500 to-green-600",
  },
  {
    letter: "I",
    title: "Integrity",
    description: "We maintain honesty and moral uprightness in all our dealings and relationships.",
    color: "from-orange-500 to-orange-600",
  },
  {
    letter: "U",
    title: "Unity & Love",
    description: "We cultivate genuine love and unity that reflects the heart of Christ.",
    color: "from-red-500 to-red-600",
  },
  {
    letter: "M",
    title: "Mentorship",
    description: "We invest in developing the next generation of leaders through intentional discipleship.",
    color: "from-indigo-500 to-indigo-600",
  },
  {
    letter: "E",
    title: "Excellence",
    description: "We pursue excellence in all we do, offering our best to God and those we serve.",
    color: "from-yellow-500 to-yellow-600",
  },
  {
    letter: "C",
    title: "Christ-like Character",
    description: "We strive to reflect the character of Christ in our thoughts, words, and actions.",
    color: "from-pink-500 to-pink-600",
  },
]

export function ValuesSection() {
  const [visibleBadges, setVisibleBadges] = useState<number[]>([])
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            values.forEach((_, index) => {
              setTimeout(() => {
                setVisibleBadges((prev) => [...prev, index])
              }, index * 150)
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
    <section ref={sectionRef} className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif font-bold text-4xl md:text-5xl text-foreground mb-4">Our Core Values</h2>
          <p className="text-xl text-muted-foreground mb-2">SATIUMEC</p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Eight foundational values that guide our ministry and shape our community
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {values.map((value, index) => {
            const isVisible = visibleBadges.includes(index)

            return (
              <Card
                key={index}
                className={`group hover:shadow-xl transition-all duration-500 border-2 hover:border-accent ${
                  isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
                }`}
                style={{
                  transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
                }}
              >
                <CardContent className="p-6 text-center space-y-3">
                  <div
                    className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${value.color} flex items-center justify-center text-white font-bold text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300`}
                  >
                    {value.letter}
                  </div>
                  <h3 className="font-serif font-bold text-xl text-foreground">{value.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
