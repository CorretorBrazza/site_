import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";

import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BannerAutoResponder from "@/components/BannerAutoResponder";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://imoveistaboao.com.br'),
  title: "imoveistaboão, Sua casa em Taboão da Serra",
  description: "Encontre os melhores imóveis para venda e locação em Taboão da Serra e região.",
  openGraph: {
    title: "imoveistaboão, Sua casa em Taboão da Serra",
    description: "Encontre os melhores imóveis para venda e locação em Taboão da Serra e região.",
    images: ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "imoveistaboão, Sua casa em Taboão da Serra",
    description: "Encontre os melhores imóveis para venda e locação em Taboão da Serra e região.",
    images: ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200'],
  },
  verification: {
    google: 'oQxjY9vnc0x9K0xHcXK2pw4lzr9lj4tcbQa2fIbXdok',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head />
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 flex flex-col min-h-screen`}>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2483076017143821"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-PYS517T5RR"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-PYS517T5RR');
          `}
        </Script>
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <BannerAutoResponder />
      </body>
    </html>
  );
}
