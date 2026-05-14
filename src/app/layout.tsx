import type { Metadata } from "next";
import { Exo_2, Orbitron } from "next/font/google";
import "./globals.css";

const exo2 = Exo_2({
  variable: "--font-exo2",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const siteTitle = "刘岩 | 前端工程师 · Web3 · React / Next.js";
const siteDescription =
  "11 年前端经验，聚焦 React / Next.js、BFF 与多链 DApp；企业级云平台、性能优化与多端交付。Base 北京。";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: siteTitle,
    template: `%s · 刘岩`,
  },
  description: siteDescription,
  keywords: [
    "前端",
    "React",
    "Next.js",
    "Web3",
    "DApp",
    "北京",
    "刘岩",
    "TypeScript",
  ],
  authors: [{ name: "刘岩" }],
  openGraph: {
    type: "website",
    locale: "zh_CN",
    title: siteTitle,
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${exo2.variable} ${orbitron.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-root text-fg">{children}</body>
    </html>
  );
}
