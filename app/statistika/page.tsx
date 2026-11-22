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
  Timer,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useSettingsStore } from "@/lib/settings-store";
import { ruPlural, uzPlural, t } from "@/lib/translations";

interface Result {
  id: string;
  fan: string;
  mavzu: string;
  score: number;
  total: number;
  time_spent?: number;
  taken_at: string;
}

interface StatCard {
  fan: string;
  mavzu: string;
  count: number;
  avgPct: number;
  best: number;
}

function formatDuration(totalSeconds?: number): string {
  if (!totalSeconds) return "—";
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  if (mins > 0) return `${mins}m ${secs}s`;
  return `${secs}s`;
}

export default function StatsPage() {
  const { lang } = useSettingsStore();
  const strings = t[lang];

  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [tokenInput, setTokenInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetchStats();
  }, [lang]);

  const fetchStats = async (_tok?: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/results");
      if (res.status === 401) {
        setToken("");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
      setToken("session");
    } catch {
      setError(lang === "uz" ? "Statistikani yuklashda xatolik yuz berdi." : "Ошибка загрузки статистики.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!tokenInput.trim()) return;
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/session", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token: tokenInput }),
    });
    if (!res.ok) {
      setError(lang === "uz" ? "Noto'g'ri token kiritildi!" : "Неверный токен!");
      setLoading(false);
      return;
    }
    setToken("session");
    setTokenInput("");
    await fetchStats();
  };

  // Hisoblar
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
    if (p >= 90) return "#10b981";
    if (p >= 70) return "#3b82f6";
    if (p >= 50) return "#f59e0b";
    return "#ef4444";
  }

  // LOGIN SCREEN
  if (!token) {
    return (
      <div className="min-h-screen flex flex-col bg-(--bg) text-(--text)">
        <Navbar />
        <main className="section-space flex-1">
          <div className="site-container">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="liquid-border w-full max-w-md p-8 sm:p-10 bg-white dark:bg-slate-900 shadow-2xl relative z-10"
            >
              <div className="flex items-center justify-between mb-8">
                <Link
                  href="/"
                  className="text-xs font-semibold text-slate-500 hover:text-violet-600 dark:text-slate-400 dark:hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <ArrowLeft size={14} />
                  {strings.quiz.home}
                </Link>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck size={12} />
                  {lang === "uz" ? "Natijalar" : "Результаты"}
                </span>
              </div>

              <div className="text-center mb-8">
                <div className="relative inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-linear-to-tr from-emerald-600 to-teal-500 text-white shadow-lg shadow-emerald-500/30 mb-4">
                  <BarChart2 size={26} />
                </div>
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
                  {strings.stats.title}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                  {lang === "uz"
                    ? "O'quvchilar natijalarini ko'rish uchun token kiriting"
                    : "Введите токен для просмотра результатов тестирования"}
                </p>
              </div>

              {error && (
                <div className="p-3 mb-5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
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
                    placeholder={lang === "uz" ? "Admin tokenini kiriting" : "Введите токен администратора"}
                    className="modern-input pr-10"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <button type="submit" className="btn-primary w-full">
                  <LogIn size={16} /> {lang === "uz" ? "Kirish" : "Войти"}
                </button>
              </form>
            </motion.div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-(--bg) text-(--text)">
      <Navbar />

      <main className="section-space flex-1">
        <div className="site-container">
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                <Link href="/" className="hover:text-violet-600 dark:hover:text-white flex items-center gap-1">
                  <ArrowLeft size={13} /> {strings.quiz.home}
                </Link>
                <span>/</span>
                <Link href="/admin" className="hover:text-violet-600 dark:hover:text-white">
                  Admin
                </Link>
                <span>/</span>
                <span className="text-emerald-600 dark:text-emerald-400">{strings.nav.stats}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
                {strings.stats.title}
              </h1>
            </div>

            <div className="flex items-center gap-2.5">
              <Link href="/admin">
                <button className="btn-ghost">{strings.nav.admin}</button>
              </Link>
              <button
                onClick={async () => {
                  await fetch("/api/admin/session", { method: "DELETE" });
                  setToken("");
                  setResults([]);
                }}
                className="btn-ghost text-rose-500 hover:text-rose-600"
              >
                {strings.admin.logout}
              </button>
            </div>
          </header>

          {loading ? (
            <div className="py-24 text-center">
              <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {lang === "uz" ? "Statistika hisoblanmoqda..." : "Расчет статистики..."}
              </p>
            </div>
          ) : (
            <>
              {/* Top 4 ko'rsatkich */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
                {[
                  {
                    icon: <Target size={20} />,
                    label: strings.stats.totalAttempts,
                    value: totalSessions,
                    color: "text-blue-500",
                    bg: "bg-blue-500/10",
                  },
                  {
                    icon: <TrendingUp size={20} />,
                    label: strings.stats.avgScore,
                    value: `${avgScore}%`,
                    color: "text-emerald-500",
                    bg: "bg-emerald-500/10",
                  },
                  {
                    icon: <Trophy size={20} />,
                    label: strings.stats.perfectCount,
                    value: perfect,
                    color: "text-amber-500",
                    bg: "bg-amber-500/10",
                  },
                  {
                    icon: <BookOpen size={20} />,
                    label: strings.stats.coveredTopics,
                    value: statCards.length,
                    color: "text-violet-500",
                    bg: "bg-violet-500/10",
                  },
                ].map((c, i) => (
                  <div key={i} className="glass p-4 rounded-2xl flex items-center gap-3.5">
                    <div className={`w-10 h-10 rounded-xl ${c.bg} ${c.color} flex items-center justify-center shrink-0`}>
                      {c.icon}
                    </div>
                    <div>
                      <div className={`text-xl font-extrabold tracking-tight ${c.color}`}>{c.value}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{c.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mavzular kesimida */}
              {statCards.length > 0 && (
                <div className="space-y-4 mb-10">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/10">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-2">
                      <BarChart2 size={16} className="text-violet-600" />
                      {strings.stats.byTopic}
                    </h2>
                    <span className="text-xs text-slate-500">{lang === "uz" ? uzPlural(statCards.length, "mavzu") : ruPlural(statCards.length, "тема", "темы", "тем")}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {statCards.map((s, i) => (
                      <div key={i} className="glass p-4 rounded-2xl space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">{s.mavzu}</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{s.fan} · {lang === "uz" ? uzPlural(s.count, "topshirilgan") : ruPlural(s.count, "прохождение", "прохождения", "прохождений")}</p>
                          </div>
                          <span className="text-xs font-black px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-white/10" style={{ color: pctColor(s.avgPct) }}>
                            {s.avgPct}%
                          </span>
                        </div>

                        <div className="h-2 w-full bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                              width: `${s.avgPct}%`,
                              backgroundColor: pctColor(s.avgPct),
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* So'nggi testlar va sarflangan vaqt */}
              {recent.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/10">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-2">
                      <Calendar size={16} className="text-sky-500" />
                      {strings.stats.recent}
                    </h2>
                  </div>

                  <div className="glass rounded-2xl divide-y divide-slate-200 dark:divide-white/10 overflow-hidden">
                    {recent.map((r) => {
                      const pct = Math.round((r.score / r.total) * 100);
                      const date = new Date(r.taken_at);
                      return (
                        <div key={r.id} className="p-4 flex items-center justify-between gap-3 text-xs hover:bg-slate-100/50 dark:hover:bg-white/2 transition-colors">
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="w-12 font-black text-center py-1 rounded-lg bg-slate-100 dark:bg-white/10" style={{ color: pctColor(pct) }}>
                              {pct}%
                            </span>
                            <div className="truncate">
                              <div className="font-bold text-slate-900 dark:text-white truncate">{r.mavzu}</div>
                              <div className="text-slate-500 text-[11px]">{r.fan}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-right shrink-0">
                            {r.time_spent ? (
                              <div className="flex items-center gap-1 font-mono font-bold text-violet-600 dark:text-violet-400">
                                <Timer size={13} />
                                <span>{formatDuration(r.time_spent)}</span>
                              </div>
                            ) : null}
                            <div>
                              <div className="text-slate-800 dark:text-slate-200 font-bold">{r.score}/{r.total} to&apos;g&apos;ri</div>
                              <div className="text-slate-400 text-[10px]">
                                {date.toLocaleDateString("uz-UZ")} {date.toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" })}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
