"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FileText,
  Mic2,
  Calendar,
  FolderKanban,
  DollarSign,
  Mail,
  Users,
  Settings,
  Shield,
  ChevronLeft,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

interface NavItem {
  title: string
  href: string
  icon: any
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Blog Posts",
    href: "/admin/blog",
    icon: FileText,
  },
  {
    title: "Sermons",
    href: "/admin/sermons",
    icon: Mic2,
  },
  {
    title: "Events",
    href: "/admin/events",
    icon: Calendar,
  },
  {
    title: "Projects",
    href: "/admin/projects",
    icon: FolderKanban,
  },
  {
    title: "Products",
    href: "/admin/products",
    icon: FolderKanban,
  },
  {
    title: "Donations",
    href: "/admin/donations",
    icon: DollarSign,
  },
  {
    title: "Messages",
    href: "/admin/messages",
    icon: Mail,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
  {
    title: "Audit Log",
    href: "/admin/audit",
    icon: Shield,
  },
]

interface AdminSidebarProps {
  collapsed?: boolean
  onCollapse?: () => void
}

export function AdminSidebar({ collapsed, onCollapse }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <div
      className={cn(
        "flex h-full flex-col border-r bg-card transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b">
        {!collapsed && (
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
              K
            </div>
            <span className="font-semibold text-lg">KMCI Admin</span>
          </Link>
        )}
        {collapsed && (
          <div className="w-8 h-8 mx-auto rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
            K
          </div>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  collapsed && "justify-center"
                )}
                title={collapsed ? item.title : undefined}
              >
                <Icon className={cn("h-5 w-5 flex-shrink-0")} />
                {!collapsed && <span>{item.title}</span>}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      <Separator />

      {/* Footer */}
      <div className="p-3 space-y-2">
        <Button
          variant="ghost"
          size="sm"
          className={cn("w-full", collapsed && "px-2")}
          asChild
        >
          <Link href="/">
            <ChevronLeft className="h-4 w-4" />
            {!collapsed && <span className="ml-2">Back to Site</span>}
          </Link>
        </Button>
      </div>
    </div>
  )
}



