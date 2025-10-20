import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import Link from "next/link"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function LatestSermonSection() {
  const supabase = await getSupabaseServerClient()

  const { data: sermons } = await supabase
    .from("sermons")
    .select("*")
    .order("sermon_date", { ascending: false })
    .limit(1)

  const latestSermon = sermons?.[0]

  return (
    <section className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif font-bold text-4xl md:text-5xl text-foreground mb-4">Latest Sermon</h2>
            <p className="text-lg text-muted-foreground">Be encouraged and inspired by God's Word</p>
          </div>

          {latestSermon ? (
            <Card className="overflow-hidden hover:shadow-xl transition-shadow">
              <div className="aspect-video bg-gradient-to-br from-primary to-primary/80 relative group cursor-pointer">
                {latestSermon.thumbnail_url && (
                  <img
                    src={latestSermon.thumbnail_url || "/placeholder.svg"}
                    alt={latestSermon.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-10 h-10 text-accent-foreground ml-1" fill="currentColor" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                  <h3 className="font-serif font-bold text-2xl text-white mb-2">{latestSermon.title}</h3>
                  <p className="text-white/90 text-sm">
                    {latestSermon.speaker} •{" "}
                    {new Date(latestSermon.sermon_date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <CardContent className="p-6">
                <p className="text-muted-foreground mb-4 leading-relaxed">{latestSermon.description}</p>
                <div className="flex gap-3">
                  <Button asChild className="flex-1">
                    <Link href="/sermons">Watch Now</Link>
                  </Button>
                  <Button asChild variant="outline" className="flex-1 bg-transparent">
                    <Link href="/sermons">View All Sermons</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No sermons available yet. Check back soon!</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
