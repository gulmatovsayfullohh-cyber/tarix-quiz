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
  const fanlar = getFanlar();
  const uz = lang === "uz";

  const hero = {
    badge: uz ? "8-sinf uchun interaktiv tarix platformasi" : "Интерактивная история для 8-го класса",
    titleA: uz ? "Tarixni " : "Изучайте ",
    titleB: uz ? "qiziqarli o'rganing" : "историю с интересом",
    desc: uz
      ? "Mavzular, testlar, vaqt va natijalarni bir joyda boshqaradigan zamonaviy o‘quv platformasi."
      : "Современная учебная платформа для тем, тестов, времени и результатов в одном месте.",
    cta: uz ? "Testni boshlash" : "Начать тест",
  };

  const features = uz
    ? [
        ["ABCD testlari", "Har bir savolda to‘rt aniq variant va tez javob"],
        ["Jonli vaqt", "Test boshlanishi va tugashigacha avtomatik sekundamer"],
        ["Ayrim natijalar", "To‘g‘ri javoblar, xatolar va umumiy foizni ko‘ring"],
        ["O‘zbek va rus", "Butun platformani o‘zingizga qulay tilda ishlating"],
      ]
    : [
        ["Тесты ABCD", "Четыре варианта в каждом вопросе и быстрый ответ"],
        ["Живое время", "Автоматический таймер от начала до конца теста"],
        ["Подробные результаты", "Правильные ответы, ошибки и общий процент"],
        ["Узбекский и русский", "Используйте всю платформу на удобном языке"],
      ];

  return (
    <div className="min-h-screen bg-white text-slate-950 dark:bg-slate-950 dark:text-white">
      <Navbar />

      <main>
        {/* =========================================================
            SECTION 1: HERO (Chiroyli va zamonaviy kirish ekran)
           ========================================================= */}
        <section className="relative overflow-hidden border-b border-slate-200/70 px-4 py-20 sm:py-24 lg:py-28 dark:border-white/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(16,185,129,.12),transparent_24%),radial-gradient(circle_at_85%_25%,rgba(37,99,235,.12),transparent_28%)]" />
          <div className="absolute -left-20 top-32 h-56 w-56 rounded-full bg-emerald-300/10 blur-3xl" />

          <div className="site-container relative grid items-center gap-16 lg:grid-cols-[1.08fr_.92fr] lg:gap-20">
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-50 px-3.5 py-2 text-xs font-extrabold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                <Sparkles size={15} />
                {hero.badge}
              </div>

              <h1 className="max-w-3xl text-5xl font-black leading-[.95] tracking-[-0.045em] sm:text-6xl lg:text-[76px]">
                {hero.titleA}
                <span className="block bg-linear-to-r from-emerald-600 via-sky-600 to-blue-700 bg-clip-text text-transparent">{hero.titleB}</span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg dark:text-slate-300">{hero.desc}</p>

              <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                <Link href="#subjects" className="sm:w-auto">
                  <button className="btn-primary min-h-14 w-full px-7 text-base sm:w-auto">
                    <Gamepad2 size={20} />
                    {hero.cta}
                    <ArrowRight size={18} />
                  </button>
                </Link>
                <Link href="/statistika" className="sm:w-auto">
                  <button className="btn-ghost min-h-14 w-full px-6 sm:w-auto">
                    <BarChart2 size={18} />
                    {uz ? "Natijalar" : "Результаты"}
                  </button>
                </Link>
              </div>

              <div className="mt-7 flex flex-wrap gap-3 text-xs font-bold text-slate-600 dark:text-slate-300">
                {[
                  [CheckCircle2, uz ? "ABCD variantlar" : "Варианты ABCD", "text-emerald-500"],
                  [Timer, uz ? "Jonli timer" : "Живой таймер", "text-sky-500"],
                  [Trophy, uz ? "To‘liq natija" : "Полный результат", "text-amber-500"],
                ].map(([Icon, label, color]) => {
                  const ItemIcon = Icon as typeof CheckCircle2;
                  return (
                    <span key={String(label)} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 dark:border-white/10 dark:bg-white/5">
                      <ItemIcon size={15} className={String(color)} /> {String(label)}
                    </span>
                  );
                })}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: .96, x: 20 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ duration: .55, delay: .12 }} className="relative mx-auto w-full max-w-130">
              <div className="absolute -inset-5 rounded-[36px] bg-linear-to-br from-emerald-300/20 via-sky-300/10 to-blue-300/20 blur-2xl" />
              <div className="relative rounded-[30px] border border-slate-200 bg-slate-950 p-4 shadow-[0_30px_80px_-30px_rgba(15,23,42,.75)] sm:p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[.2em] text-emerald-400">Visola psi</p>
                    <p className="mt-1 text-sm font-bold text-white">{uz ? "Amir Temur davri" : "Эпоха Амира Темура"}</p>
                  </div>
                  <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs font-black text-white"><Timer size={14} className="text-sky-400" /> 00:42</div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/7 p-5 text-center text-sm font-extrabold leading-relaxed text-white sm:text-base">
                  {uz ? "Amir Temur 1370-yilda qaysi shaharni poytaxt qilgan?" : "Какой город Амир Темур сделал столицей в 1370 году?"}
                </div>

                <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {[
                    ["A", uz ? "Koshon" : "Кашан", "bg-rose-500"],
                    ["B", uz ? "Andijon" : "Андижан", "bg-blue-600"],
                    ["C", uz ? "Samarqand" : "Самарканд", "bg-emerald-600 ring-2 ring-emerald-300/70"],
                    ["D", uz ? "Buxoro" : "Бухара", "bg-amber-500"],
                  ].map(([letter, answer, color]) => (
                    <div key={letter} className={`flex items-center gap-3 rounded-xl ${color} p-3 text-xs font-bold text-white sm:text-sm`}>
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-black/20 font-black">{letter}</span>
                      <span>{answer}</span>
                      {letter === "C" && <CheckCircle2 size={16} className="ml-auto" />}
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2.5">
                  <span className="text-xs font-bold text-slate-400">5 / 10</span>
                  <div className="h-2 w-32 overflow-hidden rounded-full bg-white/10"><div className="h-full w-1/2 rounded-full bg-linear-to-r from-emerald-400 to-sky-400" /></div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* =========================================================
            SECTION 2: ANSWER & PHONE MOCKUP (Interaktiv Showcase)
           ========================================================= */}
        <section className="border-b border-slate-200 px-4 py-20 dark:border-white/10 sm:py-24 lg:py-28">
          <div className="site-container">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-xs font-black uppercase tracking-[.18em] text-emerald-600">Visola psi</span>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">{uz ? "O‘quvni oddiy va natijali qiling" : "Сделайте обучение простым и эффективным"}</h2>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              {features.map(([title, text], index) => (
                <motion.div key={title} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .06 }} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-slate-900">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                    {index === 0 ? <BookOpen size={20} /> : index === 1 ? <Timer size={20} /> : index === 2 ? <Award size={20} /> : <Globe2 size={20} />}
                  </div>
                  <h3 className="text-base font-extrabold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================
            SECTION 4: FANLARNI TANLASH (#subjects - 2 ta Karta)
           ========================================================= */}
        <section id="subjects" className="bg-slate-50 px-4 py-20 dark:bg-slate-950 sm:py-24 lg:py-28 scroll-mt-16">
          <div className="site-container">
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-50 px-3 py-1.5 text-xs font-bold text-sky-700 dark:bg-sky-500/10 dark:text-sky-300"><Compass size={14} /> 8-sinf</span>
              <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">{uz ? "Fanni tanlang" : "Выберите предмет"}</h2>
              <p className="mt-3 text-sm text-slate-500 sm:text-base dark:text-slate-400">{uz ? "Tarix yo‘nalishini tanlab, mavzu bo‘yicha testni boshlang." : "Выберите направление истории и начните тест по теме."}</p>
            </div>

            <div className="mx-auto mt-14 grid max-w-4xl gap-5 sm:grid-cols-2 lg:gap-8">
              {fanlar.map((fan) => {
                const isUzb = fan.includes("O'zbekiston");
                return (
                  <motion.div key={fan} whileHover={{ y: -4 }} className="rounded-3xl border border-slate-200 bg-white p-7 sm:p-8 shadow-sm dark:border-white/10 dark:bg-slate-900">
                    <div className="flex items-start justify-between">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${isUzb ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10" : "bg-sky-50 text-sky-600 dark:bg-sky-500/10"}`}>
                        {isUzb ? <LandmarkIcon /> : <Globe2 size={24} />}
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 dark:bg-white/10 dark:text-slate-300">{getMavzular(fan).length} {uz ? "mavzu" : "тем"}</span>
                    </div>
                    <h3 className="mt-5 text-2xl font-black">{fan}</h3>
                    <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500 dark:text-slate-400">{isUzb ? (uz ? "O‘zbekiston davlati, sulolalari va tarixiy voqealar." : "Государство Узбекистана, династии и исторические события.") : (uz ? "Jahon tarixidagi muhim davrlar, inqiloblar va urushlar." : "Важные эпохи мировой истории, революции и войны.")}</p>
                    <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 dark:border-white/10">
                      <span className="text-xs font-bold text-slate-400">{getSavollarSoni(fan)} {uz ? "savol" : "вопросов"}</span>
                      <Link href={`/${encodeURIComponent(fan)}`}><button className="btn-primary px-4 py-2.5 text-sm"><span>{uz ? "Boshlash" : "Начать"}</span><ArrowRight size={16} /></button></Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =========================================================
            SECTION 5: BOTTOM GAME ON CTA (Dark Minimalist Banner)
           ========================================================= */}
        <section className="w-full bg-linear-to-r from-emerald-600 via-sky-600 to-blue-700 text-white py-20 sm:py-24 px-4 border-t border-white/10 flex flex-col items-center justify-center text-center">
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
                  <span>{hero.cta}</span>
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 px-4 py-8 text-center text-slate-400">
        <div className="site-container">
          <div className="mb-4 flex items-center justify-center gap-2 text-lg font-black text-white"><Sparkles size={18} className="text-emerald-400" />Visola psi</div>
          <div className="flex flex-wrap justify-center gap-5 text-xs font-bold"><Link href="#subjects" className="hover:text-white">{uz ? "Test" : "Тест"}</Link><Link href="/admin" className="hover:text-white">{uz ? "Admin panel" : "Админ Панель"}</Link><Link href="/statistika" className="hover:text-white">{uz ? "Statistika" : "Статистика"}</Link></div>
          <p className="mt-5 text-[11px]">© 2026 Visola psi. {uz ? "Barcha huquqlar himoyalangan." : "Все права защищены."}</p>
        </div>
      </footer>
    </div>
  );
}

function LandmarkIcon() {
  return <BookOpen size={24} />;
}