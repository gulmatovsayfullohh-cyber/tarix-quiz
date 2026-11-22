import { supabaseAdmin } from "@/utils/supabase/admin";
import { LOCAL_QUESTIONS } from "@/lib/questionsLocal";
import { NextRequest, NextResponse } from "next/server";

function isAuthorized(req: NextRequest) {
  const session = req.cookies.get("admin_session")?.value;
  if (session && process.env.NEXT_ADMIN_TOKEN) return session === process.env.NEXT_ADMIN_TOKEN;
  const token = req.headers.get("x-admin-token");
  return Boolean(process.env.NEXT_ADMIN_TOKEN && token === process.env.NEXT_ADMIN_TOKEN);
}

// POST — barcha lokal savollarni Supabase'ga yuklash (Bulk Seed)
export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
  }

  try {
    // Avval mavjudlarini o'chiramiz yoki to'g'ridan to'g'ri insert qilamiz
    const cleanQuestions = LOCAL_QUESTIONS.map((q) => ({
      fan: q.fan,
      mavzu: q.mavzu,
      savol: q.savol,
      variantlar: q.variantlar,
      javob: q.javob,
      izoh: q.izoh || "",
      sinf: q.sinf || 8,
    }));

    const { data, error } = await supabaseAdmin.from("questions").insert(cleanQuestions).select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      count: data?.length || cleanQuestions.length,
      message: `${cleanQuestions.length} ta savol muvaffaqiyatli Supabase bazasiga yuklandi!`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Xatolik yuz berdi" }, { status: 500 });
  }
}
