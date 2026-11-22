"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  BarChart2,
  Gamepad2,
  Globe,
  Languages,
  Menu,
  Moon,
  Settings,
  Sparkles,
  Sun,
  X,
} from "lucide-react";
import { useSettingsStore } from "@/lib/settings-store";
import { t } from "@/lib/translations";

export default function Navbar() {
  const { lang, setLang, theme, setTheme } = useSettingsStore();
  const [mounted, setMounted] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const languageRef = useRef<HTMLDivElement>(null);
  const strings = t[lang];

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("app_theme") as "light" | "dark" | null;
    const savedLang = localStorage.getItem("app_lang") as "uz" | "ru" | null;
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    setTheme(savedTheme || systemTheme);
    if (savedLang) setLang(savedLang);
  }, [setTheme, setLang]);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!languageRef.current?.contains(event.target as Node)) setLanguageOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLanguageOpen(false);
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const chooseLanguage = (next: "uz" | "ru") => {
    setLang(next);
    setLanguageOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 h-18 border-b-[3px] border-(--border) bg-(--bg)">
      <div className="site-container h-full flex items-center justify-between gap-3">
        <Link
          href="/"
          aria-label="Visola psi — bosh sahifa"
          className="flex min-h-11 items-center gap-2"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-[3px] border-(--border) bg-(--accent-teal) text-[#111111] shadow-[3px_3px_0_var(--shadow-color)]">
            <Sparkles size={20} strokeWidth={3} />
          </span>
          <span className="comic-title hidden text-lg text-(--text) xs:block sm:text-xl">
            Visola{" "}
            <span className="text-(--primary)">psi</span>
          </span>
        </Link>

        <nav
          className="hidden items-center gap-2 md:flex"
          aria-label={
            lang === "uz" ? "Asosiy menyu" : "Основная навигация"
          }
        >
          <Link
            href="/#subjects"
            className="nav-pill"
            aria-label={strings.nav.test}
          >
            <Gamepad2 size={17} />
            <span>{strings.nav.test}</span>
          </Link>
          <Link
            href="/admin"
            className="nav-pill"
            aria-label={strings.nav.admin}
          >
            <Settings size={17} />
            <span>{strings.nav.admin}</span>
          </Link>
          <Link
            href="/statistika"
            className="nav-pill"
            aria-label={strings.nav.stats}
          >
            <BarChart2 size={17} />
            <span>{strings.nav.stats}</span>
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <div ref={languageRef} className="relative">
            <button
              type="button"
              className="nav-icon"
              aria-label={
                lang === "uz" ? "Tilni tanlash" : "Выбрать язык"
              }
              aria-expanded={languageOpen}
              onClick={() => setLanguageOpen((open) => !open)}
            >
              {lang === "uz" ? (
                <Languages size={20} />
              ) : (
                <Globe size={20} />
              )}
            </button>

            {languageOpen && (
              <div className="absolute right-0 top-13 w-44 border-[3px] border-(--border) rounded-[14px] bg-(--bg-elevated) p-2 shadow-[4px_4px_0_var(--shadow-color)]">
                <button
                  type="button"
                  onClick={() => chooseLanguage("ru")}
                  className="flex min-h-11 w-full items-center justify-between rounded-[10px] px-3 text-sm font-black text-(--text) hover:bg-(--bg-muted)"
                >
                  Русский{" "}
                  {lang === "ru" && <span aria-hidden="true">✓</span>}
                </button>
                <button
                  type="button"
                  onClick={() => chooseLanguage("uz")}
                  className="mt-1 flex min-h-11 w-full items-center justify-between rounded-[10px] px-3 text-sm font-black text-(--text) hover:bg-(--bg-muted)"
                >
                  O'zbekcha{" "}
                  {lang === "uz" && <span aria-hidden="true">✓</span>}
                </button>
              </div>
            )}
          </div>

          {mounted && (
            <button
              type="button"
              className="nav-icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label={
                theme === "dark"
                  ? lang === "uz"
                    ? "Yorqin rejim"
                    : "Светлая тема"
                  : lang === "uz"
                  ? "Qorong'i rejim"
                  : "Тёмная тема"
              }
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          )}

          <button
            type="button"
            className="nav-icon md:hidden"
            aria-label={
              lang === "uz" ? "Menyuni ochish" : "Открыть меню"
            }
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          className="absolute left-0 right-0 top-18 border-b-[3px] border-(--border) bg-(--bg-elevated) p-4 md:hidden"
          aria-label={
            lang === "uz" ? "Mobil menyu" : "Мобильная навигация"
          }
        >
          <div className="site-container grid gap-2 px-0">
            <Link
              href="/#subjects"
              onClick={() => setMenuOpen(false)}
              className="flex min-h-12 items-center gap-3 rounded-xl border-2 border-(--border) px-4 font-black"
            >
              <Gamepad2 size={18} />
              {strings.nav.test}
            </Link>
            <Link
              href="/admin"
              onClick={() => setMenuOpen(false)}
              className="flex min-h-12 items-center gap-3 rounded-xl border-2 border-(--border) px-4 font-black"
            >
              <Settings size={18} />
              {strings.nav.admin}
            </Link>
            <Link
              href="/statistika"
              onClick={() => setMenuOpen(false)}
              className="flex min-h-12 items-center gap-3 rounded-xl border-2 border-(--border) px-4 font-black"
            >
              <BarChart2 size={18} />
              {strings.nav.stats}
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
