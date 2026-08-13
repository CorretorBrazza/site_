'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Imovel } from '@/types/imovel';
import HeaderSaldoCreditos from './components/HeaderSaldoCreditos';
import BannerBackupGamificacao from './components/BannerBackupGamificacao';
import ModalRecargaCreditos from './components/ModalRecargaCreditos';
import TabelaImoveis from './TabelaImoveis';
import { Sparkles, ShieldCheck, LogOut, RefreshCw, PlusCircle, Building2 } from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://imoveis-taboao-api-production-4cd9.up.railway.app/api/v1';

interface DashboardCorretorClientProps {
  imoveis?: Imovel[];
}

export default function DashboardCorretorClient({ imoveis: initialImoveis = [] }: DashboardCorretorClientProps) {
  const router = useRouter();
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

    // 1. Identifica usuário ativo
    let emailAtivo = '';
    const savedUser = localStorage.getItem('user_info');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.email) emailAtivo = parsed.email;
        setUsuario(parsed);
      } catch {}
    }

    if (!emailAtivo) {
      setUsuario(null);
      setListaImoveis([]);
      setLoading(false);
      return;
    }

    async function carregarDadosPainel() {
      setLoading(true);
      try {
        // Busca perfil do corretor (para ter saldo real de créditos)
        const resPerfil = await fetch(`${API_BASE_URL}/corretor/${encodeURIComponent(emailAtivo)}`);
        const jsonPerfil = await resPerfil.json();
        if (jsonPerfil.success && jsonPerfil.data) {
          const perfil = jsonPerfil.data;
          const userUpdated = {
            nome: perfil.nome || perfil.nome_guerra || 'Corretor',
            email: perfil.email || emailAtivo,
            saldo_creditos: perfil.saldo_creditos ?? 0,
            plano_atual: perfil.plano_atual || 'START',
          };
          setUsuario(userUpdated);
          localStorage.setItem('user_info', JSON.stringify(userUpdated));
        } else {
          // Se o corretor não existe na API (banco limpo), remove o cache antigo do navegador
          localStorage.removeItem('user_info');
          setUsuario(null);
          setListaImoveis([]);
        }

        // Busca anúncios do corretor ao vivo da API
        const resAnuncios = await fetch(`${API_BASE_URL}/anuncios?corretor_email=${encodeURIComponent(emailAtivo)}`, {
          cache: 'no-store',
        });
        const jsonAnuncios = await resAnuncios.json();

        if (jsonAnuncios.success && Array.isArray(jsonAnuncios.data)) {
          const mapped: Imovel[] = jsonAnuncios.data.map((item: any) => {
            const ref = item.dados_refinados || item.dados_brutos || {};
            const fotosArray = (item.fotos || []).map((f: any) =>
              typeof f === 'string' ? f : f.url_optimized || f.url || f.url_original
            );

            // Mapeamento amigável de status para o painel
            let statusExibicao: any = 'Ativo';
            const stUpper = (item.status || '').toUpperCase();
            if (stUpper === 'DELIVERED' || stUpper === 'APPROVED' || stUpper === 'PUBLISHED' || stUpper === 'ATIVO') {
              statusExibicao = 'Ativo';
            } else if (stUpper === 'PENDING_APPROVAL' || stUpper === 'INGEST_APPROVED') {
              statusExibicao = 'Em Análise';
            } else {
              statusExibicao = item.status || 'Em Análise';
            }

            return {
              id: item.ad_id || item.referencia?.toLowerCase() || `imv_${Math.random()}`,
              referencia: item.referencia || 'BRA0000',
              titulo: ref.titulo || item.media_kit?.titulo_seo || `Imóvel ${item.referencia}`,
              descricao: ref.descricao || item.media_kit?.legenda_social || '',
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
              },
              status: statusExibicao,
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

  return (
    <div className="min-h-screen bg-[#0b132b] text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header — Dark Luxury Style */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {usuario ? `Olá, ${usuario.nome}` : 'Painel do Corretor'}
              </h1>
              <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1 shadow-md uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" /> PLANO {usuario?.plano_atual?.toUpperCase() || 'START'}
              </span>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm">
              {usuario ? `Sessão ativa: ${usuario.email}` : 'Gerencie seus anúncios, Media Kits de IA e backups de fotos em nuvem.'}
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={() => window.location.reload()}
              title="Atualizar Dados"
              className="p-3 bg-slate-950 border border-slate-800 text-slate-300 hover:text-amber-400 hover:border-amber-500/50 rounded-xl transition-all shadow-md"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin text-amber-500' : ''}`} />
            </button>

            <button
              onClick={handleLogout}
              title="Encerrar Sessão Segura"
              className="p-3 bg-slate-950 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/50 rounded-xl transition-all shadow-md"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Saldo de Créditos em Estilo Dourado de Luxo */}
        <HeaderSaldoCreditos
          saldoCreditos={usuario?.saldo_creditos ?? 1}
          planoAtual={usuario?.plano_atual || 'Start'}
          onAbrirRecarga={() => setModalRecargaAberto(true)}
        />

        {/* Banner da Central de Fotos & Backups */}
        <BannerBackupGamificacao
          totalFotosBackup={totalFotosReal}
          espacoTexto={espacoTexto}
        />

        {/* Tabela de Imóveis do Corretor */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-500" />
              Seus Imóveis Cadastrados ({listaImoveis.length})
            </h2>
          </div>

          <TabelaImoveis imoveis={listaImoveis} userEmail={usuario?.email || 'corretorbrazza@gmail.com'} />
        </div>

        {/* Modal de Recarga Mercado Pago */}
        <ModalRecargaCreditos
          isOpen={modalRecargaAberto}
          onClose={() => setModalRecargaAberto(false)}
          userEmail={usuario?.email || 'corretorbrazza@gmail.com'}
          pacoteInicial={pacoteInicialModal}
        />
      </div>
    </div>
  );
}
