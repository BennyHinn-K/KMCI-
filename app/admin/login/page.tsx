"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Lock, Mail, Eye, EyeOff } from "lucide-react"

export default function AdminLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/admin"
  
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passkey, setPasskey] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = getSupabaseBrowserClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Check if user has admin role
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single()

      if (!profile || !["super_admin", "editor", "finance"].includes(profile.role)) {
        await supabase.auth.signOut()
        toast.error("Access denied. You don't have admin privileges.")
        return
      }

      toast.success("Login successful!")
      router.push(redirect)
      router.refresh()
    } catch (error: any) {
      console.error("Login error:", error)
      toast.error(error.message || "Invalid email or password")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasskey = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const r = await fetch("/admin/passkey", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ passkey }),
      })
      if (!r.ok) {
        const j = await r.json().catch(() => ({}))
        throw new Error(j.error || "Invalid passkey")
      }
      toast.success("Admin access granted")
      router.push(redirect)
      router.refresh()
    } catch (err: any) {
      toast.error(err.message || "Passkey login failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary flex items-center justify-center text-primary-foreground mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <CardTitle className="text-2xl font-bold">KMCI Admin Portal</CardTitle>
          <CardDescription>
            Sign in to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@kmci.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="my-6 text-center text-muted-foreground text-xs">OR</div>

          <form onSubmit={handlePasskey} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="passkey">Admin Passkey</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="passkey"
                  type="password"
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value)}
                  className="pl-10"
                  placeholder="Enter admin passkey"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Sign In with Passkey"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Button
              variant="link"
              className="text-sm text-muted-foreground"
              onClick={() => router.push("/")}
            >
              ← Back to Website
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}



