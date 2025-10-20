"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, TrendingUp, Users, Target } from "lucide-react"

interface DonationsOverviewProps {
  donations: any[]
  projects: any[]
}

export function DonationsOverview({ donations, projects }: DonationsOverviewProps) {
  // Calculate metrics
  const totalDonations = donations
    .filter(d => d.status === 'completed')
    .reduce((sum, d) => sum + Number(d.amount), 0)
  
  const pendingDonations = donations
    .filter(d => d.status === 'pending')
    .reduce((sum, d) => sum + Number(d.amount), 0)
  
  const totalDonors = new Set(donations.map(d => d.donor_email)).size
  const recurringDonations = donations.filter(d => d.is_recurring).length
  
  const totalProjectGoals = projects.reduce((sum, p) => sum + Number(p.goal_amount || 0), 0)
  const totalProjectRaised = projects.reduce((sum, p) => sum + Number(p.raised_amount || 0), 0)
  const projectProgress = totalProjectGoals > 0 ? (totalProjectRaised / totalProjectGoals) * 100 : 0

  // Recent donations (last 7 days)
  const recentDonations = donations.filter(d => {
    const donationDate = new Date(d.created_at)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    return donationDate >= sevenDaysAgo
  })

  const recentAmount = recentDonations
    .filter(d => d.status === 'completed')
    .reduce((sum, d) => sum + Number(d.amount), 0)

  const metrics = [
    {
      title: "Total Raised",
      value: `KSh ${totalDonations.toLocaleString()}`,
      icon: DollarSign,
      change: `+KSh ${recentAmount.toLocaleString()} this week`,
      changeType: "positive" as const
    },
    {
      title: "Pending Amount",
      value: `KSh ${pendingDonations.toLocaleString()}`,
      icon: TrendingUp,
      change: `${donations.filter(d => d.status === 'pending').length} transactions`,
      changeType: "neutral" as const
    },
    {
      title: "Total Donors",
      value: totalDonors.toLocaleString(),
      icon: Users,
      change: `${recurringDonations} recurring`,
      changeType: "positive" as const
    },
    {
      title: "Project Progress",
      value: `${Math.round(projectProgress)}%`,
      icon: Target,
      change: `KSh ${totalProjectRaised.toLocaleString()} of ${totalProjectGoals.toLocaleString()}`,
      changeType: projectProgress > 50 ? "positive" : "neutral" as const
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
              metric.changeType === 'positive' ? 'text-green-600' : 
              metric.changeType === 'negative' ? 'text-red-600' : 'text-navy/60'
            }`}>
              {metric.change}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
