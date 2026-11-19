"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart2,
  Trophy,
  Target,
  TrendingUp,
  BookOpen,
  Calendar,
  AlertCircle,
  ArrowLeft,
  ShieldCheck,
  KeyRound,
  Eye,
  EyeOff,
  LogIn,
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
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("admin_token") || "";
    if (saved) {
      setToken(saved);
      fetchStats(saved);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchStats = async (tok: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/results", {
        headers: { "x-admin-token": tok },
      });
      if (res.status === 401) {
        setError("Noto'g'ri token kiritildi!");
        setToken("");
        localStorage.removeItem("admin_token");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
    } catch {
      setError("Statistikani yuklashda xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!tokenInput.trim()) return;
    localStorage.setItem("admin_token", tokenInput.trim());
    setToken(tokenInput.trim());
    fetchStats(tokenInput.trim());
  };

  // ---- Hisob-kitoblar ----
  const totalSessions = results.length;
  const avgScore =
    totalSessions > 0
      ? Math.round(results.reduce((s, r) => s + (r.score / r.total) * 100, 0) / totalSessions)
      : 0;
  const perfect = results.filter((r) => r.score === r.total).length;

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

  const recent = [...results]
    .sort((a, b) => new Date(b.taken_at).getTime() - new Date(a.taken_at).getTime())
    .slice(0, 15);

  function pctColor(p: number) {
    if (p >= 90) return "#facc15";
    if (p >= 70) return "#10b981";
    if (p >= 50) return "#38bdf8";
    return "#f43f5e";
  }

  // ---- LOGIN VIEW ----
  if (!token) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="liquid-border w-full max-w-md p-8 md:p-10 relative z-10"
        >
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/"
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft size={14} />
              Bosh sahifa
            </Link>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-sky-400/10 text-sky-300 border border-sky-400/20">
              <ShieldCheck size={12} />
              Natijalar
            </span>
          </div>

          <div className="text-center mb-8">
            <div className="relative inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-400/20 via-slate-800 to-slate-900 border border-white/10 shadow-lg mb-4">
              <BarChart2 size={24} className="text-sky-400" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
              Statistika Paneli
            </h1>
            <p className="text-xs md:text-sm text-slate-400 max-w-xs mx-auto">
              O&apos;quvchilar natijalarini ko&apos;rish uchun admin tokenni kiriting
            </p>
          </div>

          {error && (
            <div className="p-3 mb-5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="Admin token..."
                className="modern-input pr-10"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <button type="submit" className="btn-primary w-full">
              <LogIn size={16} /> Kirish
            </button>
          </form>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 pb-28">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
              <ArrowLeft size={13} /> Asosiy sayt
            </Link>
            <span>/</span>
            <Link href="/admin" className="hover:text-white transition-colors">
              Admin
            </Link>
            <span>/</span>
            <span className="text-sky-400 font-medium">Statistika</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            Test Natijalari Tahlili
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/admin" style={{ textDecoration: "none" }}>
            <button className="btn-ghost">Admin panel</button>
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem("admin_token");
              setToken("");
            }}
            className="btn-ghost text-rose-400 hover:text-rose-300"
          >
            Chiqish
          </button>
        </div>
      </header>

      {loading ? (
        <div className="py-24 text-center">
          <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-400">Statistika hisoblanmoqda...</p>
        </div>
      ) : (
        <>
          {/* Top 4 Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
            {[
              {
                icon: <Target size={20} />,
                label: "Jami urinishlar",
                value: totalSessions,
                color: "text-sky-400",
                bg: "bg-sky-400/10",
                border: "border-sky-400/20",
              },
              {
                icon: <TrendingUp size={20} />,
                label: "O'rtacha o'zlashtirish",
                value: `${avgScore}%`,
                color: "text-emerald-400",
                bg: "bg-emerald-400/10",
                border: "border-emerald-400/20",
              },
              {
                icon: <Trophy size={20} />,
                label: "100% natija",
                value: perfect,
                color: "text-amber-400",
                bg: "bg-amber-400/10",
                border: "border-amber-400/20",
              },
              {
                icon: <BookOpen size={20} />,
                label: "Qamrab olingan mavzu",
                value: statCards.length,
                color: "text-indigo-400",
                bg: "bg-indigo-400/10",
                border: "border-indigo-400/20",
              },
            ].map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass p-4 rounded-xl flex items-center gap-3.5"
              >
                <div className={`w-10 h-10 rounded-xl ${c.bg} ${c.color} border ${c.border} flex items-center justify-center shrink-0`}>
                  {c.icon}
                </div>
                <div>
                  <div className={`text-xl font-bold tracking-tight ${c.color}`}>{c.value}</div>
                  <div className="text-xs text-slate-400">{c.label}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Mavzular reytingi */}
          {statCards.length > 0 && (
            <div className="space-y-4 mb-10">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <BarChart2 size={16} className="text-amber-400" />
                  Mavzular kesimida samaradorlik
                </h2>
                <span className="text-xs text-slate-500">{statCards.length} ta mavzu</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {statCards.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="glass p-4 rounded-xl space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-semibold text-slate-100 leading-snug">{s.mavzu}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">{s.fan} · {s.count} ta topshirilgan</p>
                      </div>
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-white/5 border border-white/10" style={{ color: pctColor(s.avgPct) }}>
                        {s.avgPct}%
                      </span>
                    </div>

                    {/* Progress track */}
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${s.avgPct}%`,
                          backgroundColor: pctColor(s.avgPct),
                        }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* So'nggi natijalar */}
          {recent.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Calendar size={16} className="text-sky-400" />
                  So&apos;nggi topshirilgan testlar
                </h2>
                <span className="text-xs text-slate-500">Oxirgi {recent.length} ta</span>
              </div>

              <div className="glass rounded-xl divide-y divide-white/5 overflow-hidden">
                {recent.map((r) => {
                  const pct = Math.round((r.score / r.total) * 100);
                  const date = new Date(r.taken_at);
                  return (
                    <div key={r.id} className="p-3.5 flex items-center justify-between gap-3 text-xs hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-10 font-bold text-center py-1 rounded bg-white/5" style={{ color: pctColor(pct) }}>
                          {pct}%
                        </span>
                        <div className="truncate">
                          <div className="font-medium text-slate-200 truncate">{r.mavzu}</div>
                          <div className="text-slate-500 text-[11px]">{r.fan}</div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-slate-300 font-semibold">{r.score}/{r.total} to&apos;g&apos;ri</div>
                        <div className="text-slate-500 text-[10px]">
                          {date.toLocaleDateString("uz-UZ")} {date.toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {totalSessions === 0 && (
            <div className="glass p-12 text-center rounded-2xl">
              <BarChart2 size={36} className="text-slate-500 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-white mb-1">Hozircha natijalar yo&apos;q</h3>
              <p className="text-xs text-slate-400">O&apos;quvchilar test yechishi bilan bu yerda batafsil tahlil paydo bo&apos;ladi.</p>
            </div>
          )}
        </>
      )}
    </main>
  );
}
