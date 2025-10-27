import { getSupabaseServerClient } from "@/lib/supabase/server"
import { UsersManager } from "@/components/admin/users-manager"

export default async function AdminUsersPage() {
  const supabase = await getSupabaseServerClient()

  const { data: users } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground">
          Manage admin users and permissions
        </p>
      </div>

      <UsersManager users={users || []} />
    </div>
  )
}



