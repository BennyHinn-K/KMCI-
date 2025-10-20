"use client"

import { useEffect, useRef, useState } from "react"

const stats = [
  { label: "Years of Ministry", value: 15, suffix: "+" },
  { label: "Lives Touched", value: 5000, suffix: "+" },
  { label: "Communities Reached", value: 25, suffix: "+" },
]

export function StatsSection() {
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
    <section ref={sectionRef} className="py-16 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="font-serif font-bold text-5xl md:text-6xl mb-2 text-accent">
                {counts[index]}
                {stat.suffix}
              </div>
              <div className="text-lg text-primary-foreground/80">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
