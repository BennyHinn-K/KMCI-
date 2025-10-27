import { getSupabaseServerClient } from "@/lib/supabase/server"
import { BlogManager } from "@/components/admin/blog-manager"

export default async function AdminBlogPage() {
  const supabase = await getSupabaseServerClient()

  const { data: posts } = await supabase
    .from("blog_posts")
    .select(`
      *,
      profiles:author_id (full_name, email)
    `)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Blog Posts</h1>
        <p className="text-muted-foreground">
          Manage your blog posts and articles
        </p>
      </div>

      <BlogManager posts={posts || []} />
    </div>
  )
}



