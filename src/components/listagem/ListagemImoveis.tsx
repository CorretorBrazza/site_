'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Building2, Filter, MapPin, X } from 'lucide-react';
import { Imovel } from '@/types/imovel';
import { processarEOrdenarImoveis } from '@/utils/imovelSorting';
import { useLiveImoveis } from '@/hooks/useLiveImoveis';
import CardImovel from '@/components/CardImovel';
import { Container, Section } from '@/components/ui/container';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Sheet } from '@/components/ui/sheet';
import { FiltrosForm } from '@/components/listagem/FiltrosForm';

export type ModoListagem = 'venda' | 'locacao';

const CONTEUDO: Record<ModoListagem, {
  titulo: string;
  destaque: string;
  descricao: string;
  vazio: string;
  path: string;
  rotuloPreco: string;
}> = {
  venda: {
    titulo: 'Imóveis à venda em',
    destaque: 'Taboão da Serra e imediações',
    descricao: 'Casas, apartamentos e sobrados com dados conferidos e contato direto com o corretor.',
    vazio: 'Nenhum imóvel à venda com esses filtros',
    path: '/venda',
    rotuloPreco: 'Preço máximo de venda',
  },
  locacao: {
    titulo: 'Imóveis para alugar em',
    destaque: 'Taboão da Serra e imediações',
    descricao: 'Opções residenciais e comerciais prontas para morar ou instalar o seu negócio.',
    vazio: 'Nenhum imóvel para alugar com esses filtros',
    path: '/locacao',
    rotuloPreco: 'Aluguel máximo',
  },
};

function filtrosDaUrl(params: URLSearchParams) {
  return {
    bairro: params.get('bairro'),
    tipo: params.get('tipo'),
    precoMax: params.get('precoMax'),
    quartos: params.get('quartos'),
  };
}

