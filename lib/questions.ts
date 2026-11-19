import { createClient } from "@/utils/supabase/client";
import { Question } from "@/types";
import { LOCAL_QUESTIONS } from "./questionsLocal";

// ----- Supabase'dan savollarni yuklash (fallback: local) -----
export async function fetchQuestions(): Promise<Question[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .order("fan", { ascending: true });

    if (error || !data || data.length === 0) {
      console.warn("Supabase bo'sh yoki xato — lokal savollar ishlatilmoqda.");
      return LOCAL_QUESTIONS;
    }
    return data as Question[];
  } catch {
    return LOCAL_QUESTIONS;
  }
}

// ----- Sinxron (SSR va fallback uchun) lokal yordamchilar -----
export function getFanlar(): string[] {
  return [...new Set(LOCAL_QUESTIONS.map((q) => q.fan))];
}

export function getMavzular(fan: string): string[] {
  return [...new Set(LOCAL_QUESTIONS.filter((q) => q.fan === fan).map((q) => q.mavzu))];
}

export function getSavollar(fan: string, mavzu: string): Question[] {
  return LOCAL_QUESTIONS.filter((q) => q.fan === fan && q.mavzu === mavzu);
}

export function getSavollarSoni(fan: string, mavzu?: string): number {
  if (mavzu) return LOCAL_QUESTIONS.filter((q) => q.fan === fan && q.mavzu === mavzu).length;
  return LOCAL_QUESTIONS.filter((q) => q.fan === fan).length;
}
