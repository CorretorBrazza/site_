'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Imovel } from '@/types/imovel';
import { fetchBrokerApi } from '@/lib/api';
import ModalExclusaoInteligente from './components/ModalExclusaoInteligente';
import ModalAcervoFotos from './components/ModalAcervoFotos';
import ModalMediaKit from './components/ModalMediaKit';
import { HardDrive, RefreshCw, Trash2, Edit, Sparkles, Clock, ExternalLink, CircleAlert } from 'lucide-react';

interface TabelaImoveisProps {
  imoveis: Imovel[];
}

const statusMeta = (rawStatus?: string) => {
  const status = String(rawStatus || '').toUpperCase();
  if (['DELIVERED', 'PUBLISHED', 'ATIVO'].includes(status)) return { label: 'Publicado', note: 'Pronto para divulgação', tone: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' };
  if (['PENDING_APPROVAL', 'QUEUED_FOR_REVIEW'].includes(status)) return { label: 'Aguardando aprovação', note: 'Confira o link enviado no WhatsApp', tone: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
  if (['REJECTED'].includes(status)) return { label: 'Precisa de ajuste', note: 'Revise e gere uma nova versão', tone: 'bg-rose-500/20 text-rose-300 border-rose-500/30' };
  if (['EXPIRED', 'EXPIRADO'].includes(status)) return { label: 'Expirado', note: 'Reative usando 1 crédito', tone: 'bg-rose-500/20 text-rose-400 border-rose-500/30' };
  return { label: 'Em processamento', note: 'Estamos preparando seu anúncio', tone: 'bg-blue-500/20 text-blue-300 border-blue-500/30' };
};

export default function TabelaImoveis({ imoveis }: TabelaImoveisProps) {
  const [filtroTransacao, setFiltroTransacao] = useState<'Todos' | 'Venda' | 'Locação'>('Todos');
  const [renovandoId, setRenovandoId] = useState<string | null>(null);

  // Estados dos modais
  const [exclusaoModal, setExclusaoModal] = useState<{ isOpen: boolean; adId: string; referencia: string }>({
    isOpen: false,
    adId: '',
    referencia: '',
  });

  const [acervoModal, setAcervoModal] = useState<{ isOpen: boolean; adId: string; referencia: string }>({
    isOpen: false,
    adId: '',
    referencia: '',
  });

  const [mediaKitModal, setMediaKitModal] = useState<{ isOpen: boolean; referencia: string; mediaKit: any }>({
    isOpen: false,
    referencia: '',
    mediaKit: null,
  });

  const handleRenovar = async (adId: string, ref: string) => {
    if (!confirm(`Deseja reativar o imóvel ${ref} por mais 90 dias usando 1 crédito?`)) return;

    setRenovandoId(adId);
    try {
      const json = await fetchBrokerApi('/anuncios/renovar', {
        method: 'POST',
        body: JSON.stringify({ ad_id: adId }),
      });
      if (json.success) {
        alert(json.message || 'Anúncio renovado por mais 90 dias!');
        window.location.reload();
      } else {
        alert(json.message || 'Saldo insuficiente para renovar.');
      }
    } catch {
      alert('Erro ao renovar anúncio.');
    } finally {
      setRenovandoId(null);
    }
  };

  const formatCurrency = (val?: number | null) => {
    if (!val) return 'Consulte';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const imoveisFiltrados = imoveis.filter((imovel) => {
    if (filtroTransacao === 'Todos') return true;
    if (filtroTransacao === 'Venda') return imovel.transacao === 'Venda' || imovel.transacao === 'Venda e Locação';
    if (filtroTransacao === 'Locação') return imovel.transacao === 'Locação' || imovel.transacao === 'Venda e Locação';
    return true;
  });

  return (
    <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
      {/* Barra de Filtros */}
      <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 bg-slate-950/60">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Filtrar por:</span>
          <div className="inline-flex p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setFiltroTransacao('Todos')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                filtroTransacao === 'Todos'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Todos ({imoveis.length})
            </button>
            <button
              onClick={() => setFiltroTransacao('Venda')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                filtroTransacao === 'Venda'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Venda
            </button>
            <button
              onClick={() => setFiltroTransacao('Locação')}
              className={`px-3.5 py-1.5 rounded-lg transition-all ${
                filtroTransacao === 'Locação'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Locação
            </button>
          </div>
        </div>

        <span className="text-xs text-slate-400 font-semibold">
          Exibindo <strong className="text-amber-400">{imoveisFiltrados.length}</strong> de <strong className="text-amber-400">{imoveis.length}</strong> imóveis
        </span>
      </div>

      {imoveisFiltrados.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[11px] font-extrabold tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-5 py-4 w-20 text-center">Foto Capa</th>
                <th className="px-5 py-4">Ref</th>
                <th className="px-6 py-4">Imóvel / Detalhes</th>
                <th className="px-5 py-4">Valor</th>
                <th className="px-5 py-4">Status / Validade</th>
                <th className="px-6 py-4">Media Kit & Acervo</th>
                <th className="px-5 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200 text-xs">
              {imoveisFiltrados.map((imovel) => {
                const fotoCapa = imovel.fotos && imovel.fotos.length > 0 ? imovel.fotos[0] : null;
                const rawStatus = String(imovel.workflow_status || imovel.status || '').toUpperCase();
                const isExpirado = ['EXPIRED', 'EXPIRADO'].includes(rawStatus);
                const isAtivo = ['DELIVERED', 'PUBLISHED', 'ATIVO'].includes(rawStatus);
                const status = statusMeta(rawStatus);
                const valorExibicao = imovel.transacao === 'Locação' ? formatCurrency(imovel.precoLocacao) : formatCurrency(imovel.precoVenda);

                return (
                  <tr key={imovel.id} className="hover:bg-slate-800/40 transition-colors">
                    
                    {/* Foto Capa + Badge de Contagem */}
                    <td className="px-5 py-4 text-center">
                      <div className="relative inline-block group">
                        {fotoCapa ? (
                          <img
                            src={fotoCapa}
                            alt={imovel.titulo}
                            className="w-14 h-14 rounded-xl object-cover border border-slate-700 shadow-md group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-500 text-[10px] font-bold">
                            Sem foto
                          </div>
                        )}
                        <span className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-md">
                          {imovel.fotos?.length || 0} 📷
                        </span>
                      </div>
                    </td>

                    {/* Referência */}
                    <td className="px-5 py-4 font-mono font-black text-amber-400 uppercase text-sm">
                      {imovel.referencia}
                    </td>

                    {/* Título & Bairro */}
                    <td className="px-6 py-4">
                      <div className="font-extrabold text-white line-clamp-2 max-w-xs">{imovel.titulo}</div>
                      <div className="text-[11px] text-slate-400 mt-1 font-semibold flex items-center gap-1.5">
                        <span className="text-amber-500">{imovel.transacao}</span> • <span>{imovel.bairro}</span>
                      </div>
                    </td>

                    {/* Valor */}
                    <td className="px-5 py-4 font-extrabold text-amber-400 whitespace-nowrap text-sm">
                      {valorExibicao}
                    </td>

                    {/* Status / Validade */}
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1 items-start">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm border ${status.tone}`}>
                          {status.label}
                        </span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1 max-w-40">
                          {isAtivo ? <Clock className="w-3 h-3 text-slate-500" /> : <CircleAlert className="w-3 h-3 text-slate-500" />} {isAtivo ? '90 dias de validade' : status.note}
                        </span>
                      </div>
                    </td>

                    {/* Media Kit IA & Acervo Cloudinary */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                        <button
                          onClick={() => setMediaKitModal({ isOpen: true, referencia: imovel.referencia, mediaKit: (imovel as any).media_kit || null })}
                          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 px-3 py-1.5 rounded-xl text-xs font-black transition-all shadow-md flex items-center gap-1.5 whitespace-nowrap"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          Media Kit IA ✨
                        </button>

                        <button
                          onClick={() => setAcervoModal({ isOpen: true, adId: imovel.id, referencia: imovel.referencia })}
                          className="bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap"
                        >
                          <HardDrive className="w-3.5 h-3.5 text-amber-500" />
                          Fotos Cloud ({imovel.fotos?.length || 0})
                        </button>
                      </div>
                    </td>

                    {/* Ações */}
                    <td className="px-5 py-4 text-right whitespace-nowrap space-x-1">
                      {isAtivo && (
                        <Link
                          href={`/imovel/${imovel.id}`}
                          target="_blank"
                          className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-xl inline-block transition-colors"
                          title="Ver Imóvel no Site"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                      )}

                      {isExpirado && (
                        <button
                          onClick={() => handleRenovar(imovel.id, imovel.referencia)}
                          disabled={renovandoId === imovel.id}
                          className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-3 py-1.5 rounded-xl text-xs font-black transition-all inline-flex items-center gap-1 shadow-md"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          {renovandoId === imovel.id ? 'Reativando...' : 'Reativar (1 crédito)'}
                        </button>
                      )}

                      <Link
                        href={`/dashboard/editar/${imovel.id}`}
                        className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-xl inline-block transition-colors"
                        title="Editar Imóvel"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={() => setExclusaoModal({ isOpen: true, adId: imovel.id, referencia: imovel.referencia })}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-xl inline-block transition-colors"
                        title="Excluir Imóvel"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-16 space-y-3 px-6">
          <p className="text-slate-200 font-bold text-sm">Seu painel ainda não tem imóveis.</p>
          <p className="text-slate-400 text-xs max-w-md mx-auto">Envie fotos e os dados principais pelo WhatsApp para iniciar a captação, gerar o Media Kit e receber o link de aprovação.</p>
          <Link href="/como-funciona" className="text-amber-400 font-black text-xs uppercase tracking-wider inline-block hover:underline">
            Ver como criar meu primeiro anúncio
          </Link>
        </div>
      )}

      {/* Modais existentes */}
      <ModalExclusaoInteligente
        isOpen={exclusaoModal.isOpen}
        onClose={() => setExclusaoModal({ isOpen: false, adId: '', referencia: '' })}
        adId={exclusaoModal.adId}
        referencia={exclusaoModal.referencia}
        onSuccess={() => window.location.reload()}
      />

      <ModalAcervoFotos
        isOpen={acervoModal.isOpen}
        onClose={() => setAcervoModal({ isOpen: false, adId: '', referencia: '' })}
        adId={exclusaoModal.adId || acervoModal.adId}
        referencia={acervoModal.referencia}
      />

      <ModalMediaKit
        isOpen={mediaKitModal.isOpen}
        onClose={() => setMediaKitModal({ isOpen: false, referencia: '', mediaKit: null })}
        referencia={mediaKitModal.referencia}
        mediaKit={mediaKitModal.mediaKit}
      />
    </div>
  );
}
