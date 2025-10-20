"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Edit, Trash2, Eye } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface BlogPostsTableProps {
  posts: any[]
}

export function BlogPostsTable({ posts }: BlogPostsTableProps) {
  const [deleting, setDeleting] = useState<string | null>(null)
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return

    setDeleting(id)
    await supabase.from("blog_posts").delete().eq("id", id)
    router.refresh()
  }

  return (
    <Card className="shadow-premium">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell className="font-medium">{post.title}</TableCell>
              <TableCell>
                <Badge variant="outline">{post.category}</Badge>
              </TableCell>
              <TableCell>{post.profiles?.full_name}</TableCell>
              <TableCell>
                <Badge variant={post.published ? "default" : "secondary"}>
                  {post.published ? "Published" : "Draft"}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(post.id)}
                    disabled={deleting === post.id}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  )
}
