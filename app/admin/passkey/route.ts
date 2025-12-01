import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { passkey } = await req.json().catch(() => ({ passkey: "" }));
  const expected = process.env.ADMIN_PASSKEY || "";
  const cookieName = process.env.AUTH_COOKIE_NAME || "kmci_admin";

  if (!expected) {
    return NextResponse.json(
      { error: "Server not configured" },
      { status: 500 },
    );
  }
  if (passkey !== expected) {
    return NextResponse.json({ error: "Invalid passkey" }, { status: 401 });
  }

  (await cookies()).set({
    name: cookieName,
    value: "1",
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 8,
    sameSite: "lax",
  });
  return NextResponse.json({ ok: true });
}
