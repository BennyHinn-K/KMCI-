"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, User, Shield, AlertTriangle, Clock } from "lucide-react"

interface AuditOverviewProps {
  auditLogs: any[]
}

export function AuditOverview({ auditLogs }: AuditOverviewProps) {
  // Calculate metrics
  const totalActions = auditLogs.length
  const uniqueUsers = new Set(auditLogs.map(log => log.user_id)).size
  
  // Recent activity (last 24 hours)
  const recentActivity = auditLogs.filter(log => {
    const logDate = new Date(log.created_at)
    const twentyFourHoursAgo = new Date()
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24)
    return logDate >= twentyFourHoursAgo
  }).length

  // Action types distribution
  const actionTypes = auditLogs.reduce((acc, log) => {
    const action = log.action || 'unknown'
    acc[action] = (acc[action] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Most active users
  const userActivity = auditLogs.reduce((acc, log) => {
    const userId = log.user_id
    if (userId) {
      acc[userId] = (acc[userId] || 0) + 1
    }
    return acc
  }, {} as Record<string, number>)

  const topUsers = Object.entries(userActivity)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 3)
    .map(([userId, count]) => {
      const user = auditLogs.find(log => log.user_id === userId)?.profiles
      return {
        name: user?.full_name || 'Unknown User',
        email: user?.email || 'unknown@example.com',
        count
      }
    })

  const metrics = [
    {
      title: "Total Actions",
      value: totalActions.toString(),
      icon: Activity,
      change: `+${recentActivity} in last 24h`,
      changeType: "positive" as const
    },
    {
      title: "Active Users",
      value: uniqueUsers.toString(),
      icon: User,
      change: "Users with activity",
      changeType: "neutral" as const
    },
    {
      title: "Recent Activity",
      value: recentActivity.toString(),
      icon: Clock,
      change: "Last 24 hours",
      changeType: "positive" as const
    },
    {
      title: "Security Events",
      value: auditLogs.filter(log => 
        log.action?.includes('login') || 
        log.action?.includes('security') ||
        log.action?.includes('permission')
      ).length.toString(),
      icon: Shield,
      change: "Security-related",
      changeType: "neutral" as const
    }
  ]

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
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
                (metric.changeType as string) === 'negative' ? 'text-red-600' : 'text-navy/60'
              }`}>
                {metric.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Action Types */}
        <Card className="border-navy/10">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-navy">Action Types</CardTitle>
            <p className="text-sm text-navy/60">Most common admin actions</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(actionTypes)
                .sort(([,a], [,b]) => (b as number) - (a as number))
                .slice(0, 5)
                .map(([action, count]) => (
                  <div key={action} className="flex justify-between items-center">
                    <span className="text-sm text-navy capitalize">
                      {action.replace(/_/g, ' ')}
                    </span>
                    <Badge variant="outline">{count as number}</Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Most Active Users */}
        <Card className="border-navy/10">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-navy">Most Active Users</CardTitle>
            <p className="text-sm text-navy/60">Users with most admin activity</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topUsers.map((user, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <div className="text-sm font-medium text-navy">
                      {user.name}
                    </div>
                    <div className="text-xs text-navy/60">
                      {user.email}
                    </div>
                  </div>
                  <Badge variant="outline">{user.count as number} actions</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
