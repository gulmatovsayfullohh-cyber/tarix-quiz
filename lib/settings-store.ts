import { create } from "zustand";

export type Language = "uz" | "ru";
export type Theme = "light" | "dark";

interface SettingsState {
  lang: Language;
  theme: Theme;
  setLang: (lang: Language) => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = theme;
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  lang: "uz",
  theme: "light",

  setLang: (lang) => {
    if (typeof window !== "undefined") localStorage.setItem("app_lang", lang);
    set({ lang });
  },

  setTheme: (theme) => {
    if (typeof window !== "undefined") localStorage.setItem("app_theme", theme);
    applyTheme(theme);
    set({ theme });
  },

  toggleTheme: () => {
    const nextTheme: Theme = get().theme === "dark" ? "light" : "dark";
    if (typeof window !== "undefined") localStorage.setItem("app_theme", nextTheme);
    applyTheme(nextTheme);
    set({ theme: nextTheme });
  },
}));
