"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    // Sequential letter reveal animation
    const title = titleRef.current
    if (!title) return

    const text = title.textContent || ""
    title.textContent = ""
    title.style.opacity = "1"

    const letters = text.split("")
    letters.forEach((letter, index) => {
      const span = document.createElement("span")
      span.textContent = letter
      span.style.opacity = "0"
      span.style.display = "inline-block"
      span.style.animation = `fade-in 0.5s ease-out ${index * 0.05}s forwards`
      title.appendChild(span)
    })
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with subtle animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary/90">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent rounded-full blur-3xl animate-float" />
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent rounded-full blur-3xl animate-float"
            style={{ animationDelay: "1s" }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Main Heading with letter reveal */}
          <h1
            ref={titleRef}
            className="font-serif font-bold text-5xl md:text-6xl lg:text-7xl text-primary-foreground leading-tight opacity-0"
          >
            A Centre of Transformation, Mission, and Hope
          </h1>

          {/* Rotating verbs */}
          <div className="flex items-center justify-center gap-2 text-xl md:text-2xl text-primary-foreground/90">
            <span>We</span>
            <span className="font-semibold text-accent animate-pulse">Disciple</span>
            <span>•</span>
            <span className="font-semibold text-accent animate-pulse" style={{ animationDelay: "0.5s" }}>
              Empower
            </span>
            <span>•</span>
            <span className="font-semibold text-accent animate-pulse" style={{ animationDelay: "1s" }}>
              Transform
            </span>
          </div>

          {/* Description */}
          <p
            className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed animate-fade-in-up"
            style={{ animationDelay: "0.5s" }}
          >
            Kingdom Missions Center International is dedicated to discipling communities and transforming lives for
            Christ's service through ministry, missions, and development.
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up"
            style={{ animationDelay: "0.8s" }}
          >
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 group">
              <Link href="/about">
                Learn More
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
            >
              <Link href="/donate">Support Our Mission</Link>
            </Button>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-primary-foreground/30 rounded-full flex items-start justify-center p-2">
              <div className="w-1 h-3 bg-primary-foreground/50 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
