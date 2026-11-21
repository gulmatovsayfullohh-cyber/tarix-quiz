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
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 transition-colors">
      <Navbar />

      <main className="flex-1 w-full">
        {/* =========================================================
            SECTION 1: HERO (Gimkit 1-rasm - Next level.)
           ========================================================= */}
        <section className="relative w-full min-h-[85vh] flex items-center justify-center px-4 py-16 md:py-24 bg-slate-50 dark:bg-slate-950 overflow-hidden border-b border-slate-200 dark:border-white/10">
          {/* Background Decorative Cards (Gimkit 1-rasmdagi orqa fon bezaklari) */}
          <div className="absolute left-6 top-1/2 -translate-y-1/2 w-64 h-80 rounded-3xl bg-violet-600/10 dark:bg-violet-900/20 border border-violet-500/20 p-4 hidden xl:block -rotate-6 pointer-events-none opacity-60">
            <div className="w-full h-8 bg-violet-600/30 rounded-xl mb-3" />
            <div className="space-y-2">
              <div className="h-6 bg-slate-200 dark:bg-white/10 rounded-lg" />
              <div className="h-6 bg-slate-200 dark:bg-white/10 rounded-lg" />
              <div className="h-6 bg-slate-200 dark:bg-white/10 rounded-lg" />
            </div>
            <div className="mt-8 p-3 rounded-xl bg-violet-600/20 text-xs font-bold text-violet-600 dark:text-violet-400">
              Leaderboard #1
            </div>
          </div>

          <div className="absolute right-6 top-1/2 -translate-y-1/2 w-64 h-80 rounded-3xl bg-slate-900/10 dark:bg-white/5 border border-slate-300 dark:border-white/10 p-4 hidden xl:block rotate-6 pointer-events-none opacity-60">
            <div className="w-16 h-4 bg-slate-400/20 rounded-full mb-4" />
            <div className="p-4 rounded-2xl bg-violet-500/15 text-xs font-bold text-violet-600 dark:text-violet-400 mb-3">
              ⏱️ 00:46
            </div>
            <div className="h-20 bg-slate-200 dark:bg-white/10 rounded-xl" />
          </div>

          {/* Markaziy Gimkit Oq Karta (1-rasmdagi Next level) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="gimkit-hero-box p-8 sm:p-12 md:p-14 text-left relative z-20"
          >
            {/* Title: Next level. / Keyingi bosqich. */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-950 dark:text-white tracking-tight mb-6">
              {strings.hero.title}
            </h1>

            {/* Greeting: Salom, men Visolaman! */}
            <div className="space-y-4 text-base sm:text-lg text-slate-700 dark:text-slate-300 font-medium leading-relaxed mb-8">
              <p>{strings.hero.greeting}</p>
              <p>{strings.hero.desc}</p>
              <p className="font-semibold text-slate-900 dark:text-white">
                {lang === "uz" ? "Sinab ko'rishga tayyormisiz?" : "Попробуйте прямо сейчас!"}
              </p>
            </div>

            {/* Author info (Josh F. o'rniga Visola) */}
            <div className="flex items-center gap-3.5 mb-8">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500 p-0.5 shadow-md shrink-0">
                <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center font-black text-violet-600 text-base">
                  V
                </div>
              </div>
              <div>
                <div className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-1.5">
                  — Visola <Sparkles size={16} className="text-amber-500" />
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  {lang === "uz" ? "Platforma asoschisi" : "Создатель платформы"}
                </div>
              </div>
            </div>

            {/* Big Purple Button: Sign Up For Free o'rniga */}
            <div className="mb-8">
              <Link href="#subjects">
                <button className="btn-gimkit w-full py-4 text-base rounded-2xl shadow-xl shadow-violet-600/30">
                  <Gamepad2 size={22} />
                  <span>{strings.hero.cta}</span>
                </button>
              </Link>
            </div>

            {/* 3 ta pastki link: Test, Admin, Stats */}
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
            SECTION 2: ANSWER (Gimkit 4-rasm)
           ========================================================= */}
        <section className="w-full bg-white dark:bg-slate-900 py-24 px-4 border-b border-slate-200 dark:border-white/10 transition-colors">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left text */}
            <div className="space-y-6 text-left">
              <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                {strings.features.section1Title}
              </h2>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                {strings.features.section1Desc}
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 font-bold text-sm text-slate-800 dark:text-slate-200">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={16} />
                  </div>
                  <span>{lang === "uz" ? "Aniq ABCD variantlari (figuralarsiz)" : "Четкие варианты ABCD (без фигур)"}</span>
                </div>
                <div className="flex items-center gap-3 font-bold text-sm text-slate-800 dark:text-slate-200">
                  <div className="w-6 h-6 rounded-full bg-violet-500/20 text-violet-600 flex items-center justify-center shrink-0">
                    <Timer size={16} />
                  </div>
                  <span>{lang === "uz" ? "Har bir testda jonli sekundamer" : "Живой секундомер в каждом тесте"}</span>
                </div>
              </div>
            </div>

            {/* Right: Phone mockup (Gimkit 4-rasmdagi oq zamonaviy telefon!) */}
            <div className="flex justify-center w-full">
              <div className="w-full max-w-[340px] bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-[44px] p-4 shadow-2xl border-[3.5px] border-slate-900 dark:border-slate-700">
                {/* Speaker */}
                <div className="w-20 h-4 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mb-4" />

                {/* Question Screen */}
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-[30px] space-y-3.5">
                  <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center font-bold text-xs sm:text-sm shadow-sm leading-snug">
                    Sulton Muhammad Xorazmshoh qaysi sulola vakili bo&apos;lgan?
                  </div>

                  {/* 4 ta rangli variant (Gimkit 4-rasmdagi kabi) */}
                  <div className="space-y-2">
                    <div className="p-3 rounded-xl bg-rose-500 text-white font-bold text-xs flex items-center gap-2.5 shadow">
                      <span className="w-6 h-6 rounded-lg bg-black/20 flex items-center justify-center font-black">A</span>
                      <span>Afrig&apos;iylar</span>
                    </div>
                    <div className="p-3 rounded-xl bg-amber-500 text-white font-bold text-xs flex items-center gap-2.5 shadow">
                      <span className="w-6 h-6 rounded-lg bg-black/20 flex items-center justify-center font-black">B</span>
                      <span>Oltintoshiylar</span>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-2.5 shadow">
                      <span className="w-6 h-6 rounded-lg bg-black/20 flex items-center justify-center font-black">C</span>
                      <span>Ma&apos;muniylar</span>
                    </div>
                    <div className="p-3 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center gap-2.5 shadow ring-2 ring-blue-400">
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
            SECTION 3: EARN (Gimkit 4-rasm pastki qismi)
           ========================================================= */}
        <section className="w-full bg-slate-50 dark:bg-slate-950 py-24 px-4 border-b border-slate-200 dark:border-white/10 transition-colors">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Phone: Earn +$1 style */}
            <div className="flex justify-center w-full order-2 lg:order-1">
              <div className="w-full max-w-[340px] bg-white dark:bg-slate-950 text-slate-900 dark:text-white rounded-[44px] p-4 shadow-2xl border-[3.5px] border-slate-900 dark:border-slate-700">
                <div className="w-20 h-4 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mb-4" />
                <div className="bg-emerald-500 text-white p-8 rounded-[30px] text-center space-y-4 shadow-inner">
                  <div className="text-4xl sm:text-5xl font-black tracking-tight">
                    +100 Ball
                  </div>
                  <div className="inline-block px-4 py-1.5 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider">
                    To&apos;g&apos;ri javob! 🎉
                  </div>
                </div>
                <div className="mt-3 p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-center font-bold text-xs text-slate-700 dark:text-slate-300">
                  Reyting va Yutuqlar 🏆
                </div>
              </div>
            </div>

            {/* Right text */}
            <div className="space-y-6 text-left order-1 lg:order-2">
              <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                {strings.features.section2Title}
              </h2>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                {strings.features.section2Desc}
              </p>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-sm space-y-2">
                <div className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
                  Natijalar tahlili
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Har bir test yakunida qancha vaqt sarflaganingiz, to&apos;g&apos;ri va xato javoblar va tarixiy faktlar batafsil ko&apos;rsatiladi.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            SECTION 4: ALWAYS NEW WAYS TO PLAY (Gimkit 5-rasm)
           ========================================================= */}
        <section className="w-full bg-[#0c192e] text-white py-24 px-4 transition-colors">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
                {strings.features.section3Title}
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {strings.features.section3Desc}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="p-7 rounded-3xl bg-slate-800/90 border border-slate-700 space-y-4 hover:border-violet-500 hover:scale-[1.02] transition-all shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-violet-500/20 text-violet-400 flex items-center justify-center">
                  <Compass size={24} />
                </div>
                <h3 className="text-xl font-bold">
                  {lang === "uz" ? "O'zbekiston tarixi" : "История Узбекистана"}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {lang === "uz"
                    ? "Xorazm davlati, Chingizxon istilosi, Jaloliddin jasorati va Amir Temur saltanati."
                    : "Государство Хорезмшахов, походы Чингисхана, подвиг Джалолиддина и эпоха Амира Темура."}
                </p>
                <div className="text-xs font-bold text-violet-400 flex items-center gap-1 pt-2">
                  <span>8-sinf darsligi</span>
                  <ChevronRight size={14} />
                </div>
              </div>

              {/* Card 2 */}
              <div className="p-7 rounded-3xl bg-slate-800/90 border border-slate-700 space-y-4 hover:border-sky-500 hover:scale-[1.02] transition-all shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                  <Globe2 size={24} />
                </div>
                <h3 className="text-xl font-bold">
                  {lang === "uz" ? "Jahon tarixi" : "Всемирная история"}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {lang === "uz"
                    ? "Buyuk Fransuz inqilobi, Bastiliya qamali, jahon urushlari va sanoat inqilobi."
                    : "Великая Французская революция, взятие Бастилии, мировые войны и промышленный прогресс."}
                </p>
                <div className="text-xs font-bold text-sky-400 flex items-center gap-1 pt-2">
                  <span>8-sinf darsligi</span>
                  <ChevronRight size={14} />
                </div>
              </div>

              {/* Card 3 */}
              <div className="p-7 rounded-3xl bg-slate-800/90 border border-slate-700 space-y-4 hover:border-emerald-500 hover:scale-[1.02] transition-all shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Trophy size={24} />
                </div>
                <h3 className="text-xl font-bold">
                  {lang === "uz" ? "Vaqt bilan poyga" : "Гонка со временем"}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {lang === "uz"
                    ? "Har bir testda sekundamer ishlaydi. Eng kam vaqtda 100% to'g'ri natija ko'rsating!"
                    : "В каждом тесте работает секундомер. Покажите 100% результат за минимальное время!"}
                </p>
                <div className="text-xs font-bold text-emerald-400 flex items-center gap-1 pt-2">
                  <span>Sekundamer nazorati</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            SECTION 5: FANLARNI TANLASH (#subjects)
           ========================================================= */}
        <section id="subjects" className="w-full max-w-6xl mx-auto px-4 py-28 scroll-mt-16">
          <div className="text-center max-w-xl mx-auto mb-16 space-y-3">
            <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
              8-sinf • Tarix fanlari
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white">
              {strings.subjects.title}
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
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
                  className="glass p-8 sm:p-10 rounded-[32px] flex flex-col justify-between space-y-8 border-2 border-slate-200 dark:border-white/10 hover:border-violet-500 transition-all shadow-lg"
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
                      <span className="text-xs font-bold px-3.5 py-1 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                        {mavzuCount} {strings.subjects.topicsCount} • {savolCount} {strings.subjects.questionsCount}
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                      {fan}
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                      {isUzb ? strings.subjects.uzbDesc : strings.subjects.worldDesc}
                    </p>
                  </div>

                  <Link href={`/${encodeURIComponent(fan)}`} className="block">
                    <button className="btn-gimkit w-full py-4 rounded-xl flex items-center justify-center gap-2">
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
            SECTION 6: BOTTOM GAME ON (Gimkit 8-rasm)
           ========================================================= */}
        <section className="w-full bg-slate-950 text-white py-24 px-4 text-center border-t border-slate-800">
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-4xl sm:text-6xl font-black tracking-tight">
              {lang === "uz" ? "Boshlashga tayyormisiz?" : "Готовы начать?"}
            </h2>
            <p className="text-base sm:text-lg text-slate-400 leading-relaxed">
              {lang === "uz"
                ? "Barcha mavzular bo'yicha bilimlaringizni sinab ko'ring va eng yaxshi natijaga erishing!"
                : "Проверьте свои знания по всем темам и достигните наилучшего результата!"}
            </p>
            <div>
              <Link href="#subjects">
                <button className="btn-gimkit px-10 py-4 text-base sm:text-lg rounded-2xl shadow-xl shadow-violet-600/40">
                  <Zap size={20} />
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
