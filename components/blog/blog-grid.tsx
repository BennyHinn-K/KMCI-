"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, User, ArrowRight } from "lucide-react"
import Link from "next/link"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

export function BlogGrid() {
  const [blogPosts, setBlogPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    async function fetchBlogPosts() {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false })

      if (!error && data) {
        setBlogPosts(data)
      }
      setLoading(false)
    }
    fetchBlogPosts()
  }, [])

  if (loading) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">Loading blog posts...</p>
        </div>
      </section>
    )
  }

  if (blogPosts.length === 0) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">No blog posts available yet. Check back soon!</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {blogPosts.map((post, index) => (
            <Card
              key={post.id}
              className="group hover:shadow-xl transition-all duration-300 overflow-hidden animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Featured Image */}
              <div className="aspect-video overflow-hidden">
                <img
                  src={post.featured_image || "/placeholder.svg?height=300&width=400&query=blog post"}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              <CardContent className="p-6 space-y-4">
                {/* Category Badge */}
                <div className="inline-block">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary">
                    {post.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-serif font-bold text-xl text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{post.excerpt}</p>

                {/* Meta Info */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {new Date(post.published_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {/* Read More Link */}
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:gap-3 transition-all"
                >
                  Read More
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
