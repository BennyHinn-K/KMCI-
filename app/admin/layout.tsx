import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { AdminLayout } from "@/components/admin/admin-layout";

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check for admin bypass cookie first
  const cookieStore = await cookies();
  const cookieName = process.env.AUTH_COOKIE_NAME || "kmci_admin";
  const hasAdminBypass = cookieStore.get(cookieName)?.value === "1";

  // If has bypass cookie, allow access without Supabase auth
  if (hasAdminBypass) {
    const mockUser = {
      id: "admin",
      email: "admin@kmci.org",
      full_name: "Admin User",
      role: "super_admin",
    };
    return <AdminLayout user={mockUser}>{children}</AdminLayout>;
  }

  // Otherwise, check Supabase authentication
  try {
    const supabase = await getSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/admin/login");
    }

    // Get user profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    // Check if user has admin role
    if (
      !profile ||
      !["super_admin", "editor", "finance"].includes(profile.role)
    ) {
      redirect("/admin/login?error=unauthorized");
    }

    return <AdminLayout user={profile}>{children}</AdminLayout>;
  } catch (error) {
    console.error("Admin auth error:", error);
    // If Supabase is not configured or fails, redirect to login
    redirect("/admin/login");
  }
}
