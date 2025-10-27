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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"

interface ProjectDialogProps {
  project?: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: () => void
}

export function ProjectDialog({ project, open, onOpenChange, onSave }: ProjectDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    full_content: "",
    category: "other",
    goal_amount: "",
    raised_amount: "",
    currency: "KES",
    image_url: "",
    status: "planning",
    is_featured: false,
  })

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || "",
        slug: project.slug || "",
        description: project.description || "",
        full_content: project.full_content || "",
        category: project.category || "other",
        goal_amount: project.goal_amount?.toString() || "",
        raised_amount: project.raised_amount?.toString() || "",
        currency: project.currency || "KES",
        image_url: project.image_url || "",
        status: project.status || "planning",
        is_featured: project.is_featured || false,
      })
    } else {
      setFormData({
        title: "",
        slug: "",
        description: "",
        full_content: "",
        category: "other",
        goal_amount: "",
        raised_amount: "0",
        currency: "KES",
        image_url: "",
        status: "planning",
        is_featured: false,
      })
    }
  }, [project])

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
        goal_amount: parseFloat(formData.goal_amount) || 0,
        raised_amount: parseFloat(formData.raised_amount) || 0,
        created_by: user.id,
      }

      if (project) {
        const { error } = await supabase
          .from("projects")
          .update(payload)
          .eq("id", project.id)

        if (error) throw error
        toast.success("Project updated successfully")
      } else {
        const { error } = await supabase.from("projects").insert(payload)

        if (error) throw error
        toast.success("Project created successfully")
      }

      onSave()
    } catch (error: any) {
      console.error("Save error:", error)
      toast.error(error.message || "Failed to save project")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{project ? "Edit Project" : "Create New Project"}</DialogTitle>
          <DialogDescription>
            Fill in the details below to {project ? "update" : "create"} a project
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="missionary_base">Missionary Base</SelectItem>
                <SelectItem value="childrens_home">Children's Home</SelectItem>
                <SelectItem value="outreach_vehicles">Outreach Vehicles</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Short Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Full Content</Label>
            <Textarea
              id="content"
              value={formData.full_content}
              onChange={(e) => setFormData({ ...formData, full_content: e.target.value })}
              rows={5}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="goal">Goal Amount</Label>
              <Input
                id="goal"
                type="number"
                step="0.01"
                value={formData.goal_amount}
                onChange={(e) => setFormData({ ...formData, goal_amount: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="raised">Raised Amount</Label>
              <Input
                id="raised"
                type="number"
                step="0.01"
                value={formData.raised_amount}
                onChange={(e) => setFormData({ ...formData, raised_amount: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={formData.currency}
                onValueChange={(value) => setFormData({ ...formData, currency: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="KES">KES</SelectItem>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="on_hold">On Hold</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="featured"
              checked={formData.is_featured}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, is_featured: checked })
              }
            />
            <Label htmlFor="featured">Feature this project</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : project ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}



