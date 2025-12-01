import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User, Share2 } from "lucide-react";
import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabase/server";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

async function getBlogPost(slug: string) {
  const supabase = await getSupabaseServerClient();

  const { data: post, error } = await supabase
    .from("blog_posts")
    .select(
      `
      *,
      profiles:author_id (
        full_name,
        avatar_url
      )
    `,
    )
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !post) {
    return null;
  }

  return post;
}

async function getRelatedPosts(currentSlug: string, category: string) {
  const supabase = await getSupabaseServerClient();

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, featured_image, created_at")
    .eq("status", "published")
    .eq("category", category)
    .neq("slug", currentSlug)
    .order("created_at", { ascending: false })
    .limit(3);

  return posts || [];
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {
      title: "Post Not Found | KMCI Blog",
    };
  }

  return {
    title: `${post.title} | KMCI Blog`,
    description: post.excerpt || post.title,
    openGraph: {
      title: post.title,
      description: post.excerpt || post.title,
      images: post.featured_image ? [post.featured_image] : [],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(slug, post.category);

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-ivory pt-24">
        {/* Hero Section */}
        <div className="relative">
          {post.featured_image && (
            <div className="h-96 relative overflow-hidden">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-dark-blue/50" />
            </div>
          )}

          <div className="container mx-auto px-4 py-16 relative">
            <div className="max-w-4xl mx-auto">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-dark-blue hover:text-gold transition-colors mb-8"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Blog
              </Link>

              <div className="space-y-6">
                <Badge variant="outline" className="border-gold text-gold">
                  {post.category}
                </Badge>

                <h1 className="text-4xl lg:text-5xl font-bold text-dark-blue leading-tight">
                  {post.title}
                </h1>

                {post.excerpt && (
                  <p className="text-xl text-dark-blue/70 leading-relaxed">
                    {post.excerpt}
                  </p>
                )}

                <div className="flex items-center gap-6 text-dark-blue/60">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{post.profiles?.full_name || "KMCI Team"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(post.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4 pb-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-8 lg:p-12 shadow-sm border border-gold/10">
              <div
                className="prose prose-lg max-w-none text-dark-blue/80"
                dangerouslySetInnerHTML={{ __html: post.content || "" }}
              />

              {/* Share Section */}
              <div className="mt-12 pt-8 border-t border-gold/20">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-dark-blue">
                    Share this post
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: post.title,
                          text: post.excerpt || post.title,
                          url: window.location.href,
                        });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                      }
                    }}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>

              {/* Author Section */}
              {post.profiles && (
                <div className="mt-12 pt-8 border-t border-gold/20">
                  <div className="flex items-start gap-4">
                    {post.profiles.avatar_url ? (
                      <img
                        src={post.profiles.avatar_url}
                        alt={post.profiles.full_name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center">
                        <User className="h-8 w-8 text-gold" />
                      </div>
                    )}
                    <div>
                      <h4 className="text-lg font-semibold text-dark-blue">
                        {post.profiles.full_name}
                      </h4>
                      <p className="text-dark-blue/60">
                        Author at Kingdom Missions Center International
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Posts Section */}
        {relatedPosts.length > 0 && (
          <div className="bg-white border-t border-gold/20">
            <div className="container mx-auto px-4 py-16">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-dark-blue text-center mb-12">
                  Related Posts
                </h2>

                <div className="grid md:grid-cols-3 gap-8">
                  {relatedPosts.map((relatedPost) => (
                    <Link
                      key={relatedPost.id}
                      href={`/blog/${relatedPost.slug}`}
                      className="group"
                    >
                      <article className="bg-ivory rounded-lg overflow-hidden border border-gold/10 hover:shadow-lg transition-all duration-300">
                        {relatedPost.featured_image && (
                          <div className="aspect-[16/9] overflow-hidden">
                            <img
                              src={relatedPost.featured_image}
                              alt={relatedPost.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                        )}
                        <div className="p-6">
                          <h3 className="text-xl font-semibold text-dark-blue mb-2 group-hover:text-gold transition-colors">
                            {relatedPost.title}
                          </h3>
                          {relatedPost.excerpt && (
                            <p className="text-dark-blue/60 text-sm line-clamp-3">
                              {relatedPost.excerpt}
                            </p>
                          )}
                          <div className="mt-4 text-sm text-dark-blue/50">
                            {new Date(
                              relatedPost.created_at,
                            ).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>

                <div className="text-center mt-12">
                  <Button asChild variant="outline">
                    <Link href="/blog">View All Posts</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
