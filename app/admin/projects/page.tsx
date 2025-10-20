import { getSupabaseServerClient } from "@/lib/supabase/server"
import { ProjectsManager } from "@/components/admin/projects-manager"

export default async function AdminProjectsPage() {
  const supabase = await getSupabaseServerClient()

  const { data: projects } = await supabase.from("projects").select("*").order("created_at", { ascending: false })

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold text-navy">Projects Management</h1>
        <p className="text-navy/60 mt-1">Manage development projects and fundraising</p>
      </div>
      <ProjectsManager initialProjects={projects || []} />
    </div>
  )
}
