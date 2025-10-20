"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Download, FileText, Calendar, User } from "lucide-react"
import { SermonModal } from "@/components/sermons/sermon-modal"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

export function SermonsGrid() {
  const [sermons, setSermons] = useState<any[]>([])
  const [selectedSermon, setSelectedSermon] = useState<any | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    async function fetchSermons() {
      const { data, error } = await supabase
        .from("sermons")
        .select("*")
        .eq("status", "published")
        .order("sermon_date", { ascending: false })

      if (!error && data) {
        setSermons(data)
      }
      setLoading(false)
    }
    fetchSermons()
  }, [])

  const handlePlaySermon = (sermon: any) => {
    setSelectedSermon(sermon)
    setIsModalOpen(true)
  }

  if (loading) {
    return (
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">Loading sermons...</p>
        </div>
      </section>
    )
  }

  if (sermons.length === 0) {
    return (
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">No sermons available yet. Check back soon!</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {sermons.map((sermon, index) => (
            <Card
              key={sermon.id}
              className="group hover:shadow-xl transition-all duration-300 overflow-hidden animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Thumbnail */}
              <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-primary to-primary/80 cursor-pointer">
                <img
                  src={sermon.thumbnail_url || "/placeholder.svg?height=300&width=400&query=sermon preaching"}
                  alt={sermon.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handlePlaySermon(sermon)}
                    className="w-16 h-16 rounded-full bg-accent flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <Play className="w-8 h-8 text-accent-foreground ml-1" fill="currentColor" />
                  </button>
                </div>
                {sermon.duration && (
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {sermon.duration}
                  </div>
                )}
              </div>

              <CardContent className="p-6 space-y-3">
                <div>
                  <h3 className="font-serif font-bold text-xl text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {sermon.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{sermon.description}</p>
                </div>

                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <User className="w-3 h-3" />
                    <span>{sermon.speaker}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {new Date(sermon.sermon_date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  {sermon.scripture && (
                    <div className="flex items-center gap-2">
                      <FileText className="w-3 h-3" />
                      <span>{sermon.scripture}</span>
                    </div>
                  )}
                </div>

                {sermon.tags && sermon.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {sermon.tags.map((tag: string) => (
                      <span key={tag} className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => handlePlaySermon(sermon)}
                    size="sm"
                    className="flex-1 bg-primary hover:bg-primary/90"
                  >
                    <Play className="w-3 h-3 mr-1" />
                    Watch
                  </Button>
                  {sermon.audio_url && (
                    <Button size="sm" variant="outline" className="bg-transparent" asChild>
                      <a href={sermon.audio_url} download>
                        <Download className="w-3 h-3" />
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {selectedSermon && (
        <SermonModal sermon={selectedSermon} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      )}
    </section>
  )
}
