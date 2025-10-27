"use client"

import { useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Search, Eye, CheckCircle, Archive } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { toast } from "sonner"

interface MessagesManagerProps {
  messages: any[]
}

export function MessagesManager({ messages: initialMessages }: MessagesManagerProps) {
  const [messages, setMessages] = useState(initialMessages)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedMessage, setSelectedMessage] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredMessages = messages.filter((message) =>
    message.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.subject?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "destructive"
      case "read": return "secondary"
      case "replied": return "default"
      case "archived": return "outline"
      default: return "secondary"
    }
  }

  const handleView = async (message: any) => {
    setSelectedMessage(message)
    setIsDialogOpen(true)

    if (message.status === "new") {
      const supabase = getSupabaseBrowserClient()
      await supabase
        .from("contact_messages")
        .update({ status: "read" })
        .eq("id", message.id)

      setMessages(messages.map(m => 
        m.id === message.id ? { ...m, status: "read" } : m
      ))
    }
  }

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      const supabase = getSupabaseBrowserClient()
      await supabase
        .from("contact_messages")
        .update({ status })
        .eq("id", id)

      setMessages(messages.map(m => 
        m.id === id ? { ...m, status } : m
      ))
      toast.success("Status updated")
    } catch (error) {
      toast.error("Failed to update status")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search messages..."
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
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Received</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMessages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No messages found
                </TableCell>
              </TableRow>
            ) : (
              filteredMessages.map((message) => (
                <TableRow key={message.id}>
                  <TableCell className="font-medium">{message.full_name}</TableCell>
                  <TableCell>{message.email}</TableCell>
                  <TableCell>{message.subject || "No subject"}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(message.status)}>
                      {message.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleView(message)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleStatusUpdate(message.id, "replied")}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleStatusUpdate(message.id, "archived")}
                      >
                        <Archive className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Message from {selectedMessage?.full_name}</DialogTitle>
            <DialogDescription>
              {selectedMessage?.email} • {selectedMessage?.phone}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedMessage?.subject && (
              <div>
                <h4 className="font-semibold mb-1">Subject:</h4>
                <p>{selectedMessage.subject}</p>
              </div>
            )}
            <div>
              <h4 className="font-semibold mb-1">Message:</h4>
              <p className="whitespace-pre-wrap">{selectedMessage?.message}</p>
            </div>
            <div className="text-sm text-muted-foreground">
              Received {selectedMessage && formatDistanceToNow(new Date(selectedMessage.created_at), { addSuffix: true })}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => {
              handleStatusUpdate(selectedMessage.id, "replied")
              setIsDialogOpen(false)
            }}>
              Mark as Replied
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}



