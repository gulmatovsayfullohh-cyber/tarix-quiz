"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart2, Trophy, Target, TrendingUp, BookOpen, Calendar, AlertCircle,
} from "lucide-react";
import Link from "next/link";

interface Result {
  id: string;
  fan: string;
  mavzu: string;
  score: number;
  total: number;
  taken_at: string;
}

interface StatCard {
  fan: string;
  mavzu: string;
  count: number;
  avgPct: number;
  best: number;
}

export default function StatsPage() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [tokenInput, setTokenInput] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("admin_token") || "";
    setToken(saved);
  }, []);

  const fetchStats = async (tok: string) => {
    setLoading(true);
    setError("");
    const res = await fetch("/api/results", {
      headers: { "x-admin-token": tok },
    });
    if (res.status === 401) {
      setError("Noto'g'ri token!");
      setLoading(false);
      return;
    }
    const data = await res.json();
    setResults(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    if (token) fetchStats(token);
    else setLoading(false);
  }, [token]);

  const handleLogin = () => {
    localStorage.setItem("admin_token", tokenInput);
    setToken(tokenInput);
    fetchStats(tokenInput);
  };

  // ---- Hisob-kitoblar ----
  const totalSessions = results.length;
  const avgScore =
    totalSessions > 0
      ? Math.round(results.reduce((s, r) => s + (r.score / r.total) * 100, 0) / totalSessions)
      : 0;
  const perfect = results.filter((r) => r.score === r.total).length;

  // Mavzu bo'yicha guruhlash
  const byMavzu: Record<string, Result[]> = {};
  results.forEach((r) => {
    const key = `${r.fan}|||${r.mavzu}`;
    if (!byMavzu[key]) byMavzu[key] = [];
    byMavzu[key].push(r);
  });

  const statCards: StatCard[] = Object.entries(byMavzu)
    .map(([key, items]) => {
      const [fan, mavzu] = key.split("|||");
      const avgPct = Math.round(
        items.reduce((s, r) => s + (r.score / r.total) * 100, 0) / items.length
      );
      const best = Math.max(...items.map((r) => Math.round((r.score / r.total) * 100)));
      return { fan, mavzu, count: items.length, avgPct, best };
    })
    .sort((a, b) => b.count - a.count);

  // So'nggi 10 ta urinish
  const recent = [...results]
    .sort((a, b) => new Date(b.taken_at).getTime() - new Date(a.taken_at).getTime())
    .slice(0, 10);

  function pctColor(p: number) {
    if (p >= 90) return "#f5c842";
    if (p >= 70) return "#22c55e";
    if (p >= 50) return "#4f8ef7";
    return "#ef4444";
  }

  // ---- LOGIN ----
  if (!token) {
    return (
      <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass"
          style={{ padding: "40px", width: "100%", maxWidth: "400px", borderRadius: "24px", textAlign: "center" }}
        >
          <BarChart2 size={36} style={{ color: "var(--accent-gold)", margin: "0 auto 16px" }} />
          <h1 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: "8px" }}>Statistika</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.88rem", marginBottom: "24px" }}>
            Admin token kiriting
          </p>
          {error && (
            <div style={{ color: "#ef4444", fontSize: "0.85rem", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px", justifyContent: "center" }}>
              <AlertCircle size={15} /> {error}
            </div>
          )}
          <input
            type="password"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="Token..."
            style={{
              width: "100%", padding: "12px 14px", borderRadius: "10px",
              background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
              color: "var(--text-primary)", fontSize: "1rem", marginBottom: "12px", outline: "none",
              fontFamily: "var(--font-outfit)",
            }}
          />
          <button className="btn-primary" onClick={handleLogin} style={{ width: "100%" }}>
            Kirish
          </button>
        </motion.div>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px 16px 80px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 className="gradient-text" style={{ fontSize: "1.8rem", fontWeight: 800 }}>📊 Statistika</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
            Jami {totalSessions} ta urinish
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <Link href="/admin" style={{ textDecoration: "none" }}>
            <button className="btn-ghost">Admin panel</button>
          </Link>
          <Link href="/" style={{ textDecoration: "none" }}>
            <button className="btn-ghost">Bosh sahifa</button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "80px", color: "var(--text-secondary)" }}>Yuklanmoqda...</div>
      ) : (
        <>
          {/* Umumiy kartalar */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "32px" }}>
            {[
              { icon: <Target size={22} />, label: "Jami urinish", value: totalSessions, color: "#4f8ef7" },
              { icon: <TrendingUp size={22} />, label: "O'rtacha ball", value: `${avgScore}%`, color: "#22c55e" },
              { icon: <Trophy size={22} />, label: "100% natija", value: perfect, color: "#f5c842" },
              { icon: <BookOpen size={22} />, label: "Mavzular", value: statCards.length, color: "#a78bfa" },
            ].map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="glass"
                style={{ padding: "20px 24px", borderRadius: "18px", display: "flex", alignItems: "center", gap: "16px" }}
              >
                <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: `${c.color}1a`, display: "flex", alignItems: "center", justifyContent: "center", color: c.color, flexShrink: 0 }}>
                  {c.icon}
                </div>
                <div>
                  <div style={{ fontSize: "1.5rem", fontWeight: 800, color: c.color }}>{c.value}</div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", fontWeight: 500 }}>{c.label}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mavzu bo'yicha statistika */}
          {statCards.length > 0 && (
            <div style={{ marginBottom: "32px" }}>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                <BarChart2 size={18} style={{ color: "var(--accent-gold)" }} /> Mavzu bo'yicha
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {statCards.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="glass"
                    style={{ padding: "16px 20px", borderRadius: "16px" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px", flexWrap: "wrap", gap: "8px" }}>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: "0.9rem" }}>{s.mavzu}</p>
                        <p style={{ color: "var(--text-secondary)", fontSize: "0.76rem" }}>{s.fan} · {s.count} ta urinish</p>
                      </div>
                      <div style={{ display: "flex", gap: "10px" }}>
                        <span style={{ fontSize: "0.8rem", color: "#4f8ef7", background: "rgba(79,142,247,0.1)", padding: "4px 10px", borderRadius: "8px" }}>
                          O'rt: {s.avgPct}%
                        </span>
                        <span style={{ fontSize: "0.8rem", color: "#f5c842", background: "rgba(245,200,66,0.1)", padding: "4px 10px", borderRadius: "8px" }}>
                          Eng yaxshi: {s.best}%
                        </span>
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div style={{ height: "6px", background: "rgba(255,255,255,0.08)", borderRadius: "3px", overflow: "hidden" }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${s.avgPct}%` }}
                        transition={{ duration: 0.8, delay: 0.2 + i * 0.06 }}
                        style={{ height: "100%", borderRadius: "3px", background: `linear-gradient(90deg, ${pctColor(s.avgPct)}, ${pctColor(s.avgPct)}99)` }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* So'nggi urinishlar */}
          {recent.length > 0 && (
            <div>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                <Calendar size={18} style={{ color: "var(--accent-gold)" }} /> So'nggi urinishlar
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {recent.map((r, i) => {
                  const pct = Math.round((r.score / r.total) * 100);
                  const date = new Date(r.taken_at);
                  return (
                    <motion.div
                      key={r.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.04 }}
                      className="glass"
                      style={{ padding: "12px 18px", borderRadius: "12px", display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}
                    >
                      <span style={{ fontSize: "1.1rem", fontWeight: 800, color: pctColor(pct), minWidth: "52px" }}>
                        {pct}%
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: "0.85rem", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.mavzu}</p>
                        <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{r.fan}</p>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <p style={{ fontSize: "0.8rem", fontWeight: 600 }}>{r.score}/{r.total}</p>
                        <p style={{ fontSize: "0.72rem", color: "var(--text-secondary)" }}>
                          {date.toLocaleDateString("uz-UZ")} {date.toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {totalSessions === 0 && (
            <div style={{ textAlign: "center", padding: "80px", color: "var(--text-secondary)" }}>
              <BarChart2 size={48} style={{ opacity: 0.3, margin: "0 auto 16px" }} />
              <p>Hozircha statistika yo'q. Quiz yechilgach shu yerda ko'rinadi.</p>
            </div>
          )}
        </>
      )}
    </main>
  );
}
