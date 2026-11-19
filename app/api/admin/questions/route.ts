import { supabaseAdmin } from "@/utils/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

function isAuthorized(req: NextRequest) {
  const token = req.headers.get("x-admin-token");
  return token === process.env.NEXT_ADMIN_TOKEN;
}

function unauthorized() {
  return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
}

// GET — barcha savollarni olish
export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) return unauthorized();
  const { data, error } = await supabaseAdmin.from("questions").select("*").order("fan");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST — yangi savol qo'shish
export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) return unauthorized();
  const body = await req.json();
  const { error } = await supabaseAdmin.from("questions").insert([body]);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

// PUT — savolni yangilash
export async function PUT(req: NextRequest) {
  if (!isAuthorized(req)) return unauthorized();
  const { id, ...rest } = await req.json();
  const { error } = await supabaseAdmin.from("questions").update(rest).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

// DELETE — savolni o'chirish
export async function DELETE(req: NextRequest) {
  if (!isAuthorized(req)) return unauthorized();
  const { id } = await req.json();
  const { error } = await supabaseAdmin.from("questions").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
