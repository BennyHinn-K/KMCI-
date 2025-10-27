"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface DonationsManagerProps {
  donations: any[]
}

export function DonationsManager({ donations: initialDonations }: DonationsManagerProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredDonations = initialDonations.filter((donation) =>
    donation.donor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    donation.donor_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    donation.payment_reference?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "default"
      case "pending": return "secondary"
      case "failed": return "destructive"
      case "refunded": return "outline"
      default: return "secondary"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search donations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Donor</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDonations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No donations found
                </TableCell>
              </TableRow>
            ) : (
              filteredDonations.map((donation) => (
                <TableRow key={donation.id}>
                  <TableCell className="font-medium">
                    {donation.is_anonymous ? "Anonymous" : donation.donor_name || "—"}
                  </TableCell>
                  <TableCell>{donation.donor_email || "—"}</TableCell>
                  <TableCell className="font-semibold">
                    {donation.currency} {Number(donation.amount).toLocaleString()}
                  </TableCell>
                  <TableCell>{donation.projects?.title || "General"}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{donation.payment_method}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(donation.status)}>
                      {donation.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(donation.created_at), { addSuffix: true })}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}



