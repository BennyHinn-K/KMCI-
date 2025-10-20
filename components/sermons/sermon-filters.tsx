"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function SermonFilters() {
  return (
    <section className="py-8 bg-card border-b border-border">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search sermons..." className="pl-10" />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2 overflow-x-auto">
              <Button variant="default" size="sm" className="bg-primary">
                All
              </Button>
              <Button variant="outline" size="sm" className="bg-transparent">
                Recent
              </Button>
              <Button variant="outline" size="sm" className="bg-transparent">
                Popular
              </Button>
              <Button variant="outline" size="sm" className="bg-transparent">
                Series
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
