'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { resolveReviewToken, ReviewResolveResult, ReviewSnapshot } from '@/lib/api';
import {
  AlertTriangle,
  Clock,
  Loader2,
  RefreshCw,
  MapPin,
  Building2,
  BedDouble,
  Bath,
  Car,
  Ruler,
  Image as ImageIcon,
} from 'lucide-react';

/** Estados possíveis da tela. `carregando` é o inicial, e é onde a leitura do fragmento acontece. */
type EstadoTela = 'carregando' | 'invalido' | 'indisponivel' | 'pronto';

/**
 * Lê o token do fragmento (`#token=...`).
 *
 * O fragmento não é enviado ao servidor HTTP — é por isso que o link usa `#token=` e não
 * `?token=`. Assim o token nunca aparece em log de acesso, em `Referer` nem no histórico do
 * servidor. O único lugar de onde ele pode ser lido é aqui, no navegador.
 */
function lerTokenDoFragmento(): string {
  if (typeof window === 'undefined') return '';
  const hash = window.location.hash || '';
  if (!hash) return '';
  try {
    const params = new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : hash);
    return (params.get('token') || '').trim();
  } catch {
    return '';
  }
}

/**
 * Apaga o fragmento da URL assim que o token é lido.
 *
 * `replaceState` (e não `pushState`) troca a entrada atual em vez de criar uma nova, então o
 * token não fica no histórico nem aparece ao apertar "voltar". Roda ANTES da chamada de rede:
 * se esperasse a resposta, o token ficaria visível na barra de endereço durante toda a
 * requisição, que é justamente a janela em que alguém olhando por cima a leria.
 */
function limparFragmento(): void {
  if (typeof window === 'undefined') return;
  if (!window.location.hash) return;
  window.history.replaceState(null, '', window.location.pathname + window.location.search);
}

/** Mapeia o resultado da API para o estado da tela, sem tocar em estado do React. */
function estadoDoResultado(r: ReviewResolveResult): { estado: EstadoTela; anuncio: ReviewSnapshot | null } {
  if (r.kind === 'ok') return { estado: 'pronto', anuncio: r.anuncio };
  if (r.kind === 'invalid') return { estado: 'invalido', anuncio: null };
  return { estado: 'indisponivel', anuncio: null };
}

const formatarBRL = (valor: number | null): string => {
  if (valor === null || valor === undefined) return 'Valor não informado';
  try {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
  } catch {
    return `R$ ${valor}`;
  }
};

