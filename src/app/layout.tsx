import type { Metadata } from "next";
import { Playfair_Display, Noto_Serif_SC, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import NoiseOverlay from "@/components/NoiseOverlay";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

const notoSerifSC = Noto_Serif_SC({
  variable: "--font-noto-serif-sc",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "700"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "MysticDraw - 塔罗占卜",
  description: "探索塔罗的智慧，揭示命运的指引",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${playfair.variable} ${notoSerifSC.variable} ${plusJakarta.variable} h-full antialiased dark`}
      style={{ colorScheme: "dark" }}
    >
      <body className="min-h-full flex flex-col" style={{ backgroundColor: "var(--bg)", color: "var(--text-primary)" }}>
        {/* Background layers */}
        <div className="fixed inset-0 -z-20 bg-layer-0" />
        <div className="fixed inset-0 -z-10 bg-layer-1" />
        <div className="fixed inset-0 -z-10 bg-layer-2" />

        {children}

        <NoiseOverlay />
      </body>
    </html>
  );
}