function filtrar(imoveis: Imovel[], modo: ModoListagem, filtros: ReturnType<typeof filtrosDaUrl>): Imovel[] {
  let lista = imoveis.filter((i) => {
    const raw = String(i.transacao || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const alvo = modo === 'venda'
      ? raw.includes('venda') || raw.includes('compra') || Boolean(i.precoVenda)
      : raw.includes('loca') || raw.includes('alug') || Boolean(i.precoLocacao);
    return alvo && (i.status === 'Ativo' || !i.status);
  });

  if (filtros.tipo) {
    const tipo = filtros.tipo.toLowerCase();
    lista = lista.filter((i) => i.tipo?.toLowerCase() === tipo);
  }

  if (filtros.precoMax) {
    const max = Number.parseFloat(filtros.precoMax);
    if (Number.isFinite(max)) {
      lista = lista.filter((i) => {
        const preco = modo === 'venda' ? i.precoVenda : i.precoLocacao;
        return (preco ?? 0) > 0 && (preco ?? 0) <= max;
      });
    }
  }

  if (filtros.quartos) {
    const minimo = Number.parseInt(filtros.quartos, 10);
    if (Number.isFinite(minimo)) {
      lista = lista.filter((i) => (i.caracteristicas?.quartos ?? 0) >= minimo);
    }
  }

  if (filtros.bairro && filtros.bairro.trim().length > 0 && !filtros.bairro.toLowerCase().includes('imediações')) {
    const termo = filtros.bairro.toLowerCase().trim();
    lista = lista.filter(
      (i) =>
        i.endereco?.bairro?.toLowerCase().includes(termo) ||
        i.bairro?.toLowerCase().includes(termo) ||
        i.titulo?.toLowerCase().includes(termo),
    );
  }

  return processarEOrdenarImoveis(lista);
}

/**
 * Listagem de imóveis (venda e locação compartilham este componente).
 *
 * Antes eram dois arquivos quase idênticos (`VendaClient`/`LocacaoClient`) que
 * divergiam na hora de filtrar preço. Aqui a única diferença é o `modo`, e os
 * filtros ficam em um drawer — no mobile, o botão "Filtros" abre um painel em
 * vez de empurrar a página.
 */
export function ListagemImoveis({ imoveis, modo }: { imoveis: Imovel[]; modo: ModoListagem }) {
  const { imoveis: atuais } = useLiveImoveis(imoveis);
  const searchParams = useSearchParams();
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);

  const filtros = filtrosDaUrl(searchParams);
  const lista = filtrar(atuais, modo, filtros);
  const config = CONTEUDO[modo];

  const temFiltro = Boolean(
    (filtros.tipo)
    || (filtros.precoMax)
    || (filtros.quartos)
    || (filtros.bairro && !filtros.bairro.toLowerCase().includes('imediações')),
  );

  return (
    <>
      <Section tone="navy" spacing="compact" className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 right-1/4 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl"
        />
        <Container className="relative z-10">
          <Badge tone="gold" className="mb-4 border border-gold-500/30 bg-gold-500/10">
            <MapPin className="h-3 w-3" aria-hidden="true" />
            Taboão da Serra e imediações
          </Badge>

          <h1 className="max-w-3xl text-3xl font-bold leading-tight text-white sm:text-4xl">
            {config.titulo} <span className="text-gold-400">{config.destaque}</span>
          </h1>

          <p className="mt-3 max-w-2xl text-sm text-white/70 sm:text-base">{config.descricao}</p>

          <p className="mt-4 text-xs font-bold uppercase tracking-wider text-white/50">
            {lista.length} {lista.length === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}
          </p>
        </Container>
      </Section>

      <Section tone="paper" spacing="compact">
        <Container>
          {/* Barra de filtros */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setFiltrosAbertos(true)}>
                <Filter className="h-4 w-4" aria-hidden="true" />
                Filtros
                {temFiltro && <span className="ml-1 rounded-full bg-gold-500 px-1.5 text-[10px] font-black text-brand-950">!</span>}
              </Button>

              {filtros.tipo && <Badge tone="neutral">{filtros.tipo}</Badge>}
              {filtros.quartos && <Badge tone="neutral">{filtros.quartos}+ quartos</Badge>}
              {filtros.precoMax && <Badge tone="neutral">Até {Number(filtros.precoMax).toLocaleString('pt-BR')}</Badge>}
              {filtros.bairro && !filtros.bairro.toLowerCase().includes('imediações') && (
                <Badge tone="neutral">{filtros.bairro}</Badge>
              )}

              {temFiltro && (
                <Link
                  href={config.path}
                  className="inline-flex items-center gap-1 text-xs font-bold text-muted hover:text-danger"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                  Limpar
                </Link>
              )}
            </div>

            <span className="text-xs font-semibold text-muted">
              {lista.length} {lista.length === 1 ? 'resultado' : 'resultados'}
            </span>
          </div>

          {lista.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {lista.map((imovel) => (
                <CardImovel key={imovel.id} imovel={imovel} />
              ))}
            </div>
          ) : (
            <EmptyState
              icone={<Building2 className="h-10 w-10" aria-hidden="true" />}
              titulo={config.vazio}
              descricao="Tente remover um filtro ou buscar por regiões vizinhas em Taboão da Serra e imediações."
              acao={(
                <Link href={config.path} className="text-sm font-extrabold text-brand-900 underline underline-offset-4 hover:text-gold-700">
                  Ver todos os imóveis
                </Link>
              )}
            />
          )}
        </Container>
      </Section>

      <Sheet
        aberto={filtrosAbertos}
        aoFechar={() => setFiltrosAbertos(false)}
        titulo="Filtrar imóveis"
        lado="right"
      >
        <FiltrosForm
          basePath={config.path}
          valores={filtros}
          idPrefix="filtro-drawer"
          rotuloPreco={config.rotuloPreco}
          aoAplicar={() => setFiltrosAbertos(false)}
        />
      </Sheet>
    </>
  );
}
