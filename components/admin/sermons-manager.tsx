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

type Sermon = {
  id: string
  title: string
  description: string
  speaker: string
  sermon_date: string
  video_url: string
  audio_url: string
  thumbnail_url: string
  scripture_reference: string
  duration: number
  tags: string[]
}

export function SermonsManager({ initialSermons }: { initialSermons: Sermon[] }) {
  const [sermons, setSermons] = useState(initialSermons)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editingSermon, setEditingSermon] = useState<Sermon | null>(null)
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    speaker: "",
    sermon_date: "",
    video_url: "",
    audio_url: "",
    thumbnail_url: "",
    scripture_reference: "",
    duration: 0,
    tags: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")
      const sermonData = {
        ...formData,
        slug,
        tags: formData.tags.split(",").map((t) => t.trim()),
        is_featured: false,
        views: 0,
      }

      if (editingSermon) {
        const { error } = await supabase.from("sermons").update(sermonData).eq("id", editingSermon.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from("sermons").insert([sermonData])
        if (error) throw error
      }

      setIsOpen(false)
      setEditingSermon(null)
      setFormData({
        title: "",
        description: "",
        speaker: "",
        sermon_date: "",
        video_url: "",
        audio_url: "",
        thumbnail_url: "",
        scripture_reference: "",
        duration: 0,
        tags: "",
      })
      router.refresh()
    } catch (error) {
      console.error("Error saving sermon:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (sermon: Sermon) => {
    setEditingSermon(sermon)
    setFormData({
      title: sermon.title,
      description: sermon.description,
      speaker: sermon.speaker,
      sermon_date: sermon.sermon_date,
      video_url: sermon.video_url,
      audio_url: sermon.audio_url,
      thumbnail_url: sermon.thumbnail_url,
      scripture_reference: sermon.scripture_reference,
      duration: sermon.duration,
      tags: sermon.tags.join(", "),
    })
    setIsOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this sermon?")) return

    try {
      const { error } = await supabase.from("sermons").delete().eq("id", id)
      if (error) throw error
      router.refresh()
    } catch (error) {
      console.error("Error deleting sermon:", error)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>All Sermons</CardTitle>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingSermon(null)
                setFormData({
                  title: "",
                  description: "",
                  speaker: "",
                  sermon_date: "",
                  video_url: "",
                  audio_url: "",
                  thumbnail_url: "",
                  scripture_reference: "",
                  duration: 0,
                  tags: "",
                })
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Sermon
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingSermon ? "Edit Sermon" : "Upload New Sermon"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Sermon Title</Label>
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
                  rows={3}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="speaker">Speaker</Label>
                  <Input
                    id="speaker"
                    value={formData.speaker}
                    onChange={(e) => setFormData({ ...formData, speaker: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sermon_date">Date</Label>
                  <Input
                    id="sermon_date"
                    type="date"
                    value={formData.sermon_date}
                    onChange={(e) => setFormData({ ...formData, sermon_date: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="scripture_reference">Scripture Reference</Label>
                <Input
                  id="scripture_reference"
                  value={formData.scripture_reference}
                  onChange={(e) => setFormData({ ...formData, scripture_reference: e.target.value })}
                  placeholder="e.g., John 3:16-21"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="video_url">Video URL</Label>
                <Input
                  id="video_url"
                  type="url"
                  value={formData.video_url}
                  onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  placeholder="YouTube or Vimeo URL"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="audio_url">Audio URL</Label>
                <Input
                  id="audio_url"
                  type="url"
                  value={formData.audio_url}
                  onChange={(e) => setFormData({ ...formData, audio_url: e.target.value })}
                  placeholder="MP3 file URL"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="thumbnail_url">Thumbnail URL</Label>
                <Input
                  id="thumbnail_url"
                  type="url"
                  value={formData.thumbnail_url}
                  onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                  placeholder="/placeholder.svg?height=400&width=600"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: Number.parseInt(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="Faith, Prayer, Worship"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : editingSermon ? (
                  "Update Sermon"
                ) : (
                  "Upload Sermon"
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
              <TableHead>Speaker</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Scripture</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sermons.map((sermon) => (
              <TableRow key={sermon.id}>
                <TableCell className="font-medium">{sermon.title}</TableCell>
                <TableCell>{sermon.speaker}</TableCell>
                <TableCell>{new Date(sermon.sermon_date).toLocaleDateString()}</TableCell>
                <TableCell>{sermon.scripture_reference}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(sermon)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(sermon.id)}>
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
