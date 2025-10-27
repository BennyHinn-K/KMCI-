import { getSupabaseServerClient } from "@/lib/supabase/server"
import { MessagesManager } from "@/components/admin/messages-manager"

export default async function AdminMessagesPage() {
  const supabase = await getSupabaseServerClient()

  const { data: messages } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground">
          View and manage contact form submissions
        </p>
      </div>

      <MessagesManager messages={messages || []} />
    </div>
  )
}



