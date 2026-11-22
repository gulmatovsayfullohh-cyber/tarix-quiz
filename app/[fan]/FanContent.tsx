"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, BookMarked, ChevronRight, Sparkles, Layers } from "lucide-react";
import { getMavzular, getSavollarSoni, fetchQuestions } from "@/lib/questions";
import Navbar from "@/components/Navbar";
import { useSettingsStore } from "@/lib/settings-store";
import { ruPlural, uzPlural, t } from "@/lib/translations";
import { useEffect, useState } from "react";

export default function FanContent({ fan }: { fan: string }) {
  const { lang } = useSettingsStore();
  const strings = t[lang];
  const fanDecoded = decodeURIComponent(fan);
  const [allQuestions, setAllQuestions] = useState<Awaited<ReturnType<typeof fetchQuestions>>>([]);
  const mavzular = [...new Set([
    ...getMavzular(fanDecoded),
    ...allQuestions.filter((q) => q.fan === fanDecoded).map((q) => q.mavzu),
  ])];

  useEffect(() => {
    let active = true;
    fetchQuestions().then((questions) => {
      if (active) setAllQuestions(questions);
    });
    return () => { active = false; };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-(--bg) text-(--text)">
      <Navbar />

      <main className="section-space flex-1">
        <div className="site-container max-w-3xl">
          {/* Back */}
          <div className="mb-6">
            <Link href="/" className="inline-block">
              <button className="btn-ghost text-xs">
                <ArrowLeft size={14} /> {lang === "uz" ? "Bosh sahifa" : "Главная"}
              </button>
            </Link>
          </div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 bg-violet-500/10 px-3 py-1 rounded-full">
              8-sinf • {fanDecoded}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-3 mb-2">
              {fanDecoded}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {lang === "uz" ? "Test topshirish uchun mavzulardan birini tanlang:" : "Выберите тему для прохождения теста:"}
            </p>
          </motion.div>

          {/* Mavzular ro'yxati */}
          <div className="space-y-3">
            {mavzular.map((mavzu, i) => {
              const count = allQuestions.length > 0
                ? allQuestions.filter((q) => q.fan === fanDecoded && q.mavzu === mavzu).length
                : getSavollarSoni(fanDecoded, mavzu);
              return (
                <motion.div
                  key={mavzu}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={`/${encodeURIComponent(fanDecoded)}/${encodeURIComponent(mavzu)}`}
                    className="block text-decoration-none group"
                  >
                    <div className="glass p-5 rounded-2xl flex items-center justify-between gap-4 group-hover:border-violet-500/50 group-hover:shadow-md transition-all">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 font-extrabold text-sm flex items-center justify-center shrink-0">
                          {i + 1}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                            {mavzu}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {count} {lang === "uz" ? uzPlural(count, "savol") : ruPlural(count, "вопрос", "вопроса", "вопросов")}
                          </p>
                        </div>
                      </div>

                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-violet-600 group-hover:text-white transition-all shrink-0">
                        <ChevronRight size={16} />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
