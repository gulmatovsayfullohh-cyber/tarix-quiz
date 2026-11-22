import { supabaseAdmin } from "@/utils/supabase/admin";
import { LOCAL_QUESTIONS } from "@/lib/questionsLocal";
import { NextRequest, NextResponse } from "next/server";

function isAuthorized(req: NextRequest) {
  const session = req.cookies.get("admin_session")?.value;
  if (session && process.env.NEXT_ADMIN_TOKEN) return session === process.env.NEXT_ADMIN_TOKEN;
  const token = req.headers.get("x-admin-token");
  return Boolean(process.env.NEXT_ADMIN_TOKEN && token === process.env.NEXT_ADMIN_TOKEN);
}

function unauthorized() {
  return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
}

// GET — barcha savollarni olish
export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) return unauthorized();

  try {
    const { data, error } = await supabaseAdmin.from("questions").select("*").order("fan");

    // Agar Supabase'da savollar bo'lsa ularni qaytaramiz
    if (!error && data && data.length > 0) {
      return NextResponse.json(data);
    }

    // Agar Supabase bo'sh bo'lsa, xatolik berib qolmasdan LOCAL_QUESTIONS ni qaytaramiz
    // Har bir savolga id biriktiramiz
    const fallbackWithId = LOCAL_QUESTIONS.map((q, idx) => ({
      ...q,
      id: `local-${idx}`,
      isLocal: true,
    }));

    return NextResponse.json(fallbackWithId);
  } catch {
    const fallbackWithId = LOCAL_QUESTIONS.map((q, idx) => ({
      ...q,
      id: `local-${idx}`,
      isLocal: true,
    }));
    return NextResponse.json(fallbackWithId);
  }
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
  const { id, isLocal, ...rest } = await req.json();

  if (String(id).startsWith("local-")) {
    // Agar lokal savolni tahrirlayotgan bo'lsa, yangi qilib Supabase'ga kiritamiz
    const { error } = await supabaseAdmin.from("questions").insert([rest]);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  const { error } = await supabaseAdmin.from("questions").update(rest).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

// DELETE — savolni o'chirish
export async function DELETE(req: NextRequest) {
  if (!isAuthorized(req)) return unauthorized();
  const { id } = await req.json();

  if (String(id).startsWith("local-")) {
    return NextResponse.json({ success: true });
  }

  const { error } = await supabaseAdmin.from("questions").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
