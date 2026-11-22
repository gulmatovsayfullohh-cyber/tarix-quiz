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

function normalizeTopic(value: string) {
  return value
    .normalize("NFC")
    .trim()
    .toLocaleLowerCase("uz-UZ")
    .replace(/[ʻʼ`´’‘]/g, "'")
    .replace(/\s+/g, " ");
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
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Savol ma'lumotlari noto'g'ri." }, { status: 400 });
  }

  const fan = typeof body.fan === "string" ? body.fan.trim() : "";
  const mavzu = typeof body.mavzu === "string" ? body.mavzu.trim() : "";
  const savol = typeof body.savol === "string" ? body.savol.trim() : "";
  const variantlar = Array.isArray(body.variantlar)
    ? body.variantlar.map((value: unknown) => typeof value === "string" ? value.trim() : "")
    : [];
  const javob = Number(body.javob);
  const sinf = Number(body.sinf || 8);

  if (!fan || !mavzu || !savol) {
    return NextResponse.json({ error: "Fan, mavzu va savol matnini to'ldiring." }, { status: 400 });
  }
  if (variantlar.length !== 4 || variantlar.some((value: string) => !value)) {
    return NextResponse.json({ error: "Barcha 4 ta javob variantini to'ldiring." }, { status: 400 });
  }
  if (!Number.isInteger(javob) || javob < 0 || javob > 3 || !Number.isInteger(sinf)) {
    return NextResponse.json({ error: "To'g'ri javob yoki sinf tanlovi noto'g'ri." }, { status: 400 });
  }

  const { data: existing, error: lookupError } = await supabaseAdmin
    .from("questions")
    .select("mavzu")
    .eq("fan", fan)
    .eq("sinf", sinf);

  if (lookupError) {
    return NextResponse.json({ error: `Mavzularni tekshirib bo'lmadi: ${lookupError.message}` }, { status: 500 });
  }

  const matchingTopic = existing?.find((row) => normalizeTopic(row.mavzu) === normalizeTopic(mavzu));
  const savedQuestion = {
    fan,
    mavzu: matchingTopic?.mavzu ?? mavzu,
    savol,
    variantlar,
    javob,
    izoh: typeof body.izoh === "string" ? body.izoh.trim() : "",
    sinf,
  };

  const { data, error } = await supabaseAdmin.from("questions").insert([savedQuestion]).select().single();
  if (error) return NextResponse.json({ error: `Savol saqlanmadi: ${error.message}` }, { status: 500 });
  return NextResponse.json({ success: true, question: data, topicCreated: !matchingTopic });
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
