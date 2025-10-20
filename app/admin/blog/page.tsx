import { getSupabaseServerClient } from "@/lib/supabase/server"
import { BlogManager } from "@/components/admin/blog-manager"

export default async function AdminBlogPage() {
  const supabase = await getSupabaseServerClient()

  const { data: posts } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false })

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold text-navy">Blog Posts Management</h1>
        <p className="text-navy/60 mt-1">Create and manage blog content</p>
      </div>
      <BlogManager initialPosts={posts || []} />
    </div>
  )
}
