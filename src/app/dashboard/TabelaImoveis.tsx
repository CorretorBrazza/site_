'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Imovel } from '@/types/imovel';
import { fetchBrokerApi } from '@/lib/api';
import ModalExclusaoInteligente from './components/ModalExclusaoInteligente';
import ModalAcervoFotos from './components/ModalAcervoFotos';
import ModalMediaKit from './components/ModalMediaKit';
import { HardDrive, RefreshCw, Trash2, Edit, Sparkles, Clock, ExternalLink, CircleAlert, Link2, Check } from 'lucide-react';

interface TabelaImoveisProps {
  imoveis: Imovel[];
}

const statusMeta = (rawStatus?: string) => {
  const status = String(rawStatus || '').toUpperCase();
  if (['DELIVERED', 'PUBLISHED', 'ATIVO'].includes(status)) return { label: 'Publicado', note: 'Pronto para divulgação', tone: 'bg-success/10 text-success border-success/30' };
  if (['PENDING_APPROVAL', 'QUEUED_FOR_REVIEW'].includes(status)) return { label: 'Aguardando aprovação', note: 'Confira o link enviado no WhatsApp', tone: 'bg-gold/10 text-gold border-gold/30' };
  if (['AWAITING_CREDITS', 'SEM_SALDO'].includes(status)) return { label: 'Aguardando liberação', note: 'Use "Liberar" para revalidar o saldo e retomar o processamento', tone: 'bg-danger/10 text-danger border-danger/30' };
  if (status === 'EXPIRED') return { label: 'Expirado', note: 'Renove para voltar ao ar', tone: 'bg-muted/10 text-muted border-muted/30' };
  if (['FAILED', 'REJECTED'].includes(status)) return { label: 'Com pendência', note: 'Revise os dados antes de publicar', tone: 'bg-danger/10 text-danger border-danger/30' };
  return { label: 'Em análise', note: 'Estamos preparando este anúncio', tone: 'bg-brand-800/5 text-brand-900 border-line' };
};

