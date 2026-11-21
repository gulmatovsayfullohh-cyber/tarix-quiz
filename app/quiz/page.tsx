"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  Lightbulb,
  ArrowRight,
  Home,
  Timer,
  Award,
  Sparkles,
} from "lucide-react";
import { useQuizStore } from "@/lib/quiz-store";
import { useSettingsStore } from "@/lib/settings-store";
import { t } from "@/lib/translations";
import Navbar from "@/components/Navbar";

const ABCD = ["A", "B", "C", "D", "E", "F"];

// Kahoot/Gimkit ranglari
const OPT_COLORS = [
  "opt-a hover:border-rose-500",
  "opt-b hover:border-blue-500",
  "opt-c hover:border-amber-500",
  "opt-d hover:border-emerald-500",
];

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

export default function QuizPage() {
  const router = useRouter();
  const { lang } = useSettingsStore();
  const strings = t[lang];

  const {
    fan,
    mavzu,
    quiz,
    index,
    score,
    elapsedSeconds,
    answer,
    nextQuestion,
    updateTimer,
    finishQuiz,
  } = useQuizStore();

  const [answered, setAnswered] = useState(false);
  const [chosenIdx, setChosenIdx] = useState<number | null>(null);
  const [correctIdx, setCorrectIdx] = useState<number | null>(null);
  const [showExplain, setShowExplain] = useState(false);

  // Redirect if no quiz loaded
  useEffect(() => {
    if (!fan || quiz.length === 0) {
      router.push("/");
    }
  }, [fan, quiz, router]);

  // Jonli sekundamer (har 1 soniyada yangilanadi)
  useEffect(() => {
    if (!fan || quiz.length === 0) return;
    const interval = setInterval(() => {
      updateTimer();
    }, 1000);
    return () => clearInterval(interval);
  }, [fan, quiz.length, updateTimer]);

  if (!fan || quiz.length === 0) return null;

  const q = quiz[index];
  const total = quiz.length;
  const isLast = index === total - 1;
  const progress = ((index + 1) / total) * 100;

  const handleAnswer = (i: number) => {
    if (answered) return;
    const result = answer(i);
    setChosenIdx(i);
    setCorrectIdx(result.correctIndex);
    setAnswered(true);
    if (q.izoh) setShowExplain(true);
  };

  const handleNext = () => {
    if (isLast) {
      finishQuiz();
      router.push("/natija");
    } else {
      nextQuestion();
      setAnswered(false);
      setChosenIdx(null);
      setCorrectIdx(null);
      setShowExplain(false);
    }
  };

  const getOptionClass = (i: number): string => {
    const baseColor = OPT_COLORS[i % OPT_COLORS.length];
    if (!answered) return `quiz-opt-btn ${baseColor}`;
    if (i === correctIdx) return `quiz-opt-btn ${baseColor} correct`;
    if (i === chosenIdx && chosenIdx !== correctIdx) return `quiz-opt-btn ${baseColor} wrong`;
    return `quiz-opt-btn ${baseColor} opacity-50`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-6 sm:py-10">
        {/* Top Info Bar (Sekundamer + Ball + Hisob) */}
        <div className="glass p-3.5 sm:p-4 rounded-2xl mb-5 flex items-center justify-between gap-3 shadow-md">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
          >
            <Home size={15} />
            <span className="hidden sm:inline">{strings.quiz.home}</span>
          </button>

          {/* Sekundamer (Jonli vaqt) */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-700 dark:text-violet-300 font-mono font-bold text-sm sm:text-base">
            <Timer size={18} className="animate-pulse text-violet-600 dark:text-violet-400" />
            <span>{formatTime(elapsedSeconds)}</span>
          </div>

          {/* Ball & Savol raqami */}
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <Award size={16} />
              {score} {strings.quiz.score}
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-violet-600 dark:text-violet-400 font-extrabold">
              {index + 1} / {total}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="progress-track mb-6">
          <motion.div
            className="progress-fill"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>

        {/* Question Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="space-y-5"
          >
            {/* Fan & Mavzu Badges */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="px-3 py-1 rounded-full font-bold bg-violet-600 text-white shadow-sm shadow-violet-600/30">
                {fan}
              </span>
              <span className="px-3 py-1 rounded-full font-medium bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300 truncate max-w-xs sm:max-w-md">
                {mavzu}
              </span>
            </div>

            {/* Savol kartasi (Gimkit/Kahoot katta shinam quti) */}
            <div className="liquid-border p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xl text-center">
              <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-relaxed">
                {q.savol}
              </h2>
              <p className="text-xs text-slate-400 mt-2 font-medium">
                {strings.quiz.selectAnswer}
              </p>
            </div>

            {/* ABCD Variantlar (Figuralar o'rniga aniq ABCD) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {q.order.map((opt, i) => (
                <motion.button
                  key={i}
                  className={getOptionClass(i)}
                  onClick={() => handleAnswer(i)}
                  disabled={answered}
                  whileHover={!answered ? { scale: 1.01 } : {}}
                  whileTap={!answered ? { scale: 0.99 } : {}}
                >
                  {/* Qat'iy harf (A, B, C, D) */}
                  <span className="quiz-letter">{ABCD[i]}</span>
                  <span className="flex-1 text-sm sm:text-base text-slate-800 dark:text-slate-100">
                    {opt.v}
                  </span>
                  {answered && i === correctIdx && (
                    <CheckCircle2 size={24} className="text-emerald-500 shrink-0 animate-bounce" />
                  )}
                  {answered && i === chosenIdx && i !== correctIdx && (
                    <XCircle size={24} className="text-rose-500 shrink-0" />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Izoh / Tushuntirish */}
            <AnimatePresence>
              {showExplain && q.izoh && (
                <motion.div
                  initial={{ opacity: 0, y: 10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3"
                >
                  <Lightbulb size={20} className="text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
                      {strings.quiz.explanation}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {q.izoh}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Keyingi savolga o'tish tugmasi */}
            {answered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="pt-2"
              >
                <button
                  onClick={handleNext}
                  className="btn-primary w-full text-base py-3.5 shadow-lg shadow-violet-600/30"
                >
                  <span>{isLast ? strings.quiz.finish : strings.quiz.next}</span>
                  <ArrowRight size={20} />
                </button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
