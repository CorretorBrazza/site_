import { getImoveis } from '@/app/actions/imovel-actions';
import Link from 'next/link';

export default async function DashboardPage() {
  const imoveis = await getImoveis();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Gerencie seu catálogo de imóveis. Salve para publicar no site.</p>
        </div>
        <Link href="/dashboard/novo" className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md">
          + Cadastrar Imóvel
        </Link>
      </div>
      
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
                      <button className="text-red-500 hover:text-red-700 font-semibold">
                        Excluir
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
    </div>
  );
}
