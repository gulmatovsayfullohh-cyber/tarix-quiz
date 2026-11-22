import type { Metadata, Viewport } from "next";
import { Nunito, Russo_One } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-body",
});

const russo = Russo_One({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: "400",
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Visola psi — Tarix Quiz",
  description:
    "Visola psi: 8-sinf o'quvchilari uchun O'zbekiston tarixi va Jahon tarixi bo'yicha interaktiv test platformasi.",
  keywords: ["Visola psi", "tarix", "quiz", "test", "8-sinf", "O'zbekiston tarixi"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFF9EE" },
    { media: "(prefers-color-scheme: dark)", color: "#0F1020" },
  ],
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
                const saved = localStorage.getItem('app_theme');
                const theme = saved === 'dark' || saved === 'light'
                  ? saved
                  : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                document.documentElement.dataset.theme = theme;
                document.documentElement.style.colorScheme = theme;
                document.documentElement.classList.toggle('dark', theme === 'dark');
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
