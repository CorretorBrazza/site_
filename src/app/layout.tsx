import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AnalyticsConsent from "@/components/AnalyticsConsent";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-serif",
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
      <body className={`${plusJakartaSans.variable} ${playfairDisplay.variable} antialiased bg-[#faf9f6] text-slate-800 flex flex-col min-h-screen`}>
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <AnalyticsConsent />
      </body>
    </html>
  );
}
