import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    // Check for admin bypass cookie
    const cookieStore = await cookies();
    const cookieName = process.env.AUTH_COOKIE_NAME || "kmci_admin";
    const hasAdminBypass = cookieStore.get(cookieName)?.value === "1";

    if (hasAdminBypass) {
      return NextResponse.json({
        authenticated: true,
        method: "passkey",
        user: {
          id: "admin",
          email: "admin@kmci.org",
          role: "super_admin"
        }
      });
    }

    return NextResponse.json({
      authenticated: false,
      method: null,
      user: null
    });

  } catch (error) {
    console.error("Admin check error:", error);
    return NextResponse.json(
      { error: "Server error", authenticated: false },
      { status: 500 }
    );
  }
}
