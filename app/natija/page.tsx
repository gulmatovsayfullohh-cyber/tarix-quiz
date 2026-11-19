"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Trophy, XCircle, CheckCircle2, RotateCcw, Layers, Home } from "lucide-react";
import { useQuizStore } from "@/lib/quiz-store";
import { getSavollar } from "@/lib/questions";

function getEmoji(pct: number) {
  if (pct >= 90) return "🏆";
  if (pct >= 70) return "⭐";
  if (pct >= 50) return "👍";
  return "💪";
}

function getMessage(pct: number) {
  if (pct >= 90) return "Ajoyib! Siz bu mavzuni zo'r o'zlashtirgansiz!";
  if (pct >= 70) return "Yaxshi natija! Biroz ko'proq takrorlasangiz yanada yaxshi bo'ladi.";
  if (pct >= 50) return "Qoniqarli. Mavzuni yana bir bor o'qib chiqing.";
  return "Yana urinib ko'ring! Takrorlash muvaffaqiyat siri.";
}

function getColor(pct: number) {
  if (pct >= 90) return "#f5c842";
  if (pct >= 70) return "#22c55e";
  if (pct >= 50) return "#4f8ef7";
  return "#ef4444";
}

export default function NatijaPage() {
  const router = useRouter();
  const { fan, mavzu, score, wrong, totalCount, setFan, setMavzu, startQuiz } = useQuizStore();

  // Natijani Supabase'ga saqlash
  useEffect(() => {
    if (!fan || !mavzu || !totalCount) return;
    fetch("/api/results", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ fan, mavzu, score, total: totalCount }),
    }).catch(() => {}); // xato bo'lsa jimgina o'tadi
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!fan) router.push("/");
  }, [fan, router]);

  if (!fan || !mavzu) return null;

  const pct = Math.round((score / totalCount) * 100);
  const color = getColor(pct);
  const circumference = 2 * Math.PI * 54; // radius=54
  const offset = circumference - (pct / 100) * circumference;

  const handleAgain = () => {
    const questions = getSavollar(fan, mavzu);
    startQuiz(questions, totalCount);
    router.push("/quiz");
  };

  return (
    <main style={{ maxWidth: "680px", margin: "0 auto", padding: "32px 16px 80px" }}>
      {/* Back home */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <button className="btn-ghost" style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "32px" }}>
            <Home size={14} /> Bosh sahifa
          </button>
        </Link>
      </motion.div>

      {/* Score card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass"
        style={{ padding: "36px 28px", textAlign: "center", marginBottom: "24px", borderRadius: "24px" }}
      >
        {/* SVG ring */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
          <div style={{ position: "relative", width: "132px", height: "132px" }}>
            <svg width="132" height="132" viewBox="0 0 132 132">
              <circle cx="66" cy="66" r="54" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
              <motion.circle
                cx="66"
                cy="66"
                r="54"
                fill="none"
                stroke={color}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                style={{ transformOrigin: "center", rotate: "-90deg" }}
              />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: "1.8rem", fontWeight: 800, color }}>{pct}%</span>
              <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{score}/{totalCount}</span>
            </div>
          </div>
        </div>

        <div style={{ fontSize: "2.5rem", marginBottom: "8px" }}>{getEmoji(pct)}</div>
        <h1 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "8px" }}>
          {score} ball to&apos;pladingiz
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", maxWidth: "320px", margin: "0 auto 28px" }}>
          {getMessage(pct)}
        </p>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
          <button
            className="btn-primary"
            onClick={handleAgain}
            style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.9rem", padding: "12px 20px" }}
          >
            <RotateCcw size={16} /> Qayta yechish
          </button>
          <Link href={`/${encodeURIComponent(fan)}`} style={{ textDecoration: "none" }}>
            <button
              className="btn-ghost"
              style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 20px", fontSize: "0.9rem" }}
            >
              <Layers size={16} /> Boshqa mavzu
            </button>
          </Link>
        </div>
      </motion.div>

      {/* Wrong answers */}
      {wrong.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <XCircle size={18} style={{ color: "var(--wrong)" }} />
            Xatolar ustida ishlash
            <span
              style={{
                background: "rgba(239,68,68,0.15)",
                border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: "8px",
                padding: "2px 10px",
                fontSize: "0.8rem",
                color: "var(--wrong)",
              }}
            >
              {wrong.length} ta
            </span>
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {wrong.map((w, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.06 }}
                className="glass"
                style={{ padding: "18px 20px", borderRadius: "16px" }}
              >
                <p style={{ fontWeight: 600, marginBottom: "12px", fontSize: "0.95rem", lineHeight: 1.5 }}>
                  {w.savol}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem" }}>
                    <XCircle size={15} style={{ color: "var(--wrong)", flexShrink: 0 }} />
                    <span style={{ color: "var(--wrong)" }}>Sizniki: </span>
                    <span style={{ color: "var(--text-secondary)" }}>{w.sizniki}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem" }}>
                    <CheckCircle2 size={15} style={{ color: "var(--correct)", flexShrink: 0 }} />
                    <span style={{ color: "var(--correct)" }}>To&apos;g&apos;ri: </span>
                    <span style={{ color: "var(--text-secondary)" }}>{w.togri}</span>
                  </div>
                </div>
                {w.izoh && (
                  <p style={{ color: "var(--text-secondary)", fontSize: "0.82rem", marginTop: "10px", padding: "8px 12px", background: "rgba(79,142,247,0.06)", borderRadius: "8px", lineHeight: 1.6 }}>
                    💡 {w.izoh}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Perfect score */}
      {wrong.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{
            textAlign: "center",
            padding: "24px",
            background: "rgba(34,197,94,0.08)",
            border: "1px solid rgba(34,197,94,0.25)",
            borderRadius: "16px",
          }}
        >
          <Trophy size={28} style={{ color: "#22c55e", marginBottom: "8px" }} />
          <p style={{ color: "#22c55e", fontWeight: 600 }}>
            Barcha savollarga to&apos;g&apos;ri javob berdingiz! 🎉
          </p>
        </motion.div>
      )}
    </main>
  );
}
