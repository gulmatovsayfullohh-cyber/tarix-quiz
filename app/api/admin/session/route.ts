import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const submitted = typeof body?.token === "string" ? body.token : "";
  const expected = process.env.NEXT_ADMIN_TOKEN;

  if (!expected || submitted !== expected) {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set("admin_session", submitted, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set("admin_session", "", { httpOnly: true, path: "/", maxAge: 0 });
  return response;
}
