import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export const metadata: Metadata = {
  title: "DentaFlow — O'zbekistondagi #1 Dental Platform",
  description:
    "Bemorlar, navbatlar, to'lovlar, AI hujjatlar — hammasi bir joyda. 14 kun bepul sinab ko'ring.",
  keywords: "dental software, klinika, tish, navbat, CRM, uzbekistan",
  openGraph: {
    title: "DentaFlow — Raqamli Dental Platform",
    description: "14 kun bepul sinab ko'ring. Karta shart emas.",
    url: "https://dentaflow.uz",
    siteName: "DentaFlow",
    locale: "uz_UZ",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" className={geist.variable}>
      <body>{children}</body>
    </html>
  );
}
