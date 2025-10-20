"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, Edit, Trash2, Shield, UserCheck } from "lucide-react"
import { useState } from "react"

interface UsersTableProps {
  profiles: any[]
}

export function UsersTable({ profiles }: UsersTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")

  const filteredProfiles = profiles.filter(profile => {
    const matchesSearch = 
      profile.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.email?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = roleFilter === "all" || profile.role === roleFilter

    return matchesSearch && matchesRole
  })

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      super_admin: { color: "bg-red-100 text-red-800", label: "Super Admin" },
      editor: { color: "bg-blue-100 text-blue-800", label: "Editor" },
      finance: { color: "bg-green-100 text-green-800", label: "Finance" },
      viewer: { color: "bg-gray-100 text-gray-800", label: "Viewer" }
    }
    
    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.viewer
    return <Badge className={config.color}>{config.label}</Badge>
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const handleRoleChange = (userId: string, newRole: string) => {
    // In a real app, this would make an API call to update the user's role
    console.log(`Changing user ${userId} role to ${newRole}`)
  }

  const handleDeleteUser = (userId: string) => {
    // In a real app, this would make an API call to delete the user
    console.log(`Deleting user ${userId}`)
  }

  return (
    <Card className="border-navy/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-navy">All Users</CardTitle>
            <p className="text-sm text-navy/60">Manage user accounts and permissions</p>
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex gap-4 mt-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-navy/50" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="super_admin">Super Admin</SelectItem>
              <SelectItem value="editor">Editor</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-navy/10">
          <Table>
            <TableHeader>
              <TableRow className="bg-navy/5">
                <TableHead className="text-navy font-semibold">User</TableHead>
                <TableHead className="text-navy font-semibold">Email</TableHead>
                <TableHead className="text-navy font-semibold">Role</TableHead>
                <TableHead className="text-navy font-semibold">Joined</TableHead>
                <TableHead className="text-navy font-semibold">Last Active</TableHead>
                <TableHead className="text-navy font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProfiles.length > 0 ? (
                filteredProfiles.map((profile) => (
                  <TableRow key={profile.id} className="hover:bg-navy/2">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-navy/10 flex items-center justify-center">
                          <span className="text-sm font-medium text-navy">
                            {profile.full_name?.charAt(0) || profile.email?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-navy">
                            {profile.full_name || 'No Name'}
                          </div>
                          <div className="text-sm text-navy/60">
                            ID: {profile.id.slice(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-navy">
                        {profile.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getRoleBadge(profile.role)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-navy">
                        {formatDate(profile.created_at)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-navy">
                        {formatDate(profile.updated_at)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => console.log('Edit user', profile.id)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRoleChange(profile.id, 'editor')}>
                            <Shield className="h-4 w-4 mr-2" />
                            Change Role
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => console.log('View activity', profile.id)}>
                            <UserCheck className="h-4 w-4 mr-2" />
                            View Activity
                          </DropdownMenuItem>
                          {profile.role !== 'super_admin' && (
                            <DropdownMenuItem 
                              onClick={() => handleDeleteUser(profile.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete User
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-navy/60">
                    No users found matching your criteria
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
