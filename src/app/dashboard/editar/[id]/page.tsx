import { getImoveis } from '@/app/actions/imovel-actions';
import { notFound } from 'next/navigation';
import FormEditarImovel from './FormEditarImovel';

export default async function EditarImovelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const imoveis = await getImoveis();
  const imovel = imoveis.find(i => i.id === id);

  if (!imovel) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Editar Imóvel</h1>
        <p className="text-gray-600 text-sm">Alterando: <span className="font-mono font-bold">{imovel.referencia}</span></p>
      </div>
      
      <FormEditarImovel imovel={imovel} />
    </div>
  );
}
