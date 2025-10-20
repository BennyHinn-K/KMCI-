"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"

const categories = [
  { id: "all", label: "All Posts" },
  { id: "testimonies", label: "Testimonies" },
  { id: "outreach", label: "Outreach" },
  { id: "leadership", label: "Leadership" },
  { id: "news", label: "News" },
  { id: "updates", label: "Updates" },
]

export function BlogCategories() {
  const [activeCategory, setActiveCategory] = useState("all")

  return (
    <section className="py-8 bg-card border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              onClick={() => setActiveCategory(category.id)}
              className={activeCategory === category.id ? "bg-primary" : "bg-transparent"}
            >
              {category.label}
            </Button>
          ))}
        </div>
      </div>
    </section>
  )
}
