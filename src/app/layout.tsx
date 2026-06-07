import type { Metadata } from "next";
import "./globals.css";
import NoiseOverlay from "@/components/NoiseOverlay";

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
      className="h-full antialiased dark"
      style={{ colorScheme: "dark" }}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=Noto+Serif+SC:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="min-h-full flex flex-col"
        style={{ backgroundColor: "#050505", color: "#e8e6e3" }}
      >
        {/* Background layers */}
        <div
          className="fixed inset-0 -z-20"
          style={{ background: "#050505" }}
        />
        <div
          className="fixed inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse at 30% 20%, #1a0b2e 0%, transparent 55%), radial-gradient(ellipse at 70% 80%, #0d1b2a 0%, transparent 45%)",
          }}
        />

        {children}

        <NoiseOverlay />
      </body>
    </html>
  );
}
