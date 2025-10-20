"use client"

import type React from "react"

import { useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

type Event = {
  id: string
  title: string
  description: string
  event_date: string
  end_date: string
  location: string
  max_attendees: number
  current_attendees: number
  status: string
  image_url: string
  slug: string
}

export function EventsManager({ initialEvents }: { initialEvents: Event[] }) {
  const [events, setEvents] = useState(initialEvents)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    event_date: "",
    end_date: "",
    location: "",
    max_attendees: 100,
    image_url: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")
      const eventData = {
        ...formData,
        slug,
        status: "upcoming",
        current_attendees: 0,
      }

      if (editingEvent) {
        const { error } = await supabase.from("events").update(eventData).eq("id", editingEvent.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from("events").insert([eventData])
        if (error) throw error
      }

      setIsOpen(false)
      setEditingEvent(null)
      setFormData({
        title: "",
        description: "",
        event_date: "",
        end_date: "",
        location: "",
        max_attendees: 100,
        image_url: "",
      })
      router.refresh()
    } catch (error) {
      console.error("Error saving event:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (event: Event) => {
    setEditingEvent(event)
    setFormData({
      title: event.title,
      description: event.description,
      event_date: event.event_date,
      end_date: event.end_date,
      location: event.location,
      max_attendees: event.max_attendees,
      image_url: event.image_url,
    })
    setIsOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return

    try {
      const { error } = await supabase.from("events").delete().eq("id", id)
      if (error) throw error
      router.refresh()
    } catch (error) {
      console.error("Error deleting event:", error)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>All Events</CardTitle>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingEvent(null)
                setFormData({
                  title: "",
                  description: "",
                  event_date: "",
                  end_date: "",
                  location: "",
                  max_attendees: 100,
                  image_url: "",
                })
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingEvent ? "Edit Event" : "Create New Event"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="event_date">Start Date & Time</Label>
                  <Input
                    id="event_date"
                    type="datetime-local"
                    value={formData.event_date}
                    onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date & Time</Label>
                  <Input
                    id="end_date"
                    type="datetime-local"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max_attendees">Max Attendees</Label>
                <Input
                  id="max_attendees"
                  type="number"
                  value={formData.max_attendees}
                  onChange={(e) => setFormData({ ...formData, max_attendees: Number.parseInt(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="/placeholder.svg?height=400&width=600"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : editingEvent ? (
                  "Update Event"
                ) : (
                  "Create Event"
                )}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Attendees</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id}>
                <TableCell className="font-medium">{event.title}</TableCell>
                <TableCell>{new Date(event.event_date).toLocaleDateString()}</TableCell>
                <TableCell>{event.location}</TableCell>
                <TableCell>
                  {event.current_attendees}/{event.max_attendees}
                </TableCell>
                <TableCell>
                  <span className="px-2 py-1 rounded-full text-xs bg-gold/20 text-gold">{event.status}</span>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(event)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(event.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
