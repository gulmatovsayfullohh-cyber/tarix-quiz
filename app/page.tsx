"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  Globe2,
  ChevronRight,
  Zap,
  Gamepad2,
  Settings,
  BarChart2,
  Sparkles,
  ArrowRight,
  Timer,
  CheckCircle2,
  Compass,
  Trophy,
  Award,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { useSettingsStore } from "@/lib/settings-store";
import { t } from "@/lib/translations";
import { getFanlar, getSavollarSoni, getMavzular } from "@/lib/questions";

export default function HomePage() {
  const { lang } = useSettingsStore();
  const strings = t[lang];
  const fanlar = getFanlar();

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 transition-colors">
      <Navbar />

      <main className="flex-1 w-full flex flex-col items-center">
        {/* =========================================================
            SECTION 1: HERO (Gimkit Next Level - Markaziy Oq Karta)
           ========================================================= */}
        <section className="w-full flex flex-col items-center justify-center px-4 py-14 sm:py-20 md:py-24 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-white/10 relative overflow-hidden text-center">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-violet-500/10 dark:bg-violet-600/15 rounded-full blur-3xl pointer-events-none -z-10" />

          {/* Markaziy Gimkit Oq Karta */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="gimkit-hero-box p-6 sm:p-10 md:p-12 text-center mx-auto"
          >
            {/* Title: Next level. */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-950 dark:text-white tracking-tight mb-5 text-center">
              {strings.hero.title}
            </h1>

            {/* Greeting */}
            <div className="space-y-3.5 text-sm sm:text-base md:text-lg text-slate-700 dark:text-slate-300 font-medium leading-relaxed mb-7 max-w-xl mx-auto text-center">
              <p>{strings.hero.greeting}</p>
              <p>{strings.hero.desc}</p>
              <p className="font-bold text-slate-900 dark:text-white">
                {lang === "uz" ? "Sinab ko'rishga tayyormisiz?" : "Попробуйте прямо сейчас!"}
              </p>
            </div>

            {/* Author info (Visola) */}
            <div className="flex items-center justify-center gap-3 mb-7">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500 p-0.5 shadow-md shrink-0">
                <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center font-black text-violet-600 text-sm">
                  V
                </div>
              </div>
              <div className="text-left">
                <div className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                  — Visola <Sparkles size={14} className="text-amber-500" />
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  {lang === "uz" ? "Platforma muallifi" : "Создатель платформы"}
                </div>
              </div>
            </div>

            {/* Big Purple Button */}
            <div className="mb-7 flex justify-center">
              <Link href="#subjects" className="w-full sm:w-auto">
                <button className="btn-gimkit w-full sm:w-auto py-3.5 px-9 text-base sm:text-lg rounded-2xl shadow-xl shadow-violet-600/30">
                  <Gamepad2 size={20} />
                  <span>{strings.hero.cta}</span>
                </button>
              </Link>
            </div>

            {/* 3 ta pastki link: Test, Admin, Stats */}
            <div className="flex items-center justify-center gap-6 pt-5 border-t border-slate-200 dark:border-white/10 text-xs sm:text-sm font-bold">
              <Link
                href="#subjects"
                className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
              >
                <Gamepad2 size={16} className="text-violet-600" />
                <span>{strings.hero.fastLinks.test}</span>
              </Link>
              <Link
                href="/admin"
                className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-amber-500 transition-colors"
              >
                <Settings size={16} className="text-amber-500" />
                <span>{strings.hero.fastLinks.admin}</span>
              </Link>
              <Link
                href="/statistika"
                className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-emerald-500 transition-colors"
              >
                <BarChart2 size={16} className="text-emerald-500" />
                <span>{strings.hero.fastLinks.stats}</span>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* =========================================================
            SECTION 2: ANSWER & PHONE MOCKUP (Interaktiv Showcase)
           ========================================================= */}
        <section className="w-full bg-white dark:bg-slate-900 py-16 sm:py-20 md:py-24 px-4 border-b border-slate-200 dark:border-white/10 flex flex-col items-center justify-center">
          <div className="site-container flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-16 mx-auto">
            {/* Left Text */}
            <div className="max-w-lg space-y-5 text-center lg:text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
                <Sparkles size={14} />
                {lang === "uz" ? "Interaktiv ta'lim" : "Интерактивное обучение"}
              </span>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                {strings.features.section1Title}
              </h2>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                {strings.features.section1Desc}
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <div className="flex items-center gap-2.5 font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-white/10 w-full sm:w-auto">
                  <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                  <span>{lang === "uz" ? "Aniq ABCD variantlari" : "Четкие варианты ABCD"}</span>
                </div>
                <div className="flex items-center gap-2.5 font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-white/10 w-full sm:w-auto">
                  <Timer size={18} className="text-violet-600 shrink-0" />
                  <span>{lang === "uz" ? "Jonli sekundamer" : "Живой секундомер"}</span>
                </div>
              </div>
            </div>

            {/* Right: Realistic iPhone Mockup */}
            <div className="flex justify-center shrink-0">
              <div className="w-[290px] sm:w-[310px] rounded-[48px] border-[5px] border-slate-900 dark:border-slate-700 bg-slate-950 p-3 shadow-2xl shadow-slate-950/20 relative">
                {/* Dynamic Island Notch */}
                <div className="w-24 h-4 bg-black rounded-full mx-auto mb-3 flex items-center justify-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-slate-800" />
                </div>

                {/* Inner Screen */}
                <div className="bg-slate-900 rounded-[36px] p-3.5 text-white space-y-3 border border-white/5">
                  {/* Screen Header */}
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 px-1">
                    <span className="truncate max-w-[150px]">O&apos;zbekiston tarixi</span>
                    <span className="flex items-center gap-1 text-violet-400 font-mono">
                      <Timer size={12} /> 00:45
                    </span>
                  </div>

                  {/* Question Box */}
                  <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 text-center font-bold text-xs text-white shadow-sm leading-snug">
                    Sulton Muhammad Xorazmshoh qaysi suloladan bo&apos;lgan?
                  </div>

                  {/* 4 Colored ABCD Buttons */}
                  <div className="space-y-2">
                    <div className="p-2.5 rounded-xl bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow">
                      <span className="w-5 h-5 rounded-md bg-black/25 flex items-center justify-center font-black text-[11px]">A</span>
                      <span className="truncate">Afrig&apos;iylar</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center gap-2 shadow">
                      <span className="w-5 h-5 rounded-md bg-black/25 flex items-center justify-center font-black text-[11px]">B</span>
                      <span className="truncate">Oltintoshiylar</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-amber-500 text-white font-bold text-xs flex items-center gap-2 shadow">
                      <span className="w-5 h-5 rounded-md bg-black/25 flex items-center justify-center font-black text-[11px]">C</span>
                      <span className="truncate">Ma&apos;muniylar</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-2 shadow ring-2 ring-emerald-400">
                      <span className="w-5 h-5 rounded-md bg-black/25 flex items-center justify-center font-black text-[11px]">D</span>
                      <span className="flex-1 truncate">Anushteginiylar</span>
                      <CheckCircle2 size={15} className="shrink-0" />
                    </div>
                  </div>

                  {/* Home Indicator */}
                  <div className="w-24 h-1 bg-white/30 rounded-full mx-auto pt-0.5 mt-2" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            SECTION 3: DOIM YANGI FORMATLAR (Dark Navy Minimalist)
           ========================================================= */}
        <section className="w-full bg-[#0c192e] text-white py-16 sm:py-20 md:py-24 px-4 flex flex-col items-center justify-center">
          <div className="site-container flex flex-col items-center justify-center text-center space-y-12 mx-auto">
            {/* Header */}
            <div className="max-w-2xl mx-auto space-y-3">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-center">
                {strings.features.section3Title}
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed text-center">
                {strings.features.section3Desc}
              </p>
            </div>

            {/* 3 ta Karta (Grid orqali teng kenglik va balandlik) */}
            <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex flex-col items-center text-center space-y-3.5 hover:border-violet-500/60 hover:-translate-y-1 transition-all shadow-lg">
                <div className="w-12 h-12 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center mx-auto">
                  <Compass size={24} />
                </div>
                <h3 className="text-lg font-bold text-white">
                  {lang === "uz" ? "O'zbekiston tarixi" : "История Узбекистана"}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed flex-1">
                  {lang === "uz"
                    ? "Xorazm davlati, Chingizxon istilosi, Jaloliddin jasorati va Amir Temur saltanati."
                    : "Государство Хорезмшахов, походы Чингисхана, подвиг Джалолиддина и эпоха Амира Темура."}
                </p>
                <div className="text-xs font-semibold text-violet-400 flex items-center justify-center gap-1 pt-1">
                  <span>8-sinf darsligi</span>
                  <ChevronRight size={13} />
                </div>
              </div>

              {/* Card 2 */}
              <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex flex-col items-center text-center space-y-3.5 hover:border-sky-500/60 hover:-translate-y-1 transition-all shadow-lg">
                <div className="w-12 h-12 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center mx-auto">
                  <Globe2 size={24} />
                </div>
                <h3 className="text-lg font-bold text-white">
                  {lang === "uz" ? "Jahon tarixi" : "Всемирная история"}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed flex-1">
                  {lang === "uz"
                    ? "Buyuk Fransuz inqilobi, Bastiliya qamali, jahon urushlari va sanoat inqilobi."
                    : "Великая Французская революция, взятие Бастилии, мировые войны и промышленный прогресс."}
                </p>
                <div className="text-xs font-semibold text-sky-400 flex items-center justify-center gap-1 pt-1">
                  <span>8-sinf darsligi</span>
                  <ChevronRight size={13} />
                </div>
              </div>

              {/* Card 3 */}
              <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex flex-col items-center text-center space-y-3.5 hover:border-emerald-500/60 hover:-translate-y-1 transition-all shadow-lg">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <Trophy size={24} />
                </div>
                <h3 className="text-lg font-bold text-white">
                  {lang === "uz" ? "Vaqt bilan poyga" : "Гонка со временем"}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed flex-1">
                  {lang === "uz"
                    ? "Har bir testda sekundamer ishlaydi. Eng kam vaqtda 100% to'g'ri natija ko'rsating!"
                    : "В каждом тесте работает секундомер. Покажите 100% результат за минимальное время!"}
                </p>
                <div className="text-xs font-semibold text-emerald-400 flex items-center justify-center gap-1 pt-1">
                  <span>Sekundamer nazorati</span>
                  <ChevronRight size={13} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            SECTION 4: FANLARNI TANLASH (#subjects - 2 ta Karta)
           ========================================================= */}
        <section id="subjects" className="w-full py-16 sm:py-20 md:py-24 px-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-white/10 flex flex-col items-center justify-center scroll-mt-16">
          <div className="site-container flex flex-col items-center justify-center text-center space-y-12 mx-auto">
            {/* Header */}
            <div className="max-w-xl mx-auto space-y-2.5">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
                <Sparkles size={13} />
                {lang === "uz" ? "8-sinf • Tarix fanlari" : "8 класс • Предметы истории"}
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                {strings.subjects.title}
              </h2>
              <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
                {strings.subjects.subtitle}
              </p>
            </div>

            {/* 2 ta Fan Kartasi (Grid orqali tenglik va simmetriya) */}
            <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              {fanlar.map((fan) => {
                const isUzb = fan.includes("O'zbekiston");
                const mavzuCount = getMavzular(fan).length;
                const savolCount = getSavollarSoni(fan);

                return (
                  <div
                    key={fan}
                    className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-white/10 rounded-3xl p-7 hover:border-violet-500 hover:shadow-xl transition-all flex flex-col justify-between space-y-6"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                          isUzb
                            ? "bg-amber-500/15 text-amber-500"
                            : "bg-sky-500/15 text-sky-500"
                        }`}>
                          {isUzb ? <BookOpen size={24} /> : <Globe2 size={24} />}
                        </div>
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                          {mavzuCount} {strings.subjects.topicsCount} • {savolCount} {strings.subjects.questionsCount}
                        </span>
                      </div>

                      <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                        {fan}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        {isUzb ? strings.subjects.uzbDesc : strings.subjects.worldDesc}
                      </p>
                    </div>

                    <Link href={`/${encodeURIComponent(fan)}`} className="w-full block">
                      <button className="btn-gimkit w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2">
                        <span>{strings.subjects.startTest}</span>
                        <ArrowRight size={18} />
                      </button>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =========================================================
            SECTION 5: BOTTOM GAME ON CTA (Dark Minimalist Banner)
           ========================================================= */}
        <section className="w-full bg-slate-950 text-white py-16 sm:py-20 px-4 border-t border-slate-800 flex flex-col items-center justify-center text-center">
          <div className="max-w-2xl mx-auto space-y-5 flex flex-col items-center text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-center">
              {lang === "uz" ? "Boshlashga tayyormisiz?" : "Готовы начать?"}
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed text-center">
              {lang === "uz"
                ? "Barcha mavzular bo'yicha bilimlaringizni sinab ko'ring va eng yaxshi natijaga erishing!"
                : "Проверьте свои знания по всем темам и достигните наилучшего результата!"}
            </p>
            <div className="pt-2 flex justify-center">
              <Link href="#subjects">
                <button className="btn-gimkit px-9 py-3.5 text-base rounded-2xl shadow-xl shadow-violet-600/40">
                  <Zap size={18} />
                  <span>{strings.hero.cta}</span>
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-slate-950 text-slate-500 py-10 px-4 border-t border-slate-900 text-xs text-center space-y-3.5 flex flex-col items-center justify-center">
        <div className="flex items-center justify-center gap-6 font-semibold">
          <Link href="#subjects" className="hover:text-white transition-colors">{strings.nav.test}</Link>
          <Link href="/admin" className="hover:text-white transition-colors">{strings.nav.admin}</Link>
          <Link href="/statistika" className="hover:text-white transition-colors">{strings.nav.stats}</Link>
        </div>
        <p>© 2026 Visola psi. {strings.footer.rights}</p>
        <p className="text-[11px] text-slate-600">{strings.footer.builtWith}</p>
      </footer>
    </div>
  );
}