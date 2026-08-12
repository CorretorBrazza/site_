'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Imovel } from '@/types/imovel';
import ModalExclusaoInteligente from './components/ModalExclusaoInteligente';
import ModalAcervoFotos from './components/ModalAcervoFotos';
import ModalMediaKit from './components/ModalMediaKit';
import { HardDrive, RefreshCw, Trash2, Edit, Sparkles, Clock } from 'lucide-react';

import { API_BASE_URL } from '@/lib/api';

interface TabelaImoveisProps {
  imoveis: Imovel[];
  userEmail?: string;
}

export default function TabelaImoveis({ imoveis, userEmail = 'corretor@taboao.com.br' }: TabelaImoveisProps) {
  const router = useRouter();
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
      const res = await fetch(`${API_BASE_URL}/anuncios/renovar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ad_id: adId, email: userEmail }),
      });

      const json = await res.json();
      if (json.success) {
        alert(json.message || 'Anúncio renovado por mais 90 dias!');
        router.refresh();
      } else {
        alert(json.message || 'Saldo insuficiente para renovar.');
      }
    } catch {
      alert('Erro ao renovar anúncio.');
    } finally {
      setRenovandoId(null);
    }
  };

  const imoveisFiltrados = imoveis.filter((imovel) => {
    if (filtroTransacao === 'Todos') return true;
    if (filtroTransacao === 'Venda') return imovel.transacao === 'Venda' || imovel.transacao === 'Venda e Locação';
    if (filtroTransacao === 'Locação') return imovel.transacao === 'Locação' || imovel.transacao === 'Venda e Locação';
    return true;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Barra de Filtros */}
      <div className="p-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3 bg-gray-50/50">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Filtrar por:</span>
          <div className="inline-flex p-1 bg-gray-100 rounded-lg text-xs font-medium">
            <button
              onClick={() => setFiltroTransacao('Todos')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                filtroTransacao === 'Todos'
                  ? 'bg-white text-gray-900 shadow-xs font-semibold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Todos ({imoveis.length})
            </button>
            <button
              onClick={() => setFiltroTransacao('Venda')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                filtroTransacao === 'Venda'
                  ? 'bg-white text-blue-600 shadow-xs font-semibold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Venda
            </button>
            <button
              onClick={() => setFiltroTransacao('Locação')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                filtroTransacao === 'Locação'
                  ? 'bg-white text-blue-600 shadow-xs font-semibold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Locação
            </button>
          </div>
        </div>

        <span className="text-xs text-gray-500 font-medium">
          Exibindo <strong>{imoveisFiltrados.length}</strong> de <strong>{imoveis.length}</strong> imóveis
        </span>
      </div>

      {imoveisFiltrados.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold">
              <tr>
                <th className="px-4 py-4 w-16 text-center">Capa</th>
                <th className="px-6 py-4">Ref</th>
                <th className="px-6 py-4">Título</th>
                <th className="px-6 py-4">Status / Validade</th>
                <th className="px-6 py-4">Media Kit & Backup</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {imoveisFiltrados.map((imovel) => {
                const fotoCapa = imovel.fotos && imovel.fotos.length > 0 ? imovel.fotos[0] : null;
                const isExpirado = imovel.status === 'Expirado' || (imovel.status as string) === 'expirado';

                return (
                  <tr key={imovel.id} className="hover:bg-gray-50 transition-colors text-sm">
                    <td className="px-4 py-3 text-center">
                      {fotoCapa ? (
                        <img
                          src={fotoCapa}
                          alt={imovel.titulo}
                          className="w-12 h-12 rounded-lg object-cover border border-gray-200 shadow-xs inline-block"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 text-[10px] font-medium inline-block">
                          Sem foto
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 font-mono text-gray-500 uppercase font-bold">{imovel.referencia}</td>

                    <td className="px-6 py-4 font-semibold text-gray-900">
                      <div>{imovel.titulo}</div>
                      <span className="text-[11px] text-gray-400 font-normal">{imovel.transacao}</span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 items-start">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            isExpirado
                              ? 'bg-red-100 text-red-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {imovel.status}
                        </span>
                        <span className="text-[11px] text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          90 dias válidos
                        </span>
                      </div>
                    </td>

                    {/* Botões para Media Kit IA + Backup R2 */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                        <button
                          onClick={() => setMediaKitModal({ isOpen: true, referencia: imovel.referencia, mediaKit: (imovel as any).media_kit || null })}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          Media Kit IA ✨
                        </button>

                        <button
                          onClick={() => setAcervoModal({ isOpen: true, adId: imovel.id, referencia: imovel.referencia })}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
                        >
                          <HardDrive className="w-3.5 h-3.5" />
                          Acervo R2
                        </button>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right space-x-2">
                      {isExpirado && (
                        <button
                          onClick={() => handleRenovar(imovel.id, imovel.referencia)}
                          disabled={renovandoId === imovel.id}
                          className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1 shadow-xs"
                        >
                          <RefreshCw className="w-3 h-3" />
                          {renovandoId === imovel.id ? 'Reativando...' : 'Reativar (1 crédito)'}
                        </button>
                      )}

                      <Link
                        href={`/dashboard/editar/${imovel.id}`}
                        className="text-gray-600 hover:text-blue-600 p-1.5 rounded-lg hover:bg-gray-100 inline-block font-medium"
                        title="Editar Imóvel"
                      >
                        <Edit className="w-4 h-4 inline" />
                      </Link>

                      <button
                        onClick={() => setExclusaoModal({ isOpen: true, adId: imovel.id, referencia: imovel.referencia })}
                        className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 inline-block font-medium"
                        title="Excluir Imóvel"
                      >
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-500">Nenhum imóvel encontrado para este filtro.</p>
          <a href="mailto:anuncios@imoveistaboao.com.br" className="text-blue-600 font-bold mt-2 inline-block hover:underline">
            Envie seus imóveis por e-mail (anuncios@imoveistaboao.com.br)
          </a>
        </div>
      )}

      {/* Modal de Exclusão Inteligente com Pesquisa */}
      <ModalExclusaoInteligente
        isOpen={exclusaoModal.isOpen}
        onClose={() => setExclusaoModal({ isOpen: false, adId: '', referencia: '' })}
        adId={exclusaoModal.adId}
        referencia={exclusaoModal.referencia}
        userEmail={userEmail}
        onSuccess={() => router.refresh()}
      />

      {/* Modal de Acervo de Fotos R2 + Anotações Simples */}
      <ModalAcervoFotos
        isOpen={acervoModal.isOpen}
        onClose={() => setAcervoModal({ isOpen: false, adId: '', referencia: '' })}
        adId={acervoModal.adId}
        referencia={acervoModal.referencia}
      />

      {/* Modal de Media Kit de IA com Botões de Copiar com 1 Clique */}
      <ModalMediaKit
        isOpen={mediaKitModal.isOpen}
        onClose={() => setMediaKitModal({ isOpen: false, referencia: '', mediaKit: null })}
        referencia={mediaKitModal.referencia}
        mediaKit={mediaKitModal.mediaKit}
      />
    </div>
  );
}
