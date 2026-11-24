'use client';

import { useState } from 'react';
import {
  Building2,
  Home,
  KeyRound,
  MessageCircle,
  Phone,
  ShieldCheck,
  User,
} from 'lucide-react';
import CardImovel from '@/components/CardImovel';
import { Imovel } from '@/types/imovel';
import { formatarTelefoneBrasil, urlWhatsappCorretor } from '@/lib/telefone';

interface VitrineData {
  corretor: {
    nome: string;
    telefone: string;
    telefone_exibicao?: string;
    exibir_telefone?: boolean;
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

  const whatsAppUrl = urlWhatsappCorretor(corretor.telefone, corretor.nome);
  const telefoneVisivel = corretor.exibir_telefone !== false && Boolean(corretor.telefone);
  const telefoneExibicao = corretor.telefone_exibicao || formatarTelefoneBrasil(corretor.telefone);

  // Normalização para o formato do CardImovel. A API já entrega o payload
  // compacto; este mapper só traduz para o tipo do componente.
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
      isNovo: Boolean(ad.isNovo),
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
    <div className="bg-[#070e1c] text-white">
      {/* Hero / Perfil do Corretor — o header do site já vem do root layout. */}
      <section className="relative overflow-hidden border-b border-brand-800/60 bg-gradient-to-b from-brand-950 via-brand-900 to-[#070e1c] pt-8 pb-10">
        <div className="absolute left-1/2 top-0 h-64 w-full max-w-4xl -translate-x-1/2 rounded-full bg-gold/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-4xl px-4">
          <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-start sm:gap-6 sm:text-left">
            <div className="relative shrink-0">
              <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-gold/50 bg-brand-850 shadow-2xl sm:h-32 sm:w-32">
                {corretor.foto_perfil_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={corretor.foto_perfil_url}
                    alt={`Foto de ${corretor.nome}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-12 w-12 text-white-40" />
                )}
              </div>
            </div>

            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                  {corretor.nome}
                </h1>
                {corretor.creci && (
                  <span className="flex items-center gap-1 rounded-full border border-gold/40 bg-gold/15 px-2.5 py-0.5 text-xs font-bold text-gold">
                    <ShieldCheck className="h-3.5 w-3.5" /> CRECI {corretor.creci}
                  </span>
                )}
              </div>

              {corretor.apresentacao ? (
                <p className="max-w-2xl text-sm leading-relaxed text-white-70">{corretor.apresentacao}</p>
              ) : (
                <p className="text-sm italic text-white-50">
                  Corretor especialista em imóveis residenciais e comerciais em Taboão da Serra e região.
                </p>
              )}

              {whatsAppUrl && (
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2 sm:justify-start">
                  <a
                    href={whatsAppUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-success px-5 py-2.5 text-sm font-bold text-brand-950 shadow-lg shadow-success/20 transition-all hover:scale-[1.02] hover:bg-success/90 active:scale-[0.98]"
                  >
                    <MessageCircle className="h-4 w-4 fill-current" />
                    Falar no WhatsApp
                  </a>
                  {telefoneVisivel && (
                    <span className="flex items-center gap-1.5 font-mono text-xs text-white-60">
                      <Phone className="h-3.5 w-3.5 text-white-40" /> {telefoneExibicao}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Cards de Métricas Resumo */}
          <div className="mt-6 grid grid-cols-3 gap-2.5 border-t border-brand-800/60 pt-6 sm:gap-4">
            <div className="rounded-xl border border-brand-800 bg-brand-900/60 p-3 text-center">
              <div className="text-[11px] font-medium uppercase tracking-wider text-white-60 sm:text-xs">Imóveis Ativos</div>
              <div className="mt-0.5 text-lg font-black text-white sm:text-2xl">{totais.total}</div>
            </div>
            <div className="rounded-xl border border-brand-800 bg-brand-900/60 p-3 text-center">
              <div className="text-[11px] font-medium uppercase tracking-wider text-gold sm:text-xs">Para Venda</div>
              <div className="mt-0.5 text-lg font-black text-gold sm:text-2xl">{totais.venda}</div>
            </div>
            <div className="rounded-xl border border-brand-800 bg-brand-900/60 p-3 text-center">
              <div className="text-[11px] font-medium uppercase tracking-wider text-[#00b4d8] sm:text-xs">Para Locação</div>
              <div className="mt-0.5 text-lg font-black text-[#00b4d8] sm:text-2xl">{totais.locacao}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Conteúdo: Blocos de Imóveis. O <main> é o do root layout. */}
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex max-w-full items-center gap-1.5 overflow-x-auto rounded-xl border border-brand-800 bg-brand-900/80 p-1">
            <button
              type="button"
              onClick={() => setTabAtiva('todos')}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                tabAtiva === 'todos' ? 'bg-gold text-brand-950 shadow-sm' : 'text-white-70 hover:text-white'
              }`}
            >
              <Building2 className="h-3.5 w-3.5" />
              Todos ({totais.total})
            </button>
            <button
              type="button"
              onClick={() => setTabAtiva('venda')}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                tabAtiva === 'venda' ? 'bg-gold text-brand-950 shadow-sm' : 'text-white-70 hover:text-white'
              }`}
            >
              <Home className="h-3.5 w-3.5" />
              Venda ({totais.venda})
            </button>
            <button
              type="button"
              onClick={() => setTabAtiva('locacao')}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                tabAtiva === 'locacao' ? 'bg-gold text-brand-950 shadow-sm' : 'text-white-70 hover:text-white'
              }`}
            >
              <KeyRound className="h-3.5 w-3.5" />
              Locação ({totais.locacao})
            </button>
          </div>

          <span className="hidden text-xs text-white-50 sm:inline">
            Exibindo {listaExibicao.length} {listaExibicao.length === 1 ? 'imóvel' : 'imóveis'}
          </span>
        </div>

        {listaExibicao.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {listaExibicao.map((imovel) => (
              <div key={imovel.id} className="h-full">
                <CardImovel imovel={imovel} />
              </div>
            ))}
          </div>
        ) : (
          <div className="mx-auto max-w-lg rounded-2xl border border-brand-800/80 bg-brand-900/30 px-4 py-16 text-center">
            <Building2 className="mx-auto mb-3 h-12 w-12 text-white-30" />
            <h3 className="mb-1 text-base font-bold text-white">Nenhum imóvel nesta categoria</h3>
            <p className="mb-4 text-xs text-white-60">
              O corretor {corretor.nome} ainda não possui imóveis com este filtro de transação.
            </p>
            <button
              type="button"
              onClick={() => setTabAtiva('todos')}
              className="rounded-lg bg-brand-800 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-brand-700"
            >
              Ver todos os imóveis ({totais.total})
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
