'use client';

import { useEffect, useState } from 'react';
import {
  Building2,
  Check,
  Copy,
  Home,
  KeyRound,
  Link2,
  MessageCircle,
  Phone,
  ShieldCheck,
  User,
} from 'lucide-react';
import CardImovel from '@/components/CardImovel';
import { Imovel } from '@/types/imovel';
import { copiarTexto } from '@/lib/clipboard';
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
  const [copiado, setCopiado] = useState(false);
  const [origem, setOrigem] = useState('');

  // Só no cliente: o HTML servidor mostra o caminho, o navegador completa com
  // a origem real (produção, preview ou localhost) sem quebrar hidratação.
  useEffect(() => {
    setOrigem(window.location.origin);
  }, []);

  const slugCanonico = corretor.slug;
  const linkVitrine = `${origem}/corretor/${slugCanonico}/`;
  const whatsAppUrl = urlWhatsappCorretor(corretor.telefone, corretor.nome);
  const telefoneVisivel = corretor.exibir_telefone !== false && Boolean(corretor.telefone);
  const telefoneExibicao = corretor.telefone_exibicao || formatarTelefoneBrasil(corretor.telefone);

  const handleCopiarLink = async () => {
    const ok = await copiarTexto(linkVitrine);
    if (ok) {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    }
  };

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
    <div className="bg-slate-50 text-brand-900">
      {/* Hero / Perfil do Corretor — o header do site já vem do root layout. */}
      <section className="relative overflow-hidden border-b border-line bg-gradient-to-b from-white via-slate-50 to-slate-100 pt-8 pb-10">
        <div className="absolute left-1/2 top-0 h-64 w-full max-w-4xl -translate-x-1/2 rounded-full bg-gold/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-4xl px-4">
          <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-start sm:gap-6 sm:text-left">
            <div className="relative shrink-0">
              <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-gold/60 bg-white shadow-xl sm:h-32 sm:w-32">
                {corretor.foto_perfil_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={corretor.foto_perfil_url}
                    alt={`Foto de ${corretor.nome}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-12 w-12 text-brand-900/30" />
                )}
              </div>
            </div>

            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <h1 className="text-2xl font-black tracking-tight text-brand-900 sm:text-3xl">
                  {corretor.nome}
                </h1>
                {corretor.creci && (
                  <span className="flex items-center gap-1 rounded-full border border-gold/50 bg-gold/10 px-2.5 py-0.5 text-xs font-bold text-gold-700">
                    <ShieldCheck className="h-3.5 w-3.5" /> CRECI {corretor.creci}
                  </span>
                )}
              </div>

              {corretor.apresentacao ? (
                <p className="max-w-2xl text-sm leading-relaxed text-gray-600">{corretor.apresentacao}</p>
              ) : (
                <p className="text-sm italic text-gray-500">
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
                    <span className="flex items-center gap-1.5 font-mono text-xs text-gray-600">
                      <Phone className="h-3.5 w-3.5 text-gray-400" /> {telefoneExibicao}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Link canônico da vitrine, sempre visível e copiável. */}
          <div className="mt-6 rounded-xl border border-gold/30 bg-white/90 p-3 sm:p-4 shadow-sm">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gold-700">
                <Link2 className="h-3.5 w-3.5" /> Link oficial da vitrine
              </span>
              <button
                type="button"
                onClick={handleCopiarLink}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-bold transition-all ${
                  copiado
                    ? 'border-success/40 bg-success/10 text-success'
                    : 'border-line bg-white text-brand-900 hover:bg-slate-50'
                }`}
              >
                {copiado ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copiado ? 'Link copiado!' : 'Copiar link'}
              </button>
            </div>
            <input
              type="text"
              readOnly
              value={linkVitrine}
              aria-label="Link da vitrine do corretor"
              onFocus={(event) => event.currentTarget.select()}
              className="w-full min-w-0 truncate rounded-lg border border-line bg-slate-50 px-3 py-2 font-mono text-xs text-brand-900"
            />
            <p className="mt-2 text-[11px] text-gray-500">
              Compartilhe este endereço no Instagram, WhatsApp ou na bio. Ele sempre abre a vitrine oficial.
            </p>
          </div>

          {/* Cards de Métricas Resumo */}
          <div className="mt-6 grid grid-cols-3 gap-2.5 border-t border-line pt-6 sm:gap-4">
            <div className="rounded-xl border border-line bg-white p-3 text-center shadow-sm">
              <div className="text-[11px] font-medium uppercase tracking-wider text-gray-500 sm:text-xs">Imóveis Ativos</div>
              <div className="mt-0.5 text-lg font-black text-brand-900 sm:text-2xl">{totais.total}</div>
            </div>
            <div className="rounded-xl border border-line bg-white p-3 text-center shadow-sm">
              <div className="text-[11px] font-medium uppercase tracking-wider text-gold-700 sm:text-xs">Para Venda</div>
              <div className="mt-0.5 text-lg font-black text-gold-700 sm:text-2xl">{totais.venda}</div>
            </div>
            <div className="rounded-xl border border-line bg-white p-3 text-center shadow-sm">
              <div className="text-[11px] font-medium uppercase tracking-wider text-sky-700 sm:text-xs">Para Locação</div>
              <div className="mt-0.5 text-lg font-black text-sky-700 sm:text-2xl">{totais.locacao}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Conteúdo: Blocos de Imóveis. O <main> é o do root layout. */}
      <div className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex max-w-full items-center gap-1.5 overflow-x-auto rounded-xl border border-line bg-white p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setTabAtiva('todos')}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                tabAtiva === 'todos' ? 'bg-gold text-brand-950 shadow-sm' : 'text-gray-600 hover:text-brand-900 hover:bg-slate-50'
              }`}
            >
              <Building2 className="h-3.5 w-3.5" />
              Todos ({totais.total})
            </button>
            <button
              type="button"
              onClick={() => setTabAtiva('venda')}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                tabAtiva === 'venda' ? 'bg-gold text-brand-950 shadow-sm' : 'text-gray-600 hover:text-brand-900 hover:bg-slate-50'
              }`}
            >
              <Home className="h-3.5 w-3.5" />
              Venda ({totais.venda})
            </button>
            <button
              type="button"
              onClick={() => setTabAtiva('locacao')}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                tabAtiva === 'locacao' ? 'bg-gold text-brand-950 shadow-sm' : 'text-gray-600 hover:text-brand-900 hover:bg-slate-50'
              }`}
            >
              <KeyRound className="h-3.5 w-3.5" />
              Locação ({totais.locacao})
            </button>
          </div>

          <span className="hidden text-xs text-gray-500 sm:inline">
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
          <div className="mx-auto max-w-lg rounded-2xl border border-line bg-white px-4 py-16 text-center shadow-sm">
            <Building2 className="mx-auto mb-3 h-12 w-12 text-gray-300" />
            <h3 className="mb-1 text-base font-bold text-brand-900">Nenhum imóvel nesta categoria</h3>
            <p className="mb-4 text-xs text-gray-500">
              O corretor {corretor.nome} ainda não possui imóveis com este filtro de transação.
            </p>
            <button
              type="button"
              onClick={() => setTabAtiva('todos')}
              className="rounded-lg bg-gold px-4 py-2 text-xs font-bold text-brand-950 transition-colors hover:bg-gold-400"
            >
              Ver todos os imóveis ({totais.total})
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