export default function TabelaImoveis({ imoveis }: TabelaImoveisProps) {
  const [selecionadoParaExcluir, setSelecionadoParaExcluir] = useState<Imovel | null>(null);
  const [selecionadoParaBackup, setSelecionadoParaBackup] = useState<Imovel | null>(null);
  const [selecionadoParaIA, setSelecionadoParaIA] = useState<Imovel | null>(null);
  const [linkCopiadoId, setLinkCopiadoId] = useState<string | null>(null);
  const [loadingIA, setLoadingIA] = useState<string | null>(null);

  const handleCopiarLink = async (imovel: Imovel) => {
    const referencia = imovel.referencia || imovel.id;
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://imoveistaboao.com.br';
    const link = `${baseUrl}/imovel/${referencia}`;
    try {
      await navigator.clipboard.writeText(link);
      setLinkCopiadoId(imovel.id);
      setTimeout(() => setLinkCopiadoId(null), 2500);
    } catch {
      // fallback
    }
  };

  // Ação exclusiva de anúncios AWAITING_CREDITS/SEM_SALDO. O botão "IA" continua
  // abrindo o Media Kit (que só visualiza/copia conteúdo); este é o único lugar
  // que dispara o endpoint de liberação, para não repetir o erro de sequestrar
  // um botão que já tinha uma função.
  const handleLiberar = async (imovel: Imovel) => {
    setLoadingIA(imovel.id);
    try {
      const res = await fetchBrokerApi(`/me/anuncios/${imovel.id}/regenerar`, {
        method: 'POST',
      });

      if (res.success) {
        const msg = res.data?.message || res.message || 'Anúncio liberado para processamento. Atualizando o painel...';
        alert(msg);
        window.location.reload();
      } else {
        alert('Não foi possível liberar o anúncio: ' + (res.error || res.message || 'Falha de comunicação.'));
      }
    } catch (err: any) {
      alert('Falha na requisição: ' + err.message);
    } finally {
      setLoadingIA(null);
    }
  };

  // Não desabilitar "Liberar" pelo saldo projetado no painel: o backend
  // revalida no momento da liberação e desconta a reserva do PRÓPRIO anúncio
  // (credit-recovery.service.ts:87-95). Com saldo=1 e 1 reservado neste ad,
  // o front via 0 e travava justamente o caso que o backend liberaria.

  if (imoveis.length === 0) {
    return (
      <div className="bg-white border border-line rounded-3xl shadow-sm overflow-hidden">
        <div className="p-8 sm:p-10 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-brand-900/5 border border-brand-700/20 flex items-center justify-center mx-auto">
            <Sparkles className="w-7 h-7 text-brand-800" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-brand-900">Nenhum imóvel no painel ainda</h3>
            <p className="text-sm text-muted max-w-md mx-auto">
              Envie seu primeiro imóvel para acompanhar status, aprovação, publicação e vitrine em um só lugar.
            </p>
          </div>
          <div className="pt-1">
            <Link href="/dashboard/novo" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-900 text-white text-sm font-bold hover:bg-brand-800 transition-colors">
              <Sparkles className="w-4 h-4" /> Cadastrar primeiro imóvel
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-line rounded-3xl shadow-sm overflow-hidden text-brand-900">
      <div className="p-4 sm:p-6 border-b border-line flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-paper/50">
        <div>
          <h3 className="text-lg font-bold text-brand-900">Acompanhamento de Imóveis</h3>
          <p className="text-xs text-muted mt-1">Status claro para saber o que está publicado, pendente ou aguardando ação.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-muted bg-white border border-line rounded-full px-3 py-1">
            {imoveis.length} {imoveis.length === 1 ? 'imóvel' : 'imóveis'}
          </span>
          <button onClick={() => window.location.reload()} className="p-2 rounded-xl border border-line hover:bg-brand-50 transition-colors" title="Atualizar lista" aria-label="Atualizar lista">
            <RefreshCw className="w-4 h-4 text-muted" />
          </button>
        </div>
      </div>

      {/* Mobile-first: cards */}
      <div className="md:hidden divide-y divide-line">
        {imoveis.map((imovel) => {
          const statusInfo = statusMeta(imovel.status as string);
          const isAtivo = ['DELIVERED', 'PUBLISHED', 'ATIVO'].includes(String(imovel.status || '').toUpperCase());
          const isAwaiting = ['AWAITING_CREDITS', 'SEM_SALDO'].includes(String(imovel.status || '').toUpperCase());
          const isPendingApproval = ['PENDING_APPROVAL', 'QUEUED_FOR_REVIEW'].includes(String(imovel.status || '').toUpperCase());
          const referencia = imovel.referencia || imovel.id;

          return (
            <div key={imovel.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-bold text-sm text-brand-900 leading-snug line-clamp-2">
                    {imovel.titulo || `Imóvel ${referencia}`}
                  </p>
                  <p className="text-[11px] text-muted mt-1">Ref: {referencia} • {imovel.endereco?.bairro || 'Taboão da Serra'}</p>
                </div>
                <span className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusInfo.tone}`}>
                  {statusInfo.label}
                </span>
              </div>

              <div className="text-[11px] text-muted leading-snug">
                {statusInfo.note}
                {isAwaiting ? ' (toque em "Liberar" para revalidar o saldo e retomar)' : ''}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                {isAtivo ? (
                  <Link href={`/imovel/${referencia}`} target="_blank" className="col-span-2 inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-brand-900 text-white text-xs font-bold">
                    <ExternalLink className="w-4 h-4" /> Ver anúncio publicado
                  </Link>
                ) : (
                  <div className="col-span-2 inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-paper border border-line text-xs font-semibold text-muted">
                    <CircleAlert className="w-4 h-4" />
                    {isPendingApproval ? 'Aguardando sua aprovação' : isAwaiting ? 'Aguardando liberação/publicação' : 'Em processamento'}
                  </div>
                )}

                {isAwaiting && (
                  <button
                    onClick={() => handleLiberar(imovel)}
                    disabled={loadingIA === imovel.id}
                    className="col-span-2 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-brand-900 text-white text-xs font-bold disabled:opacity-50"
                    title="Revalidar saldo e liberar para processamento"
                  >
                    {loadingIA === imovel.id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    Liberar para processamento
                  </button>
                )}
                <button onClick={() => handleCopiarLink(imovel)} className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-line text-xs font-semibold hover:bg-brand-50">
                  {linkCopiadoId === imovel.id ? <Check className="w-4 h-4 text-success" /> : <Link2 className="w-4 h-4" />}
                  {linkCopiadoId === imovel.id ? 'Copiado' : 'Copiar link'}
                </button>
                <button onClick={() => setSelecionadoParaIA(imovel)} className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-line text-xs font-semibold hover:bg-brand-50">
                  <Sparkles className="w-4 h-4" /> IA
                </button>
                <button onClick={() => setSelecionadoParaBackup(imovel)} className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-line text-xs font-semibold hover:bg-brand-50">
                  <HardDrive className="w-4 h-4" /> Fotos
                </button>
                <Link href={`/dashboard/editar/${imovel.id}`} className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-line text-xs font-semibold hover:bg-brand-50">
                  <Edit className="w-4 h-4" /> Editar
                </Link>
                <button onClick={() => setSelecionadoParaExcluir(imovel)} className="col-span-2 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-danger/20 text-danger text-xs font-semibold hover:bg-danger/5" title="Excluir">
                  <Trash2 className="w-4 h-4" /> Excluir anúncio
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop: tabela */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-sm text-ink min-w-[860px]">
          <thead className="bg-paper text-brand-900 border-b border-line">
            <tr>
              <th className="p-4 font-bold">Imóvel / Status</th>
              <th className="p-4 font-bold">Detalhes</th>
              <th className="p-4 font-bold text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {imoveis.map((imovel) => {
              const statusInfo = statusMeta(imovel.status as string);
              const isAtivo = ['DELIVERED', 'PUBLISHED', 'ATIVO'].includes(String(imovel.status || '').toUpperCase());
              const isAwaiting = ['AWAITING_CREDITS', 'SEM_SALDO'].includes(String(imovel.status || '').toUpperCase());
              const referencia = imovel.referencia || imovel.id;
              return (
                <tr key={imovel.id} className="hover:bg-brand-50/50 transition-colors">
                  <td className="p-4 align-top">
                    <div className="font-bold text-brand-900 mb-1 line-clamp-2">{imovel.titulo || `Imóvel ${referencia}`}</div>
                    <div className="text-xs text-muted">Ref: {referencia}</div>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusInfo.tone}`}>{statusInfo.label}</span>
                      <span className="text-[11px] text-muted">{statusInfo.note}</span>
                    </div>
                    {isAwaiting && (
                      <div className="mt-1 text-[11px] text-muted">
                        {'Use o botão "Liberar" para revalidar o saldo e retomar o processamento.'}
                      </div>
                    )}
                  </td>
                  <td className="p-4 align-top">
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2"><span className="text-muted">Bairro:</span><span className="font-medium">{imovel.endereco?.bairro || 'Taboão da Serra'}</span></div>
                      <div className="flex items-center gap-2"><span className="text-muted">Tipo:</span><span className="font-medium">{imovel.tipoImovel || imovel.tipo || '-'}</span></div>
                      <div className="flex items-center gap-2"><span className="text-muted">Transação:</span><span className="font-medium">{imovel.transacao || '-'}</span></div>
                    </div>
                  </td>
                  <td className="p-4 align-top">
                    <div className="flex flex-wrap justify-center gap-2">
                      {isAtivo ? (
                        <Link href={`/imovel/${referencia}`} target="_blank" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-900 text-white text-xs font-bold">
                          <ExternalLink className="w-4 h-4" /> Ver
                        </Link>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-paper border border-line text-xs font-semibold text-muted">
                          <Clock className="w-4 h-4" /> Pendente
                        </span>
                      )}
                      {isAwaiting && (
                        <button
                          onClick={() => handleLiberar(imovel)}
                          disabled={loadingIA === imovel.id}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-900 text-white text-xs font-bold disabled:opacity-50"
                          title="Revalidar saldo e liberar para processamento"
                        >
                          {loadingIA === imovel.id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                          Liberar
                        </button>
                      )}
                      <button onClick={() => handleCopiarLink(imovel)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-line text-xs font-semibold hover:bg-brand-50" title="Copiar link">
                        {linkCopiadoId === imovel.id ? <Check className="w-4 h-4 text-success" /> : <Link2 className="w-4 h-4" />}
                      </button>
                      <button onClick={() => setSelecionadoParaIA(imovel)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-line text-xs font-semibold hover:bg-brand-50" title="Ver Media Kit">
                        <Sparkles className="w-4 h-4" />
                      </button>
                      <button onClick={() => setSelecionadoParaBackup(imovel)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-line text-xs font-semibold hover:bg-brand-50" title="Fotos / acervo">
                        <HardDrive className="w-4 h-4" />
                      </button>
                      <Link href={`/dashboard/editar/${imovel.id}`} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-line text-xs font-semibold hover:bg-brand-50" title="Editar">
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button onClick={() => setSelecionadoParaExcluir(imovel)} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-danger/20 text-danger text-xs font-semibold hover:bg-danger/5" title="Excluir">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selecionadoParaExcluir && (
        <ModalExclusaoInteligente
          isOpen={!!selecionadoParaExcluir}
          adId={selecionadoParaExcluir.id}
          referencia={String(selecionadoParaExcluir.referencia || selecionadoParaExcluir.id)}
          onClose={() => setSelecionadoParaExcluir(null)}
          onSuccess={() => window.location.reload()}
        />
      )}
      {selecionadoParaBackup && (
        <ModalAcervoFotos
          isOpen={!!selecionadoParaBackup}
          adId={selecionadoParaBackup.id}
          referencia={String(selecionadoParaBackup.referencia || selecionadoParaBackup.id)}
          onClose={() => setSelecionadoParaBackup(null)}
        />
      )}
      {selecionadoParaIA && (
        <ModalMediaKit
          isOpen={!!selecionadoParaIA}
          referencia={String(selecionadoParaIA.referencia || selecionadoParaIA.id)}
          mediaKit={(selecionadoParaIA as any).media_kit || (selecionadoParaIA as any).mediaKit || null}
          onClose={() => setSelecionadoParaIA(null)}
        />
      )}
    </div>
  );
}
