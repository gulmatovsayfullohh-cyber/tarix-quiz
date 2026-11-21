import type { Metadata } from "next";
import { Outfit, Nunito, Russo_One } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-outfit",
});

const nunito = Nunito({
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-nunito",
});

const russo = Russo_One({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: "400",
  variable: "--font-russo",
});

export const metadata: Metadata = {
  title: "Visola psi — Tarix Quiz",
  description:
    "Visola psi: 8-sinf o'quvchilari uchun O'zbekiston tarixi va Jahon tarixi bo'yicha interaktiv test platformasi.",
  keywords: ["Visola psi", "tarix", "quiz", "test", "8-sinf", "O'zbekiston tarixi"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const t = localStorage.getItem('app_theme');
                if (t === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className={`${nunito.variable} ${russo.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
