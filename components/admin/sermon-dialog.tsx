"use client"

import { useState, useEffect } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"

interface SermonDialogProps {
  sermon?: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: () => void
}

export function SermonDialog({ sermon, open, onOpenChange, onSave }: SermonDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    speaker: "",
    description: "",
    sermon_date: "",
    video_url: "",
    audio_url: "",
    thumbnail_url: "",
    scripture_reference: "",
    is_featured: false,
  })

  useEffect(() => {
    if (sermon) {
      setFormData({
        title: sermon.title || "",
        slug: sermon.slug || "",
        speaker: sermon.speaker || "",
        description: sermon.description || "",
        sermon_date: sermon.sermon_date || "",
        video_url: sermon.video_url || "",
        audio_url: sermon.audio_url || "",
        thumbnail_url: sermon.thumbnail_url || "",
        scripture_reference: sermon.scripture_reference || "",
        is_featured: sermon.is_featured || false,
      })
    } else {
      setFormData({
        title: "",
        slug: "",
        speaker: "",
        description: "",
        sermon_date: new Date().toISOString().split('T')[0],
        video_url: "",
        audio_url: "",
        thumbnail_url: "",
        scripture_reference: "",
        is_featured: false,
      })
    }
  }, [sermon])

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = getSupabaseBrowserClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) throw new Error("Not authenticated")

      const payload = {
        ...formData,
        created_by: user.id,
      }

      if (sermon) {
        const { error } = await supabase
          .from("sermons")
          .update(payload)
          .eq("id", sermon.id)

        if (error) throw error
        toast.success("Sermon updated successfully")
      } else {
        const { error } = await supabase.from("sermons").insert(payload)

        if (error) throw error
        toast.success("Sermon created successfully")
      }

      onSave()
    } catch (error: any) {
      console.error("Save error:", error)
      toast.error(error.message || "Failed to save sermon")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{sermon ? "Edit Sermon" : "Add New Sermon"}</DialogTitle>
          <DialogDescription>
            Fill in the details below to {sermon ? "update" : "add"} a sermon
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  title: e.target.value,
                  slug: generateSlug(e.target.value)
                })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="speaker">Speaker</Label>
              <Input
                id="speaker"
                value={formData.speaker}
                onChange={(e) => setFormData({ ...formData, speaker: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Sermon Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.sermon_date}
                onChange={(e) => setFormData({ ...formData, sermon_date: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="scripture">Scripture Reference</Label>
              <Input
                id="scripture"
                value={formData.scripture_reference}
                onChange={(e) => setFormData({ ...formData, scripture_reference: e.target.value })}
                placeholder="e.g., John 3:16-18"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="video">Video URL</Label>
            <Input
              id="video"
              value={formData.video_url}
              onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
              placeholder="https://youtube.com/..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="audio">Audio URL</Label>
            <Input
              id="audio"
              value={formData.audio_url}
              onChange={(e) => setFormData({ ...formData, audio_url: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnail">Thumbnail URL</Label>
            <Input
              id="thumbnail"
              value={formData.thumbnail_url}
              onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="featured"
              checked={formData.is_featured}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, is_featured: checked })
              }
            />
            <Label htmlFor="featured">Feature this sermon</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : sermon ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}



