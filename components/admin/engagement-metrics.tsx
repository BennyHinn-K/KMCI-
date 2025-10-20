"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

interface EngagementMetricsProps {
  events: any[]
  contactMessages: any[]
  newsletterSubscribers: any[]
}

export function EngagementMetrics({ events, contactMessages, newsletterSubscribers }: EngagementMetricsProps) {
  // Event attendance data
  const eventAttendance = events.map(event => ({
    name: event.title || 'Event',
    attendees: event.current_attendees || 0,
    capacity: event.max_attendees || 0,
    fillRate: event.max_attendees ? Math.round((event.current_attendees || 0) / event.max_attendees * 100) : 0
  })).slice(0, 5) // Top 5 events

  // Contact message status distribution
  const messageStatusData = contactMessages.reduce((acc, message) => {
    const status = message.status || 'new'
    acc[status] = (acc[status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const statusColors = {
    new: '#3b82f6',
    read: '#10b981',
    replied: '#8b5cf6',
    archived: '#6b7280'
  }

  const pieData = Object.entries(messageStatusData).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count,
    color: statusColors[status as keyof typeof statusColors] || '#6b7280'
  }))

  // Newsletter growth (last 6 months)
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const date = new Date()
    date.setMonth(date.getMonth() - (5 - i))
    const monthName = date.toLocaleDateString('en-US', { month: 'short' })
    
    const subscribersInMonth = newsletterSubscribers.filter(sub => {
      const subDate = new Date(sub.subscribed_at)
      return subDate.getMonth() === date.getMonth() && subDate.getFullYear() === date.getFullYear()
    }).length

    return {
      month: monthName,
      subscribers: subscribersInMonth
    }
  })

  return (
    <div className="space-y-6">
      {/* Event Attendance Chart */}
      <Card className="border-navy/10">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-navy">Event Attendance</CardTitle>
          <p className="text-sm text-navy/60">Top 5 events by attendance</p>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={eventAttendance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  stroke="#64748b"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  stroke="#64748b"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="attendees" fill="#3b82f6" name="Attendees" />
                <Bar dataKey="capacity" fill="#e5e7eb" name="Capacity" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Contact Messages Status */}
      <Card className="border-navy/10">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-navy">Contact Messages</CardTitle>
          <p className="text-sm text-navy/60">Status distribution</p>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-4 mt-4 justify-center">
            {pieData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-navy/70">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Newsletter Growth */}
      <Card className="border-navy/10">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-navy">Newsletter Growth</CardTitle>
          <p className="text-sm text-navy/60">New subscribers over time</p>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last6Months}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="month" 
                  stroke="#64748b"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#64748b"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="subscribers" fill="#10b981" name="New Subscribers" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
