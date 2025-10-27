"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, FileText, Mic2, Calendar, FolderKanban } from "lucide-react"

export function QuickActions() {
  const actions = [
    {
      label: "New Blog Post",
      href: "/admin/blog?action=new",
      icon: FileText,
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      label: "Add Sermon",
      href: "/admin/sermons?action=new",
      icon: Mic2,
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      label: "Create Event",
      href: "/admin/events?action=new",
      icon: Calendar,
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      label: "New Project",
      href: "/admin/projects?action=new",
      icon: FolderKanban,
      color: "bg-orange-500 hover:bg-orange-600",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4">
      {actions.map((action) => {
        const Icon = action.icon
        return (
          <Button
            key={action.href}
            asChild
            className={`h-auto flex-col gap-2 py-6 ${action.color} text-white`}
          >
            <Link href={action.href}>
              <Icon className="h-6 w-6" />
              <span className="text-sm font-medium">{action.label}</span>
            </Link>
          </Button>
        )
      })}
    </div>
  )
}



