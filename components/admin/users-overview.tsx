"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Shield, Edit, DollarSign, Calendar } from "lucide-react"

interface UsersOverviewProps {
  profiles: any[]
}

export function UsersOverview({ profiles }: UsersOverviewProps) {
  // Calculate metrics
  const totalUsers = profiles.length
  const superAdmins = profiles.filter(p => p.role === 'super_admin').length
  const editors = profiles.filter(p => p.role === 'editor').length
  const finance = profiles.filter(p => p.role === 'finance').length
  const viewers = profiles.filter(p => p.role === 'viewer').length

  // Recent users (last 30 days)
  const recentUsers = profiles.filter(profile => {
    const userDate = new Date(profile.created_at)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    return userDate >= thirtyDaysAgo
  }).length

  // Active users (users with recent activity - placeholder logic)
  const activeUsers = profiles.length // In a real app, you'd check for recent login activity

  const metrics = [
    {
      title: "Total Users",
      value: totalUsers.toString(),
      icon: Users,
      change: `+${recentUsers} this month`,
      changeType: "positive" as const
    },
    {
      title: "Super Admins",
      value: superAdmins.toString(),
      icon: Shield,
      change: "Full access",
      changeType: "neutral" as const
    },
    {
      title: "Editors",
      value: editors.toString(),
      icon: Edit,
      change: "Content management",
      changeType: "neutral" as const
    },
    {
      title: "Finance",
      value: finance.toString(),
      icon: DollarSign,
      change: "Financial access",
      changeType: "neutral" as const
    },
    {
      title: "Active Users",
      value: activeUsers.toString(),
      icon: Calendar,
      change: "Recently active",
      changeType: "positive" as const
    }
  ]

  const roleDistribution = [
    { role: "Super Admin", count: superAdmins, color: "bg-red-100 text-red-800" },
    { role: "Editor", count: editors, color: "bg-blue-100 text-blue-800" },
    { role: "Finance", count: finance, color: "bg-green-100 text-green-800" },
    { role: "Viewer", count: viewers, color: "bg-gray-100 text-gray-800" }
  ]

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
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
                (metric.changeType as string) === 'negative' ? 'text-red-600' : 'text-navy/60'
              }`}>
                {metric.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Role Distribution */}
      <Card className="border-navy/10">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-navy">Role Distribution</CardTitle>
          <p className="text-sm text-navy/60">Breakdown of user roles and permissions</p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {roleDistribution.map((role, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-navy mb-2">{role.count}</div>
                <Badge className={role.color}>{role.role}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
