"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Users, DollarSign, Eye, MessageSquare, Mail } from "lucide-react"

interface AnalyticsOverviewProps {
  donations: any[]
  blogPosts: any[]
  events: any[]
  sermons: any[]
  contactMessages: any[]
  newsletterSubscribers: any[]
}

export function AnalyticsOverview({
  donations,
  blogPosts,
  sermons,
  events,
  contactMessages,
  newsletterSubscribers
}: AnalyticsOverviewProps) {
  // Calculate metrics
  const totalDonations = donations
    .filter(d => d.status === 'completed')
    .reduce((sum, d) => sum + Number(d.amount), 0)
  
  const totalViews = [
    ...blogPosts.map(p => p.views || 0),
    ...sermons.map(s => s.views || 0)
  ].reduce((sum, views) => sum + views, 0)
  
  const totalEventAttendees = events.reduce((sum, e) => sum + (e.current_attendees || 0), 0)
  const activeSubscribers = newsletterSubscribers.filter(s => s.is_active).length
  const newContacts = contactMessages.filter(m => {
    const messageDate = new Date(m.created_at)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    return messageDate >= thirtyDaysAgo
  }).length

  const metrics = [
    {
      title: "Total Donations",
      value: `KSh ${totalDonations.toLocaleString()}`,
      icon: DollarSign,
      change: "+12.5%",
      changeType: "positive" as const
    },
    {
      title: "Total Views",
      value: totalViews.toLocaleString(),
      icon: Eye,
      change: "+8.2%",
      changeType: "positive" as const
    },
    {
      title: "Event Attendees",
      value: totalEventAttendees.toLocaleString(),
      icon: Users,
      change: "+15.3%",
      changeType: "positive" as const
    },
    {
      title: "Newsletter Subscribers",
      value: activeSubscribers.toLocaleString(),
      icon: Mail,
      change: "+5.7%",
      changeType: "positive" as const
    },
    {
      title: "New Contacts (30d)",
      value: newContacts.toLocaleString(),
      icon: MessageSquare,
      change: "+22.1%",
      changeType: "positive" as const
    },
    {
      title: "Content Published",
      value: (blogPosts.length + sermons.length).toLocaleString(),
      icon: TrendingUp,
      change: "+3.2%",
      changeType: "positive" as const
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {metrics.map((metric, index) => (
        <Card key={index} className="border-navy/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-navy/70">
              {metric.title}
            </CardTitle>
            <metric.icon className="h-4 w-4 text-navy/50" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-navy">{metric.value}</div>
            <p className={`text-xs ${
              metric.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}>
              {metric.change} from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
