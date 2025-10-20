"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Calendar, Video, DollarSign } from "lucide-react"

interface StatsCardsProps {
  stats: {
    blogPosts: number
    events: number
    sermons: number
    donations: number
  }
}

export function StatsCards({ stats }: StatsCardsProps) {
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    setAnimated(true)
  }, [])

  const cards = [
    {
      title: "Blog Posts",
      value: stats.blogPosts,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Events",
      value: stats.events,
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Sermons",
      value: stats.sermons,
      icon: Video,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Total Donations",
      value: `KES ${stats.donations.toLocaleString()}`,
      icon: DollarSign,
      color: "text-gold",
      bgColor: "bg-gold/10",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Card
          key={card.title}
          className="shadow-premium hover:shadow-premium-lg transition-all duration-300"
          style={{
            animationDelay: `${index * 100}ms`,
            opacity: animated ? 1 : 0,
            transform: animated ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.5s ease-out",
          }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-navy/60">{card.title}</CardTitle>
            <div className={`${card.bgColor} p-2 rounded-lg`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-navy">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
