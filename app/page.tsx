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

  const subjectText = (fan: string) => {
    if (fan.includes("O'zbekiston")) {
      return uz
        ? "Davlatlar, sulolalar, janglar va tarixiy shaxslar."
        : "Государства, династии, сражения и исторические личности.";
    }
    return uz
      ? "Jahon voqealari, inqiloblar, urushlar va madaniyat."
      : "Мировые события, революции, войны и культура.";
  };

  const featureItems = uz
    ? [
        [BookOpen, "ABCD testlari", "Har bir savolda to‘rt aniq variant va tez javob."],
        [Timer, "Jonli vaqt", "Test boshlanishidan tugashigacha avtomatik sekundamer."],
        [Award, "Aniq natija", "To‘g‘ri javoblar, xatolar va umumiy foizni ko‘ring."],
        [Globe2, "Ikki til", "Platformani o‘zbek yoki rus tilida ishlating."],
      ]
    : [
        [BookOpen, "Тесты ABCD", "Четыре чётких варианта и быстрый выбор ответа."],
        [Timer, "Живое время", "Автоматический таймер от начала до конца теста."],
        [Award, "Точный результат", "Смотрите правильные ответы, ошибки и общий процент."],
        [Globe2, "Два языка", "Используйте платформу на узбекском или русском."],
      ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-(--bg) text-(--text)">
      <Navbar />

      <main>
        <section className="comic-hero border-b-[3px] border-(--border) py-12 sm:py-16 lg:py-20">
          <div className="site-container grid items-center gap-12 lg:grid-cols-[1.08fr_.92fr] lg:gap-12">
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <span className="comic-badge mb-5 bg-white text-[#111]">
                <Sparkles size={15} />
                {uz ? "8-sinf uchun interaktiv tarix" : "Интерактивная история для 8-го класса"}
              </span>

              <h1 className="max-w-180 text-[clamp(2.25rem,6vw,4.25rem)] leading-[1.1] tracking-[-0.02em] text-(--text)">
                {uz ? "Tarixni " : "Изучайте "}
                <span className="text-(--comic-purple)">{uz ? "qiziqarli o‘rganing" : "историю легко"}</span>
              </h1>

              <p className="mt-6 max-w-[60ch] text-base leading-[1.6] text-[#334155] sm:text-lg dark:text-slate-200">
                {uz
                  ? "Mavzular, testlar, vaqt va natijalarni bir joyda boshqaradigan zamonaviy o‘quv platformasi."
                  : "Современная учебная платформа для тем, тестов, времени и результатов в одном месте."}
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link href="#subjects">
                  <button className="comic-button flex h-13 w-full items-center justify-center gap-2 px-7 sm:w-auto" type="button">
                    <Gamepad2 size={20} />{uz ? "Testni boshlash" : "Начать тест"}<ArrowRight size={18} />
                  </button>
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {[
                  [CheckCircle2, uz ? "ABCD variantlari" : "Варианты ABCD"],
                  [Timer, uz ? "Jonli timer" : "Живой таймер"],
                  [Trophy, uz ? "To‘liq natija" : "Полный результат"],
                ].map(([Icon, label]) => {
                  const BadgeIcon = Icon as typeof CheckCircle2;
                  return <span key={String(label)} className="comic-badge"><BadgeIcon size={16} />{String(label)}</span>;
                })}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .35, delay: .08 }} className="w-full max-w-130 justify-self-center lg:justify-self-end">
              <div className="comic-panel rotate-[0.4deg] bg-[#111827] p-6 text-white">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[.16em] text-(--comic-teal)">Visola psi</p>
                    <p className="mt-1 text-sm font-black">{uz ? "Amir Temur davri" : "Эпоха Амира Темура"}</p>
                  </div>
                  <span className="flex shrink-0 items-center gap-2 rounded-full border-2 border-white bg-white/10 px-3 py-2 text-sm font-black"><Timer size={16} />00:42</span>
                </div>

                <div className="mt-5 rounded-xl border-2 border-white/70 bg-white/10 p-4 text-center text-base font-black leading-6">
                  {uz ? "Amir Temur 1370-yilda qaysi shaharni poytaxt qilgan?" : "Какой город Амир Темур сделал столицей в 1370 году?"}
                </div>

                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {[
                    ["A", uz ? "Koshon" : "Кашан", "#ff3b6b"],
                    ["B", uz ? "Andijon" : "Андижан", "#2563eb"],
                    ["C", uz ? "Samarqand" : "Самарканд", "#00c2a8"],
                    ["D", uz ? "Buxoro" : "Бухара", "#ffb800"],
                  ].map(([letter, answer, color]) => (
                    <div key={letter} className="flex min-h-14 items-center gap-3 rounded-xl border-2 border-white px-3 py-2 text-sm font-black" style={{ backgroundColor: String(color), color: letter === "D" ? "#111" : "#fff" }}>
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-white text-xs">{letter}</span>
                      <span>{answer}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="text-xs font-black">5 / 10</span>
                  <div className="h-3 flex-1 overflow-hidden rounded-full border-2 border-white bg-white/20"><div className="h-full w-1/2 bg-(--comic-yellow)" /></div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="section-space border-b-[3px] border-(--border) bg-(--bg-elevated)">
          <div className="site-container">
            <div className="mx-auto max-w-[60ch] text-center">
              <h2 className="comic-title text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.2]">{uz ? "O‘quvni oddiy va natijali qiling" : "Сделайте обучение простым и эффективным"}</h2>
              <p className="mt-3 text-base leading-[1.6] text-slate-600 dark:text-slate-300">{uz ? "To‘liq quiz tajribasi va tushunarli natijalar bir joyda." : "Полный опыт тестирования и понятные результаты в одном месте."}</p>
            </div>

            <div className="mt-10 grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featureItems.map(([Icon, title, text], index) => {
                const FeatureIcon = Icon as typeof BookOpen;
                return (
                  <motion.article key={String(title)} whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 10 }} viewport={{ once: true }} className="comic-panel flex min-h-55 flex-col p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-[#111] bg-(--comic-teal) text-[#111] shadow-[3px_3px_0_#111]">
                      <FeatureIcon size={24} strokeWidth={2.5} />
                    </div>
                    <h3 className="text-lg font-normal">{String(title)}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{String(text)}</p>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="subjects" className="section-space border-b-[3px] border-(--border) bg-(--bg) scroll-mt-20">
          <div className="site-container">
            <div className="mx-auto max-w-[60ch] text-center">
              <span className="comic-badge mb-4 bg-(--comic-yellow) text-[#111]">8-sinf</span>
              <h2 className="comic-title text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.2]">{uz ? "Fanni tanlang" : "Выберите предмет"}</h2>
              <p className="mt-3 text-base leading-[1.6] text-slate-600 dark:text-slate-300">{uz ? "Tarix yo‘nalishini tanlab, mavzu bo‘yicha testni boshlang." : "Выберите направление истории и начните тест по теме."}</p>
            </div>

            <div className="mx-auto mt-10 grid max-w-225 gap-6 md:grid-cols-2">
              {fanlar.map((fan) => (
                <article key={fan} className="comic-panel relative flex min-h-70 flex-col p-6">
                  <span className="absolute right-4 top-4 comic-badge bg-(--comic-yellow) text-[#111]">
                    {getMavzular(fan).length} {uz ? "ta mavzu" : "тем"}
                  </span>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-[#111] bg-(--comic-purple) text-white shadow-[3px_3px_0_#111]">
                    {fan.includes("O'zbekiston") ? <BookOpen size={24} /> : <Globe2 size={24} />}
                  </div>
                  <h3 className="mt-4 text-2xl">{fan}</h3>
                  <p className="mt-2 flex-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{subjectText(fan)}</p>
                  <div className="mt-4 flex items-center justify-between gap-3 border-t-2 border-[#111] pt-4 dark:border-white">
                    <span className="text-sm font-black">{getSavollarSoni(fan)} {uz ? "ta savol" : "вопросов"}</span>
                    <Link href={`/${encodeURIComponent(fan)}`}><button className="comic-button flex h-13 items-center gap-2 px-5 text-sm" type="button">{uz ? "Boshlash" : "Начать"}<ArrowRight size={17} /></button></Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="comic-cta section-space text-center">
          <div className="site-container">
            <h2 className="comic-title text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.2] text-[#111]">{uz ? "Bilimingizni sinab ko‘ring" : "Проверьте свои знания"}</h2>
            <p className="mx-auto mt-3 max-w-[60ch] text-base leading-[1.6] text-[#111]">{uz ? "Testni boshlang, natijangizni o‘ling va xatolar ustida ishlang." : "Начните тест, получите результат и проанализируйте ошибки."}</p>
            <Link href="#subjects"><button className="mt-8 h-14 rounded-[14px] border-[3px] border-[#111] bg-white px-9 text-base font-black text-[#111] shadow-[5px_5px_0_#111] transition-transform hover:translate-x-0.5 hover:translate-y-0.5" type="button"><Zap size={18} className="mr-2 inline" />{uz ? "Testni boshlash" : "Начать тест"}</button></Link>
          </div>
        </section>
      </main>

      <footer className="bg-(--comic-cream) px-4 py-10 text-center dark:bg-slate-950">
        <div className="site-container flex flex-col items-center gap-4">
          <div className="comic-title flex items-center gap-2 text-lg text-[#111] dark:text-white"><Sparkles size={18} />Visola psi</div>
          <nav className="flex flex-wrap justify-center gap-6 text-sm font-black"><Link href="#subjects">{uz ? "Test" : "Тест"}</Link><Link href="/admin">{uz ? "Admin panel" : "Админ Панель"}</Link></nav>
          <p className="text-xs text-slate-600 dark:text-slate-400">© 2026 Visola psi. {uz ? "Barcha huquqlar himoyalangan." : "Все права защищены."}</p>
        </div>
      </footer>
    </div>
  );
}