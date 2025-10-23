"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

interface DonationReportsProps {
  donations: any[]
  projects: any[]
}

export function DonationReports({ donations, projects }: DonationReportsProps) {
  // Payment method distribution
  const paymentMethodData = donations.reduce((acc, donation) => {
    const method = donation.payment_method || 'unknown'
    acc[method] = (acc[method] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const paymentMethodColors = {
    stripe: '#3b82f6',
    mpesa: '#10b981',
    bank_transfer: '#8b5cf6',
    cash: '#6b7280',
    unknown: '#ef4444'
  }

  const pieData = Object.entries(paymentMethodData).map(([method, count]) => ({
    name: method.charAt(0).toUpperCase() + method.slice(1).replace('_', ' '),
    value: count,
    color: paymentMethodColors[method as keyof typeof paymentMethodColors] || '#6b7280'
  }))

  // Monthly donations (last 6 months)
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const date = new Date()
    date.setMonth(date.getMonth() - (5 - i))
    const monthName = date.toLocaleDateString('en-US', { month: 'short' })
    
    const donationsInMonth = donations.filter(donation => {
      const donationDate = new Date(donation.created_at)
      return donationDate.getMonth() === date.getMonth() && 
             donationDate.getFullYear() === date.getFullYear() &&
             donation.status === 'completed'
    })

    const totalAmount = donationsInMonth.reduce((sum, d) => sum + Number(d.amount), 0)

    return {
      month: monthName,
      amount: totalAmount,
      count: donationsInMonth.length
    }
  })

  // Project funding progress
  const projectProgress = projects.map(project => ({
    name: project.title || 'Untitled Project',
    raised: Number(project.raised_amount || 0),
    goal: Number(project.goal_amount || 0),
    progress: project.goal_amount ? (project.raised_amount / project.goal_amount) * 100 : 0
  })).slice(0, 5) // Top 5 projects

  return (
    <div className="space-y-6">
      {/* Payment Methods Distribution */}
      <Card className="border-navy/10">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-navy">Payment Methods</CardTitle>
          <p className="text-sm text-navy/60">Distribution of donation methods</p>
        </CardHeader>
        <CardContent>
          <div className="h-48">
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
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            {pieData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-navy/70">{item.name}: {item.value as string}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Donations Trend */}
      <Card className="border-navy/10">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-navy">Monthly Trend</CardTitle>
          <p className="text-sm text-navy/60">Donation amounts over time</p>
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
                  tickFormatter={(value) => `KSh ${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value: any) => [`KSh ${Number(value).toLocaleString()}`, 'Amount']}
                />
                <Bar dataKey="amount" fill="#3b82f6" name="Amount" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Project Funding Progress */}
      <Card className="border-navy/10">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-navy">Project Progress</CardTitle>
          <p className="text-sm text-navy/60">Funding status by project</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projectProgress.length > 0 ? (
              projectProgress.map((project, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-navy truncate">
                      {project.name}
                    </span>
                    <span className="text-sm text-navy/60">
                      {Math.round(project.progress)}%
                    </span>
                  </div>
                  <Progress 
                    value={project.progress} 
                    className="h-2"
                  />
                  <div className="flex justify-between text-xs text-navy/60">
                    <span>KSh {project.raised.toLocaleString()}</span>
                    <span>KSh {project.goal.toLocaleString()}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-navy/60 text-center py-4">
                No projects with funding goals yet
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card className="border-navy/10">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-navy">Quick Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-navy/70">Total Transactions</span>
              <span className="text-sm font-medium text-navy">{donations.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-navy/70">Completed</span>
              <span className="text-sm font-medium text-navy">
                {donations.filter(d => d.status === 'completed').length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-navy/70">Pending</span>
              <span className="text-sm font-medium text-navy">
                {donations.filter(d => d.status === 'pending').length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-navy/70">Recurring</span>
              <span className="text-sm font-medium text-navy">
                {donations.filter(d => d.is_recurring).length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-navy/70">Anonymous</span>
              <span className="text-sm font-medium text-navy">
                {donations.filter(d => d.is_anonymous).length}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
