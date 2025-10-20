import { getSupabaseServerClient } from "@/lib/supabase/server"
import { UsersOverview } from "@/components/admin/users-overview"
import { UsersTable } from "@/components/admin/users-table"
import { InviteUserModal } from "@/components/admin/invite-user-modal"

export default async function AdminUsersPage() {
  const supabase = await getSupabaseServerClient()

  // Fetch users data
  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-navy">Users</h1>
          <p className="text-navy/60 mt-1">Manage admin users and their permissions</p>
        </div>
        <InviteUserModal />
      </div>

      <UsersOverview profiles={profiles || []} />
      <UsersTable profiles={profiles || []} />
    </div>
  )
}



