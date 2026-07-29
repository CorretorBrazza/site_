'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Imovel } from '@/types/imovel';
import { excluirImovelAction } from '@/app/actions/imovel-server-actions';
import { useState } from 'react';

interface TabelaImoveisProps {
  imoveis: Imovel[];
}

export default function TabelaImoveis({ imoveis }: TabelaImoveisProps) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [filtroTransacao, setFiltroTransacao] = useState<'Todos' | 'Venda' | 'Locação'>('Todos');

  const handleExcluir = async (id: string, ref: string) => {
    if (confirm(`Tem certeza que deseja excluir permanentemente o imóvel ${ref}?`)) {
      setLoadingId(id);
      try {
        await excluirImovelAction(id);
        alert('Imóvel excluído!');
        router.refresh(); // Atualiza a lista
      } catch (error) {
        alert('Erro ao excluir o imóvel.');
      } finally {
        setLoadingId(null);
      }
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
                  ? 'bg-white text-gray-900 shadow-sm font-semibold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Todos ({imoveis.length})
            </button>
            <button
              onClick={() => setFiltroTransacao('Venda')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                filtroTransacao === 'Venda'
                  ? 'bg-white text-blue-600 shadow-sm font-semibold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Venda
            </button>
            <button
              onClick={() => setFiltroTransacao('Locação')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                filtroTransacao === 'Locação'
                  ? 'bg-white text-blue-600 shadow-sm font-semibold'
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
                <th className="px-6 py-4">Tipo</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {imoveisFiltrados.map((imovel) => {
                const fotoCapa = imovel.fotos && imovel.fotos.length > 0 ? imovel.fotos[0] : null;

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
                    <td className="px-6 py-4 font-mono text-gray-500 uppercase">{imovel.referencia}</td>
                    <td className="px-6 py-4 font-semibold text-gray-900">{imovel.titulo}</td>
                    <td className="px-6 py-4">{imovel.transacao}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${imovel.status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                        {imovel.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <Link href={`/dashboard/editar/${imovel.id}`} className="text-blue-600 hover:text-blue-800 font-semibold">
                        Editar
                      </Link>
                      <button
                        onClick={() => handleExcluir(imovel.id, imovel.referencia)}
                        disabled={loadingId === imovel.id}
                        className="text-red-500 hover:text-red-700 font-semibold disabled:text-gray-400"
                      >
                        {loadingId === imovel.id ? 'Excluindo...' : 'Excluir'}
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
          <Link href="/dashboard/novo" className="text-blue-600 font-bold mt-2 inline-block">Cadastre um imóvel</Link>
        </div>
      )}
    </div>
  );
}

