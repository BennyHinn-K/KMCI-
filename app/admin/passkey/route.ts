import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { passkey } = await req.json();

    // Get environment variables
    const expectedPasskey = process.env.ADMIN_PASSKEY || "kmci@KMCI";
    const cookieName = process.env.AUTH_COOKIE_NAME || "kmci_admin";

    console.log("Passkey attempt:", passkey ? "PROVIDED" : "MISSING");
    console.log("Expected passkey configured:", expectedPasskey ? "YES" : "NO");

    if (!passkey) {
      return NextResponse.json(
        { error: "Passkey is required" },
        { status: 400 },
      );
    }

    if (passkey !== expectedPasskey) {
      console.log("Invalid passkey provided");
      return NextResponse.json({ error: "Invalid passkey" }, { status: 401 });
    }

    // Set admin bypass cookie
    const cookieStore = await cookies();
    cookieStore.set({
      name: cookieName,
      value: "1",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8, // 8 hours
      sameSite: "lax",
    });

    console.log("Admin bypass cookie set successfully");

    return NextResponse.json({
      success: true,
      message: "Admin access granted",
    });
  } catch (error) {
    console.error("Passkey route error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
