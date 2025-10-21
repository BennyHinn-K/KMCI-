import type React from "react"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminHeader } from "@/components/admin/admin-header"
import { cookies } from "next/headers"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await getSupabaseServerClient()
  const cookieStore = await cookies()
  const hasPasswordGate = cookieStore.get("admin_auth")?.value === "1"
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user && !hasPasswordGate) {
    redirect("/admin/login")
  }

  // Get user profile with role
  const { data: profile } = user ? await supabase.from("profiles").select("*").eq("id", user.id).single() : { data: null }

  return (
    <div className="min-h-screen bg-ivory">
      <AdminSidebar userRole={profile?.role || (hasPasswordGate ? "super_admin" : "editor")} />
      <div className="lg:pl-64">
        <AdminHeader user={user} profile={profile} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
