import { updateSession } from "./lib/supabase/middleware"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Only protect admin routes; allow public pages without auth
  if (!request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next()
  }

  // Update session with Supabase for admin routes
  const response = await updateSession(request)

  // If unauthenticated, ensure redirect goes to /admin/login
  const location = (response as NextResponse).headers.get("location")
  if (location && location.includes("/auth/login")) {
    const url = request.nextUrl.clone()
    url.pathname = "/admin/login"
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: ["/admin/:path*"],
}
