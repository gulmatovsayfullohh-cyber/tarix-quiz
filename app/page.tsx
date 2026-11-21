"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  Globe2,
  ChevronRight,
  Zap,
  Target,
  Trophy,
  Gamepad2,
  Settings,
  BarChart2,
  Sparkles,
  ArrowRight,
  Timer,
  CheckCircle2,
  Layers,
  Award,
  Compass,
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
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors">
      <Navbar />

      <main className="flex-1 w-full overflow-hidden">
        {/* =========================================================
            SECTION 1: HERO (Gimkit uslubidagi Markaziy Karta)
           ========================================================= */}
        <section className="w-full px-4 pt-10 pb-20 md:pt-16 md:pb-28 flex flex-col items-center justify-center relative">
          {/* Ambient background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-violet-500/10 dark:bg-violet-600/15 rounded-full blur-3xl pointer-events-none -z-10" />

          {/* Markaziy Gimkit Hero Karta */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="gimkit-hero-card p-8 sm:p-14 text-center z-10"
          >
            {/* Title: Keyingi bosqich. */}
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-6">
              {strings.hero.title}
            </h1>

            {/* Greeting: Salom, men Visolaman! */}
            <p className="text-base sm:text-lg text-slate-700 dark:text-slate-200 font-medium mb-3 leading-relaxed">
              {strings.hero.greeting}
            </p>

            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 mb-8 leading-relaxed max-w-xl mx-auto">
              {strings.hero.desc}
            </p>

            {/* Author info: Visola */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-600 via-pink-500 to-amber-400 p-0.5 shadow-md shrink-0">
                <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center font-black text-violet-600 text-sm">
                  V
                </div>
              </div>
              <div className="text-left">
                <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                  — Visola <Sparkles size={14} className="text-amber-500" />
                </div>
                <div className="text-[11px] text-slate-400 font-medium">Platforma muallifi</div>
              </div>
            </div>

            {/* Big Violet Button */}
            <div className="mb-8">
              <Link href="#subjects">
                <button className="btn-gimkit text-base py-3.5 px-8 rounded-xl shadow-lg shadow-violet-600/30">
                  <Gamepad2 size={20} />
                  <span>{strings.hero.cta}</span>
                </button>
              </Link>
            </div>

            {/* Fast bottom links */}
            <div className="flex items-center justify-center gap-6 pt-6 border-t border-slate-200 dark:border-white/10 text-xs sm:text-sm font-bold">
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
            SECTION 2: ANSWER & PHONE MOCKUP (Gimkit 4-rasm)
           ========================================================= */}
        <section className="w-full bg-white dark:bg-slate-900/60 py-20 px-4 border-t border-slate-200 dark:border-white/5 transition-colors">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left text */}
            <div className="space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
                <Sparkles size={14} />
                {lang === "uz" ? "Interaktiv ta'lim" : "Интерактивное обучение"}
              </span>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {strings.features.section1Title}
              </h2>

              <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                {strings.features.section1Desc}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-600 shrink-0">
                    <CheckCircle2 size={18} />
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {lang === "uz" ? "Aniq ABCD variantlar" : "Четкие варианты ABCD"}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-white/10 flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-violet-500/15 text-violet-600 shrink-0">
                    <Timer size={18} />
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {lang === "uz" ? "Jonli sekundamer" : "Живой секундомер"}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Phone mockup (Toza va alohida container) */}
            <div className="flex justify-center w-full">
              <div className="w-full max-w-sm bg-slate-900 text-white rounded-[44px] p-4 shadow-2xl border-4 border-slate-700">
                {/* Phone Speaker */}
                <div className="w-20 h-4 bg-slate-800 rounded-full mx-auto mb-4" />

                {/* Screen content */}
                <div className="bg-slate-950 p-5 rounded-[32px] space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                    <span>O&apos;zbekiston tarixi</span>
                    <span className="font-mono text-violet-400 font-bold bg-violet-500/20 px-2 py-0.5 rounded">⏱️ 00:45</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center font-bold text-sm leading-snug">
                    Sulton Muhammad Xorazmshoh qaysi suloladan bo&apos;lgan?
                  </div>

                  {/* ABCD Phone Buttons */}
                  <div className="space-y-2 pt-1">
                    <div className="p-3 rounded-xl bg-rose-500 text-white font-bold text-xs flex items-center gap-2.5 shadow">
                      <span className="w-6 h-6 rounded-lg bg-black/20 flex items-center justify-center font-black">A</span>
                      <span>Afrig&apos;iylar</span>
                    </div>
                    <div className="p-3 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center gap-2.5 shadow">
                      <span className="w-6 h-6 rounded-lg bg-black/20 flex items-center justify-center font-black">B</span>
                      <span>Oltintoshiylar</span>
                    </div>
                    <div className="p-3 rounded-xl bg-amber-500 text-white font-bold text-xs flex items-center gap-2.5 shadow">
                      <span className="w-6 h-6 rounded-lg bg-black/20 flex items-center justify-center font-black">C</span>
                      <span>Ma&apos;muniylar</span>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-2.5 shadow ring-2 ring-emerald-400">
                      <span className="w-6 h-6 rounded-lg bg-black/20 flex items-center justify-center font-black">D</span>
                      <span className="flex-1">Anushteginiylar</span>
                      <CheckCircle2 size={16} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            SECTION 3: THREE FORMATS (Gimkit 5-rasm kabi)
           ========================================================= */}
        <section className="w-full bg-slate-900 text-white py-20 px-4 transition-colors">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center max-w-xl mx-auto space-y-3">
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
                {strings.features.section3Title}
              </h2>
              <p className="text-sm sm:text-base text-slate-400">
                {strings.features.section3Desc}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700 space-y-4 hover:border-violet-500 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-violet-500/20 text-violet-400 flex items-center justify-center">
                  <Compass size={24} />
                </div>
                <h3 className="text-lg font-bold">
                  {lang === "uz" ? "O'zbekiston tarixi" : "История Узбекистана"}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {lang === "uz"
                    ? "Xorazm davlati, Chingizxon istilosi, Jaloliddin jasorati va Amir Temur saltanati."
                    : "Государство Хорезмшахов, походы Чингисхана, подвиг Джалолиддина и эпоха Амира Темура."}
                </p>
                <div className="text-xs font-bold text-violet-400 flex items-center gap-1">
                  <span>8-sinf darsligi</span>
                  <ChevronRight size={14} />
                </div>
              </div>

              {/* Card 2 */}
              <div className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700 space-y-4 hover:border-sky-500 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                  <Globe2 size={24} />
                </div>
                <h3 className="text-lg font-bold">
                  {lang === "uz" ? "Jahon tarixi" : "Всемирная история"}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {lang === "uz"
                    ? "Buyuk Fransuz inqilobi, Bastiliya qamali, jahon urushlari va sanoat taraqqiyoti."
                    : "Великая Французская революция, взятие Бастилии, мировые войны и промышленный прогресс."}
                </p>
                <div className="text-xs font-bold text-sky-400 flex items-center gap-1">
                  <span>8-sinf darsligi</span>
                  <ChevronRight size={14} />
                </div>
              </div>

              {/* Card 3 */}
              <div className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700 space-y-4 hover:border-emerald-500 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Trophy size={24} />
                </div>
                <h3 className="text-lg font-bold">
                  {lang === "uz" ? "Vaqt bilan poyga" : "Гонка со временем"}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {lang === "uz"
                    ? "Har bir testda sekundamer ishlaydi. Eng kam vaqtda 100% to'g'ri natija ko'rsating!"
                    : "В каждом тесте работает секундомер. Покажите 100% результат за минимальное время!"}
                </p>
                <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <span>Sekundamer nazorati</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            SECTION 4: FANLARNI TANLASH VA TEST TOPShIRISh (#subjects)
           ========================================================= */}
        <section id="subjects" className="w-full max-w-6xl mx-auto px-4 py-24 scroll-mt-16">
          <div className="text-center max-w-xl mx-auto mb-14 space-y-3">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
              8-sinf • Tarix fanlari
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              {strings.subjects.title}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {strings.subjects.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {fanlar.map((fan) => {
              const isUzb = fan.includes("O'zbekiston");
              const mavzuCount = getMavzular(fan).length;
              const savolCount = getSavollarSoni(fan);

              return (
                <div
                  key={fan}
                  className="glass p-8 sm:p-10 rounded-3xl flex flex-col justify-between space-y-8 border-2 border-slate-200 dark:border-white/10 hover:border-violet-500 transition-all"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                        isUzb
                          ? "bg-amber-500/15 text-amber-500"
                          : "bg-sky-500/15 text-sky-500"
                      }`}>
                        {isUzb ? <BookOpen size={28} /> : <Globe2 size={28} />}
                      </div>
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                        {mavzuCount} {strings.subjects.topicsCount} • {savolCount} {strings.subjects.questionsCount}
                      </span>
                    </div>

                    <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                      {fan}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {isUzb ? strings.subjects.uzbDesc : strings.subjects.worldDesc}
                    </p>
                  </div>

                  <Link href={`/${encodeURIComponent(fan)}`} className="block">
                    <button className="btn-gimkit w-full py-3.5 rounded-xl flex items-center justify-center gap-2">
                      <span>{strings.subjects.startTest}</span>
                      <ArrowRight size={18} />
                    </button>
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* =========================================================
            SECTION 5: BOTTOM GAME ON CTA (Gimkit 8-rasm)
           ========================================================= */}
        <section className="w-full bg-slate-950 text-white py-20 px-4 text-center border-t border-slate-800">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
              {lang === "uz" ? "Boshlashga tayyormisiz?" : "Готовы начать?"}
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              {lang === "uz"
                ? "Barcha mavzular bo'yicha bilimlaringizni sinab ko'ring va eng yaxshi natijaga erishing!"
                : "Проверьте свои знания по всем темам и достигните наилучшего результата!"}
            </p>
            <div>
              <Link href="#subjects">
                <button className="btn-gimkit px-8 py-4 text-base rounded-xl shadow-xl shadow-violet-600/30">
                  <Zap size={18} />
                  <span>{strings.hero.cta}</span>
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-500 py-12 px-4 border-t border-slate-800 text-xs text-center space-y-4">
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
