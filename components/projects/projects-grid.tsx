"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Building, Home, Truck, ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

const iconMap: any = {
  building: Building,
  home: Home,
  truck: Truck,
}

export function ProjectsGrid() {
  const [projects, setProjects] = useState<any[]>([])
  const [expandedProject, setExpandedProject] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    async function fetchProjects() {
      try {
        const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false })

      if (!error && data) {
        setProjects(data)
      } else {
        setProjects([]) // Set empty array as fallback
      }
      } catch (error) {
        console.error("Error fetching projects:", error)
        setProjects([]) // Set empty array as fallback
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  const toggleProject = (id: string) => {
    setExpandedProject(expandedProject === id ? null : id)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  if (loading) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">Loading projects...</p>
        </div>
      </section>
    )
  }

  if (projects.length === 0) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">No active projects at this time. Check back soon!</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="space-y-8 max-w-6xl mx-auto">
          {projects.map((project, index) => {
            const Icon = iconMap[project.icon] || Building
            const isExpanded = expandedProject === project.id
            const progressPercentage = (project.raised_amount / project.goal_amount) * 100

            return (
              <Card
                key={project.id}
                className="group hover:shadow-xl transition-all duration-500 border-2 hover:border-accent overflow-hidden animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="md:flex">
                  {/* Project Image */}
                  <div className="md:w-2/5 aspect-video md:aspect-square overflow-hidden">
                    <img
                      src={project.image_url || "/placeholder.svg?height=400&width=400&query=development project"}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  {/* Project Details */}
                  <CardContent className="md:w-3/5 p-6 md:p-8 space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-7 h-7 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-muted-foreground mb-1">{project.category}</div>
                        <h3 className="font-serif font-bold text-2xl text-foreground mb-2">{project.title}</h3>
                        <p className="text-muted-foreground">{project.short_description}</p>
                      </div>
                    </div>

                    {/* Progress Section */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-baseline">
                        <div>
                          <div className="text-3xl font-bold text-accent">{formatCurrency(project.raised_amount)}</div>
                          <div className="text-sm text-muted-foreground">
                            raised of {formatCurrency(project.goal_amount)} goal
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">{Math.round(progressPercentage)}%</div>
                          <div className="text-sm text-muted-foreground">funded</div>
                        </div>
                      </div>

                      <Progress value={progressPercentage} className="h-3" />
                    </div>

                    {/* Impact Stats */}
                    {(project.families_reached > 0 || project.communities_served > 0) && (
                      <div className="flex gap-6 text-sm">
                        {project.families_reached > 0 && (
                          <div>
                            <div className="font-bold text-lg text-foreground">{project.families_reached}</div>
                            <div className="text-muted-foreground">Families Reached</div>
                          </div>
                        )}
                        {project.communities_served > 0 && (
                          <div>
                            <div className="font-bold text-lg text-foreground">{project.communities_served}</div>
                            <div className="text-muted-foreground">Communities Served</div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                      <Button asChild className="flex-1 bg-primary hover:bg-primary/90">
                        <Link href="/donate">Donate Now</Link>
                      </Button>
                      <Button
                        onClick={() => toggleProject(project.id)}
                        variant="outline"
                        className="flex-1 bg-transparent"
                      >
                        {isExpanded ? (
                          <>
                            Less Info <ChevronUp className="ml-2 h-4 w-4" />
                          </>
                        ) : (
                          <>
                            More Info <ChevronDown className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="pt-6 border-t border-border space-y-4 animate-fade-in-up">
                        <div>
                          <h4 className="font-semibold text-lg text-foreground mb-2">Project Details</h4>
                          <p className="text-muted-foreground leading-relaxed">{project.full_description}</p>
                        </div>

                        <div className="bg-muted/50 p-4 rounded-lg">
                          <h4 className="font-semibold text-sm text-foreground mb-2">How Your Donation Helps</h4>
                          <ul className="space-y-1 text-sm text-muted-foreground">
                            <li>• Every contribution brings us closer to our goal</li>
                            <li>• 100% of donations go directly to the project</li>
                            <li>• Regular updates provided to all donors</li>
                            <li>• Tax-deductible receipts available</li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
