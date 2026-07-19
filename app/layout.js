import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Sora, Inter, IBM_Plex_Mono, Noto_Sans_Bengali } from "next/font/google";

const sora = Sora({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-display", display: "swap" });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-body", display: "swap" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-mono", display: "swap" });
const notoBengali = Noto_Sans_Bengali({ subsets: ["bengali"], weight: ["400", "500", "600", "700"], variable: "--font-bengali", display: "swap" });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "JobNews — সরকারি ও বেসরকারি চাকরির সর্বশেষ আপডেট",
    template: "%s | JobNews"
  },
  description:
    "প্রতিদিনের সরকারি ও বেসরকারি চাকরির খবর — vacancy, eligibility, salary, last date সহ সম্পূর্ণ তথ্য। রাজ্য, জেলা, শিক্ষাগত যোগ্যতা অনুযায়ী চাকরি খুঁজুন।",
  keywords: [
    "job news", "sarkari naukri", "government jobs", "chakrir khobor",
    "job vacancy", "railway jobs", "bank jobs", "state govt jobs"
  ],
  openGraph: {
    type: "website",
    siteName: "JobNews",
    locale: "bn_IN"
  },
  robots: { index: true, follow: true }
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn" className={`${sora.variable} ${inter.variable} ${plexMono.variable} ${notoBengali.variable}`}>
      <body className="font-body bg-paper text-ink min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
