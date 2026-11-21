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

export const useSettingsStore = create<SettingsState>((set) => ({
  lang: "uz",
  theme: "light", // Boshlang'ich tema foydalanuvchi so'raganidek yorqin/oq/binafsha, lekin dark mode ham bor
  setLang: (lang) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("app_lang", lang);
    }
    set({ lang });
  },
  setTheme: (theme) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("app_theme", theme);
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
    set({ theme });
  },
  toggleTheme: () => {
    set((state) => {
      const nextTheme = state.theme === "dark" ? "light" : "dark";
      if (typeof window !== "undefined") {
        localStorage.setItem("app_theme", nextTheme);
        if (nextTheme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
      return { theme: nextTheme };
    });
  },
}));
