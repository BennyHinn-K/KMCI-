import { createBrowserClient } from "@supabase/ssr"

export function getSupabaseBrowserClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || ''
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || ''
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Supabase credentials missing! Check your .env.local file')
    console.error('URL:', supabaseUrl || 'MISSING')
    console.error('Key:', supabaseKey ? 'SET (hidden)' : 'MISSING')
  }
  
  return createBrowserClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseKey || 'placeholder-key')
}
