"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Eye, Calendar, Users } from "lucide-react"

interface ContentPerformanceProps {
  blogPosts: any[]
  sermons: any[]
  events: any[]
}

export function ContentPerformance({ blogPosts, sermons, events }: ContentPerformanceProps) {
  // Top performing blog posts
  const topBlogPosts = blogPosts
    .filter(post => post.is_published)
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5)

  // Top performing sermons
  const topSermons = sermons
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5)

  // Most attended events
  const topEvents = events
    .sort((a, b) => (b.current_attendees || 0) - (a.current_attendees || 0))
    .slice(0, 5)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-bold text-navy mb-2">Content Performance</h2>
        <p className="text-navy/60">Top performing content across your ministry</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Top Blog Posts */}
        <Card className="border-navy/10">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-navy flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Top Blog Posts
            </CardTitle>
            <p className="text-sm text-navy/60">Most viewed articles</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topBlogPosts.length > 0 ? (
                topBlogPosts.map((post, index) => (
                  <div key={post.id} className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-navy truncate">
                        {post.title || 'Untitled Post'}
                      </p>
                      <p className="text-xs text-navy/60">
                        {formatDate(post.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      <Eye className="h-4 w-4 text-navy/50" />
                      <span className="text-sm font-medium text-navy">
                        {post.views || 0}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-navy/60 text-center py-4">
                  No published blog posts yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Sermons */}
        <Card className="border-navy/10">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-navy flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Top Sermons
            </CardTitle>
            <p className="text-sm text-navy/60">Most watched messages</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topSermons.length > 0 ? (
                topSermons.map((sermon, index) => (
                  <div key={sermon.id} className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-navy truncate">
                        {sermon.title || 'Untitled Sermon'}
                      </p>
                      <p className="text-xs text-navy/60">
                        {sermon.speaker} • {formatDate(sermon.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      <Eye className="h-4 w-4 text-navy/50" />
                      <span className="text-sm font-medium text-navy">
                        {sermon.views || 0}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-navy/60 text-center py-4">
                  No sermons uploaded yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Events */}
        <Card className="border-navy/10">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-navy flex items-center gap-2">
              <Users className="h-5 w-5" />
              Most Attended Events
            </CardTitle>
            <p className="text-sm text-navy/60">Events with highest attendance</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topEvents.length > 0 ? (
                topEvents.map((event, index) => (
                  <div key={event.id} className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-navy truncate">
                        {event.title || 'Untitled Event'}
                      </p>
                      <p className="text-xs text-navy/60">
                        {formatDate(event.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      <Users className="h-4 w-4 text-navy/50" />
                      <span className="text-sm font-medium text-navy">
                        {event.current_attendees || 0}
                        {event.max_attendees && `/${event.max_attendees}`}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-navy/60 text-center py-4">
                  No events created yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Summary */}
      <Card className="border-navy/10">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-navy">Performance Summary</CardTitle>
          <p className="text-sm text-navy/60">Overall content engagement metrics</p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-navy">
                {blogPosts.filter(p => p.is_published).length}
              </div>
              <div className="text-sm text-navy/60">Published Posts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-navy">
                {sermons.length}
              </div>
              <div className="text-sm text-navy/60">Sermons</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-navy">
                {events.length}
              </div>
              <div className="text-sm text-navy/60">Events</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-navy">
                {[
                  ...blogPosts.map(p => p.views || 0),
                  ...sermons.map(s => s.views || 0)
                ].reduce((sum, views) => sum + views, 0)}
              </div>
              <div className="text-sm text-navy/60">Total Views</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
