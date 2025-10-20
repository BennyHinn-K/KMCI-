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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

type Project = {
  id: string
  title: string
  description: string
  full_content: string
  category: string
  goal_amount: number
  raised_amount: number
  currency: string
  status: string
  image_url: string
  families_reached: number
  communities_served: number
}

export function ProjectsManager({ initialProjects }: { initialProjects: Project[] }) {
  const [projects, setProjects] = useState(initialProjects)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    full_content: "",
    category: "infrastructure",
    goal_amount: 0,
    raised_amount: 0,
    currency: "KES",
    status: "active",
    image_url: "",
    families_reached: 0,
    communities_served: 0,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")
      const projectData = {
        ...formData,
        slug,
      }

      if (editingProject) {
        const { error } = await supabase.from("projects").update(projectData).eq("id", editingProject.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from("projects").insert([projectData])
        if (error) throw error
      }

      setIsOpen(false)
      setEditingProject(null)
      setFormData({
        title: "",
        description: "",
        full_content: "",
        category: "infrastructure",
        goal_amount: 0,
        raised_amount: 0,
        currency: "KES",
        status: "active",
        image_url: "",
        families_reached: 0,
        communities_served: 0,
      })
      router.refresh()
    } catch (error) {
      console.error("Error saving project:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setFormData({
      title: project.title,
      description: project.description,
      full_content: project.full_content,
      category: project.category,
      goal_amount: project.goal_amount,
      raised_amount: project.raised_amount,
      currency: project.currency,
      status: project.status,
      image_url: project.image_url,
      families_reached: project.families_reached,
      communities_served: project.communities_served,
    })
    setIsOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return

    try {
      const { error } = await supabase.from("projects").delete().eq("id", id)
      if (error) throw error
      router.refresh()
    } catch (error) {
      console.error("Error deleting project:", error)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>All Projects</CardTitle>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingProject(null)
                setFormData({
                  title: "",
                  description: "",
                  full_content: "",
                  category: "infrastructure",
                  goal_amount: 0,
                  raised_amount: 0,
                  currency: "KES",
                  status: "active",
                  image_url: "",
                  families_reached: 0,
                  communities_served: 0,
                })
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProject ? "Edit Project" : "Create New Project"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Short Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="full_content">Full Content</Label>
                <Textarea
                  id="full_content"
                  value={formData.full_content}
                  onChange={(e) => setFormData({ ...formData, full_content: e.target.value })}
                  rows={6}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
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
                      <SelectItem value="infrastructure">Infrastructure</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="community">Community Care</SelectItem>
                      <SelectItem value="outreach">Outreach</SelectItem>
                    </SelectContent>
                  </Select>
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
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="planned">Planned</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="goal_amount">Goal Amount</Label>
                  <Input
                    id="goal_amount"
                    type="number"
                    value={formData.goal_amount}
                    onChange={(e) => setFormData({ ...formData, goal_amount: Number.parseFloat(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="raised_amount">Raised Amount</Label>
                  <Input
                    id="raised_amount"
                    type="number"
                    value={formData.raised_amount}
                    onChange={(e) => setFormData({ ...formData, raised_amount: Number.parseFloat(e.target.value) })}
                    required
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
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="families_reached">Families Reached</Label>
                  <Input
                    id="families_reached"
                    type="number"
                    value={formData.families_reached}
                    onChange={(e) => setFormData({ ...formData, families_reached: Number.parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="communities_served">Communities Served</Label>
                  <Input
                    id="communities_served"
                    type="number"
                    value={formData.communities_served}
                    onChange={(e) => setFormData({ ...formData, communities_served: Number.parseInt(e.target.value) })}
                  />
                </div>
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
                ) : editingProject ? (
                  "Update Project"
                ) : (
                  "Create Project"
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
              <TableHead>Category</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => {
              const progress = (project.raised_amount / project.goal_amount) * 100
              return (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.title}</TableCell>
                  <TableCell className="capitalize">{project.category}</TableCell>
                  <TableCell>{progress.toFixed(0)}%</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        project.status === "active"
                          ? "bg-green-100 text-green-700"
                          : project.status === "completed"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {project.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(project)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(project.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
