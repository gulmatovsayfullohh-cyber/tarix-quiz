"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  LogIn,
  X,
  Save,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  BarChart2,
  Search,
  Landmark,
  Globe2,
  KeyRound,
  ShieldCheck,
  ArrowLeft,
  Sparkles,
  HelpCircle,
  Eye,
  EyeOff,
  CloudUpload,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useSettingsStore } from "@/lib/settings-store";
import { t } from "@/lib/translations";
import { getFanlar, getMavzular } from "@/lib/questions";
import { LOCAL_QUESTIONS } from "@/lib/questionsLocal";

interface Question {
  id?: string;
  fan: string;
  mavzu: string;
  savol: string;
  variantlar: string[];
  javob: number;
  izoh: string;
  sinf: number;
  isLocal?: boolean;
}

const EMPTY_Q: Omit<Question, "id"> = {
  fan: "O'zbekiston tarixi",
  mavzu: "",
  savol: "",
  variantlar: ["", "", "", ""],
  javob: 0,
  izoh: "",
  sinf: 8,
};

export default function AdminPage() {
  const { lang } = useSettingsStore();
  const strings = t[lang];

  const [token, setToken] = useState("");
  const [tokenInput, setTokenInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFanFilter, setSelectedFanFilter] = useState<string>("ALL");
  const [modal, setModal] = useState<{ open: boolean; q: Omit<Question, "id"> & { id?: string } }>({
    open: false,
    q: { ...EMPTY_Q },
  });
  const [deleting, setDeleting] = useState<string | null>(null);
  const [customTopicMode, setCustomTopicMode] = useState(false);

  // Load saved token
  useEffect(() => {
    const saved = localStorage.getItem("admin_token") || "";
    if (saved) {
      setToken(saved);
      fetchQuestions(saved);
    }
  }, []);

  const fetchQuestions = useCallback(async (tok: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/questions", {
        headers: { "x-admin-token": tok },
      });
      if (res.status === 401) {
        setError(lang === "uz" ? "Token noto'g'ri. Qaytadan urinib ko'ring." : "Неверный токен. Попробуйте снова.");
        setToken("");
        localStorage.removeItem("admin_token");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setQuestions(Array.isArray(data) ? data : []);
    } catch {
      setError(lang === "uz" ? "Savollarni yuklashda xatolik." : "Ошибка при загрузке вопросов.");
    } finally {
      setLoading(false);
    }
  }, [lang]);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!tokenInput.trim()) return;
    localStorage.setItem("admin_token", tokenInput.trim());
    setToken(tokenInput.trim());
    fetchQuestions(tokenInput.trim());
  };

  const showSuccess = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 4000);
  };

  // Seed / Sync to Supabase
  const handleSyncToSupabase = async () => {
    setSyncing(true);
    setError("");
    try {
      const res = await fetch("/api/admin/seed", {
        method: "POST",
        headers: { "x-admin-token": token },
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Sinxronlashda xatolik yuz berdi.");
      } else {
        showSuccess(data.message || "Barcha savollar Supabase bazasiga yuklandi!");
        fetchQuestions(token);
      }
    } catch {
      setError("Serverga ulanishda xatolik yuz berdi.");
    } finally {
      setSyncing(false);
    }
  };

  const saveQuestion = async () => {
    const q = modal.q;
    if (!q.savol.trim() || !q.mavzu.trim()) {
      setError(lang === "uz" ? "Savol matni va mavzuni to'ldiring." : "Заполните текст вопроса и тему.");
      return;
    }
    if (q.variantlar.some((v) => !v.trim())) {
      setError(lang === "uz" ? "Barcha 4 ta variantni to'ldiring." : "Заполните все 4 варианта.");
      return;
    }

    setLoading(true);
    setError("");
    const method = q.id && !String(q.id).startsWith("local-") ? "PUT" : "POST";
    try {
      const res = await fetch("/api/admin/questions", {
        method,
        headers: { "content-type": "application/json", "x-admin-token": token },
        body: JSON.stringify(q),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setError(d.error || "Saqlashda xato yuz berdi!");
        setLoading(false);
        return;
      }
      setModal({ open: false, q: { ...EMPTY_Q } });
      showSuccess(q.id ? "Savol yangilandi ✓" : "Yangi savol qo'shildi ✓");
      fetchQuestions(token);
    } catch {
      setError("Server bilan aloqa uzildi.");
    } finally {
      setLoading(false);
    }
  };

  const deleteQuestion = async (id: string) => {
    if (!confirm(lang === "uz" ? "Haqiqatan ham bu savolni o'chirmoqchimisiz?" : "Вы действительно хотите удалить этот вопрос?")) return;
    setDeleting(id);
    try {
      const res = await fetch("/api/admin/questions", {
        method: "DELETE",
        headers: { "content-type": "application/json", "x-admin-token": token },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        setError("O'chirishda xatolik yuz berdi.");
        return;
      }
      showSuccess("Savol o'chirildi ✓");
      fetchQuestions(token);
    } catch {
      setError("O'chirishda xatolik yuz berdi.");
    } finally {
      setDeleting(null);
    }
  };

  const openEdit = (q: Question) => {
    setCustomTopicMode(false);
    setModal({ open: true, q: { ...q, variantlar: [...q.variantlar] } });
  };

  const openAdd = () => {
    setCustomTopicMode(false);
    const firstFan = getFanlar()[0] || EMPTY_Q.fan;
    const firstTopic = getMavzular(firstFan)[0] || "";
    setModal({
      open: true,
      q: { ...EMPTY_Q, fan: firstFan, mavzu: firstTopic, variantlar: ["", "", "", ""] },
    });
  };

  // Filterlangan savollar
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const matchFan = selectedFanFilter === "ALL" || q.fan === selectedFanFilter;
      const matchSearch =
        searchQuery === "" ||
        q.savol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.mavzu.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.variantlar.some((v) => v.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchFan && matchSearch;
    });
  }, [questions, selectedFanFilter, searchQuery]);

  // Guruhlangan
  const grouped = useMemo(() => {
    const fans = [...new Set(filteredQuestions.map((q) => q.fan))];
    return fans.map((fan) => {
      const fanQuestions = filteredQuestions.filter((q) => q.fan === fan);
      const mavzular = [...new Set(fanQuestions.map((q) => q.mavzu))];
      return {
        fan,
        mavzular: mavzular.map((mavzu) => ({
          mavzu,
          items: fanQuestions.filter((q) => q.mavzu === mavzu),
        })),
      };
    });
  }, [filteredQuestions]);

  const uniqueFans = useMemo(() => [...new Set(questions.map((q) => q.fan))], [questions]);
  const uniqueMavzularCount = useMemo(() => new Set(questions.map((q) => q.mavzu)).size, [questions]);
  const hasLocalQuestions = useMemo(() => questions.some((q) => q.isLocal), [questions]);

  // ==========================================
  // LOGIN SCREEN
  // ==========================================
  if (!token) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
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
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
                <ShieldCheck size={13} />
                {lang === "uz" ? "Himoyalangan" : "Защищено"}
              </span>
            </div>

            <div className="text-center mb-8">
              <div className="relative inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-linear-to-tr from-violet-600 to-indigo-500 text-white shadow-lg shadow-violet-500/30 mb-4">
                <KeyRound size={26} />
              </div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
                Visola psi • {strings.admin.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                {lang === "uz" ? "Boshqaruv paneliga kirish uchun token kiriting" : "Введите токен для входа в панель управления"}
              </p>
            </div>

            {error && (
              <div className="p-3 mb-5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Admin Token
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    placeholder="tarix-admin-2024"
                    className="modern-input pr-10"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw size={16} className="animate-spin" />
                    {lang === "uz" ? "Tekshirilmoqda..." : "Проверка..."}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <LogIn size={16} />
                    {lang === "uz" ? "Tizimga kirish" : "Войти в систему"}
                  </span>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-[11px] text-slate-400 dark:text-slate-500">
              Standart token: <code className="text-violet-600 dark:text-violet-400 font-bold bg-violet-500/10 px-1.5 py-0.5 rounded">tarix-admin-2024</code>
            </p>
          </motion.div>
        </main>
      </div>
    );
  }

  // ==========================================
  // MAIN ADMIN DASHBOARD
  // ==========================================
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors">
      <Navbar />

      <main className="section-space flex-1">
        <div className="site-container">
          {/* Sync to Supabase Banner (Agar lokal savollar bo'lsa) */}
          {hasLocalQuestions && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold shrink-0">
                  <CloudUpload size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {lang === "uz" ? "Lokal savollar yuklangan (Supabase bo'sh)" : "Загружены локальные вопросы (Supabase пуст)"}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {lang === "uz"
                      ? `Barcha ${LOCAL_QUESTIONS.length} ta savolni Supabase doimiy bazasiga 1 bosishda saqlab qo'yishingiz mumkin.`
                      : `Вы можете сохранить все ${LOCAL_QUESTIONS.length} вопросов в постоянную базу Supabase в 1 клик.`}
                  </p>
                </div>
              </div>
              <button
                onClick={handleSyncToSupabase}
                disabled={syncing}
                className="btn-primary text-xs whitespace-nowrap bg-linear-to-r from-amber-500 to-orange-500 shadow-amber-500/30"
              >
                {syncing ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    {lang === "uz" ? "Yuklanmoqda..." : "Загрузка..."}
                  </>
                ) : (
                  <>
                    <CloudUpload size={14} />
                    {lang === "uz" ? "Supabase'ga yuklash" : "Загрузить в Supabase"}
                  </>
                )}
              </button>
            </motion.div>
          )}

          {/* Top Header */}
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                <Link href="/" className="hover:text-violet-600 dark:hover:text-white flex items-center gap-1">
                  <ArrowLeft size={13} /> {strings.quiz.home}
                </Link>
                <span>/</span>
                <span className="text-violet-600 dark:text-violet-400">{strings.admin.title}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
                {strings.admin.title}
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 font-bold border border-violet-500/20">
                  Visola psi
                </span>
              </h1>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <Link href="/statistika">
                <button className="btn-ghost">
                  <BarChart2 size={16} className="text-emerald-500" />
                  <span>{strings.nav.stats}</span>
                </button>
              </Link>
              <button onClick={openAdd} className="btn-primary">
                <Plus size={17} />
                <span>{strings.admin.addQuestion}</span>
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem("admin_token");
                  setToken("");
                  setQuestions([]);
                }}
                className="btn-ghost text-rose-500 hover:text-rose-600"
                title="Chiqish"
              >
                {strings.admin.logout}
              </button>
            </div>
          </header>

          {/* Mini Stats Banner */}
          <section className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-8">
            <div className="glass p-4 rounded-2xl flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-600 dark:text-violet-400 shrink-0">
                <HelpCircle size={20} />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">{strings.admin.totalQuestions}</div>
                <div className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">{questions.length} ta</div>
              </div>
            </div>

            <div className="glass p-4 rounded-2xl flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
                <BookOpen size={20} />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">{strings.admin.totalTopics}</div>
                <div className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">{uniqueMavzularCount} ta</div>
              </div>
            </div>

            <div className="glass p-4 rounded-2xl col-span-2 sm:col-span-1 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                <Sparkles size={20} />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">{strings.admin.totalSubjects}</div>
                <div className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">{uniqueFans.length || 2} ta</div>
              </div>
            </div>
          </section>

          {/* Search & Filter Bar */}
          <div className="glass p-3 sm:p-4 rounded-2xl mb-8 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={strings.admin.searchPlaceholder}
                className="modern-input pl-10 pr-8 py-2 text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setSelectedFanFilter("ALL")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedFanFilter === "ALL"
                    ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/5"
                }`}
              >
                {lang === "uz" ? "Barchasi" : "Все"} ({questions.length})
              </button>
              {uniqueFans.map((fan) => (
                <button
                  key={fan}
                  onClick={() => setSelectedFanFilter(fan)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    selectedFanFilter === fan
                      ? "bg-violet-600 text-white shadow-md shadow-violet-600/30"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/5"
                  }`}
                >
                  {fan.includes("O'zbekiston") ? <Landmark size={13} /> : <Globe2 size={13} />}
                  {fan}
                </button>
              ))}
            </div>
          </div>

          {/* Alerts */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-sm flex items-center gap-3"
              >
                <AlertCircle size={18} className="shrink-0" />
                <span className="flex-1 font-medium">{error}</span>
                <button onClick={() => setError("")}><X size={16} /></button>
              </motion.div>
            )}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-sm flex items-center gap-3"
              >
                <CheckCircle2 size={18} className="shrink-0" />
                <span className="flex-1 font-bold">{success}</span>
                <button onClick={() => setSuccess("")}><X size={16} /></button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Questions grouped */}
          {loading ? (
            <div className="py-24 text-center">
              <RefreshCw size={28} className="animate-spin text-violet-600 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                {lang === "uz" ? "Savollar yuklanmoqda..." : "Загрузка вопросов..."}
              </p>
            </div>
          ) : grouped.length === 0 ? (
            <div className="glass p-12 text-center rounded-3xl">
              <div className="w-14 h-14 rounded-2xl bg-violet-500/10 text-violet-600 flex items-center justify-center mx-auto mb-3">
                <Search size={26} />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                {strings.admin.emptyState}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 max-w-sm mx-auto">
                {strings.admin.emptyStateDesc}
              </p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <button onClick={openAdd} className="btn-primary text-xs">
                  <Plus size={15} /> {strings.admin.addQuestion}
                </button>
                <button onClick={handleSyncToSupabase} disabled={syncing} className="btn-ghost text-xs">
                  <CloudUpload size={15} /> {strings.admin.syncLocal}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-10">
              {grouped.map((group) => (
                <div key={group.fan} className="space-y-6">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200 dark:border-white/10">
                    <div className="p-1.5 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
                      {group.fan.includes("O'zbekiston") ? <Landmark size={18} /> : <Globe2 size={18} />}
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">{group.fan}</h2>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300 font-bold">
                      {group.mavzular.reduce((acc, m) => acc + m.items.length, 0)} {lang === "uz" ? "ta savol" : "вопросов"}
                    </span>
                  </div>

                  <div className="space-y-6">
                    {group.mavzular.map((m) => (
                      <div key={m.mavzu} className="space-y-3">
                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pl-1 font-semibold">
                          <span className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                            <span className="w-2 h-2 rounded-full bg-violet-600" />
                            {m.mavzu}
                          </span>
                          <span>{m.items.length} {lang === "uz" ? "ta savol" : "вопросов"}</span>
                        </div>

                        <div className="grid grid-cols-1 gap-2.5">
                          {m.items.map((q, idx) => (
                            <div
                              key={q.id || idx}
                              className="glass p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                            >
                              <div className="flex-1 min-w-0 pr-2">
                                <div className="flex items-start gap-3">
                                  <span className="text-xs font-mono font-bold text-slate-400 mt-0.5">#{idx + 1}</span>
                                  <div className="space-y-1">
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white leading-snug">
                                      {q.savol}
                                    </p>
                                    <div className="flex items-center gap-2 flex-wrap text-xs">
                                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold">
                                        <CheckCircle2 size={12} />
                                        {["A", "B", "C", "D"][q.javob]}: {q.variantlar[q.javob]}
                                      </span>
                                      {q.izoh && (
                                        <span className="text-slate-500 dark:text-slate-400 text-[11px] truncate max-w-sm">
                                          💡 {q.izoh}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                                <button
                                  onClick={() => openEdit(q)}
                                  className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition-colors"
                                  title="Tahrirlash"
                                >
                                  <Pencil size={15} />
                                </button>
                                <button
                                  onClick={() => q.id && deleteQuestion(q.id)}
                                  disabled={deleting === q.id}
                                  className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition-colors"
                                  title="O'chirish"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Modal: Tahrirlash / Yangi savol */}
          <AnimatePresence>
            {modal.open && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="liquid-border w-full max-w-xl max-h-[92vh] overflow-y-auto p-6 sm:p-8 bg-white dark:bg-slate-900 shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-white/10 mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        {modal.q.id ? <Pencil size={18} className="text-violet-600" /> : <Plus size={18} className="text-violet-600" />}
                        {modal.q.id ? "Savolni tahrirlash" : "Yangi savol qo'shish"}
                      </h3>
                    </div>
                    <button
                      onClick={() => setModal({ open: false, q: { ...EMPTY_Q } })}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                          Fan
                        </label>
                        <select
                          value={modal.q.fan}
                          onChange={(e) => {
                            const fan = e.target.value;
                            const firstTopic = getMavzular(fan)[0] || "";
                            setCustomTopicMode(false);
                            setModal((m) => ({ ...m, q: { ...m.q, fan, mavzu: firstTopic } }));
                          }}
                          className="modern-input"
                        >
                          {getFanlar().map((fan) => (
                            <option key={fan} value={fan}>{fan}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                          Sinf
                        </label>
                        <select
                          value={modal.q.sinf || 8}
                          onChange={(e) => setModal((m) => ({ ...m, q: { ...m.q, sinf: Number(e.target.value) } }))}
                          className="modern-input"
                        >
                          <option value={8}>{lang === "uz" ? "8-sinf" : "8 класс"}</option>
                          <option value={9}>{lang === "uz" ? "9-sinf" : "9 класс"}</option>
                          <option value={10}>{lang === "uz" ? "10-sinf" : "10 класс"}</option>
                          <option value={11}>{lang === "uz" ? "11-sinf" : "11 класс"}</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Mavzu
                        </label>
                        <button
                          type="button"
                          onClick={() => setCustomTopicMode((value) => !value)}
                          className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                        >
                          {customTopicMode ? "Mavzulardan tanlash" : "+ Yangi mavzu"}
                        </button>
                      </div>
                      {customTopicMode ? (
                        <input
                          type="text"
                          value={modal.q.mavzu}
                          onChange={(e) => setModal((m) => ({ ...m, q: { ...m.q, mavzu: e.target.value } }))}
                          placeholder="Yangi mavzu nomini kiriting"
                          className="modern-input"
                          autoFocus
                        />
                      ) : (
                        <select
                          value={modal.q.mavzu}
                          onChange={(e) => setModal((m) => ({ ...m, q: { ...m.q, mavzu: e.target.value } }))}
                          className="modern-input"
                        >
                          {[...new Set([
                            ...getMavzular(modal.q.fan),
                            ...questions.filter((q) => q.fan === modal.q.fan).map((q) => q.mavzu),
                          ])].map((topic) => (
                            <option key={topic} value={topic}>{topic}</option>
                          ))}
                        </select>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                        Savol matni
                      </label>
                      <textarea
                        rows={3}
                        value={modal.q.savol}
                        onChange={(e) => setModal((m) => ({ ...m, q: { ...m.q, savol: e.target.value } }))}
                        placeholder="Savol matni..."
                        className="modern-input resize-y"
                      />
                    </div>

                    {/* ABCD Variantlar */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                          Variantlar (To&apos;g&apos;ri javobni tanlang)
                        </label>
                        <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                          ✓ Bosib belgilang
                        </span>
                      </div>

                      <div className="space-y-2">
                        {modal.q.variantlar.map((v, i) => {
                          const isCorrect = modal.q.javob === i;
                          const letter = ["A", "B", "C", "D"][i];
                          const letterColors = [
                            "bg-rose-500 text-white",
                            "bg-blue-600 text-white",
                            "bg-amber-500 text-white",
                            "bg-emerald-600 text-white",
                          ];
                          return (
                            <div
                              key={i}
                              className={`flex items-center gap-2 p-2 rounded-xl border-2 transition-all ${
                                isCorrect
                                  ? "border-emerald-500 bg-emerald-500/10"
                                  : "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5"
                              }`}
                            >
                              <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-extrabold text-sm shrink-0 ${letterColors[i]}`}>
                                {letter}
                              </span>
                              <input
                                type="text"
                                value={v}
                                onChange={(e) => {
                                  const newVars = [...modal.q.variantlar];
                                  newVars[i] = e.target.value;
                                  setModal((m) => ({ ...m, q: { ...m.q, variantlar: newVars } }));
                                }}
                                placeholder={`${letter} varianti...`}
                                className="modern-input py-1 px-3 text-xs bg-transparent border-0 focus:ring-0"
                              />
                              <button
                                type="button"
                                onClick={() => setModal((m) => ({ ...m, q: { ...m.q, javob: i } }))}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                  isCorrect
                                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30"
                                    : "bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                                }`}
                              >
                                {isCorrect ? "✓ To'g'ri" : "Tanlash"}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                        Izoh / Tushuntirish (Ixtiyoriy)
                      </label>
                      <input
                        type="text"
                        value={modal.q.izoh}
                        onChange={(e) => setModal((m) => ({ ...m, q: { ...m.q, izoh: e.target.value } }))}
                        placeholder="Qo'shimcha tarixiy fakt..."
                        className="modern-input"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-white/10">
                      <button
                        type="button"
                        onClick={() => setModal({ open: false, q: { ...EMPTY_Q } })}
                        className="btn-ghost"
                      >
                        Bekor qilish
                      </button>
                      <button
                        type="button"
                        onClick={saveQuestion}
                        disabled={loading}
                        className="btn-primary"
                      >
                        <Save size={16} />
                        {loading ? "Saqlanmoqda..." : "Saqlash"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
