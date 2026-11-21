"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Layers, Gamepad2, Sparkles, CheckCircle2 } from "lucide-react";
import { fetchQuestions, getSavollarSoni, getSavollar } from "@/lib/questions";
import { useQuizStore } from "@/lib/quiz-store";
import Navbar from "@/components/Navbar";
import { useSettingsStore } from "@/lib/settings-store";
import { useEffect, useState } from "react";

const COUNT_OPTIONS = [5, 10, 15, 20, 30];

export default function MavzuContent({ fan, mavzu }: { fan: string; mavzu: string }) {
  const { lang } = useSettingsStore();
  const router = useRouter();
  const { setFan, setMavzu, startQuiz } = useQuizStore();
  const [questions, setQuestions] = useState(() => getSavollar(fan, mavzu));
  const total = questions.length;

  useEffect(() => {
    let active = true;
    fetchQuestions().then((all) => {
      if (!active) return;
      const filtered = all.filter((question) => question.fan === fan && question.mavzu === mavzu);
      if (filtered.length > 0) setQuestions(filtered);
    });
    return () => { active = false; };
  }, [fan, mavzu]);

  const options = [...COUNT_OPTIONS.filter((n) => n < total), total];

  const handleStart = (count: number) => {
    setFan(fan);
    setMavzu(mavzu);
    startQuiz(questions, count);
    router.push("/quiz");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors">
      <Navbar />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-8 pb-24">
        {/* Back */}
        <div className="mb-6">
          <Link href={`/${encodeURIComponent(fan)}`} className="inline-block">
            <button className="btn-ghost text-xs">
              <ArrowLeft size={14} /> {lang === "uz" ? "Mavzularga qaytish" : "Назад к темам"}
            </button>
          </Link>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="liquid-border p-6 sm:p-10 bg-white dark:bg-slate-900 rounded-3xl shadow-xl text-center space-y-6"
        >
          <div className="w-14 h-14 rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center mx-auto">
            <Gamepad2 size={28} />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 bg-violet-500/10 px-3 py-1 rounded-full">
              {fan}
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-3 mb-2">
              {mavzu}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {lang === "uz"
                ? `Ushbu mavzuda jami ${total} ta savol bor. Nechtasini yechmoqchisiz?`
                : `В этой теме всего ${total} вопросов. Сколько вы хотите пройти?`}
            </p>
          </div>

          {/* Count Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            {options.map((n) => {
              const isAll = n === total;
              return (
                <button
                  key={n}
                  onClick={() => handleStart(n)}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-1 group hover:-translate-y-1 ${
                    isAll
                      ? "border-violet-600 bg-violet-600/10 text-violet-600 dark:text-violet-400 shadow-md"
                      : "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-slate-800 dark:text-slate-200 hover:border-violet-500"
                  }`}
                >
                  <span className="text-2xl font-black">{n}</span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {isAll ? (lang === "uz" ? "Hammasi" : "Все") : (lang === "uz" ? "ta savol" : "вопросов")}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
