import { getSupabaseServerClient } from "@/lib/supabase/server"
import { ProjectsManager } from "@/components/admin/projects-manager"

export default async function AdminProjectsPage() {
  const supabase = await getSupabaseServerClient()

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <p className="text-muted-foreground">
          Manage missionary projects and fundraising campaigns
        </p>
      </div>

      <ProjectsManager projects={projects || []} />
    </div>
  )
}



