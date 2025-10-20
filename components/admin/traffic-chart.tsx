"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface TrafficChartProps {
  blogPosts: any[]
  sermons: any[]
}

export function TrafficChart({ blogPosts, sermons }: TrafficChartProps) {
  // Generate last 7 days data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      blogViews: 0,
      sermonViews: 0,
      totalViews: 0
    }
  })

  // Aggregate views by date
  const blogViewsByDate = blogPosts.reduce((acc, post) => {
    const date = new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    const dayData = last7Days.find(d => d.date === date)
    if (dayData) {
      dayData.blogViews += post.views || 0
    }
    return acc
  }, {})

  const sermonViewsByDate = sermons.reduce((acc, sermon) => {
    const date = new Date(sermon.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    const dayData = last7Days.find(d => d.date === date)
    if (dayData) {
      dayData.sermonViews += sermon.views || 0
    }
    return acc
  }, {})

  // Calculate total views for each day
  last7Days.forEach(day => {
    day.totalViews = day.blogViews + day.sermonViews
  })

  return (
    <Card className="border-navy/10">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-navy">Traffic Overview</CardTitle>
        <p className="text-sm text-navy/60">Content views over the last 7 days</p>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={last7Days}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
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
              <Line 
                type="monotone" 
                dataKey="blogViews" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Blog Views"
              />
              <Line 
                type="monotone" 
                dataKey="sermonViews" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Sermon Views"
              />
              <Line 
                type="monotone" 
                dataKey="totalViews" 
                stroke="#8b5cf6" 
                strokeWidth={3}
                name="Total Views"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