export default function RevisarPage() {
  // O token vive APENAS aqui, em memória, e some quando a aba fecha ou recarrega. Não vai para
  // estado persistente, storage, cookie, console, analytics nem query string. `useRef` em vez de
  // `useState` de propósito: não dispara re-render ao ser setado e não aparece no snapshot de
  // estado do React DevTools como um valor de componente.
  const tokenRef = useRef<string>('');

  const [estado, setEstado] = useState<EstadoTela>('carregando');
  const [anuncio, setAnuncio] = useState<ReviewSnapshot | null>(null);

  useEffect(() => {
    // `tokenRef.current ||` não é redundante: em desenvolvimento o React StrictMode roda o efeito
    // duas vezes (monta, desmonta, monta). A primeira execução lê o fragmento e o apaga; sem o
    // curto-circuito, a segunda leria um hash já vazio e concluiria "link inválido" para um token
    // perfeitamente válido. O ref sobrevive à remontagem simulada, então a segunda execução reusa
    // o token já lido em vez de reler a URL.
    const token = tokenRef.current || lerTokenDoFragmento();
    tokenRef.current = token;
    limparFragmento();

    // `ativo` evita aplicar resultado de uma requisição que terminou depois de o componente
    // sair de tela (e, em React 18 em modo estrito, depois do desmonte simulado).
    //
    // Sem token, `resolveReviewToken('')` devolve `invalid` na hora. O caminho é o mesmo do token
    // inválido de propósito: a tela tem um só desfecho de recusa, e não um ramo "sem token"
    // separado que teria a própria mensagem para manter em sincronia.
    let ativo = true;
    (async () => {
      const resultado = await resolveReviewToken(token);
      if (!ativo) return;
      const proximo = estadoDoResultado(resultado);
      setAnuncio(proximo.anuncio);
      setEstado(proximo.estado);
    })();

    return () => {
      ativo = false;
    };
  }, []);

  // Retry usa o token que já está em memória. Não relê o fragmento — ele foi apagado — e por isso
  // um reload da página depois de um 503 perde o token e cai em "link inválido". É o preço de não
  // deixar o token na URL, e é o preço certo: a alternativa seria manter a credencial visível.
  const tentarNovamente = async () => {
    const token = tokenRef.current;
    if (!token) {
      setEstado('invalido');
      return;
    }
    setEstado('carregando');
    const resultado = await resolveReviewToken(token);
    const proximo = estadoDoResultado(resultado);
    setAnuncio(proximo.anuncio);
    setEstado(proximo.estado);
  };

  if (estado === 'carregando') {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-600">Abrindo a revisão do anúncio...</p>
        </div>
      </div>
    );
  }

  if (estado === 'invalido') {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex items-center justify-center p-6">
        <div className="bg-white border border-red-200 rounded-3xl p-8 text-center shadow-xl space-y-4 max-w-md">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto text-red-600 border border-red-200">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-black text-slate-900">Link inválido ou expirado</h1>
          <p className="text-xs text-slate-600 leading-relaxed">
            Este link de revisão não está mais disponível. Ele pode ter expirado, já ter sido usado
            ou ter sido substituído por um link mais recente.
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md"
            >
              Voltar ao Portal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (estado === 'indisponivel') {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex items-center justify-center p-6">
        <div className="bg-white border border-amber-200 rounded-3xl p-8 text-center shadow-xl space-y-4 max-w-md">
          <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto text-amber-600 border border-amber-200">
            <Clock className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-black text-slate-900">Não foi possível abrir agora</h1>
          <p className="text-xs text-slate-600 leading-relaxed">
            Tivemos um problema temporário ao carregar o anúncio. O seu link continua válido —
            tente novamente em alguns instantes.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={tentarNovamente}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Tentar novamente</span>
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-slate-300 text-slate-700 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-slate-50"
            >
              Voltar ao Portal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!anuncio) {
    return null;
  }

  const dados = anuncio.dados || {};
  const endereco = dados.endereco || {};
  const carac = dados.caracteristicas || {};
  const capa = anuncio.fotos?.[0];
  const demaisFotos = (anuncio.fotos || []).slice(1);

  const caracteristica = (icone: React.ReactNode, rotulo: string, valor: unknown) => {
    if (valor === null || valor === undefined || valor === '') return null;
    if (typeof valor !== 'string' && typeof valor !== 'number') return null;
    return (
      <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
        <span className="text-blue-600 shrink-0">{icone}</span>
        <span className="text-xs text-slate-700 font-bold">
          {rotulo}: {String(valor)}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-8 px-4">
      <main className="max-w-5xl mx-auto space-y-6">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-black px-3 py-1 rounded-xl uppercase">
                REF: {anuncio.referencia || anuncio.ad_id}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {dados.titulo || 'Anúncio de Imóvel'}
            </h1>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>{endereco.bairro || 'Taboão da Serra e imediações'}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Valor</p>
            <p className="text-lg font-black text-slate-900">{formatarBRL(anuncio.valor)}</p>
          </div>
        </div>

        {capa && (
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={capa} alt="Foto principal do anúncio" className="w-full max-h-[420px] object-cover" />
          </div>
        )}

        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <span>Dados do imóvel</span>
          </h2>

          {(dados.tipoImovel || dados.finalidade) && (
            <div className="flex flex-wrap gap-2 text-xs">
              {dados.tipoImovel && (
                <span className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-1 font-bold text-slate-700">
                  {dados.tipoImovel}
                </span>
              )}
              {dados.finalidade && (
                <span className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-1 font-bold text-slate-700">
                  {dados.finalidade}
                </span>
              )}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {caracteristica(<BedDouble className="w-4 h-4" />, 'Quartos', carac.quartos)}
            {caracteristica(<Bath className="w-4 h-4" />, 'Banheiros', carac.banheiros)}
            {caracteristica(<Car className="w-4 h-4" />, 'Vagas', carac.vagas)}
            {caracteristica(<Ruler className="w-4 h-4" />, 'Área', carac.areaUtil ?? carac.areaTotal)}
          </div>

          {dados.descricao && (
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{dados.descricao}</p>
          )}
        </div>

        {demaisFotos.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-blue-600" />
              <span>Fotos ({anuncio.fotos.length})</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {demaisFotos.map((foto, indice) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={`${foto}-${indice}`}
                  src={foto}
                  alt={`Foto ${indice + 2} do anúncio`}
                  className="w-full h-36 object-cover rounded-2xl border border-slate-200"
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
