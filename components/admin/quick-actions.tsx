import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export function QuickActions() {
  const actions = [
    { title: "Manage Blog Posts", href: "/admin/blog", description: "Create and manage blog articles" },
    { title: "Manage Events", href: "/admin/events", description: "Schedule and manage events" },
    { title: "Manage Sermons", href: "/admin/sermons", description: "Upload and manage sermons" },
    { title: "Manage Projects", href: "/admin/projects", description: "Start and manage projects" },
  ]

  return (
    <Card className="shadow-premium">
      <CardHeader>
        <CardTitle className="text-navy">Quick Actions</CardTitle>
        <CardDescription>Common tasks and shortcuts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {actions.map((action) => (
            <Link key={action.title} href={action.href}>
              <Button
                variant="outline"
                className="w-full h-auto flex flex-col items-start p-4 hover:bg-navy/5 hover:border-gold transition-all bg-transparent"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Plus className="h-4 w-4 text-gold" />
                  <span className="font-semibold text-navy">{action.title}</span>
                </div>
                <span className="text-xs text-navy/60 text-left">{action.description}</span>
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
