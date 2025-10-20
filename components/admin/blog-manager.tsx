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

type BlogPost = {
  id: string
  title: string
  excerpt: string
  content: string
  category: string
  featured_image_url: string
  tags: string[]
  is_published: boolean
  published_at: string
  created_at: string
}

export function BlogManager({ initialPosts }: { initialPosts: BlogPost[] }) {
  const [posts, setPosts] = useState(initialPosts)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "testimonies",
    featured_image_url: "",
    tags: "",
    is_published: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")
      const postData = {
        ...formData,
        slug,
        tags: formData.tags.split(",").map((t) => t.trim()),
        published_at: formData.is_published ? new Date().toISOString() : null,
        views: 0,
      }

      if (editingPost) {
        const { error } = await supabase.from("blog_posts").update(postData).eq("id", editingPost.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from("blog_posts").insert([postData])
        if (error) throw error
      }

      setIsOpen(false)
      setEditingPost(null)
      setFormData({
        title: "",
        excerpt: "",
        content: "",
        category: "testimonies",
        featured_image_url: "",
        tags: "",
        is_published: false,
      })
      router.refresh()
    } catch (error) {
      console.error("Error saving blog post:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post)
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      featured_image_url: post.featured_image_url,
      tags: post.tags.join(", "),
      is_published: post.is_published,
    })
    setIsOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return

    try {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id)
      if (error) throw error
      router.refresh()
    } catch (error) {
      console.error("Error deleting blog post:", error)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>All Blog Posts</CardTitle>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingPost(null)
                setFormData({
                  title: "",
                  excerpt: "",
                  content: "",
                  category: "testimonies",
                  featured_image_url: "",
                  tags: "",
                  is_published: false,
                })
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPost ? "Edit Blog Post" : "Create New Blog Post"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Post Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={2}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Full Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={10}
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
                      <SelectItem value="testimonies">Testimonies</SelectItem>
                      <SelectItem value="outreach">Outreach</SelectItem>
                      <SelectItem value="leadership">Leadership</SelectItem>
                      <SelectItem value="ministry">Ministry Updates</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="featured_image_url">Featured Image URL</Label>
                  <Input
                    id="featured_image_url"
                    type="url"
                    value={formData.featured_image_url}
                    onChange={(e) => setFormData({ ...formData, featured_image_url: e.target.value })}
                    placeholder="/placeholder.svg?height=400&width=600"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="faith, community, transformation"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_published"
                  checked={formData.is_published}
                  onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="is_published" className="cursor-pointer">
                  Publish immediately
                </Label>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : editingPost ? (
                  "Update Post"
                ) : (
                  "Create Post"
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
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-medium">{post.title}</TableCell>
                <TableCell className="capitalize">{post.category}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${post.is_published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}
                  >
                    {post.is_published ? "Published" : "Draft"}
                  </span>
                </TableCell>
                <TableCell>{new Date(post.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(post)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(post.id)}>
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
