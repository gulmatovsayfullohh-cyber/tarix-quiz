"use client";
import { use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Layers } from "lucide-react";
import { getSavollarSoni, getSavollar } from "@/lib/questions";
import { useQuizStore } from "@/lib/quiz-store";

interface Props {
  params: Promise<{ fan: string; mavzu: string }>;
}

const COUNT_OPTIONS = [5, 10, 15, 20, 30];

export default function MavzuPage({ params }: Props) {
  const { fan: fanEnc, mavzu: mavzuEnc } = use(params);
  const fan = decodeURIComponent(fanEnc);
  const mavzu = decodeURIComponent(mavzuEnc);
  const total = getSavollarSoni(fan, mavzu);
  const router = useRouter();
  const { setFan, setMavzu, startQuiz } = useQuizStore();

  const options = [...COUNT_OPTIONS.filter((n) => n < total), total];

  const handleStart = (count: number) => {
    setFan(fan);
    setMavzu(mavzu);
    const questions = getSavollar(fan, mavzu);
    startQuiz(questions, count);
    router.push("/quiz");
  };

  return (
    <main style={{ maxWidth: "600px", margin: "0 auto", padding: "32px 16px 80px" }}>
      {/* Back */}
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
        <Link href={`/${encodeURIComponent(fan)}`} style={{ textDecoration: "none" }}>
          <button className="btn-ghost" style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "32px" }}>
            <ArrowLeft size={16} /> Orqaga
          </button>
        </Link>
      </motion.div>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
          <Layers size={20} style={{ color: "var(--accent-gold)" }} />
          <span style={{ color: "var(--text-secondary)", fontSize: "0.82rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            {fan}
          </span>
        </div>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "8px", lineHeight: 1.3 }}>
          {mavzu}
        </h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: "40px", fontSize: "0.9rem" }}>
          Jami{" "}
          <strong style={{ color: "var(--accent-gold)" }}>{total} ta</strong>{" "}
          savol mavjud. Qancha yechmoqchisiz?
        </p>
      </motion.div>

      {/* Count options */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: "12px" }}
      >
        {options.map((n, i) => (
          <motion.button
            key={n}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            onClick={() => handleStart(n)}
            className="glass"
            style={{
              padding: "20px 12px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "6px",
              cursor: "pointer",
              border: n === total ? "1px solid rgba(245,200,66,0.4)" : "1px solid rgba(255,255,255,0.08)",
              borderRadius: "16px",
              fontFamily: "var(--font-outfit), sans-serif",
              color: "var(--text-primary)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(245,200,66,0.6)";
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-3px)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 10px 24px rgba(245,200,66,0.15)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = n === total ? "rgba(245,200,66,0.4)" : "rgba(255,255,255,0.08)";
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
            }}
          >
            <span style={{ fontSize: "1.8rem", fontWeight: 800, color: n === total ? "var(--accent-gold)" : "var(--text-primary)" }}>
              {n}
            </span>
            <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
              {n === total ? "Hammasi" : "ta savol"}
            </span>
          </motion.button>
        ))}
      </motion.div>
    </main>
  );
}
