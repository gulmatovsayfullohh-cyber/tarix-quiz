import { supabaseAdmin } from "@/utils/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

function isAuthorized(req: NextRequest) {
  const token = req.headers.get("x-admin-token");
  return token === process.env.NEXT_ADMIN_TOKEN;
}

// GET — statistikalar
export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
  const { data, error } = await supabaseAdmin
    .from("results")
    .select("*")
    .order("taken_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST — natija saqlash (anonim)
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { fan, mavzu, score, total } = body;
  if (!fan || !mavzu || score == null || !total) {
    return NextResponse.json({ error: "Noto'g'ri ma'lumot" }, { status: 400 });
  }
  const { error } = await supabaseAdmin.from("results").insert([{ fan, mavzu, score, total }]);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
