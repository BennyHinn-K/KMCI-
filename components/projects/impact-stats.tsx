"use client"

import { useEffect, useRef, useState } from "react"
import { Users, Home, Truck } from "lucide-react"

const stats = [
  { icon: Users, label: "Families Reached", value: 165, suffix: "+" },
  { icon: Home, label: "Children Cared For", value: 45, suffix: "" },
  { icon: Truck, label: "Communities Served", value: 11, suffix: "+" },
]

export function ImpactStats() {
  const [counts, setCounts] = useState(stats.map(() => 0))
  const [hasAnimated, setHasAnimated] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true)
            stats.forEach((stat, index) => {
              const duration = 2000
              const steps = 60
              const increment = stat.value / steps
              let current = 0

              const timer = setInterval(() => {
                current += increment
                if (current >= stat.value) {
                  current = stat.value
                  clearInterval(timer)
                }
                setCounts((prev) => {
                  const newCounts = [...prev]
                  newCounts[index] = Math.floor(current)
                  return newCounts
                })
              }, duration / steps)
            })
            observer.disconnect()
          }
        })
      },
      { threshold: 0.5 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [hasAnimated])

  return (
    <section ref={sectionRef} className="py-16 bg-card">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="font-serif font-bold text-3xl text-foreground mb-2">Our Impact</h2>
          <p className="text-muted-foreground">Lives transformed through your generous support</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <div className="font-serif font-bold text-5xl text-accent">
                  {counts[index]}
                  {stat.suffix}
                </div>
                <div className="text-lg text-muted-foreground">{stat.label}</div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
