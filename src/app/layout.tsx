import type { Metadata } from "next";
import "./globals.css";

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
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=Noto+Serif+SC:wght@300;400;500;700&family=Fira+Code:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="min-h-full flex flex-col"
        style={{ backgroundColor: "#050505", color: "#e8e6e3" }}
      >
        {children}
      </body>
    </html>
  );
}
