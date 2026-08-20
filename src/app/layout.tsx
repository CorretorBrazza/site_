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
  title: "Imóveis Taboão | Sua casa em Taboão da Serra",
  description: "Encontre imóveis para comprar, alugar ou anunciar em Taboão da Serra e imediações.",
  openGraph: {
    title: "Imóveis Taboão | Sua casa em Taboão da Serra",
    description: "Encontre imóveis para comprar, alugar ou anunciar em Taboão da Serra e imediações.",
    images: ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Imóveis Taboão | Sua casa em Taboão da Serra",
    description: "Encontre imóveis para comprar, alugar ou anunciar em Taboão da Serra e imediações.",
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
  const globalJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: 'Imóveis Taboão',
    legalName: 'Colega Corretor Estratégia Imobiliária',
    taxID: '63.188.894/0001-05',
    email: 'contato@colegacorretor.com.br',
    description: 'Plataforma imobiliária inteligente com Inteligência Artificial para compra, venda, locação e publicação de imóveis em Taboão da Serra e região.',
    url: 'https://imoveistaboao.com.br',
    telephone: '+5511989161897',
    image: 'https://imoveistaboao.com.br/favicon.ico',
    priceRange: 'R$ 12,90 - R$ 1.500.000',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Taboão da Serra',
      addressRegion: 'SP',
      addressCountry: 'BR',
      postalCode: '06750-000',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -23.6247,
      longitude: -46.7885,
    },
  };

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(globalJsonLd) }}
        />
      </head>
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
