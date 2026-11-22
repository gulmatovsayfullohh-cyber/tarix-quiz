import { createClient } from "@/utils/supabase/client";
import { Question } from "@/types";
import { LOCAL_QUESTIONS } from "./questionsLocal";

export const LOCAL_QUESTION_OVERRIDES_KEY = "visola_local_question_overrides";

export function readLocalQuestionOverrides(): Question[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(LOCAL_QUESTION_OVERRIDES_KEY);
    const parsed: unknown = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed as Question[] : [];
  } catch {
    return [];
  }
}

export function mergeLocalQuestionOverrides(questions: Question[]): Question[] {
  const overrides = readLocalQuestionOverrides();
  const overridesById = new Map(overrides.filter((q) => q.id).map((q) => [q.id!, q]));
  const merged = questions
    .map((question) => {
      const id = question.id;
      const override = id ? overridesById.get(id) : undefined;
      if (!override) return question;
      overridesById.delete(id!);
      return override.isDeleted ? null : override;
    })
    .filter((question): question is Question => question !== null);

  for (const override of overridesById.values()) {
    if (!override.isDeleted) merged.push(override);
  }
  return merged;
}

function localQuestionsWithIds(): Question[] {
  return LOCAL_QUESTIONS.map((question, index) => ({
    ...question,
    id: `local-${index}`,
    isLocal: true,
  }));
}

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
      return mergeLocalQuestionOverrides(localQuestionsWithIds());
    }
    return mergeLocalQuestionOverrides(data as Question[]);
  } catch {
    return mergeLocalQuestionOverrides(localQuestionsWithIds());
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
