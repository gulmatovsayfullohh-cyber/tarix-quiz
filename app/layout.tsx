import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Tarix Quiz — 8-sinf",
  description:
    "8-sinf o'quvchilari uchun O'zbekiston tarixi va Jahon tarixi bo'yicha interaktiv test platformasi. Mavzularni o'qib bo'lgach, bilimingizni sinab ko'ring!",
  keywords: ["tarix", "quiz", "test", "8-sinf", "o'zbekiston tarixi", "jahon tarixi"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz">
      <body className={`${outfit.variable} font-outfit antialiased`}>
        {children}
      </body>
    </html>
  );
}
