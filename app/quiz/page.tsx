"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Lightbulb, ArrowRight, Home } from "lucide-react";
import { useQuizStore } from "@/lib/quiz-store";

const LETTERS = ["A", "B", "C", "D", "E", "F"];

export default function QuizPage() {
  const router = useRouter();
  const { fan, mavzu, quiz, index, score, answer, nextQuestion } = useQuizStore();

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

  if (!fan || quiz.length === 0) return null;

  const q = quiz[index];
  const total = quiz.length;
  const isLast = index === total - 1;
  const progress = ((index) / total) * 100;

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
    if (!answered) return "option-btn";
    if (i === correctIdx) return "option-btn correct";
    if (i === chosenIdx && chosenIdx !== correctIdx) return "option-btn wrong";
    return "option-btn";
  };

  return (
    <main style={{ maxWidth: "680px", margin: "0 auto", padding: "24px 16px 60px" }}>
      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
        <button
          onClick={() => router.push("/")}
          className="btn-ghost"
          style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 14px", fontSize: "0.85rem" }}
        >
          <Home size={14} /> Bosh sahifa
        </button>
        <div style={{ color: "var(--text-secondary)", fontSize: "0.85rem", fontWeight: 600 }}>
          <span style={{ color: "var(--text-primary)", fontWeight: 700 }}>{score}</span> ball •{" "}
          {index + 1} / {total}
        </div>
      </div>

      {/* Progress bar */}
      <div className="progress-track" style={{ marginBottom: "32px" }}>
        <motion.div
          className="progress-fill"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.3 }}
        >
          {/* Fan + Mavzu tag */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
            <span
              style={{
                background: "rgba(245,200,66,0.1)",
                border: "1px solid rgba(245,200,66,0.25)",
                borderRadius: "8px",
                padding: "3px 10px",
                fontSize: "0.75rem",
                color: "#f5c842",
                fontWeight: 600,
              }}
            >
              {fan}
            </span>
            <span
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                padding: "3px 10px",
                fontSize: "0.75rem",
                color: "var(--text-secondary)",
              }}
            >
              {mavzu}
            </span>
          </div>

          {/* Question text */}
          <div
            className="glass"
            style={{ padding: "24px", marginBottom: "20px", borderRadius: "18px" }}
          >
            <p style={{ fontSize: "1.1rem", fontWeight: 600, lineHeight: 1.6, color: "var(--text-primary)" }}>
              {q.savol}
            </p>
          </div>

          {/* Options */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
            {q.order.map((opt, i) => (
              <motion.button
                key={i}
                className={getOptionClass(i)}
                onClick={() => handleAnswer(i)}
                disabled={answered}
                whileHover={!answered ? { x: 4 } : {}}
                whileTap={!answered ? { scale: 0.98 } : {}}
              >
                <span className="option-letter">{LETTERS[i]}</span>
                <span style={{ flex: 1 }}>{opt.v}</span>
                {answered && i === correctIdx && (
                  <CheckCircle2 size={20} style={{ color: "var(--correct)", flexShrink: 0 }} />
                )}
                {answered && i === chosenIdx && i !== correctIdx && (
                  <XCircle size={20} style={{ color: "var(--wrong)", flexShrink: 0 }} />
                )}
              </motion.button>
            ))}
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {showExplain && q.izoh && (
              <motion.div
                initial={{ opacity: 0, y: 10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                style={{
                  background: "rgba(79,142,247,0.08)",
                  border: "1px solid rgba(79,142,247,0.25)",
                  borderRadius: "14px",
                  padding: "14px 18px",
                  marginBottom: "16px",
                  display: "flex",
                  gap: "10px",
                  alignItems: "flex-start",
                }}
              >
                <Lightbulb size={18} style={{ color: "var(--accent-blue)", flexShrink: 0, marginTop: "1px" }} />
                <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: 1.6 }}>
                  {q.izoh}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Next button */}
          <AnimatePresence>
            {answered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <button
                  className="btn-primary"
                  onClick={handleNext}
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
                >
                  {isLast ? "Natijani ko'rish" : "Keyingi savol"}
                  <ArrowRight size={18} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
