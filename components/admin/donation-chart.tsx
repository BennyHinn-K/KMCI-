"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface DonationChartProps {
  donations: Array<{ amount: number; created_at: string }>
}

export function DonationChart({ donations }: DonationChartProps) {
  // Group donations by month
  const monthlyData = donations.reduce((acc: any, donation) => {
    const month = new Date(donation.created_at).toLocaleDateString("en-US", { month: "short" })
    if (!acc[month]) {
      acc[month] = 0
    }
    acc[month] += donation.amount
    return acc
  }, {})

  const chartData = Object.entries(monthlyData).map(([month, amount]) => ({
    month,
    amount,
  }))

  return (
    <Card className="shadow-premium">
      <CardHeader>
        <CardTitle className="text-navy">Donation Trends</CardTitle>
        <CardDescription>Monthly donation amounts over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#1e3a5f" />
            <YAxis stroke="#1e3a5f" />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="amount" fill="#d4af37" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
