import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans, Tiro_Devanagari_Hindi } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Providers } from "@/lib/store";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const body = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const hindi = Tiro_Devanagari_Hindi({
  variable: "--font-hindi",
  subsets: ["devanagari", "latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Laxmi Balaji PG Pune — Cozy PGs in Hinjewadi, Wakad, Baner",
  description:
    "Laxmi Balaji PG — 8 cozy homes across 5 Pune localities. Flagship PG-2 for boys in Hinjewadi Phase 1. Twin & triple sharing, homely food, Wi-Fi, CCTV security. Request a callback or book a visit.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${hindi.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-body">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
