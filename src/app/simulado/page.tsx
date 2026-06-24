import { Metadata } from 'next';
import SimuladorClient from './SimuladorClient';

export const metadata: Metadata = {
  title: 'Até quando no aluguel? Simulador de Financiamento Caixa MCMV',
  description: 'Até quando você vai pagar o aluguel de outra pessoa? Simule agora mesmo o seu financiamento imobiliário Caixa pelo programa Minha Casa Minha Vida de forma gratuita.',
  openGraph: {
    title: 'Até quando no aluguel? Simulador de Financiamento Caixa MCMV',
    description: 'Até quando você vai pagar o aluguel de outra pessoa? Faça a simulação de financiamento imobiliário Caixa pelo Minha Casa Minha Vida.',
    images: ['/images/simulado/conquista-casa.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Até quando no aluguel? Simulador de Financiamento Caixa MCMV',
    description: 'Até quando você vai pagar o aluguel de outra pessoa? Simule seu financiamento Caixa MCMV.',
    images: ['/images/simulado/conquista-casa.png'],
  }
};

export default function SimuladoPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': 'Até quando no aluguel? Simulador de Financiamento Caixa MCMV',
    'description': 'Simulador de Financiamento Imobiliário Caixa Econômica Federal e Minha Casa Minha Vida.',
    'url': 'https://imoveistaboao.com.br/simulado',
    'potentialAction': {
      '@type': 'FinancialService',
      'name': 'Simulador de Crédito Imobiliário Caixa',
      'feesAndCommissionsSpecification': 'Grátis'
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SimuladorClient />
    </>
  );
}
