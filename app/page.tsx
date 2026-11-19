"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Globe, ChevronRight, Zap, Target, Trophy } from "lucide-react";
import { getFanlar, getSavollarSoni, getMavzular } from "@/lib/questions";

const FAN_CONFIG: Record<string, { icon: React.ReactNode; color: string; gradient: string; desc: string }> = {
  "O'zbekiston tarixi": {
    icon: <BookOpen size={28} />,
    color: "#f5c842",
    gradient: "linear-gradient(135deg, #f5c842, #ff9f43)",
    desc: "O'rta Osiyo va O'zbekiston tarixi: davlatlar, shaxslar, voqealar",
  },
  "Jahon tarixi": {
    icon: <Globe size={28} />,
    color: "#4f8ef7",
    gradient: "linear-gradient(135deg, #4f8ef7, #a855f7)",
    desc: "Inqiloblar, urushlar, sivilizatsiyalar va jahon tarixiy voqealari",
  },
};

const STATS = [
  { icon: <Zap size={18} />, label: "Tezkor test", desc: "Har savol bor-yo'g'i 4 variant" },
  { icon: <Target size={18} />, label: "Xatolar tahlili", desc: "Noto'g'ri javoblarni ko'rib chiqing" },
  { icon: <Trophy size={18} />, label: "Ball tizimi", desc: "O'z natijangizni kuzating" },
];

export default function HomePage() {
  const fanlar = getFanlar();

  return (
    <main className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-4 pt-20 pb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span
            style={{
              background: "rgba(245,200,66,0.12)",
              border: "1px solid rgba(245,200,66,0.3)",
              borderRadius: "999px",
              padding: "6px 18px",
              fontSize: "0.8rem",
              color: "#f5c842",
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              display: "inline-block",
              marginBottom: "24px",
            }}
          >
            8-sinf • Tarix fanlari
          </span>

          <h1
            className="gradient-text"
            style={{ fontSize: "clamp(2.4rem, 6vw, 4rem)", fontWeight: 800, lineHeight: 1.1, marginBottom: "16px" }}
          >
            Tarix Quiz
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", maxWidth: "480px", margin: "0 auto 48px" }}>
            Mavzuni o&apos;qib bo&apos;ldingizmi? Bilimingizni interaktiv testlar orqali sinab ko&apos;ring!
          </p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          style={{ display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center", marginBottom: "64px" }}
        >
          {STATS.map((s, i) => (
            <div
              key={i}
              className="glass"
              style={{ padding: "12px 20px", display: "flex", alignItems: "center", gap: "10px", borderRadius: "14px" }}
            >
              <span style={{ color: "var(--accent-gold)" }}>{s.icon}</span>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>{s.label}</div>
                <div style={{ color: "var(--text-secondary)", fontSize: "0.75rem" }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Fan cards */}
      <section
        style={{
          maxWidth: "800px",
          width: "100%",
          margin: "0 auto",
          padding: "0 16px 80px",
        }}
      >
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ color: "var(--text-secondary)", fontSize: "0.85rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "20px" }}
        >
          Fanni tanlang
        </motion.h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
          {fanlar.map((fan, i) => {
            const cfg = FAN_CONFIG[fan] || { icon: <BookOpen size={28} />, color: "#f5c842", gradient: "linear-gradient(135deg,#f5c842,#ff9f43)", desc: "" };
            const mavzuCount = getMavzular(fan).length;
            const savolCount = getSavollarSoni(fan);

            return (
              <motion.div
                key={fan}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              >
                <Link href={`/${encodeURIComponent(fan)}`} style={{ textDecoration: "none" }}>
                  <div
                    className="glass"
                    style={{
                      padding: "28px",
                      cursor: "pointer",
                      position: "relative",
                      overflow: "hidden",
                      borderRadius: "20px",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                      (e.currentTarget as HTMLDivElement).style.boxShadow = `0 20px 40px ${cfg.color}22`;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                      (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                    }}
                  >
                    {/* Glow */}
                    <div
                      style={{
                        position: "absolute",
                        top: "-40px",
                        right: "-40px",
                        width: "120px",
                        height: "120px",
                        borderRadius: "50%",
                        background: `radial-gradient(circle, ${cfg.color}20 0%, transparent 70%)`,
                        pointerEvents: "none",
                      }}
                    />

                    {/* Icon */}
                    <div
                      style={{
                        width: "56px",
                        height: "56px",
                        borderRadius: "16px",
                        background: cfg.gradient,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#0a0f1e",
                        marginBottom: "20px",
                      }}
                    >
                      {cfg.icon}
                    </div>

                    <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "8px", color: "var(--text-primary)" }}>
                      {fan}
                    </h2>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "20px", lineHeight: 1.5 }}>
                      {cfg.desc}
                    </p>

                    {/* Meta */}
                    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                      <span
                        style={{
                          background: `${cfg.color}18`,
                          border: `1px solid ${cfg.color}40`,
                          borderRadius: "8px",
                          padding: "4px 12px",
                          fontSize: "0.8rem",
                          color: cfg.color,
                          fontWeight: 600,
                        }}
                      >
                        {mavzuCount} mavzu
                      </span>
                      <span style={{ color: "var(--text-secondary)", fontSize: "0.82rem" }}>
                        {savolCount} ta savol
                      </span>
                      <ChevronRight size={18} style={{ color: cfg.color, marginLeft: "auto" }} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
