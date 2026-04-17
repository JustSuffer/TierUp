import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AnimatedBackground from "@/components/AnimatedBackground";
import Navbar from "@/components/Navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TierUp | The Ultimate Tier List Experience",
  description: "Create, customize, share, and explore stunning tier lists with TierUp.",
  icons: {
    // Favicon'u iki farklı şekilde ekleyebilirsiniz:
    // 1. "public" klasörünün içine "favicon.ico" isimli bir dosya atarak (bu satır onu hedefliyor)
    // 2. Veya Next.js App Router standartlarını kullanarak direkt "src/app/" içine "favicon.ico" veya "icon.png" dosyanızı koyarak.
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased min-h-screen relative`}>
        <AnimatedBackground />
        <Navbar />
        <main className="relative z-0 pt-24 pb-12 px-4 sm:px-6 md:px-12 mx-auto max-w-7xl">
          {children}
        </main>
      </body>
    </html>
  );
}
