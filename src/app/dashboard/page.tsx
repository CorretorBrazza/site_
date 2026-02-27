import { getImoveis } from '@/app/actions/imovel-server-actions';
import Link from 'next/link';
import TabelaImoveis from './TabelaImoveis';

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
      
      <TabelaImoveis imoveis={imoveis} />
    </div>
  );
}
