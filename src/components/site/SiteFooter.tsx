import Link from 'next/link';
import { MapPin, Mail, MessageCircle } from 'lucide-react';
import { Logo } from '@/components/brand/Logo';
import { Container } from '@/components/ui/container';
import ContactButton from '@/components/ContactButton';

const NUMERO_WHATSAPP = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5511989161897').replace(/\D/g, '');

const GRUPOS = [
  {
    titulo: 'Navegação',
    itens: [
      { href: '/venda', label: 'Comprar imóveis' },
      { href: '/locacao', label: 'Alugar imóveis' },
      { href: '/como-funciona', label: 'Como funciona a IA' },
      { href: '/demo', label: 'Testar demonstração' },
      { href: '/planos', label: 'Planos e preços' },
    ],
  },
  {
    titulo: 'Para o corretor',
    itens: [
      { href: '/login', label: 'Entrar no painel' },
      { href: '/cadastro', label: 'Criar conta' },
      { href: '/novo', label: 'Anunciar imóvel' },
      { href: '/revisar', label: 'Revisar anúncio' },
    ],
  },
] as const;

/**
 * Rodapé institucional (navy profundo, ouro nos títulos).
 *
 * No mobile as colunas viram blocos empilhados em duas colunas — sem 4 colunas
 * apertadas como no rodapé anterior.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-brand-700/60 bg-brand-950 pt-14 pb-8 text-white/75">
      <Container>
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 space-y-4 md:col-span-2">
            <Logo tom="claro" tamanho={38} />
            <p className="max-w-sm text-sm leading-relaxed text-white/60">
              O portal de referência para quem busca comprar, alugar ou anunciar imóveis em{' '}
              <strong className="font-semibold text-white/80">Taboão da Serra e imediações</strong>.
              Inteligência artificial a serviço do mercado imobiliário.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-sm">
              <a
                href={`https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent('Olá! Vim pelo portal Imóveis Taboão.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-whatsapp/15 px-3 py-2 font-bold text-whatsapp hover:bg-whatsapp/25"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                WhatsApp
              </a>
              <span className="inline-flex items-center gap-2 text-white/60">
                <MapPin className="h-4 w-4 text-gold-400" aria-hidden="true" />
                Taboão da Serra e imediações — SP
              </span>
            </div>
          </div>

          {GRUPOS.map((grupo) => (
            <div key={grupo.titulo}>
              <h3 className="mb-4 text-[11px] font-extrabold uppercase tracking-[0.18em] text-gold-400">
                {grupo.titulo}
              </h3>
              <ul className="space-y-2.5 text-sm">
                {grupo.itens.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-white/70 hover:text-white">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-brand-700/60 pt-6 text-xs text-white/50 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p>
              &copy; {new Date().getFullYear()} Imóveis Taboão • Uma solução{' '}
              <strong className="font-semibold text-white/70">Colega Corretor Estratégia Imobiliária</strong>
            </p>
            <p className="flex flex-wrap items-center gap-x-2">
              <span>CNPJ: 63.188.894/0001-05</span>
              <span aria-hidden="true">•</span>
              <span className="inline-flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                <ContactButton className="underline underline-offset-2 hover:text-white">
                  Atendimento e Ouvidoria
                </ContactButton>
              </span>
            </p>
          </div>

          <nav aria-label="Links legais" className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/politica-de-privacidade" className="hover:text-white">
              Política de Privacidade
            </Link>
            <Link href="/termos-de-uso" className="hover:text-white">
              Termos de Uso
            </Link>
            <Link href="/exclusao-de-dados" className="hover:text-white">
              Exclusão de Dados
            </Link>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
