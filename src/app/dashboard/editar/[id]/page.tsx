'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { getAnuncioForBroker } from '@/lib/api';
import FormEditarImovel from './FormEditarImovel';
import { Imovel } from '@/types/imovel';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function EditarImovelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [imovel, setImovel] = useState<Imovel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function carregarAnuncio() {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const res = await getAnuncioForBroker(id);
        if (res.success && res.data) {
          const ad = res.data;
          const refinados = ad.dados_refinados || {};
          const end = refinados.endereco || {};
          const carac = refinados.caracteristicas || {};
          const fotosUrls = (ad.fotos || []).map((f: any) => (typeof f === 'string' ? f : f.url)).filter(Boolean);

          const imovelFormatado: Imovel = {
            id: ad.ad_id || id,
            referencia: ad.referencia || 'BRA',
            titulo: refinados.titulo || `Imóvel ${ad.referencia || id}`,
            descricao: refinados.descricao || '',
            tipoImovel: refinados.tipoImovel || 'Apartamento',
            transacao: ad.transacao === 'Locacao' || refinados.transacao === 'Locacao' ? 'Locação' : (refinados.transacao || 'Venda'),
            precoVenda: refinados.precoVenda || undefined,
            precoLocacao: refinados.precoLocacao || undefined,
            valorCondominio: refinados.valorCondominio || undefined,
            iptuMensal: refinados.iptuMensal || undefined,
            condominio: refinados.condominio || '',
            endereco: {
              rua: end.rua || '',
              numero: end.numero || '',
              bairro: end.bairro || 'Taboão da Serra',
              cidade: end.cidade || 'Taboão da Serra',
              estado: end.estado || 'SP',
              cep: end.cep || '',
            },
            caracteristicas: {
              quartos: carac.quartos ?? 0,
              suites: carac.suites ?? 0,
              banheiros: carac.banheiros ?? 0,
              vagas: carac.vagas ?? 0,
              areaUtil: carac.areaUtil ?? 0,
              areaTotal: carac.areaTotal ?? 0,
            },
            fotos: fotosUrls,
            destaque: false,
            status: ad.status === 'DELIVERED' || ad.status === 'PUBLISHED' || ad.status === 'ATIVO' ? 'Ativo' : 'Inativo',
            workflow_status: ad.status,
            created_at: ad.created_at,
          };

          setImovel(imovelFormatado);
        } else {
          setError(res.error || res.message || 'Não foi possível carregar os dados deste imóvel.');
        }
      } catch (err: any) {
        setError(err.message || 'Erro de conexão ao carregar anúncio.');
      } finally {
        setLoading(false);
      }
    }

    carregarAnuncio();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 p-8">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-slate-600 font-semibold text-sm">Carregando dados do anúncio...</p>
      </div>
    );
  }

  if (error || !imovel) {
    return (
      <div className="max-w-3xl mx-auto p-8 my-8 bg-rose-50 border border-rose-200 rounded-3xl text-center space-y-4">
        <div className="inline-flex p-3 bg-rose-100 rounded-2xl text-rose-600">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-rose-900">Não foi possível abrir o editor</h1>
        <p className="text-sm text-rose-700 max-w-md mx-auto">{error || 'Anúncio não encontrado ou sem permissão de acesso.'}</p>
        <div className="pt-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Voltar ao Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Editar Anúncio {imovel.referencia}</h1>
          </div>
          <p className="text-xs text-slate-500 font-medium pl-8">
            Atualize as informações cadastrais e comerciais do imóvel diretamente no portal.
          </p>
        </div>
      </div>

      <FormEditarImovel imovel={imovel} />
    </div>
  );
}
