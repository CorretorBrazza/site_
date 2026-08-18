'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Imovel } from '@/types/imovel';
import { fetchBrokerApi } from '@/lib/api';
import HeaderSaldoCreditos from './components/HeaderSaldoCreditos';
import BannerBackupGamificacao from './components/BannerBackupGamificacao';
import ModalRecargaCreditos from './components/ModalRecargaCreditos';
import TabelaImoveis from './TabelaImoveis';
import PainelConhecimentoRegional from './components/PainelConhecimentoRegional';
import { ShieldCheck, LogOut, RefreshCw, Building2, CheckCircle2, Clock3, CircleAlert, MessageCircle } from 'lucide-react';

interface DashboardCorretorClientProps {
  imoveis?: Imovel[];
}

const workflowMeta: Record<string, { label: string; tone: string; nextAction: string }> = {
  RECEIVED: { label: 'Recebido', tone: 'text-blue-300 border-blue-800 bg-blue-950/60', nextAction: 'Aguarde o início do processamento.' },
  INGESTED: { label: 'Organizando dados', tone: 'text-blue-300 border-blue-800 bg-blue-950/60', nextAction: 'Estamos preparando fotos e informações.' },
  EXTRACTION_DONE: { label: 'Analisando imóvel', tone: 'text-indigo-300 border-indigo-800 bg-indigo-950/60', nextAction: 'A IA está estruturando os dados do imóvel.' },
  KNOWLEDGE_DONE: { label: 'Criando Media Kit', tone: 'text-violet-300 border-violet-800 bg-violet-950/60', nextAction: 'A copy e os materiais comerciais estão sendo gerados.' },
  PENDING_APPROVAL: { label: 'Aguardando sua aprovação', tone: 'text-amber-300 border-amber-800 bg-amber-950/60', nextAction: 'Abra o link enviado no WhatsApp, revise e aprove.' },
  QUEUED_FOR_REVIEW: { label: 'Atualização em revisão', tone: 'text-amber-300 border-amber-800 bg-amber-950/60', nextAction: 'Aguarde a nova versão de aprovação.' },
  AWAITING_CREDITS: { label: 'Aguardando crédito', tone: 'text-rose-300 border-rose-800 bg-rose-950/60', nextAction: 'Recarregue créditos para gerar o link de aprovação.' },
  APPROVED: { label: 'Finalizando publicação', tone: 'text-emerald-300 border-emerald-800 bg-emerald-950/60', nextAction: 'Estamos concluindo a entrega do anúncio.' },
  DELIVERED: { label: 'Publicado', tone: 'text-emerald-300 border-emerald-800 bg-emerald-950/60', nextAction: 'Use seu Media Kit e divulgue o imóvel.' },
  PUBLISHED: { label: 'Publicado', tone: 'text-emerald-300 border-emerald-800 bg-emerald-950/60', nextAction: 'Use seu Media Kit e divulgue o imóvel.' },
  REJECTED: { label: 'Precisa de ajuste', tone: 'text-rose-300 border-rose-800 bg-rose-950/60', nextAction: 'Revise os dados e solicite uma nova aprovação.' },
  EXPIRED: { label: 'Anúncio expirado', tone: 'text-rose-300 border-rose-800 bg-rose-950/60', nextAction: 'Reative o anúncio com um crédito.' },
};

function getWorkflowMeta(status?: string) {
  return workflowMeta[String(status || '').toUpperCase()] || {
    label: 'Em processamento',
    tone: 'text-slate-300 border-slate-700 bg-slate-900',
    nextAction: 'Acompanhe o processamento; se demorar, atualize a página.',
  };
}

