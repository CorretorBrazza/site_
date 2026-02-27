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

  const handleExcluir = async (id: string, ref: string) => {
    if (confirm(`Tem certeza que deseja excluir permanentemente o imóvel ${ref}?`)) {
      setLoadingId(id);
      try {
        await excluirImovel(id);
        alert('Imóvel excluído!');
        router.refresh(); // Atualiza a lista
      } catch (error) {
        alert('Erro ao excluir o imóvel.');
      } finally {
        setLoadingId(null);
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {imoveis.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Ref</th>
                <th className="px-6 py-4">Título</th>
                <th className="px-6 py-4">Tipo</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {imoveis.map((imovel) => (
                <tr key={imovel.id} className="hover:bg-gray-50 transition-colors text-sm">
                  <td className="px-6 py-4 font-mono text-gray-500 uppercase">{imovel.referencia}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">{imovel.titulo}</td>
                  <td className="px-6 py-4">{imovel.transacao}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      imovel.status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
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
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-500">Nenhum imóvel cadastrado ainda.</p>
          <Link href="/dashboard/novo" className="text-blue-600 font-bold mt-2 inline-block">Cadastre o primeiro</Link>
        </div>
      )}
    </div>
  );
}
