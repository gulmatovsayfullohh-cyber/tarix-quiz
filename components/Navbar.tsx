"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Gamepad2,
  Settings,
  BarChart2,
  Sun,
  Moon,
  Globe,
  Sparkles,
} from "lucide-react";
import { useSettingsStore } from "@/lib/settings-store";
import { t } from "@/lib/translations";

export default function Navbar() {
  const { lang, setLang, theme, toggleTheme, setTheme } = useSettingsStore();
  const [mounted, setMounted] = useState(false);
  const strings = t[lang];

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("app_theme") as "light" | "dark" | null;
    const savedLang = localStorage.getItem("app_lang") as "uz" | "ru" | null;
    if (savedTheme) setTheme(savedTheme);
    if (savedLang) setLang(savedLang);
  }, [setTheme, setLang]);

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/70 dark:bg-slate-950/70 border-b border-slate-200/60 dark:border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo / Brand */}
        <Link href="/" className="flex items-center gap-2 group text-decoration-none">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-violet-500/25 group-hover:scale-105 transition-transform">
            <Sparkles size={20} />
          </div>
          <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900 dark:text-white uppercase font-sans">
            Visola <span className="text-violet-600 dark:text-violet-400">psi</span>
          </span>
        </Link>

        {/* Navigation links & controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Test (Join Game o'rniga) */}
          <Link
            href="/#subjects"
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
          >
            <Gamepad2 size={16} className="text-violet-600 dark:text-violet-400" />
            <span className="hidden xs:inline">{strings.nav.test}</span>
          </Link>

          {/* Admin Panel (Group Pricing o'rniga) */}
          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
          >
            <Settings size={16} className="text-amber-500" />
            <span className="hidden sm:inline">{strings.nav.admin}</span>
          </Link>

          {/* Statistika (Login / Sign Up o'rniga) */}
          <Link
            href="/statistika"
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-emerald-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
          >
            <BarChart2 size={16} className="text-emerald-500" />
            <span className="hidden md:inline">{strings.nav.stats}</span>
          </Link>

          <div className="h-4 w-px bg-slate-300 dark:bg-white/10 mx-0.5" />

          {/* Language Switcher */}
          <button
            onClick={() => setLang(lang === "uz" ? "ru" : "uz")}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/10 transition-colors"
            title="Tilni o'zgartirish / Сменить язык"
          >
            <Globe size={13} className="text-violet-600 dark:text-violet-400" />
            <span>{lang.toUpperCase()}</span>
          </button>

          {/* Dark / Light Mode Toggle */}
          {mounted && (
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/10 transition-colors"
              title={theme === "dark" ? "Oq rejimga o'tish" : "Qora rejimga o'tish"}
            >
              {theme === "dark" ? (
                <Sun size={16} className="text-amber-400" />
              ) : (
                <Moon size={16} className="text-violet-600" />
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
