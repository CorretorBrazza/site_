'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Imovel } from '@/types/imovel';
import { mapearAnuncioParaImovel } from '@/lib/imovelMapper';
import { fetchBrokerApi, logoutBrokerSession, requestReviewLink } from '@/lib/api';
import HeaderSaldoCreditos from './components/HeaderSaldoCreditos';
import BannerBackupGamificacao from './components/BannerBackupGamificacao';
import ModalRecargaCreditos from './components/ModalRecargaCreditos';
import ModalPerfilVitrine from './components/ModalPerfilVitrine';
import ContactModal from '@/components/ContactModal';
import TabelaImoveis from './TabelaImoveis';
import PainelConhecimentoRegional from './components/PainelConhecimentoRegional';
import DashboardShell from './components/DashboardShell';
import { AppShellDesktop } from '@/components/app/AppShell';
import { TabId } from './components/BottomNavMobile';
import { ShieldCheck, LogOut, RefreshCw, Building2, CheckCircle2, Clock3, CircleAlert, MessageCircle, Coins, ChevronRight, Sparkles, MapPin, Mail, ExternalLink } from 'lucide-react';

interface DashboardCorretorClientProps {
  initialImoveis?: Imovel[];
  initialUsuario?: any;
}

type WorkflowMeta = { label: string; tone: string; nextAction: string };