export default function DashboardCorretorClient({ imoveis: initialImoveis = [] }: DashboardCorretorClientProps) {
  const router = useRouter();
  const [modalRecargaAberto, setModalRecargaAberto] = useState(false);
  const [usuario, setUsuario] = useState<{ email: string; nome: string; saldo_creditos: number; plano_atual: string } | null>(null);
  const [listaImoveis, setListaImoveis] = useState<Imovel[]>(initialImoveis);
  const [loading, setLoading] = useState(true);
  const [pacoteInicialModal, setPacoteInicialModal] = useState<'start' | 'pro' | 'elite'>('pro');

  useEffect(() => {
    // Checa se há um parâmetro recarga na URL (ex: ?recarga=pro) vindo da página /planos
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const recargaParam = urlParams.get('recarga');
      if (recargaParam === 'start' || recargaParam === 'pro' || recargaParam === 'elite') {
        setPacoteInicialModal(recargaParam);
        setModalRecargaAberto(true);
      }
    }

    // A sessão JWT é a única fonte de identidade; user_info serve apenas para exibição provisória.
    const token = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('user_info');
    if (savedUser) {
      try {
        setUsuario(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('user_info');
      }
    }

    if (!token) {
      setUsuario(null);
      setListaImoveis([]);
      setLoading(false);
      router.replace('/login');
      return;
    }

    async function carregarDadosPainel() {
      setLoading(true);
      try {
        // Busca perfil pela sessão autenticada para ter saldo real de créditos.
        const jsonPerfil = await fetchBrokerApi('/corretor/me');
        if (jsonPerfil.success && jsonPerfil.data) {
          const perfil = jsonPerfil.data;
          const userUpdated = {
            nome: perfil.nome || perfil.nome_guerra || 'Corretor',
            email: perfil.email || '',
            saldo_creditos: perfil.saldo_creditos ?? 0,
            plano_atual: perfil.plano_atual || 'START',
          };
          setUsuario(userUpdated);
          localStorage.setItem('user_info', JSON.stringify(userUpdated));
        } else {
          // Se o corretor não existe na API (banco limpo), remove o cache antigo do navegador
          localStorage.removeItem('user_info');
          localStorage.removeItem('auth_token');
          setUsuario(null);
          setListaImoveis([]);
          router.replace('/login');
        }

        // Busca anúncios do corretor autenticado; não há e-mail controlável na requisição.
        const jsonAnuncios = await fetchBrokerApi('/me/anuncios?limit=100', { cache: 'no-store' });

        if (jsonAnuncios.success && Array.isArray(jsonAnuncios.data)) {
          const mapped: Imovel[] = jsonAnuncios.data.map((item: any) => {
            const ref = item.dados_refinados || item.dados_brutos || {};
            const fotosArray = (item.fotos || []).map((f: any) =>
              typeof f === 'string' ? f : f.url_optimized || f.url || f.url_original
            );

            // Mapeamento amigável de status para o painel
            let statusExibicao: any = 'Em Análise';
            const stUpper = (item.status || '').toUpperCase();
            if (stUpper === 'DELIVERED' || stUpper === 'PUBLISHED' || stUpper === 'ATIVO') {
              statusExibicao = 'Ativo';
            } else if (stUpper === 'PENDING_APPROVAL' || stUpper === 'INGEST_APPROVED' || stUpper === 'APPROVED') {
              statusExibicao = 'Em Análise';
            } else {
              statusExibicao = item.status || 'Em Análise';
            }

            return {
              id: item.ad_id || item.id || item.referencia?.toLowerCase() || 'anuncio-sem-id',
              referencia: item.referencia || 'BRA0000',
              titulo: ref.titulo || item.media_kit?.titulo_seo || `Imóvel ${item.referencia}`,
              descricao: ref.descricao || item.media_kit?.legenda_social || '',
                              tipoImovel: ref.tipoImovel || ref.tipo || 'Apartamento',
                tipo: ref.tipo || ref.tipoImovel || 'Apartamento',

              transacao: ref.transacao || ref.finalidade || (ref.precoLocacao ? 'Locação' : 'Venda'),
              precoVenda: ref.precoVenda || null,
              precoLocacao: ref.precoLocacao || null,
              condominio: ref.condominio || null,
              iptu: ref.iptu || null,
              bairro: ref.bairro || ref.endereco?.bairro || 'Taboão da Serra',
              cidade: ref.cidade || ref.endereco?.cidade || 'Taboão da Serra',
              endereco: {
                                  rua: ref.rua || ref.endereco?.rua || '',
                  numero: ref.numero || ref.endereco?.numero || '',
                  bairro: ref.bairro || ref.endereco?.bairro || 'Taboão da Serra',

                cidade: ref.cidade || ref.endereco?.cidade || 'Taboão da Serra',
                estado: ref.estado || ref.endereco?.estado || 'SP',
                cep: ref.cep || ref.endereco?.cep || '',
              },
              fotos: fotosArray.length > 0 ? fotosArray : ['https://images.unsplash.com/photo-1560518883-ce09059eeffa'],
                              caracteristicas: {
                  quartos: ref.quartos || ref.caracteristicas?.quartos || 0,
                  suites: ref.suites || ref.caracteristicas?.suites || 0,
                  banheiros: ref.banheiros || ref.caracteristicas?.banheiros || 0,
                  vagas: ref.vagas || ref.caracteristicas?.vagas || 0,
                  areaUtil: ref.areaUtil || ref.caracteristicas?.areaUtil || 0,
                  areaTotal: ref.areaTotal || ref.caracteristicas?.areaTotal || 0,
                },

              status: statusExibicao,
              workflow_status: stUpper || 'RECEIVED',
              estagio: Number(item.estagio || 0),
              destaque: true,
              media_kit: item.media_kit || null,
              approval_url: item.approval_url || null,
              createdAt: item.created_at?._seconds
                ? new Date(item.created_at._seconds * 1000).toISOString()
                : item.created_at || new Date().toISOString(),
              updatedAt: item.updated_at?._seconds
                ? new Date(item.updated_at._seconds * 1000).toISOString()
                : item.updated_at || new Date().toISOString(),
            };
          });

          setListaImoveis(mapped);
        }
      } catch (err) {
        console.error('Erro ao carregar dados do painel do corretor:', err);
      } finally {
        setLoading(false);
      }
    }

    carregarDadosPainel();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/login');
  };

  const totalFotosReal = (listaImoveis || []).reduce((acc, item) => acc + (item.fotos?.length || 0), 0);
  const totalMegas = totalFotosReal * 2.5;
  const espacoTexto = totalMegas >= 1024 ? `${(totalMegas / 1024).toFixed(1)} GB` : `${totalMegas.toFixed(0)} MB`;
  const workSummary = listaImoveis.reduce((summary, item) => {
    const status = String(item.workflow_status || '').toUpperCase();
    if (status === 'DELIVERED' || status === 'PUBLISHED') summary.publicados += 1;
    else if (status === 'PENDING_APPROVAL' || status === 'QUEUED_FOR_REVIEW') summary.aprovacao += 1;
    else if (status === 'REJECTED' || status === 'EXPIRED') summary.atencao += 1;
    else summary.processando += 1;
    return summary;
  }, { publicados: 0, aprovacao: 0, processando: 0, atencao: 0 });
  const nextItem = listaImoveis.find((item) => ['PENDING_APPROVAL', 'QUEUED_FOR_REVIEW', 'AWAITING_CREDITS', 'REJECTED', 'EXPIRED'].includes(String(item.workflow_status || '').toUpperCase()))
    || listaImoveis.find((item) => !['DELIVERED', 'PUBLISHED'].includes(String(item.workflow_status || '').toUpperCase()));
  const nextItemMeta = nextItem ? getWorkflowMeta(nextItem.workflow_status) : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header — Clean Light Style */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {usuario ? `Olá, ${usuario.nome}` : 'Painel do Corretor'}
              </h1>
              <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1 shadow-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" /> PLANO {usuario?.plano_atual?.toUpperCase() || 'START'}
              </span>
            </div>
            <p className="text-slate-500 text-xs sm:text-sm font-medium">
              {usuario ? `Sessão ativa: ${usuario.email}` : 'Gerencie seus anúncios, Media Kits de IA e backups de fotos em nuvem.'}
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={() => window.location.reload()}
              title="Atualizar Dados"
              className="p-3 bg-slate-50 border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-300 rounded-xl transition-all shadow-xs"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin text-blue-600' : ''}`} />
            </button>

            <button
              onClick={handleLogout}
              title="Encerrar Sessão Segura"
              className="p-3 bg-slate-50 border border-slate-200 text-slate-500 hover:text-red-600 hover:border-red-300 rounded-xl transition-all shadow-xs"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Saldo de Créditos */}
        <HeaderSaldoCreditos
          saldoCreditos={usuario?.saldo_creditos ?? 1}
          planoAtual={usuario?.plano_atual || 'Start'}
          onAbrirRecarga={() => setModalRecargaAberto(true)}
        />

        {/* Central de trabalho: fila, exceções e próxima ação */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="text-[10px] font-black uppercase tracking-wider text-emerald-700 flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Publicados</div>
            <div className="text-2xl font-black text-slate-900 mt-2">{workSummary.publicados}</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="text-[10px] font-black uppercase tracking-wider text-amber-700 flex items-center gap-1.5"><Clock3 className="w-3.5 h-3.5 text-amber-600" /> Aprovação</div>
            <div className="text-2xl font-black text-slate-900 mt-2">{workSummary.aprovacao}</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="text-[10px] font-black uppercase tracking-wider text-blue-700 flex items-center gap-1.5"><RefreshCw className="w-3.5 h-3.5 text-blue-600" /> Processando</div>
            <div className="text-2xl font-black text-slate-900 mt-2">{workSummary.processando}</div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <div className="text-[10px] font-black uppercase tracking-wider text-rose-700 flex items-center gap-1.5"><CircleAlert className="w-3.5 h-3.5 text-rose-600" /> Sua atenção</div>
            <div className="text-2xl font-black text-slate-900 mt-2">{workSummary.atencao}</div>
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row gap-4 md:items-center md:justify-between shadow-sm">
          <div className="flex gap-3">
            <div className="shrink-0 p-2.5 h-fit rounded-xl bg-blue-50 border border-blue-200 text-blue-600"><MessageCircle className="w-5 h-5" /></div>
            <div>
              <p className="text-[10px] uppercase tracking-wider font-black text-blue-600">Próxima ação</p>
              <h2 className="text-base font-bold text-slate-900 mt-1">{nextItem ? `${nextItem.referencia} — ${nextItemMeta?.label}` : 'Envie seu primeiro imóvel pelo WhatsApp'}</h2>
              <p className="text-sm text-slate-600 mt-1">{nextItem ? nextItemMeta?.nextAction : 'Envie fotos e as informações principais do imóvel para iniciarmos seu Media Kit.'}</p>
            </div>
          </div>
          <button onClick={() => window.location.reload()} className="text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:border-blue-500 hover:text-blue-600 transition-colors">Atualizar status</button>
        </section>

        {/* Banner da Central de Fotos & Backups */}
        <BannerBackupGamificacao
          totalFotosBackup={totalFotosReal}
          espacoTexto={espacoTexto}
        />

        {/* Tabela de Imóveis do Corretor */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              Seus Imóveis Cadastrados ({listaImoveis.length})
            </h2>
          </div>

          <PainelConhecimentoRegional />
          <TabelaImoveis imoveis={listaImoveis} />
        </div>

        {/* Modal de Recarga Mercado Pago */}
        <ModalRecargaCreditos
          isOpen={modalRecargaAberto}
          onClose={() => setModalRecargaAberto(false)}
          pacoteInicial={pacoteInicialModal}
        />
      </div>
    </div>
  );
}
