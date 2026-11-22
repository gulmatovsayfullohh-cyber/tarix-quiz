"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Trophy,
  XCircle,
  CheckCircle2,
  RotateCcw,
  Layers,
  Home,
  Timer,
  Award,
  Sparkles,
  BarChart2,
  Calendar,
} from "lucide-react";
import { useQuizStore } from "@/lib/quiz-store";
import { useSettingsStore } from "@/lib/settings-store";
import { t } from "@/lib/translations";
import { getSavollar } from "@/lib/questions";
import Navbar from "@/components/Navbar";

function formatDuration(totalSeconds: number, lang: "uz" | "ru"): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  if (lang === "uz") {
    if (mins > 0) return `${mins} daqiqa ${secs} soniya`;
    return `${secs} soniya`;
  } else {
    if (mins > 0) return `${mins} мин ${secs} сек`;
    return `${secs} сек`;
  }
}

export default function NatijaPage() {
  const router = useRouter();
  const { lang } = useSettingsStore();
  const strings = t[lang];

  const {
    fan,
    mavzu,
    score,
    wrong,
    totalCount,
    elapsedSeconds,
    startQuiz,
  } = useQuizStore();

  // Natijani Supabase'ga saqlash
  useEffect(() => {
    if (!fan || !mavzu || !totalCount) return;
    fetch("/api/results", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        fan,
        mavzu,
        score,
        total: totalCount,
        time_spent: elapsedSeconds,
      }),
    }).catch(() => {});
  }, [fan, mavzu, score, totalCount, elapsedSeconds]);

  useEffect(() => {
    if (!fan) router.push("/");
  }, [fan, router]);

  if (!fan || !mavzu) return null;

  const pct = Math.round((score / totalCount) * 100);
  const correctCount = score;
  const wrongCount = wrong.length;

  const handleAgain = () => {
    const questions = getSavollar(fan, mavzu);
    startQuiz(questions, totalCount);
    router.push("/quiz");
  };

  return (
    <div className="min-h-screen flex flex-col bg-(--bg) text-(--text)">
      <Navbar />

      <main className="section-space flex-1">
        <div className="site-container max-w-3xl">
          {/* Navigation back */}
          <div className="mb-6 flex items-center justify-between">
            <Link href="/">
              <button className="btn-ghost text-xs">
                <Home size={14} /> {strings.quiz.home}
              </button>
            </Link>
            <span className="text-xs font-bold text-violet-600 dark:text-violet-400 bg-violet-500/10 px-3 py-1 rounded-full">
              {fan} • {mavzu}
            </span>
          </div>

          {/* Hero Score Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="liquid-border p-6 sm:p-10 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-tr from-violet-600 to-indigo-500 text-white shadow-lg shadow-violet-500/30 mb-4 animate-bounce">
              <Trophy size={32} />
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
              {strings.result.title}
            </h1>

            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8 font-medium">
              {pct === 100
                ? strings.result.perfect
                : lang === "uz"
                ? "Siz barcha savollarni yakunladingiz! Quyida to'liq natijalar bilan tanishishingiz mumkin."
                : "Вы завершили тест! Ниже представлены подробные результаты."}
            </p>

            {/* 3 ta asosiy ko'rsatkich (Vaqt, Ball, Foiz) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-8">
              {/* Sekundamer natijasi */}
              <div className="p-4 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-center">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-violet-700 dark:text-violet-300 mb-1">
                  <Timer size={15} />
                  <span>{strings.result.timeSpent}</span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-violet-700 dark:text-violet-400 font-mono">
                  {formatDuration(elapsedSeconds, lang)}
                </div>
              </div>

              {/* To'plangan ball */}
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 mb-1">
                  <CheckCircle2 size={15} />
                  <span>{strings.result.score}</span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {correctCount} / {totalCount}
                </div>
              </div>

              {/* Foiz */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-300 mb-1">
                  <Sparkles size={15} />
                  <span>{strings.result.accuracy}</span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400">
                  {pct}%
                </div>
              </div>
            </div>

            {/* Harakatlar tugmalari */}
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <button
                onClick={handleAgain}
                className="btn-primary text-sm shadow-md shadow-violet-600/30"
              >
                <RotateCcw size={16} />
                <span>{strings.result.retry}</span>
              </button>
              <Link href={`/${encodeURIComponent(fan)}`}>
                <button className="btn-ghost text-sm">
                  <Layers size={16} />
                  <span>{strings.result.chooseTopic}</span>
                </button>
              </Link>
              <Link href="/statistika">
                <button className="btn-ghost text-sm text-emerald-600 dark:text-emerald-400">
                  <BarChart2 size={16} />
                  <span>{strings.nav.stats}</span>
                </button>
              </Link>
            </div>
          </motion.div>

          {/* Xatolar ustida ishlash / To'g'ri javoblarni ko'rsatish */}
          {wrong.length > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/10">
                <h3 className="text-sm font-bold uppercase tracking-wider text-rose-500 flex items-center gap-2">
                  <XCircle size={18} />
                  {strings.result.wrongAnswers} ({wrong.length})
                </h3>
                <span className="text-xs text-slate-500">
                  {lang === "uz" ? "Tarixiy tushuntirishlar" : "Пояснения к ошибкам"}
                </span>
              </div>

              <div className="space-y-3">
                {wrong.map((w, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="glass p-5 rounded-2xl border-l-4 border-l-rose-500 space-y-3"
                  >
                    <p className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-snug">
                      {w.savol}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center gap-2 font-semibold">
                        <XCircle size={16} className="shrink-0" />
                        <span>{strings.result.yourAnswer}: {w.sizniki}</span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center gap-2 font-bold">
                        <CheckCircle2 size={16} className="shrink-0" />
                        <span>{strings.result.correctIs}: {w.togri}</span>
                      </div>
                    </div>

                    {w.izoh && (
                      <div className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        💡 <strong>{lang === "uz" ? "Tarixiy fakt" : "Исторический факт"}:</strong> {w.izoh}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="glass p-8 text-center rounded-3xl border-2 border-emerald-500/30">
              <CheckCircle2 size={40} className="text-emerald-500 mx-auto mb-2" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {lang === "uz" ? "Birorta ham xato yo'q!" : "Ни одной ошибки!"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {lang === "uz" ? "Mavzuni to'liq va a'lo darajada o'zlashtirgansiz." : "Вы отлично усвоили тему."}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
