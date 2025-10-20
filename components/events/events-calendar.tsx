"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react"

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

export function EventsCalendar() {
  const [currentMonth, setCurrentMonth] = useState(0) // January 2025
  const [view, setView] = useState<"calendar" | "list">("calendar")

  const nextMonth = () => {
    setCurrentMonth((prev) => (prev + 1) % 12)
  }

  const prevMonth = () => {
    setCurrentMonth((prev) => (prev - 1 + 12) % 12)
  }

  // Sample event dates for January 2025
  const eventDates = [12, 20, 25, 26]

  return (
    <section className="py-12 bg-card">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* View Toggle */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-serif font-bold text-3xl text-foreground">Event Calendar</h2>
            <div className="flex gap-2">
              <Button
                variant={view === "calendar" ? "default" : "outline"}
                onClick={() => setView("calendar")}
                className={view === "calendar" ? "bg-primary" : "bg-transparent"}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                Calendar
              </Button>
              <Button
                variant={view === "list" ? "default" : "outline"}
                onClick={() => setView("list")}
                className={view === "list" ? "bg-primary" : "bg-transparent"}
              >
                List View
              </Button>
            </div>
          </div>

          {view === "calendar" && (
            <Card className="animate-fade-in">
              <CardContent className="p-6">
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-6">
                  <Button variant="ghost" size="icon" onClick={prevMonth}>
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <h3 className="font-serif font-bold text-2xl text-foreground">{months[currentMonth]} 2025</h3>
                  <Button variant="ghost" size="icon" onClick={nextMonth}>
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2">
                  {/* Day headers */}
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="text-center font-semibold text-sm text-muted-foreground py-2">
                      {day}
                    </div>
                  ))}

                  {/* Calendar days - January 2025 starts on Wednesday */}
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square" />
                  ))}

                  {Array.from({ length: 31 }).map((_, i) => {
                    const day = i + 1
                    const hasEvent = eventDates.includes(day)

                    return (
                      <button
                        key={day}
                        className={`aspect-square rounded-lg flex items-center justify-center text-sm transition-all ${
                          hasEvent
                            ? "bg-primary text-primary-foreground font-bold hover:bg-primary/90 ring-2 ring-accent"
                            : "hover:bg-muted text-foreground"
                        }`}
                      >
                        {day}
                      </button>
                    )
                  })}
                </div>

                <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-4 h-4 rounded bg-primary ring-2 ring-accent" />
                  <span>Days with events</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  )
}
