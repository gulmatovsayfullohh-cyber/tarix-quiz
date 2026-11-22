"use client";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
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
import { ruPlural, uzPlural, t } from "@/lib/translations";
import {
  getFanlar,
  getMavzular,
  LOCAL_QUESTION_OVERRIDES_KEY,
  mergeLocalQuestionOverrides,
  readLocalQuestionOverrides,
} from "@/lib/questions";
import { LOCAL_QUESTIONS } from "@/lib/questionsLocal";

interface Question {
  id?: string;
  fan: string;
  mavzu: string;
  savol: string;
  variantlar: string[];
  javob: number;
  izoh: string;
  sinf?: number;
  isLocal?: boolean;
}

const EMPTY_Q: Omit<Question, "id"> = {
  fan: "O'zbekiston tarixi",
  mavzu: "",
  savol: "",
  variantlar: ["", "", "", ""],
  javob: -1,
  izoh: "",
  sinf: 8,
};

function normalizeTopicName(value: string) {
  return value
    .normalize("NFC")
    .trim()
    .toLocaleLowerCase("uz-UZ")
    .replace(/[ʻʼ`´’‘]/g, "'")
    .replace(/\s+/g, " ");
}

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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const modalRef = useRef<HTMLDivElement>(null);
  const closeModalRef = useRef<() => void>(() => {});
  const saveLockRef = useRef(false);

  const fetchQuestions = useCallback(async (_tok?: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/questions");
      if (res.status === 401) {
        setToken("");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setQuestions(mergeLocalQuestionOverrides(Array.isArray(data) ? data : []));
      setToken("session");
    } catch {
      setError(lang === "uz" ? "Savollarni yuklashda xatolik." : "Ошибка при загрузке вопросов.");
    } finally {
      setLoading(false);
    }
  }, [lang]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const closeModal = (force = false) => {
    const hasDraft = Boolean(
      modal.q.savol.trim() ||
      modal.q.izoh.trim() ||
      modal.q.variantlar.some((variant) => variant.trim()) ||
      (customTopicMode && modal.q.mavzu.trim())
    );
    if (!force && hasDraft && !window.confirm(lang === "uz" ? "Kiritilgan ma'lumotlar yo'qoladi. Yopilsinmi?" : "Введённые данные будут потеряны. Закрыть?")) return;
    setModal({ open: false, q: { ...EMPTY_Q } });
    setCustomTopicMode(false);
    setFieldErrors({});
    setError("");
  };
  closeModalRef.current = () => closeModal();

  useEffect(() => {
    if (!modal.open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    modalRef.current?.querySelector<HTMLElement>("input, select, textarea")?.focus();

    const trapFocus = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeModalRef.current();
        return;
      }
      if (event.key !== "Tab" || !modalRef.current) return;
      const focusable = Array.from(modalRef.current.querySelectorAll<HTMLElement>(
        "button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href]"
      ));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", trapFocus);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", trapFocus);
    };
  }, [modal.open]);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!tokenInput.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token: tokenInput }),
      });
      if (!res.ok) {
        setError(lang === "uz" ? "Token noto'g'ri. Qaytadan urinib ko'ring." : "Неверный токен. Попробуйте снова.");
        setToken("");
        return;
      }
      setToken("session");
      setTokenInput("");
      await fetchQuestions();
    } finally {
      setLoading(false);
    }
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
      const res = await fetch("/api/admin/seed", { method: "POST" });
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
    const errors: Record<string, string> = {};
    if (!q.mavzu.trim()) errors.mavzu = lang === "uz" ? "Mavzuni tanlang yoki kiriting." : "Выберите или введите тему.";
    if (!q.savol.trim()) errors.savol = lang === "uz" ? "Savol matnini kiriting." : "Введите текст вопроса.";
    q.variantlar.forEach((value, index) => {
      if (!value.trim()) errors[`variant${index}`] = lang === "uz" ? "Variantni to'ldiring." : "Заполните вариант.";
    });
    if (!Number.isInteger(q.javob) || q.javob < 0 || q.javob > 3 || !q.variantlar[q.javob]?.trim()) {
      errors.javob = lang === "uz" ? "To'g'ri javobni tanlang." : "Выберите правильный ответ.";
    }
    setFieldErrors(errors);
    if (Object.keys(errors).length) {
      setError(lang === "uz" ? "Belgilangan maydonlarni tekshiring." : "Проверьте выделенные поля.");
      return;
    }
    if (saveLockRef.current) return;
    saveLockRef.current = true;

    const matchingTopic = questions.find((item) =>
      item.fan === q.fan &&
      (item.sinf || 8) === (q.sinf || 8) &&
      normalizeTopicName(item.mavzu) === normalizeTopicName(q.mavzu)
    );
    const payload = {
      ...q,
      fan: q.fan.trim(),
      mavzu: matchingTopic?.mavzu ?? q.mavzu.normalize("NFC").trim().replace(/\s+/g, " "),
      savol: q.savol.trim(),
      variantlar: q.variantlar.map((value) => value.trim()),
      izoh: q.izoh.trim(),
      sinf: q.sinf || 8,
    };
    setLoading(true);
    setError("");
    const localMode = questions.length > 0 && questions.every((item) => item.isLocal);
    const method = q.id && !String(q.id).startsWith("local-") ? "PUT" : "POST";
    try {
      if (localMode) {
        const overrides = readLocalQuestionOverrides();
        const localQuestion: Question = {
          ...payload,
          id: q.id || `local-custom-${Date.now()}`,
          isLocal: true,
        };
        const nextOverrides = [
          ...overrides.filter((item) => item.id !== localQuestion.id),
          localQuestion,
        ];
        localStorage.setItem(LOCAL_QUESTION_OVERRIDES_KEY, JSON.stringify(nextOverrides));
        setQuestions(mergeLocalQuestionOverrides(questions));
        setModal({ open: false, q: { ...EMPTY_Q } });
        setCustomTopicMode(false);
        showSuccess(lang === "uz" ? "Savol qo'shildi" : "Вопрос добавлен");
        setError("");
        return;
      }

      const res = await fetch("/api/admin/questions", {
        method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setError(d.error || (lang === "uz" ? "Savol saqlanmadi." : "Не удалось сохранить вопрос."));
        return;
      }
      setModal({ open: false, q: { ...EMPTY_Q } });
      setCustomTopicMode(false);
      showSuccess(lang === "uz" ? (q.id ? "Savol yangilandi" : "Savol qo'shildi") : (q.id ? "Вопрос обновлён" : "Вопрос добавлен"));
      await fetchQuestions();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : (lang === "uz" ? "Server bilan aloqa uzildi." : "Не удалось связаться с сервером."));
    } finally {
      saveLockRef.current = false;
      setLoading(false);
    }
  };

  const deleteQuestion = async (id: string) => {
    if (!confirm(lang === "uz" ? "Haqiqatan ham bu savolni o'chirmoqchimisiz?" : "Вы действительно хотите удалить этот вопрос?")) return;
    setDeleting(id);
    try {
      const localQuestion = questions.find((question) => question.id === id && question.isLocal);
      if (localQuestion) {
        const overrides = readLocalQuestionOverrides().filter((question) => question.id !== id);
        overrides.push({ ...localQuestion, isDeleted: true });
        localStorage.setItem(LOCAL_QUESTION_OVERRIDES_KEY, JSON.stringify(overrides));
        setQuestions((current) => current.filter((question) => question.id !== id));
        showSuccess(lang === "uz" ? "Savol o'chirildi" : "Вопрос удалён");
        return;
      }

      const res = await fetch("/api/admin/questions", {
        method: "DELETE",
        headers: { "content-type": "application/json" },
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
    setFieldErrors({});
    setError("");
    setModal({ open: true, q: { ...q, variantlar: [...q.variantlar] } });
  };

  const openAdd = () => {
    setCustomTopicMode(false);
    setFieldErrors({});
    setError("");
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
      <div className="min-h-screen flex flex-col bg-(--bg) text-(--text)">
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
                    placeholder={lang === "uz" ? "Admin tokenini kiriting" : "Введите токен администратора"}
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

            <p className="mt-6 text-center text-[11px] text-(--text-muted)">
              {lang === "uz" ? "Token server konfiguratsiyasida saqlanadi." : "Токен хранится в настройках сервера."}
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
    <div className="min-h-screen flex flex-col bg-(--bg) text-(--text)">
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
                onClick={async () => {
                  await fetch("/api/admin/session", { method: "DELETE" });
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
                      {lang === "uz"
                        ? uzPlural(group.mavzular.reduce((acc, m) => acc + m.items.length, 0), "savol")
                        : ruPlural(group.mavzular.reduce((acc, m) => acc + m.items.length, 0), "вопрос", "вопроса", "вопросов")}
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
              <div
                className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm max-[480px]:p-0"
                onMouseDown={(event) => {
                  if (event.target === event.currentTarget) closeModal();
                }}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  ref={modalRef}
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="question-modal-title"
                  className="liquid-border flex max-h-[calc(100dvh-32px)] w-full max-w-xl flex-col overflow-hidden bg-(--bg-elevated) p-0 max-[480px]:h-dvh max-[480px]:max-h-dvh max-[480px]:max-w-none max-[480px]:rounded-none"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="sticky top-0 z-10 flex shrink-0 items-center justify-between gap-4 border-b border-(--border) bg-(--bg-elevated) px-6 py-4">
                    <div>
                      <h3 id="question-modal-title" className="flex items-center gap-2 text-lg font-bold text-(--text)">
                        {modal.q.id ? <Pencil size={18} className="text-violet-600" /> : <Plus size={18} className="text-violet-600" />}
                        {modal.q.id ? "Savolni tahrirlash" : "Yangi savol qo'shish"}
                      </h3>
                    </div>
                    <button
                      type="button"
                      aria-label={lang === "uz" ? "Modalni yopish" : "Закрыть окно"}
                      onClick={() => closeModal()}
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-(--border) text-(--text-muted) hover:bg-(--bg-muted)"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4 sm:p-6">
                    {error && (
                      <div role="alert" className="rounded-xl border-2 border-(--danger) bg-red-50 p-3 text-sm font-bold text-red-900 dark:bg-red-950 dark:text-red-100">
                        {error}
                      </div>
                    )}
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
                          onClick={() => {
                            const nextMode = !customTopicMode;
                            setCustomTopicMode(nextMode);
                            setModal((current) => ({
                              ...current,
                              q: { ...current.q, mavzu: nextMode ? "" : (getMavzular(current.q.fan)[0] || "") },
                            }));
                            setFieldErrors((current) => ({ ...current, mavzu: "" }));
                          }}
                          className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
                        >
                          {customTopicMode ? "Mavzulardan tanlash" : "+ Yangi mavzu"}
                        </button>
                      </div>
                      {customTopicMode ? (
                        <>
                          <input
                            type="text"
                            value={modal.q.mavzu}
                            onChange={(e) => {
                              setModal((m) => ({ ...m, q: { ...m.q, mavzu: e.target.value } }));
                              setFieldErrors((current) => ({ ...current, mavzu: "" }));
                            }}
                            placeholder={lang === "uz" ? "Yangi mavzu nomini kiriting" : "Введите название новой темы"}
                            className={`modern-input ${fieldErrors.mavzu ? "field-invalid" : ""}`}
                            autoFocus
                          />
                          {fieldErrors.mavzu && <p className="field-error">{fieldErrors.mavzu}</p>}
                        </>
                      ) : (
                        <select
                          value={modal.q.mavzu}
                          onChange={(e) => {
                            setModal((m) => ({ ...m, q: { ...m.q, mavzu: e.target.value } }));
                            setFieldErrors((current) => ({ ...current, mavzu: "" }));
                          }}
                          className={`modern-input ${fieldErrors.mavzu ? "field-invalid" : ""}`}
                        >
                          <option value="">{lang === "uz" ? "Mavzuni tanlang" : "Выберите тему"}</option>
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
                        onChange={(e) => {
                          setModal((m) => ({ ...m, q: { ...m.q, savol: e.target.value } }));
                          setFieldErrors((current) => ({ ...current, savol: "" }));
                        }}
                        placeholder={lang === "uz" ? "Savol matnini kiriting" : "Введите текст вопроса"}
                        className={`modern-input resize-none ${fieldErrors.savol ? "field-invalid" : ""}`}
                      />
                      {fieldErrors.savol && <p className="field-error">{fieldErrors.savol}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                        Variantlar
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {modal.q.variantlar.map((variant, idx) => (
                          <div key={idx} className="flex flex-col items-start gap-1">
                            <span className="text-xs font-mono font-bold text-slate-400">{String.fromCharCode(65 + idx)}.</span>
                            <input
                              type="text"
                              value={variant}
                              onChange={(e) => {
                                const newVariantlar = [...modal.q.variantlar];
                                newVariantlar[idx] = e.target.value;
                                setModal((m) => ({ ...m, q: { ...m.q, variantlar: newVariantlar } }));
                                setFieldErrors((current) => ({ ...current, [`variant${idx}`]: "" }));
                              }}
                              placeholder={lang === "uz" ? "Variant matnini kiriting" : "Введите текст варианта"}
                              className={`modern-input ${fieldErrors[`variant${idx}`] ? "field-invalid" : ""}`}
                            />
                            {fieldErrors[`variant${idx}`] && <p className="field-error">{fieldErrors[`variant${idx}`]}</p>}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                        Javob
                      </label>
                      <select
                        value={modal.q.javob}
                        onChange={(e) => {
                          setModal((m) => ({ ...m, q: { ...m.q, javob: Number(e.target.value) } }));
                          setFieldErrors((current) => ({ ...current, javob: "" }));
                        }}
                        className={`modern-input ${fieldErrors.javob ? "field-invalid" : ""}`}
                      >
                        <option value={-1} disabled>
                          {lang === "uz" ? "To'g'ri javobni tanlang" : "Выберите правильный ответ"}
                        </option>
                        {modal.q.variantlar.map((variant, idx) => (
                          <option key={idx} value={idx} disabled={!variant.trim()}>
                            {String.fromCharCode(65 + idx)} - {variant.trim() || (lang === "uz" ? "Variant kiritilmagan" : "Вариант не заполнен")}
                          </option>
                        ))}
                      </select>
                      {fieldErrors.javob && <p className="field-error">{fieldErrors.javob}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                        Izoh (optional)
                      </label>
                      <textarea
                        rows={2}
                        value={modal.q.izoh}
                        onChange={(e) => setModal((m) => ({ ...m, q: { ...m.q, izoh: e.target.value } }))}
                        placeholder={lang === "uz" ? "Izoh qo'shish" : "Добавить примечание"}
                        className="modern-input resize-none"
                      />
                    </div>
                  </div>

                  <div className="question-modal-footer sticky bottom-0 z-10 flex shrink-0 flex-col-reverse gap-3 border-t border-(--border) bg-(--bg-elevated) px-4 py-4 sm:flex-row sm:justify-end sm:px-6">
                    <button
                      type="button"
                      onClick={saveQuestion}
                      disabled={loading}
                      className="btn-primary w-full sm:w-auto"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <RefreshCw size={16} className="animate-spin" />
                          {lang === "uz" ? "Saqlanmoqda..." : "Сохранение..."}
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Save size={16} />
                          {modal.q.id ? lang === "uz" ? "O'zgartirishlarni saqlash" : "Сохранить изменения" : lang === "uz" ? "Savolni saqlash" : "Сохранить вопрос"}
                        </span>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => closeModal()}
                      className="btn-ghost w-full sm:w-auto"
                    >
                      <X size={16} />
                      {lang === "uz" ? "Chiqish" : "Выход"}
                    </button>
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
