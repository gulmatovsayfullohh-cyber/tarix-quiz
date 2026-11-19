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
  SlidersHorizontal,
  Landmark,
  Globe2,
  KeyRound,
  ShieldCheck,
  ArrowLeft,
  Sparkles,
  HelpCircle,
  Eye,
  EyeOff,
  Filter,
} from "lucide-react";
import Link from "next/link";

interface Question {
  id?: string;
  fan: string;
  mavzu: string;
  savol: string;
  variantlar: string[];
  javob: number;
  izoh: string;
  sinf: number;
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
  const [token, setToken] = useState("");
  const [tokenInput, setTokenInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFanFilter, setSelectedFanFilter] = useState<string>("ALL");
  const [modal, setModal] = useState<{ open: boolean; q: Omit<Question, "id"> & { id?: string } }>({
    open: false,
    q: { ...EMPTY_Q },
  });
  const [deleting, setDeleting] = useState<string | null>(null);

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
        setError("Kiritilgan token noto'g'ri. Iltimos qaytadan urinib ko'ring.");
        setToken("");
        localStorage.removeItem("admin_token");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setQuestions(Array.isArray(data) ? data : []);
    } catch {
      setError("Savollarni yuklashda xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!tokenInput.trim()) return;
    localStorage.setItem("admin_token", tokenInput.trim());
    setToken(tokenInput.trim());
    fetchQuestions(tokenInput.trim());
  };

  const showSuccess = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(""), 3500);
  };

  const saveQuestion = async () => {
    const q = modal.q;
    if (!q.savol.trim() || !q.mavzu.trim()) {
      setError("Iltimos, savol matni va mavzuni to'ldiring.");
      return;
    }
    if (q.variantlar.some((v) => !v.trim())) {
      setError("Iltimos, barcha 4 ta variantni to'ldiring.");
      return;
    }

    setLoading(true);
    setError("");
    const method = q.id ? "PUT" : "POST";
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
      showSuccess(q.id ? "Savol muvaffaqiyatli yangilandi" : "Yangi savol muvaffaqiyatli qo'shildi");
      fetchQuestions(token);
    } catch {
      setError("Server bilan aloqa uzildi.");
    } finally {
      setLoading(false);
    }
  };

  const deleteQuestion = async (id: string) => {
    if (!confirm("Haqiqatan ham bu savolni o'chirmoqchimisiz?")) return;
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
      showSuccess("Savol o'chirildi");
      fetchQuestions(token);
    } catch {
      setError("O'chirishda xatolik yuz berdi.");
    } finally {
      setDeleting(null);
    }
  };

  const openEdit = (q: Question) =>
    setModal({ open: true, q: { ...q, variantlar: [...q.variantlar] } });

  const openAdd = () =>
    setModal({ open: true, q: { ...EMPTY_Q, variantlar: ["", "", "", ""] } });

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

  // ==========================================
  // LOGIN SCREEN (MINIMALIST + LIQUID GLASS EDGE)
  // ==========================================
  if (!token) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="liquid-border w-full max-w-md p-8 md:p-10 relative z-10"
        >
          {/* Top subtle badge */}
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/"
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft size={14} />
              Bosh sahifa
            </Link>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-400/10 text-amber-300 border border-amber-400/20">
              <ShieldCheck size={12} />
              Himoyalangan
            </span>
          </div>

          {/* Logo & Icon */}
          <div className="text-center mb-8">
            <div className="relative inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400/20 via-slate-800 to-slate-900 border border-white/10 shadow-lg shadow-black/40 mb-4">
              <KeyRound size={24} className="text-amber-400" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
              Boshqaruv Paneli
            </h1>
            <p className="text-xs md:text-sm text-slate-400 max-w-xs mx-auto leading-relaxed">
              Tarix Quiz savollari va natijalarini boshqarish uchun admin tokenni kiriting
            </p>
          </div>

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 mb-5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2"
            >
              <AlertCircle size={15} className="shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Admin Token
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="Tokenni kiriting..."
                  className="modern-input pr-10"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                  Tekshirilmoqda...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn size={16} />
                  Tizimga kirish
                </span>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-[11px] text-slate-500">
            Standart token: <code className="text-slate-400 bg-white/5 px-1.5 py-0.5 rounded">tarix-admin-2024</code>
          </p>
        </motion.div>
      </main>
    );
  }

  // ==========================================
  // MAIN ADMIN DASHBOARD
  // ==========================================
  return (
    <main className="max-w-6xl mx-auto px-4 py-8 pb-28">
      {/* Top Bar / Navigation */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2.5 text-xs text-slate-400 mb-1">
            <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
              <ArrowLeft size={13} /> Asosiy sayt
            </Link>
            <span>/</span>
            <span className="text-amber-400/90 font-medium">Boshqaruv</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            Admin Panel
            <span className="text-xs px-2 py-0.5 rounded-md bg-amber-400/10 text-amber-300 border border-amber-400/20 font-medium">
              V2.0
            </span>
          </h1>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <Link href="/statistika" style={{ textDecoration: "none" }}>
            <button className="btn-ghost">
              <BarChart2 size={16} className="text-sky-400" />
              <span>Statistika</span>
            </button>
          </Link>
          <button
            onClick={openAdd}
            className="btn-primary"
          >
            <Plus size={17} />
            <span>Savol qo&apos;shish</span>
          </button>
          <button
            onClick={() => {
              localStorage.removeItem("admin_token");
              setToken("");
              setQuestions([]);
            }}
            className="btn-ghost text-rose-400 hover:text-rose-300 hover:border-rose-500/30"
            title="Chiqish"
          >
            Chiqish
          </button>
        </div>
      </header>

      {/* Mini Stats Banner (Minimalist Liquid Glass) */}
      <section className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4 mb-8">
        <div className="glass p-4 rounded-xl flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shrink-0">
            <HelpCircle size={20} />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-400">Jami savollar</div>
            <div className="text-xl font-bold text-white tracking-tight">{questions.length} ta</div>
          </div>
        </div>

        <div className="glass p-4 rounded-xl flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-sky-400/10 border border-sky-400/20 flex items-center justify-center text-sky-400 shrink-0">
            <BookOpen size={20} />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-400">Mavzular soni</div>
            <div className="text-xl font-bold text-white tracking-tight">{uniqueMavzularCount} ta</div>
          </div>
        </div>

        <div className="glass p-4 rounded-xl col-span-2 sm:col-span-1 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400 shrink-0">
            <Sparkles size={20} />
          </div>
          <div>
            <div className="text-xs font-medium text-slate-400">Fanlar to&apos;plami</div>
            <div className="text-xl font-bold text-white tracking-tight">{uniqueFans.length || 2} ta</div>
          </div>
        </div>
      </section>

      {/* Search and Filters Bar */}
      <div className="glass p-3 md:p-4 rounded-2xl mb-8 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Savol yoki mavzuni qidirish..."
            className="modern-input pl-10 pr-8 py-2 text-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedFanFilter("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              selectedFanFilter === "ALL"
                ? "bg-white text-slate-950 font-semibold shadow"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            Barchasi ({questions.length})
          </button>
          {uniqueFans.map((fan) => (
            <button
              key={fan}
              onClick={() => setSelectedFanFilter(fan)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedFanFilter === fan
                  ? "bg-amber-400 text-slate-950 font-semibold shadow"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {fan.includes("O'zbekiston") ? <Landmark size={12} /> : <Globe2 size={12} />}
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
            className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-sm flex items-center gap-3"
          >
            <AlertCircle size={18} className="shrink-0 text-rose-400" />
            <span className="flex-1">{error}</span>
            <button onClick={() => setError("")} className="text-rose-400 hover:text-rose-200">
              <X size={16} />
            </button>
          </motion.div>
        )}
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm flex items-center gap-3"
          >
            <CheckCircle2 size={18} className="shrink-0 text-emerald-400" />
            <span className="flex-1 font-medium">{success}</span>
            <button onClick={() => setSuccess("")} className="text-emerald-400 hover:text-emerald-200">
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      {loading ? (
        <div className="py-24 text-center">
          <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-400">Savollar bazasi yuklanmoqda...</p>
        </div>
      ) : grouped.length === 0 ? (
        <div className="glass p-12 text-center rounded-2xl">
          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 mx-auto mb-3">
            <Search size={22} />
          </div>
          <h3 className="text-base font-semibold text-white mb-1">Savollar topilmadi</h3>
          <p className="text-xs text-slate-400 mb-4 max-w-sm mx-auto">
            Qidiruv so&apos;zini o&apos;zgartirib ko&apos;ring yoki yangi savol qo&apos;shing.
          </p>
          <button onClick={openAdd} className="btn-primary text-xs">
            <Plus size={15} /> Yangi savol qo&apos;shish
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {grouped.map((group) => (
            <div key={group.fan} className="space-y-6">
              {/* Fan Title Badge */}
              <div className="flex items-center gap-2.5 pb-2 border-b border-white/5">
                <div className="p-1.5 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/20">
                  {group.fan.includes("O'zbekiston") ? <Landmark size={16} /> : <Globe2 size={16} />}
                </div>
                <h2 className="text-lg font-bold text-white tracking-tight">{group.fan}</h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-slate-400 font-medium">
                  {group.mavzular.reduce((acc, m) => acc + m.items.length, 0)} ta savol
                </span>
              </div>

              {/* Mavzular ro'yxati */}
              <div className="space-y-6">
                {group.mavzular.map((m) => (
                  <div key={m.mavzu} className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400 pl-1">
                      <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        {m.mavzu}
                      </span>
                      <span>{m.items.length} ta savol</span>
                    </div>

                    {/* Savollar Kartochkalari */}
                    <div className="grid grid-cols-1 gap-2.5">
                      {m.items.map((q, idx) => (
                        <motion.div
                          key={q.id || idx}
                          layout
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="glass p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 group"
                        >
                          <div className="flex-1 min-w-0 pr-2">
                            <div className="flex items-start gap-2.5">
                              <span className="text-xs font-mono text-slate-500 mt-0.5">#{idx + 1}</span>
                              <div className="space-y-1">
                                <p className="text-sm font-medium text-slate-100 leading-snug">
                                  {q.savol}
                                </p>
                                <div className="flex items-center gap-2 flex-wrap text-xs">
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                                    <CheckCircle2 size={11} />
                                    To&apos;g&apos;ri: {q.variantlar[q.javob]}
                                  </span>
                                  {q.izoh && (
                                    <span className="text-slate-400 truncate max-w-xs md:max-w-md text-[11px]">
                                      💡 {q.izoh}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center">
                            <button
                              onClick={() => openEdit(q)}
                              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/5 hover:border-white/20 transition-all"
                              title="Tahrirlash"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => q.id && deleteQuestion(q.id)}
                              disabled={deleting === q.id}
                              className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all"
                              title="O'chirish"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ==========================================
          MODAL (TAHRIRLASH / YANGI SAVOL QO'SHISH)
         ========================================== */}
      <AnimatePresence>
        {modal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="liquid-border w-full max-w-xl max-h-[92vh] overflow-y-auto p-6 md:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    {modal.q.id ? <Pencil size={18} className="text-amber-400" /> : <Plus size={18} className="text-amber-400" />}
                    {modal.q.id ? "Savolni tahrirlash" : "Yangi savol qo'shish"}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Tarix darsligi asosida to&apos;g&apos;ri ma&apos;lumotlarni kiriting
                  </p>
                </div>
                <button
                  onClick={() => setModal({ open: false, q: { ...EMPTY_Q } })}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form Content */}
              <div className="space-y-4">
                {/* Fan & Sinf */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Fan
                    </label>
                    <select
                      value={modal.q.fan}
                      onChange={(e) => setModal((m) => ({ ...m, q: { ...m.q, fan: e.target.value } }))}
                      className="modern-input"
                    >
                      <option value="O'zbekiston tarixi">O&apos;zbekiston tarixi</option>
                      <option value="Jahon tarixi">Jahon tarixi</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Sinf
                    </label>
                    <select
                      value={modal.q.sinf || 8}
                      onChange={(e) => setModal((m) => ({ ...m, q: { ...m.q, sinf: Number(e.target.value) } }))}
                      className="modern-input"
                    >
                      <option value={8}>8-sinf</option>
                      <option value={9}>9-sinf</option>
                      <option value={10}>10-sinf</option>
                      <option value={11}>11-sinf</option>
                    </select>
                  </div>
                </div>

                {/* Mavzu */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Mavzu nomi
                  </label>
                  <input
                    type="text"
                    value={modal.q.mavzu}
                    onChange={(e) => setModal((m) => ({ ...m, q: { ...m.q, mavzu: e.target.value } }))}
                    placeholder="Masalan: XIII asr boshlarida Xorazm davlati"
                    className="modern-input"
                  />
                </div>

                {/* Savol matni */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Savol matni
                  </label>
                  <textarea
                    rows={3}
                    value={modal.q.savol}
                    onChange={(e) => setModal((m) => ({ ...m, q: { ...m.q, savol: e.target.value } }))}
                    placeholder="Savol matnini bu yerga yozing..."
                    className="modern-input resize-y"
                  />
                </div>

                {/* Variantlar */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Variantlar (To&apos;g&apos;ri javobni tanlang)
                    </label>
                    <span className="text-[11px] text-amber-400/90 font-medium">
                      ✓ tugmasini bosing
                    </span>
                  </div>

                  <div className="space-y-2">
                    {modal.q.variantlar.map((v, i) => {
                      const isCorrect = modal.q.javob === i;
                      const letter = ["A", "B", "C", "D"][i];
                      return (
                        <div
                          key={i}
                          className={`flex items-center gap-2 p-1.5 rounded-xl border transition-all ${
                            isCorrect
                              ? "bg-emerald-500/10 border-emerald-500/30"
                              : "bg-white/[0.02] border-white/5"
                          }`}
                        >
                          <span
                            className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                              isCorrect
                                ? "bg-emerald-500 text-slate-950 font-extrabold"
                                : "bg-white/10 text-slate-300"
                            }`}
                          >
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
                            className="modern-input py-1.5 px-3 text-xs bg-transparent border-0 focus:ring-0 shadow-none"
                          />
                          <button
                            type="button"
                            onClick={() => setModal((m) => ({ ...m, q: { ...m.q, javob: i } }))}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                              isCorrect
                                ? "bg-emerald-500 text-slate-950 shadow-sm"
                                : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                            }`}
                          >
                            {isCorrect ? "✓ To'g'ri" : "Tanlash"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Izoh */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    Izoh / Tushuntirish (Ixtiyoriy)
                  </label>
                  <input
                    type="text"
                    value={modal.q.izoh}
                    onChange={(e) => setModal((m) => ({ ...m, q: { ...m.q, izoh: e.target.value } }))}
                    placeholder="O'quvchi xato qilganda chiqadigan izoh..."
                    className="modern-input"
                  />
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
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
    </main>
  );
}
