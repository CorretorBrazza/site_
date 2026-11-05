'use client';

import { useEffect, useState, use } from 'react';
import { getAnuncioForBroker } from '@/lib/api';
import FormEditarImovel from './FormEditarImovel';
import { Imovel } from '@/types/imovel';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import DashboardShell from '../../components/DashboardShell';

export default function EditarImovelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
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
            titulo: refinados.titulo || '',
            descricao: refinados.descricao || '',
            tipoImovel: refinados.tipoImovel || '',
            transacao: (ad.transacao === 'Locacao' || refinados.transacao === 'Locacao' ? 'Locação' : (refinados.transacao || ad.transacao || '')) as any,
            precoVenda: refinados.precoVenda !== undefined && refinados.precoVenda !== null ? Number(refinados.precoVenda) : undefined,
            precoLocacao: refinados.precoLocacao !== undefined && refinados.precoLocacao !== null ? Number(refinados.precoLocacao) : undefined,
            precoPacote: refinados.precoPacote !== undefined && refinados.precoPacote !== null ? Number(refinados.precoPacote) : undefined,
            valorCondominio: refinados.valorCondominio !== undefined && refinados.valorCondominio !== null ? Number(refinados.valorCondominio) : undefined,
            iptuMensal: refinados.iptuMensal !== undefined && refinados.iptuMensal !== null ? Number(refinados.iptuMensal) : undefined,
            condominio: refinados.condominio || '',
            endereco: {
              rua: end.rua || '',
              numero: end.numero || '',
              bairro: end.bairro || '',
              cidade: end.cidade || '',
              estado: end.estado || '',
              cep: end.cep || '',
            },
            caracteristicas: {
              quartos: carac.quartos !== undefined && carac.quartos !== null ? Number(carac.quartos) : null,
              suites: carac.suites !== undefined && carac.suites !== null ? Number(carac.suites) : null,
              banheiros: carac.banheiros !== undefined && carac.banheiros !== null ? Number(carac.banheiros) : null,
              vagas: carac.vagas !== undefined && carac.vagas !== null ? Number(carac.vagas) : null,
              areaUtil: carac.areaUtil !== undefined && carac.areaUtil !== null ? Number(carac.areaUtil) : null,
              areaTotal: carac.areaTotal !== undefined && carac.areaTotal !== null ? Number(carac.areaTotal) : null,
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

  return (
    <DashboardShell activeTab="imoveis" backRoute="/dashboard" showChildrenOnDesktop>
      {loading ? (
        <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 p-8">
          <Loader2 className="w-10 h-10 text-brand-800 animate-spin" />
          <p className="text-ink font-semibold text-sm">Carregando dados do anúncio...</p>
        </div>
      ) : error || !imovel ? (
        <div className="max-w-3xl mx-auto p-6 my-6 md:p-8 md:my-8 bg-danger/10 border border-danger/30 rounded-3xl text-center space-y-4">
          <div className="inline-flex p-3 bg-danger/10 rounded-2xl text-danger">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-bold text-danger">Não foi possível abrir o editor</h1>
          <p className="text-sm text-danger max-w-md mx-auto">{error || 'Anúncio não encontrado ou sem permissão de acesso.'}</p>
          <div className="pt-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-brand-900 hover:bg-brand-800 text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar ao Dashboard
            </Link>
          </div>
        </div>
      ) : (
        <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
          <div className="flex items-center justify-between gap-4 border-b border-line pb-4">
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard"
                  className="hidden md:inline-flex p-1.5 text-muted hover:text-ink hover:bg-paper rounded-lg transition-colors"
                  title="Voltar ao Dashboard"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-2xl font-black text-brand-900 tracking-tight">Editar Anúncio {imovel.referencia}</h1>
              </div>
              <p className="text-xs text-muted font-medium pl-0 md:pl-8">
                Atualize as informações cadastrais e comerciais do imóvel diretamente no portal.
              </p>
            </div>
          </div>

          <FormEditarImovel imovel={imovel} />
        </div>
      )}
    </DashboardShell>
  );
}
