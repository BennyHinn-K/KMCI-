"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Eye, ChevronDown, ChevronRight } from "lucide-react"
import { useState } from "react"

interface AuditTableProps {
  auditLogs: any[]
}

export function AuditTable({ auditLogs }: AuditTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())

  const toggleRow = (logId: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(logId)) {
      newExpanded.delete(logId)
    } else {
      newExpanded.add(logId)
    }
    setExpandedRows(newExpanded)
  }

  const getActionBadge = (action: string) => {
    const actionConfig = {
      create: { color: "bg-green-100 text-green-800", label: "Create" },
      update: { color: "bg-blue-100 text-blue-800", label: "Update" },
      delete: { color: "bg-red-100 text-red-800", label: "Delete" },
      login: { color: "bg-purple-100 text-purple-800", label: "Login" },
      logout: { color: "bg-gray-100 text-gray-800", label: "Logout" },
      permission: { color: "bg-yellow-100 text-yellow-800", label: "Permission" }
    }
    
    const config = actionConfig[action as keyof typeof actionConfig] || 
                  { color: "bg-gray-100 text-gray-800", label: action }
    return <Badge className={config.color}>{config.label}</Badge>
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const formatJson = (data: any) => {
    if (!data) return "No data"
    return JSON.stringify(data, null, 2)
  }

  return (
    <Card className="border-navy/10">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-navy">Audit Log Entries</CardTitle>
        <p className="text-sm text-navy/60">Detailed log of all admin actions and system changes</p>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-navy/10">
          <Table>
            <TableHeader>
              <TableRow className="bg-navy/5">
                <TableHead className="text-navy font-semibold w-8"></TableHead>
                <TableHead className="text-navy font-semibold">Action</TableHead>
                <TableHead className="text-navy font-semibold">User</TableHead>
                <TableHead className="text-navy font-semibold">Table</TableHead>
                <TableHead className="text-navy font-semibold">IP Address</TableHead>
                <TableHead className="text-navy font-semibold">Timestamp</TableHead>
                <TableHead className="text-navy font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLogs.length > 0 ? (
                auditLogs.map((log) => (
                  <>
                    <TableRow key={log.id} className="hover:bg-navy/2">
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleRow(log.id)}
                        >
                          {expandedRows.has(log.id) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell>
                        {getActionBadge(log.action)}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-navy">
                            {log.profiles?.full_name || 'System'}
                          </div>
                          <div className="text-sm text-navy/60">
                            {log.profiles?.email || 'system@kmci.org'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-navy">
                          {log.table_name || 'N/A'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-navy font-mono">
                          {log.ip_address || 'N/A'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-navy">
                          {formatDate(log.created_at)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                    
                    {/* Expanded Row with Details */}
                    {expandedRows.has(log.id) && (
                      <TableRow>
                        <TableCell colSpan={7} className="bg-navy/5">
                          <div className="p-4 space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                              <div>
                                <h4 className="font-medium text-navy mb-2">Old Data</h4>
                                <pre className="text-xs bg-white p-3 rounded border overflow-auto max-h-32">
                                  {formatJson(log.old_data)}
                                </pre>
                              </div>
                              <div>
                                <h4 className="font-medium text-navy mb-2">New Data</h4>
                                <pre className="text-xs bg-white p-3 rounded border overflow-auto max-h-32">
                                  {formatJson(log.new_data)}
                                </pre>
                              </div>
                            </div>
                            
                            <div className="grid gap-4 md:grid-cols-3">
                              <div>
                                <h4 className="font-medium text-navy mb-1">User Agent</h4>
                                <p className="text-sm text-navy/70 break-all">
                                  {log.user_agent || 'N/A'}
                                </p>
                              </div>
                              <div>
                                <h4 className="font-medium text-navy mb-1">Record ID</h4>
                                <p className="text-sm text-navy/70 font-mono">
                                  {log.record_id || 'N/A'}
                                </p>
                              </div>
                              <div>
                                <h4 className="font-medium text-navy mb-1">Log ID</h4>
                                <p className="text-sm text-navy/70 font-mono">
                                  {log.id}
                                </p>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-navy/60">
                    No audit logs found
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
