"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, BookMarked, ChevronRight } from "lucide-react";
import { getMavzular, getSavollarSoni } from "@/lib/questions";

export default function FanContent({ fan }: { fan: string }) {
  const fanDecoded = decodeURIComponent(fan);
  const mavzular = getMavzular(fanDecoded);

  return (
    <main style={{ maxWidth: "720px", margin: "0 auto", padding: "32px 16px 80px" }}>
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
        <Link href="/" style={{ textDecoration: "none" }}>
          <button className="btn-ghost" style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "32px" }}>
            <ArrowLeft size={16} /> Orqaga
          </button>
        </Link>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.82rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "8px" }}>
          Fan
        </p>
        <h1 className="gradient-text" style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "32px" }}>
          {fanDecoded}
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginBottom: "24px" }}>
          Mavzulardan birini tanlang
        </p>
      </motion.div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {mavzular.map((mavzu, i) => {
          const count = getSavollarSoni(fanDecoded, mavzu);
          return (
            <motion.div
              key={mavzu}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.07 }}
            >
              <Link
                href={`/${encodeURIComponent(fanDecoded)}/${encodeURIComponent(mavzu)}`}
                style={{ textDecoration: "none" }}
              >
                <div
                  className="glass"
                  style={{
                    padding: "18px 20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    borderRadius: "16px",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = "translateX(6px)";
                    (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(245,200,66,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = "translateX(0)";
                    (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.08)";
                  }}
                >
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "10px",
                      background: "rgba(245,200,66,0.12)",
                      border: "1px solid rgba(245,200,66,0.25)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#f5c842",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      flexShrink: 0,
                    }}
                  >
                    {i + 1}
                  </div>

                  <BookMarked size={18} style={{ color: "var(--text-secondary)", flexShrink: 0 }} />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: "0.95rem", marginBottom: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {mavzu}
                    </div>
                    <div style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>
                      {count} ta savol
                    </div>
                  </div>

                  <ChevronRight size={18} style={{ color: "var(--text-secondary)", flexShrink: 0 }} />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </main>
  );
}
