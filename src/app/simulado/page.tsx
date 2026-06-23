import { Metadata } from 'next';
import SimuladorClient from './SimuladorClient';

export const metadata: Metadata = {
  title: 'Simulador de Financiamento Caixa - Minha Casa Minha Vida | Imóveis Taboão',
  description: 'Simule agora seu financiamento imobiliário Caixa pelo programa Minha Casa Minha Vida. Veja o valor liberado, parcelas e subsídio estimado de forma rápida e gratuita.',
  openGraph: {
    title: 'Simulador de Financiamento Caixa - Minha Casa Minha Vida',
    description: 'Simule agora seu financiamento imobiliário Caixa pelo programa Minha Casa Minha Vida. Veja o valor liberado, parcelas e subsídio estimado.',
    images: ['/images/simulado/conquista-casa.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Simulador de Financiamento Caixa - Minha Casa Minha Vida',
    description: 'Simule agora seu financiamento imobiliário Caixa pelo programa Minha Casa Minha Vida. Veja o valor liberado, parcelas e subsídio estimado.',
    images: ['/images/simulado/conquista-casa.png'],
  }
};

export default function SimuladoPage() {
  return <SimuladorClient />;
}