function asNumber(value: any, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

/**
 * `/me/anuncios` devolve `ad_id`, mas toda a UI do painel usa `imovel.id`.
 * Sem esta normalização o modal de exclusão chamava
 * `/anuncios/undefined/excluir`, e o delete falhava silenciosamente.
 *
 * Usa o mapper único para título/endereço/fotos e mantém os campos operacionais
 * da API (`status`, validade, media_kit, etc.), que o mapper não preserva.
 */
function normalizarAnuncioDoPainel(ad: any): Imovel {
  const mapeado = mapearAnuncioParaImovel(ad);
  return {
    ...mapeado,
    ...ad,
    id: String(ad?.id || ad?.ad_id || mapeado.id),
    status: String(ad?.status || '').toUpperCase() as unknown as Imovel['status'],
    titulo: mapeado.titulo,
    endereco: mapeado.endereco,
    tipoImovel: mapeado.tipoImovel,
    transacao: mapeado.transacao,
    fotos: mapeado.fotos,
  };
}

function workflowMeta(status?: string): WorkflowMeta {
  const normalized = String(status || '').toUpperCase();
  if (['DELIVERED', 'PUBLISHED', 'ATIVO'].includes(normalized)) {
    return { label: 'Publicado', tone: 'bg-success/10 text-success border-success/30', nextAction: 'Monitorar leads e renovar quando necessário.' };
  }
  if (['PENDING_APPROVAL', 'QUEUED_FOR_REVIEW'].includes(normalized)) {
    return { label: 'Aguardando aprovação', tone: 'bg-gold/10 text-gold border-gold/30', nextAction: 'Abra a revisão no painel para conferir as fotos e aprovar.' };
  }
  if (['AWAITING_CREDITS', 'SEM_SALDO'].includes(normalized)) {
    return { label: 'Aguardando liberação', tone: 'bg-danger/10 text-danger border-danger/30', nextAction: 'Verificar saldo disponível e concluir a publicação/liberação.' };
  }
  if (['FAILED', 'REJECTED'].includes(normalized)) {
    return { label: 'Com pendência', tone: 'bg-danger/10 text-danger border-danger/30', nextAction: 'Revisar pendências e reenviar/processar novamente.' };
  }
  return { label: 'Em análise', tone: 'bg-brand-800/5 text-brand-900 border-line', nextAction: 'Aguardando processamento da equipe/IA.' };
}

export default function DashboardCorretorClient({
  initialImoveis = [],
  initialUsuario = null
}: DashboardCorretorClientProps) {
  const router = useRouter();
  const [imoveis, setImoveis] = useState<Imovel[]>(initialImoveis);
  const [usuario, setUsuario] = useState(initialUsuario);
  const [activeTab, setActiveTab] = useState<TabId>('inicio');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [recarregaAberta, setRecarregaAberta] = useState(false);
  const [perfilVitrineAberto, setPerfilVitrineAberto] = useState(false);
  const [ultimoSync, setUltimoSync] = useState<Date | null>(null);
  const [abrindoRevisaoId, setAbrindoRevisaoId] = useState<string | null>(null);
  const [erroRevisao, setErroRevisao] = useState<string | null>(null);

  const handleAbrirRevisao = async (ad: Imovel) => {
    setErroRevisao(null);
    setAbrindoRevisaoId(ad.id);
    try {
      const resultado = await requestReviewLink(ad.id);
      if (!resultado.success || !resultado.url) {
        setErroRevisao(resultado.error || 'Não foi possível abrir a revisão.');
        return;
      }
      window.open(resultado.url, '_blank', 'noopener,noreferrer');
    } finally {
      setAbrindoRevisaoId(null);
    }
  };

  const anunciosCountRef = useRef(imoveis.length);
  const saldoRef = useRef(asNumber(initialUsuario?.saldo_creditos, 0));

  useEffect(() => {
    anunciosCountRef.current = imoveis.length;
  }, [imoveis.length]);

  useEffect(() => {
    saldoRef.current = asNumber(usuario?.saldo_creditos, 0);
  }, [usuario?.saldo_creditos]);

  const handleLogout = async () => {
    await logoutBrokerSession();
    router.push('/login');
  };

  useEffect(() => {
    let isMounted = true;
    let pollId: ReturnType<typeof setInterval> | null = null;

    const carregarDados = async (opts?: { silent?: boolean }) => {
      const silent = !!opts?.silent;
      if (silent) setRefreshing(true);

      try {
        const userCache = typeof window !== 'undefined' ? localStorage.getItem('user_info') : null;
        if (!userCache) {
          if (isMounted) {
            setLoadError(null);
            setLoading(false);
          }
          router.push('/login');
          return;
        }

        try {
          if (!silent) {
            const parsedCache = JSON.parse(userCache);
            setUsuario((prev: any) => prev || parsedCache);
          }
        } catch {
          router.push('/login');
          return;
        }

        const [profileRes, listRes] = await Promise.allSettled([
          fetchBrokerApi('/corretor/me'),
          fetchBrokerApi('/me/anuncios'),
        ]);

        let hadNonAuthError = false;
        const errorMessages: string[] = [];

        if (profileRes.status === 'fulfilled') {
          const userRes = profileRes.value as any;
          if (userRes.success && userRes.data) {
            const normalizedUser = userRes.data;
            setUsuario(normalizedUser);
            try {
              localStorage.setItem('user_info', JSON.stringify(normalizedUser));
            } catch {
              // noop
            }
          } else if (userRes?.error?.includes('Sessão expirada') || userRes?.error?.includes('login')) {
            if (isMounted) setLoadError(null);
            await logoutBrokerSession();
            router.push('/login');
            return;
          } else if (userRes?.error) {
            hadNonAuthError = true;
            errorMessages.push(`Perfil: ${userRes.error}`);
          }
        } else {
          hadNonAuthError = true;
          errorMessages.push('Perfil: falha ao carregar dados do corretor.');
        }

        if (listRes.status === 'fulfilled') {
          const adsRes = listRes.value as any;
          if (adsRes.success && Array.isArray(adsRes.data)) {
            const nextAds: Imovel[] = adsRes.data.map(normalizarAnuncioDoPainel);
            setImoveis(nextAds);
            anunciosCountRef.current = nextAds.length;
          } else if (adsRes?.error && !adsRes?.error?.includes('Sessão expirada')) {
            hadNonAuthError = true;
            errorMessages.push(`Imóveis: ${adsRes.error}`);
          }
        } else {
          hadNonAuthError = true;
          errorMessages.push('Imóveis: falha ao carregar sua lista de anúncios.');
        }

        if (isMounted) {
          setUltimoSync(new Date());
          setLoadError(hadNonAuthError ? errorMessages.join(' ') : null);
        }
      } catch (error) {
        console.error('Erro ao carregar dashboard corretor:', error);
        if (isMounted) {
          setLoadError('Não foi possível atualizar o painel agora. Verifique sua conexão e tente novamente.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    };

    carregarDados();

    pollId = setInterval(async () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return;
      await carregarDados({ silent: true });
    }, 15000);

    return () => {
      isMounted = false;
      if (pollId) clearInterval(pollId);
    };
  }, [router]);

  const saldoCreditos = asNumber(usuario?.saldo_creditos, 0);
  const creditosReservados = asNumber(usuario?.creditos_reservados, 0);
  const saldoDisponivel = Math.max(0, asNumber(usuario?.saldo_disponivel, saldoCreditos - creditosReservados));

  const anunciosPublicados = imoveis.filter((i) => ['DELIVERED', 'PUBLISHED', 'ATIVO'].includes(String(i.status || '').toUpperCase()));
  const anunciosPendentes = imoveis.filter((i) => ['PENDING_APPROVAL', 'QUEUED_FOR_REVIEW', 'AWAITING_CREDITS', 'SEM_SALDO', 'EXTRACTION_ONLY', 'PROCESSING', 'SUBMITTED'].includes(String(i.status || '').toUpperCase()));
  const anunciosComPendencia = imoveis.filter((i) => ['FAILED', 'REJECTED', 'AWAITING_CREDITS', 'SEM_SALDO'].includes(String(i.status || '').toUpperCase()));
  const aguardandoAprovacao = imoveis.filter((i) => ['PENDING_APPROVAL', 'QUEUED_FOR_REVIEW'].includes(String(i.status || '').toUpperCase()));
  const aguardandoCredito = imoveis.filter((i) => ['AWAITING_CREDITS', 'SEM_SALDO'].includes(String(i.status || '').toUpperCase()));
  const prioridade = imoveis.find((i) => ['PENDING_APPROVAL', 'QUEUED_FOR_REVIEW', 'AWAITING_CREDITS', 'FAILED'].includes(String(i.status || '').toUpperCase())) || imoveis[0] || null;
  const prioridadeMeta = workflowMeta(prioridade?.status as string | undefined);
  const primeiroNome = (usuario?.nome || 'Corretor').split(' ')[0];
  const slugVitrine = (usuario?.slug || '').trim().toLowerCase();

  if (loading && !usuario) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper text-brand-900">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 animate-spin text-gold" />
          <span className="text-sm font-medium">Carregando seu painel...</span>
        </div>
      </div>
    );
  }

  const dashboardContent = (
    <>
      {loadError && (
        <div className="rounded-2xl border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-start gap-2 min-w-0">
            <CircleAlert className="w-4 h-4 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold">Não foi possível atualizar tudo agora</p>
              <p className="text-xs sm:text-sm opacity-90 break-words">{loadError}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white border border-danger/20 text-danger text-xs font-bold hover:bg-danger/10 transition-colors shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Tentar novamente
          </button>
        </div>
      )}

      {activeTab === 'inicio' && (
        <div className="space-y-5 sm:space-y-6">
          <section className="bg-white border border-line rounded-3xl p-4 sm:p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2 min-w-0">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-gold bg-gold/10 border border-gold/20 rounded-full px-3 py-1">
                  <Sparkles className="w-3.5 h-3.5" /> Painel do corretor
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-900 leading-tight">Olá, {primeiroNome}</h1>
                <p className="text-sm text-muted max-w-2xl">
                  Acompanhe publicação, aprovação, saldo disponível e sua vitrine em um só lugar.
                </p>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-line text-xs font-semibold text-brand-900 hover:bg-brand-50 transition-colors shrink-0"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} /> Atualizar
              </button>
            </div>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
              <div className="rounded-2xl border border-line bg-paper p-3">
                <div className="text-[11px] uppercase tracking-wide text-muted font-bold">Publicados</div>
                <div className="mt-1 text-xl font-extrabold text-brand-900">{anunciosPublicados.length}</div>
              </div>
              <div className="rounded-2xl border border-line bg-paper p-3">
                <div className="text-[11px] uppercase tracking-wide text-muted font-bold">Em fluxo</div>
                <div className="mt-1 text-xl font-extrabold text-brand-900">{anunciosPendentes.length}</div>
              </div>
              <div className="rounded-2xl border border-line bg-paper p-3">
                <div className="text-[11px] uppercase tracking-wide text-muted font-bold">Saldo disp.</div>
                <div className="mt-1 text-xl font-extrabold text-brand-900">{saldoDisponivel}</div>
              </div>
              <div className="rounded-2xl border border-line bg-paper p-3">
                <div className="text-[11px] uppercase tracking-wide text-muted font-bold">Com pendência</div>
                <div className="mt-1 text-xl font-extrabold text-brand-900">{anunciosComPendencia.length}</div>
              </div>
            </div>
            {ultimoSync && (
              <p className="mt-3 text-[11px] text-muted">Última atualização: {ultimoSync.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}{refreshing ? ' • atualizando...' : ''}</p>
            )}
          </section>

          {prioridade && (
            <section className="bg-white border border-line rounded-3xl p-4 sm:p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wide text-muted">Próxima ação recomendada</p>
                  <h2 className="mt-1 text-base sm:text-lg font-bold text-brand-900 line-clamp-2">
                    {prioridade.titulo || `Imóvel ${prioridade.referencia || prioridade.id}`}
                  </h2>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${prioridadeMeta.tone}`}>
                      {prioridadeMeta.label}
                    </span>
                    <span className="text-xs text-muted">Ref: {prioridade.referencia || prioridade.id}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted leading-relaxed">{prioridadeMeta.nextAction}</p>
                  {aguardandoCredito.length > 0 && saldoDisponivel > 0 && (
                    <p className="mt-2 text-xs text-brand-900 bg-gold/10 border border-gold/20 rounded-xl px-3 py-2">
                      Você tem saldo disponível. Se algum imóvel ainda estiver aguardando liberação, atualize o painel ou siga o fluxo de processamento/reprocessamento.
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setActiveTab('imoveis')}
                  className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-900 text-white text-xs font-bold hover:bg-brand-800 transition-colors"
                >
                  Ver imóveis <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </section>
          )}

          <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button onClick={() => router.push('/dashboard/novo')} className="bg-white border border-line rounded-2xl p-4 text-left shadow-sm hover:border-gold/40 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold mb-3"><Building2 className="w-5 h-5" /></div>
              <div className="font-bold text-brand-900">Novo imóvel</div>
              <div className="text-xs text-muted mt-1">Cadastrar e enviar para processamento</div>
            </button>
            <button onClick={() => setActiveTab('bairro')} className="bg-white border border-line rounded-2xl p-4 text-left shadow-sm hover:border-gold/40 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-brand-900/5 border border-brand-700/20 flex items-center justify-center text-brand-900 mb-3"><MapPin className="w-5 h-5" /></div>
              <div className="font-bold text-brand-900">Conhecimento local</div>
              <div className="text-xs text-muted mt-1">Melhorar contexto dos anúncios da região</div>
            </button>
            <button onClick={() => setPerfilVitrineAberto(true)} className="bg-white border border-line rounded-2xl p-4 text-left shadow-sm hover:border-gold/40 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-success/10 border border-success/20 flex items-center justify-center text-success mb-3"><CheckCircle2 className="w-5 h-5" /></div>
              <div className="font-bold text-brand-900">Minha vitrine</div>
              <div className="text-xs text-muted mt-1">Editar perfil público e compartilhar link</div>
            </button>
          </section>

          <HeaderSaldoCreditos
            saldoCreditos={saldoCreditos}
            saldoDisponivel={saldoDisponivel}
            creditosReservados={creditosReservados}
            planoAtual={usuario?.plano_atual || 'start'}
            onAbrirRecarga={() => setRecarregaAberta(true)}
          />

          <BannerBackupGamificacao
            totalFotosBackup={0}
            espacoTexto="na nuvem"
            onAbrirBackupModal={() => setActiveTab('imoveis')}
          />

          {(aguardandoAprovacao.length > 0 || aguardandoCredito.length > 0) && (
            <section className="bg-white border border-line rounded-3xl p-4 sm:p-5 shadow-sm space-y-3">
              <h3 className="font-bold text-brand-900 flex items-center gap-2"><CircleAlert className="w-4 h-4 text-gold" /> Atenções do momento</h3>
              <div className="space-y-2">
                {aguardandoAprovacao.slice(0, 2).map((ad) => (
                  <div key={ad.id} className="rounded-xl border border-gold/20 bg-gold/5 px-3 py-2.5">
                    <div className="flex items-start gap-2.5">
                      {ad.fotos?.[0] && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={ad.fotos[0]} alt={`Foto de ${ad.referencia || ad.id}`} className="h-10 w-14 shrink-0 rounded-lg object-cover border border-line" />
                      )}
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-brand-900 line-clamp-1">{ad.titulo || `Imóvel ${ad.referencia || ad.id}`}</div>
                        <div className="text-xs text-muted mt-0.5">Confira as fotos e aprove para avançar na publicação.</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAbrirRevisao(ad)}
                      disabled={abrindoRevisaoId === ad.id}
                      className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-brand-900 hover:text-gold disabled:opacity-50"
                    >
                      {abrindoRevisaoId === ad.id ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ExternalLink className="w-3.5 h-3.5" />}
                      {abrindoRevisaoId === ad.id ? 'Abrindo revisão...' : 'Revisar e aprovar agora'}
                    </button>
                    {erroRevisao && <div className="mt-1 text-[11px] text-danger">{erroRevisao}</div>}
                  </div>
                ))}
                {aguardandoCredito.slice(0, 2).map((ad) => (
                  <div key={ad.id} className="rounded-xl border border-danger/20 bg-danger/5 px-3 py-2.5">
                    <div className="text-sm font-semibold text-brand-900 line-clamp-1">{ad.titulo || `Imóvel ${ad.referencia || ad.id}`}</div>
                    <div className="text-xs text-muted mt-0.5">
                      {saldoDisponivel > 0 ? 'Aguardando liberação/reprocessamento (há saldo disponível).' : 'Aguardando crédito/liberação (saldo disponível insuficiente).'}
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => setActiveTab('imoveis')} className="text-sm font-bold text-brand-900 inline-flex items-center gap-1.5 hover:text-gold transition-colors">
                Ver todos os imóveis <ChevronRight className="w-4 h-4" />
              </button>
            </section>
          )}
        </div>
      )}

      {activeTab === 'imoveis' && (
        <div className="space-y-4 sm:space-y-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-brand-900">Meus imóveis</h2>
              <p className="text-sm text-muted">Acompanhe status, aprovação e publicação de cada anúncio.</p>
            </div>
            <button onClick={() => router.push('/dashboard/novo')} className="inline-flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl bg-brand-900 text-white text-xs sm:text-sm font-bold hover:bg-brand-800 transition-colors">
              <Building2 className="w-4 h-4" /> Novo
            </button>
          </div>
          <TabelaImoveis imoveis={imoveis} />
        </div>
      )}

      {activeTab === 'bairro' && (
        <div className="space-y-4 sm:space-y-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-brand-900">Conhecimento regional</h2>
            <p className="text-sm text-muted">Ajude a IA com informações locais para melhorar seus anúncios e contexto.</p>
          </div>
          <PainelConhecimentoRegional />
        </div>
      )}

      {activeTab === 'conta' && (
        <div className="space-y-4 sm:space-y-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-brand-900">Minha conta</h2>
            <p className="text-sm text-muted">Perfil, créditos, vitrine pública e suporte.</p>
          </div>

          <section className="bg-white border border-line rounded-3xl p-4 sm:p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-brand-900 text-white flex items-center justify-center font-extrabold text-lg shrink-0">
                {primeiroNome.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-brand-900 truncate">{usuario?.nome || 'Corretor'}</p>
                <p className="text-xs text-muted truncate">{usuario?.email || 'E-mail não informado'}</p>
                {usuario?.telefone && <p className="text-xs text-muted truncate">{usuario.telefone}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="rounded-xl border border-line bg-paper p-3">
                <div className="text-[11px] uppercase tracking-wide text-muted font-bold">Saldo disponível</div>
                <div className="mt-1 text-lg font-extrabold text-brand-900">{saldoDisponivel}</div>
                <div className="text-[11px] text-muted mt-0.5">Total: {saldoCreditos}{creditosReservados > 0 ? ` • Reservado: ${creditosReservados}` : ''}</div>
              </div>
              <div className="rounded-xl border border-line bg-paper p-3">
                <div className="text-[11px] uppercase tracking-wide text-muted font-bold">Plano</div>
                <div className="mt-1 text-lg font-extrabold text-brand-900 capitalize">{usuario?.plano_atual || 'start'}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button onClick={() => setPerfilVitrineAberto(true)} className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-brand-900 text-white font-bold text-sm hover:bg-brand-800 transition-colors">
                <ShieldCheck className="w-4 h-4" /> Editar perfil e vitrine
              </button>
              <button onClick={() => setRecarregaAberta(true)} className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-line bg-white font-bold text-sm hover:bg-brand-50 transition-colors">
                <Coins className="w-4 h-4" /> Recarregar créditos
              </button>
              {slugVitrine && (
                <button onClick={() => router.push(`/corretor/${slugVitrine}`)} className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-line bg-white font-bold text-sm hover:bg-brand-50 transition-colors sm:col-span-2">
                  <Building2 className="w-4 h-4" /> Ver minha vitrine pública
                </button>
              )}
            </div>
          </section>

          <section className="bg-white border border-line rounded-3xl p-4 sm:p-5 shadow-sm space-y-3">
            <h3 className="font-bold text-brand-900">Suporte e ajuda</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <a href="https://wa.me/5511989161897" target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-line hover:bg-brand-50 font-semibold text-sm">
                <MessageCircle className="w-4 h-4 text-success" /> WhatsApp do suporte
              </a>
              <a href="mailto:contato@colegacorretor.com.br" className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-line hover:bg-brand-50 font-semibold text-sm">
                <Mail className="w-4 h-4" /> E-mail
              </a>
            </div>
          </section>

          <button onClick={handleLogout} className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-danger/20 text-danger font-bold text-sm hover:bg-danger/5 transition-colors">
            <LogOut className="w-4 h-4" /> Sair da conta
          </button>
        </div>
      )}

      <ModalRecargaCreditos
        isOpen={recarregaAberta}
        onClose={() => setRecarregaAberta(false)}
      />
      <ModalPerfilVitrine
        aberto={perfilVitrineAberto}
        onClose={() => setPerfilVitrineAberto(false)}
        usuario={usuario}
        onPerfilAtualizado={(novoPerfil) => setUsuario((prev: any) => ({ ...(prev || {}), ...novoPerfil }))}
      />
    </>
  );

  return (
    <>
      {/* Mobile app shell (inclui navegação inferior) */}
      <DashboardShell activeTab={activeTab} onTabChange={setActiveTab} usuario={usuario} loading={loading}>
        <div className="min-h-screen bg-paper px-3 pt-3 pb-24 space-y-4 md:hidden">
          {dashboardContent}
        </div>
      </DashboardShell>

      {/* Desktop shell */}
      <div className="hidden md:block min-h-screen bg-paper">
        <AppShellDesktop activeTab={activeTab} onTabChange={setActiveTab} usuario={usuario}>
          <div className="max-w-6xl mx-auto px-6 py-6 space-y-6">
            {dashboardContent}
          </div>
        </AppShellDesktop>
      </div>
    </>
  );
}
