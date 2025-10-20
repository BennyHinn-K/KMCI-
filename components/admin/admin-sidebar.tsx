"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Video,
  FolderKanban,
  DollarSign,
  Users,
  Settings,
  BarChart3,
  Shield,
} from "lucide-react"

interface AdminSidebarProps {
  userRole: string
}

export function AdminSidebar({ userRole }: AdminSidebarProps) {
  const pathname = usePathname()

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Blog Posts", href: "/admin/blog", icon: FileText },
    { name: "Events", href: "/admin/events", icon: Calendar },
    { name: "Sermons", href: "/admin/sermons", icon: Video },
    { name: "Projects", href: "/admin/projects", icon: FolderKanban },
    { name: "Donations", href: "/admin/donations", icon: DollarSign, roles: ["super_admin", "finance"] },
    { name: "Users", href: "/admin/users", icon: Users, roles: ["super_admin"] },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { name: "Audit Log", href: "/admin/audit", icon: Shield, roles: ["super_admin"] },
    { name: "Settings", href: "/admin/settings", icon: Settings, roles: ["super_admin"] },
  ]

  const filteredNavigation = navigation.filter((item) => !item.roles || item.roles.includes(userRole))

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-navy px-6 pb-4">
        <div className="flex h-16 shrink-0 items-center">
          <h1 className="text-xl font-display font-bold text-gold">KMCI Admin</h1>
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {filteredNavigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-all",
                          isActive ? "bg-gold text-navy shadow-glow" : "text-ivory hover:text-gold hover:bg-navy-light",
                        )}
                      >
                        <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                        {item.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}
