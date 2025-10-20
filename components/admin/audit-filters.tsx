"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, Filter, Download, Calendar } from "lucide-react"
import { useState } from "react"

export function AuditFilters() {
  const [searchTerm, setSearchTerm] = useState("")
  const [actionFilter, setActionFilter] = useState("all")
  const [userFilter, setUserFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")

  const handleExport = () => {
    // In a real app, this would export the filtered audit logs
    console.log('Exporting audit logs with filters:', {
      searchTerm,
      actionFilter,
      userFilter,
      dateFilter
    })
  }

  return (
    <Card className="border-navy/10">
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4">
          {/* Search and Basic Filters */}
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-navy/50" />
                <Input
                  placeholder="Search by action, user, or table..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Action Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="create">Create</SelectItem>
                <SelectItem value="update">Update</SelectItem>
                <SelectItem value="delete">Delete</SelectItem>
                <SelectItem value="login">Login</SelectItem>
                <SelectItem value="logout">Logout</SelectItem>
                <SelectItem value="permission">Permission Change</SelectItem>
              </SelectContent>
            </Select>
            <Select value={userFilter} onValueChange={setUserFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="User" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="admin">Admin Users</SelectItem>
                <SelectItem value="editor">Editors</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Advanced Filters */}
          <div className="flex gap-4">
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Time Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Custom Date Range
            </Button>
            
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>

          {/* Active Filters Display */}
          {(searchTerm || actionFilter !== "all" || userFilter !== "all" || dateFilter !== "all") && (
            <div className="flex items-center gap-2 pt-2 border-t border-navy/10">
              <span className="text-sm text-navy/60">Active filters:</span>
              {searchTerm && (
                <span className="text-xs bg-navy/10 text-navy px-2 py-1 rounded">
                  Search: "{searchTerm}"
                </span>
              )}
              {actionFilter !== "all" && (
                <span className="text-xs bg-navy/10 text-navy px-2 py-1 rounded">
                  Action: {actionFilter}
                </span>
              )}
              {userFilter !== "all" && (
                <span className="text-xs bg-navy/10 text-navy px-2 py-1 rounded">
                  User: {userFilter}
                </span>
              )}
              {dateFilter !== "all" && (
                <span className="text-xs bg-navy/10 text-navy px-2 py-1 rounded">
                  Period: {dateFilter}
                </span>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setSearchTerm("")
                  setActionFilter("all")
                  setUserFilter("all")
                  setDateFilter("all")
                }}
                className="text-xs"
              >
                Clear All
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
