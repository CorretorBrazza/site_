'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  Check,
  Copy,
  ExternalLink,
  Home,
  KeyRound,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  User,
} from 'lucide-react';
import CardImovel from '@/components/CardImovel';
import { Imovel } from '@/types/imovel';

interface VitrineData {
  corretor: {
    nome: string;
    telefone: string;
    codigo_corretor: string;
    slug: string;
    foto_perfil_url?: string;
    apresentacao?: string;
    creci?: string;
    total_anuncios: number;
  };
  imoveis: {
    venda: any[];
    locacao: any[];
    todos: any[];
  };
  totais: {
    total: number;
    venda: number;
    locacao: number;
  };
}

export default function VitrineCorretorClient({ initialData }: { initialData: VitrineData }) {
  const { corretor, imoveis, totais } = initialData;
  const [tabAtiva, setTabAtiva] = useState<'todos' | 'venda' | 'locacao'>('todos');
  const [copiado, setCopiado] = useState(false);

  const telefoneLimpo = (corretor.telefone || '').replace(/\D/g, '');
  const whatsAppUrl = telefoneLimpo
    ? `https://wa.me/55${telefoneLimpo}?text=${encodeURIComponent(
        `Olá ${corretor.nome}! Vi sua vitrine no portal Imóveis Taboão e gostaria de mais informações sobre seus imóveis.`
      )}`
    : null;

  const handleCopiarLink = async () => {
    try {
      if (typeof window !== 'undefined') {
        await navigator.clipboard.writeText(window.location.href);
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2500);
      }
    } catch {
      // fallback
    }
  };

  // Normalização para o formato do CardImovel
  const normalizarImovel = (ad: any): Imovel => {
    const dados = ad.dados_refinados || ad;
    const rawFotos = Array.isArray(ad.fotos)
      ? ad.fotos.map((f: any) => (typeof f === 'string' ? f : f.url_optimized || f.url || ''))
      : [];

    return {
      id: ad.ad_id || ad.id,
      referencia: ad.referencia || ad.id,
      titulo: dados.titulo || ad.titulo || 'Imóvel em Taboão da Serra',
      descricao: dados.descricao || '',
      transacao: ad.transacao || dados.transacao || 'Venda',
      tipoImovel: dados.tipoImovel || dados.tipo || 'Imóvel Residencial',
      endereco: {
        rua: dados.endereco?.rua || '',
        numero: dados.endereco?.numero || '',
        bairro: dados.endereco?.bairro || dados.bairro || 'Taboão da Serra',
        cidade: dados.endereco?.cidade || 'Taboão da Serra',
        estado: dados.endereco?.estado || 'SP',
        cep: dados.endereco?.cep || '',
      },
      caracteristicas: {
        quartos: dados.quartos ?? dados.caracteristicas?.quartos ?? null,
        suites: dados.suites ?? dados.caracteristicas?.suites ?? null,
        banheiros: dados.banheiros ?? dados.caracteristicas?.banheiros ?? null,
        vagas: dados.vagas ?? dados.caracteristicas?.vagas ?? null,
        areaUtil: dados.areaUtil ?? dados.caracteristicas?.areaUtil ?? null,
      },
      precoVenda: ad.precoVenda ?? dados.precoVenda ?? null,
      precoLocacao: ad.precoLocacao ?? dados.precoLocacao ?? null,
      precoPacote: ad.precoPacote ?? dados.precoPacote ?? null,
      fotos: rawFotos,
      status: 'Ativo',
      destaque: true,
      corretor: {
        nome: corretor.nome,
        telefone: corretor.telefone,
      },
    };
  };

  const listaExibicao = (
    tabAtiva === 'venda'
      ? imoveis.venda
      : tabAtiva === 'locacao'
      ? imoveis.locacao
      : imoveis.todos
  ).map(normalizarImovel);

  return (
    <div className="min-h-screen bg-[#070e1c] text-white">
      {/* Barra Superior Minimalista */}
      <header className="border-b border-brand-800/80 bg-brand-950/70 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-lg bg-gold/20 border border-gold/40 flex items-center justify-center text-gold group-hover:scale-105 transition-transform">
              <Home className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-sm sm:text-base tracking-tight text-white group-hover:text-gold transition-colors">
              IMÓVEIS TABOÃO
            </span>
          </Link>

          <button
            onClick={handleCopiarLink}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
              copiado
                ? 'bg-success/20 text-success border-success/40'
                : 'bg-brand-900 text-white-80 border-brand-700/80 hover:text-white'
            }`}
          >
            {copiado ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copiado ? 'Link Copiado' : 'Compartilhar Vitrine'}
          </button>
        </div>
      </header>

      {/* Hero / Perfil do Corretor (Mobile-First) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-950 via-brand-900 to-[#070e1c] pt-8 pb-10 border-b border-brand-800/60">
        {/* Glow de fundo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-gold/5 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6 text-center sm:text-left">
            {/* Foto de Perfil */}
            <div className="relative shrink-0">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-gold/50 shadow-2xl overflow-hidden bg-brand-850 flex items-center justify-center">
                {corretor.foto_perfil_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={corretor.foto_perfil_url}
                    alt={corretor.nome}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-white-40">
                    <User className="w-12 h-12" />
                  </div>
                )}
              </div>
              <span className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-success border-2 border-brand-950 flex items-center justify-center shadow-md" title="Corretor Verificado">
                <Check className="w-3.5 h-3.5 text-brand-950 stroke-[3]" />
              </span>
            </div>

            {/* Informações Textuais */}
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {corretor.nome}
                </h1>
                {corretor.creci && (
                  <span className="bg-gold/15 border border-gold/40 text-gold text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> CRECI {corretor.creci}
                  </span>
                )}
              </div>

              {corretor.apresentacao ? (
                <p className="text-white-70 text-sm leading-relaxed max-w-2xl">
                  {corretor.apresentacao}
                </p>
              ) : (
                <p className="text-white-50 text-sm italic">
                  Corretor especialista em imóveis residenciais e comerciais em Taboão da Serra e região.
                </p>
              )}

              {/* Botão de Contato WhatsApp Principal */}
              {whatsAppUrl && (
                <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <a
                    href={whatsAppUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-success hover:bg-success/90 text-brand-950 font-bold text-sm shadow-lg shadow-success/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    Falar no WhatsApp
                  </a>
                  {corretor.telefone && (
                    <span className="text-xs text-white-60 font-mono flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-white-40" /> {corretor.telefone}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Cards de Métricas Resumo */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-4 mt-8 pt-6 border-t border-brand-800/60">
            <div className="bg-brand-900/60 border border-brand-800 rounded-xl p-3 text-center">
              <div className="text-[11px] sm:text-xs text-white-60 font-medium uppercase tracking-wider">Imóveis Ativos</div>
              <div className="text-lg sm:text-2xl font-black text-white mt-0.5">{totais.total}</div>
            </div>
            <div className="bg-brand-900/60 border border-brand-800 rounded-xl p-3 text-center">
              <div className="text-[11px] sm:text-xs text-gold font-medium uppercase tracking-wider">Para Venda</div>
              <div className="text-lg sm:text-2xl font-black text-gold mt-0.5">{totais.venda}</div>
            </div>
            <div className="bg-brand-900/60 border border-brand-800 rounded-xl p-3 text-center">
              <div className="text-[11px] sm:text-xs text-[#00b4d8] font-medium uppercase tracking-wider">Para Locação</div>
              <div className="text-lg sm:text-2xl font-black text-[#00b4d8] mt-0.5">{totais.locacao}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Conteúdo: Blocos de Imóveis (Venda e Locação) */}
      <main className="max-w-6xl mx-auto px-4 py-8 sm:py-10">
        {/* Filtros em Abas / Mobile-First */}
        <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
          <div className="flex items-center gap-1.5 p-1 bg-brand-900/80 border border-brand-800 rounded-xl overflow-x-auto max-w-full">
            <button
              onClick={() => setTabAtiva('todos')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                tabAtiva === 'todos'
                  ? 'bg-gold text-brand-950 shadow-sm'
                  : 'text-white-70 hover:text-white'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              Todos ({totais.total})
            </button>
            <button
              onClick={() => setTabAtiva('venda')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                tabAtiva === 'venda'
                  ? 'bg-gold text-brand-950 shadow-sm'
                  : 'text-white-70 hover:text-white'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              Venda ({totais.venda})
            </button>
            <button
              onClick={() => setTabAtiva('locacao')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                tabAtiva === 'locacao'
                  ? 'bg-gold text-brand-950 shadow-sm'
                  : 'text-white-70 hover:text-white'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              Locação ({totais.locacao})
            </button>
          </div>

          <span className="text-xs text-white-50 hidden sm:inline">
            Exibindo {listaExibicao.length} {listaExibicao.length === 1 ? 'imóvel' : 'imóveis'}
          </span>
        </div>

        {/* Listagem em Grade */}
        {listaExibicao.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {listaExibicao.map((imovel) => (
              <div key={imovel.id} className="h-full">
                <CardImovel imovel={imovel} />
              </div>
            ))}
          </div>
        ) : (
          /* Estado Vazio Amigável */
          <div className="text-center py-16 px-4 bg-brand-900/30 border border-brand-800/80 rounded-2xl max-w-lg mx-auto">
            <Building2 className="w-12 h-12 text-white-30 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">Nenhum imóvel nesta categoria</h3>
            <p className="text-xs text-white-60 mb-4">
              O corretor {corretor.nome} ainda não possui imóveis com este filtro de transação.
            </p>
            <button
              onClick={() => setTabAtiva('todos')}
              className="px-4 py-2 bg-brand-800 hover:bg-brand-700 text-white text-xs font-bold rounded-lg transition-colors"
            >
              Ver todos os imóveis ({totais.total})
            </button>
          </div>
        )}
      </main>

      {/* Rodapé da Vitrine */}
      <footer className="border-t border-brand-800/80 bg-brand-950 py-8 px-4 text-center text-xs text-white-50">
        <p className="mb-2">
          Vitrine oficial de <strong>{corretor.nome}</strong> vinculada ao portal <strong>imoveistaboao.com.br</strong>
        </p>
        <p className="text-[11px] text-white-40">
          Taboão da Serra e Região &bull; Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}
