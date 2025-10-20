"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Filter, Download, Eye } from "lucide-react"
import { useState } from "react"

interface DonationsTableProps {
  donations: any[]
}

export function DonationsTable({ donations }: DonationsTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all")

  const filteredDonations = donations.filter(donation => {
    const matchesSearch = 
      donation.donor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.donor_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.payment_reference?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || donation.status === statusFilter
    const matchesPaymentMethod = paymentMethodFilter === "all" || donation.payment_method === paymentMethodFilter

    return matchesSearch && matchesStatus && matchesPaymentMethod
  })

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
      completed: { color: "bg-green-100 text-green-800", label: "Completed" },
      failed: { color: "bg-red-100 text-red-800", label: "Failed" },
      refunded: { color: "bg-gray-100 text-gray-800", label: "Refunded" }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return <Badge className={config.color}>{config.label}</Badge>
  }

  const getPaymentMethodBadge = (method: string) => {
    const methodConfig = {
      stripe: { color: "bg-blue-100 text-blue-800", label: "Stripe" },
      mpesa: { color: "bg-green-100 text-green-800", label: "M-Pesa" },
      bank_transfer: { color: "bg-purple-100 text-purple-800", label: "Bank Transfer" },
      cash: { color: "bg-gray-100 text-gray-800", label: "Cash" }
    }
    
    const config = methodConfig[method as keyof typeof methodConfig] || methodConfig.cash
    return <Badge className={config.color}>{config.label}</Badge>
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatAmount = (amount: number) => {
    return `KSh ${Number(amount).toLocaleString()}`
  }

  return (
    <Card className="border-navy/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-navy">Recent Donations</CardTitle>
            <p className="text-sm text-navy/60">All financial contributions and transactions</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex gap-4 mt-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-navy/50" />
              <Input
                placeholder="Search by name, email, or reference..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
          <Select value={paymentMethodFilter} onValueChange={setPaymentMethodFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Payment Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Methods</SelectItem>
              <SelectItem value="stripe">Stripe</SelectItem>
              <SelectItem value="mpesa">M-Pesa</SelectItem>
              <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
              <SelectItem value="cash">Cash</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-navy/10">
          <Table>
            <TableHeader>
              <TableRow className="bg-navy/5">
                <TableHead className="text-navy font-semibold">Donor</TableHead>
                <TableHead className="text-navy font-semibold">Amount</TableHead>
                <TableHead className="text-navy font-semibold">Project</TableHead>
                <TableHead className="text-navy font-semibold">Method</TableHead>
                <TableHead className="text-navy font-semibold">Status</TableHead>
                <TableHead className="text-navy font-semibold">Date</TableHead>
                <TableHead className="text-navy font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDonations.length > 0 ? (
                filteredDonations.map((donation) => (
                  <TableRow key={donation.id} className="hover:bg-navy/2">
                    <TableCell>
                      <div>
                        <div className="font-medium text-navy">
                          {donation.is_anonymous ? "Anonymous" : donation.donor_name || "Unknown"}
                        </div>
                        <div className="text-sm text-navy/60">
                          {donation.is_anonymous ? "Anonymous" : donation.donor_email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-navy">
                        {formatAmount(donation.amount)}
                      </div>
                      {donation.is_recurring && (
                        <Badge variant="outline" className="text-xs">
                          Recurring
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-navy">
                        {donation.projects?.title || "General Fund"}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getPaymentMethodBadge(donation.payment_method)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(donation.status)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-navy">
                        {formatDate(donation.created_at)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-navy/60">
                    No donations found matching your criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
