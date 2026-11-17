import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import AnalyticsConsent from "@/components/AnalyticsConsent";
import PwaRegister from "@/components/PwaRegister";
import { safeJsonLd } from "@/lib/jsonld";

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
  manifest: '/manifest.webmanifest',
  applicationName: 'Imóveis Taboão',
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Imóveis Taboão',
  },
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
        <meta name="theme-color" content="#091731" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(globalJsonLd) }}
        />
      </head>
      <body className={`${plusJakartaSans.variable} ${playfairDisplay.variable} flex min-h-screen flex-col bg-paper text-ink antialiased`}>
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-brand-900 focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white"
        >
          Pular para o conteúdo
        </a>
        <SiteHeader />
        <main id="conteudo" className="flex-grow">
          {children}
        </main>
        <SiteFooter />
        <AnalyticsConsent />
        <PwaRegister />
      </body>
    </html>
  );
}
