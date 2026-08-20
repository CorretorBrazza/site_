'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Brain,
  Users,
  Coins,
  HardDrive,
  Sparkles,
  Plus,
  Send,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Building2,
  RefreshCw,
  Lock,
  KeyRound,
  LogOut,
  Eye,
  EyeOff,
  Cpu,
  Zap,
  Activity,
  Key,
  Trash2,
  ExternalLink,
  PhoneCall,
} from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';
import CuradoriaRegionalAdmin from './CuradoriaRegionalAdmin';

interface OperationItem {
  ad_id: string;
  referencia: string;
  titulo: string;
  status: string;
  corretor_email: string;
  updated_at: string | null;
  next_action: string;
}

interface StatsData {
  total_corretores: number;
  total_anuncios: number;
  anuncios_ativos: number;
  total_creditos_rede: number;
  espaco_salvo_gb: string;
  total_fotos_acervo: number;
  operacao?: {
    status_counts: Record<string, number>;
    em_processamento: number;
    aguardando_aprovacao: number;
    exigem_atencao: number;
    corretores_sem_credito: number;
    corretores_saldo_baixo: number;
    itens_atencao: OperationItem[];
  };
}

interface CorretorData {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  saldo_creditos: number;
  plano_atual: string;
  total_anuncios?: number;
  anuncios_ativos?: number;
  status: string;
  created_at: string;
}

interface AnuncioData {
  id: string;
  ad_id: string;
  titulo: string;
  tipo: string;
  transacao: string;
  preco: number;
  status: string;
  corretor_email: string;
  corretor_nome: string;
  corretor_telefone: string;
  foto_capa: string;
  total_fotos: number;
  created_at: string;
}

interface GeminiKeyMetric {
  key_alias: string;
  total_requests: number;
  total_prompt_tokens: number;
  total_completion_tokens: number;
  total_tokens: number;
  errors_count: number;
  last_used_at: string | null;
}

interface GeminiMetricsData {
  keys?: GeminiKeyMetric[];
  total_requests_all_keys?: number;
  total_tokens_all_keys?: number;
  model_configured?: string;
  configured_keys_count?: number;
}

interface ConhecimentoItem {
  id: string;
  titulo: string;
  cidade: string;
  bairro?: string;
  categoria?: string;
  descricao: string;
  pontos_interesse?: string[];
  vias_acesso?: string[];
  validado_por_admin?: boolean;
  created_at?: string;
}

export default function AdminDashboardPage() {
  // Autenticação Admin
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [emailLogin, setEmailLogin] = useState('');
  const [senhaLogin, setSenhaLogin] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erroAuth, setErroAuth] = useState<string | null>(null);
  const [autenticando, setAutenticando] = useState(false);

  // Estados do Dashboard
  const [abaAtiva, setAbaAtiva] = useState<'conhecimento' | 'corretores' | 'anuncios' | 'metricas'>('conhecimento');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [corretores, setCorretores] = useState<CorretorData[]>([]);
  const [anunciosList, setAnunciosList] = useState<AnuncioData[]>([]);
  const [conhecimentoList, setConhecimentoList] = useState<ConhecimentoItem[]>([]);
  const [geminiMetrics, setGeminiMetrics] = useState<GeminiMetricsData | null>(null);

  // Form de inserção de conhecimento por texto bruto
  const [textoBruto, setTextoBruto] = useState('');
  const [cidadeSel, setCidadeSel] = useState('Taboão da Serra');
  const [bairroSel, setBairroSel] = useState('');
  const [processandoIa, setProcessandoIa] = useState(false);
  const [msgSucessoIa, setMsgSucessoIa] = useState<string | null>(null);
  const [erroIa, setErroIa] = useState<string | null>(null);

  // Modal Ajuste Créditos
  const [corretorSelecionado, setCorretorSelecionado] = useState<CorretorData | null>(null);
  const [qtdCreditos, setQtdCreditos] = useState(5);
  const [motivoAjuste, setMotivoAjuste] = useState('Bônus de Parceiro Admin');
  const [salvandoCredito, setSalvandoCredito] = useState(false);

  // Convite de Novos Corretores com Bônus
  const [telefoneConvite, setTelefoneConvite] = useState('');
  const [creditosConvite, setCreditosConvite] = useState(3);
  const [nomeConvite, setNomeConvite] = useState('');
  const [enviandoConvite, setEnviandoConvite] = useState(false);
  const [msgSucessoConvite, setMsgSucessoConvite] = useState<string | null>(null);
  const [erroConvite, setErroConvite] = useState<string | null>(null);

  // Verifica token ao carregar
  useEffect(() => {
    const savedToken = localStorage.getItem('admin_token');
    if (savedToken) {
      setAdminToken(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (adminToken) {
      carregarDadosAdmin(adminToken);
    }
  }, [adminToken]);

  const handleLoginAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErroAuth(null);
    setAutenticando(true);

    try {
      const res = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailLogin, senha: senhaLogin }),
      });

      const json = await res.json();
      if (json.success && json.data.token) {
        localStorage.setItem('admin_token', json.data.token);
        setAdminToken(json.data.token);
      } else {
        setErroAuth(json.message || 'Falha na autenticação administrativa. Verifique e-mail e senha.');
      }
    } catch (err) {
      setErroAuth('Erro ao se conectar com a API no Railway.');
    } finally {
      setAutenticando(false);
    }
  };

  const handleLogoutAdmin = () => {
    localStorage.removeItem('admin_token');
    setAdminToken(null);
  };

  const carregarDadosAdmin = async (token: string) => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [resStats, resCorretores, resAnuncios, resConhecimento, resMetrics] = await Promise.all([
        fetch(`${API_BASE_URL}/admin/stats`, { headers }).then((r) => r.json()).catch(() => ({})),
        fetch(`${API_BASE_URL}/admin/corretores`, { headers }).then((r) => r.json()).catch(() => ({})),
        fetch(`${API_BASE_URL}/admin/anuncios`, { headers }).then((r) => r.json()).catch(() => ({})),
        fetch(`${API_BASE_URL}/admin/conhecimento`, { headers }).then((r) => r.json()).catch(() => ({})),
        fetch(`${API_BASE_URL}/admin/gemini-metrics`, { headers }).then((r) => r.json()).catch(() => ({})),
      ]);

      // Se o token estiver expirado ou inválido, limpa localStorage e pede login limpo
      if (
        (resCorretores.message && resCorretores.message.includes('expirad')) ||
        (resCorretores.error && resCorretores.error.includes('expirad')) ||
        (resStats.message && resStats.message.includes('expirad'))
      ) {
        localStorage.removeItem('admin_token');
        setAdminToken(null);
        setErroAuth('Sessão expirada. Insira sua senha para reautenticar e carregar o Firebase.');
        return;
      }

      if (resStats.success) {
        setStats(resStats.data || resStats);
        if (resStats.gemini_metrics || resStats.data?.gemini_metrics) {
          setGeminiMetrics(resStats.gemini_metrics || resStats.data?.gemini_metrics);
        }
      }

      if (resCorretores.success) {
        const lista = Array.isArray(resCorretores.data)
          ? resCorretores.data
          : (Array.isArray(resCorretores.corretores) ? resCorretores.corretores : []);
        setCorretores(lista);
      } else if (Array.isArray(resCorretores)) {
        setCorretores(resCorretores);
      }

      if (resAnuncios.success && Array.isArray(resAnuncios.data)) {
        setAnunciosList(resAnuncios.data);
      }

      if (resConhecimento.success) {
        const regional = resConhecimento.data?.regional || [];
        const conds = (resConhecimento.data?.condominios || []).map((c: any) => ({
          id: c.id,
          titulo: c.nome,
          cidade: c.cidade || 'Taboão da Serra',
          bairro: c.bairro,
          categoria: 'condominio',
          descricao: `Condomínio com ${c.caracteristicas_oficiais?.torres || 1} torres e infraestrutura completa.`,
          pontos_interesse: c.pontos_interesse_proximos || [],
        }));
        setConhecimentoList([...regional, ...conds]);
      }

      if (resMetrics.success && resMetrics.data) {
        setGeminiMetrics(resMetrics.data);
      }
    } catch (err) {
      console.error('Erro ao carregar painel admin:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExcluirAnuncioAdmin = async (adId: string, titulo: string) => {
    if (!adminToken) return;
    const confirmou = window.confirm(`Tem certeza de que deseja EXCLUIR DEFINITIVAMENTE o anúncio "${titulo}" (ID: ${adId})? Esta ação não poderá ser desfeita.`);
    if (!confirmou) return;

    try {
      const res = await fetch(`${API_BASE_URL}/admin/anuncios/${encodeURIComponent(adId)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      const json = await res.json();
      if (json.success) {
        alert(`Anúncio "${titulo}" excluído com sucesso do portal!`);
        carregarDadosAdmin(adminToken);
      } else {
        alert(json.message || 'Erro ao excluir anúncio.');
      }
    } catch (err) {
      alert('Erro de conexão ao excluir anúncio.');
    }
  };

  const handleEnviarTextoBrutoIa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken) return;
    setMsgSucessoIa(null);
    setErroIa(null);
    setProcessandoIa(true);

    try {
      const res = await fetch(`${API_BASE_URL}/admin/conhecimento/texto-bruto`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          texto_bruto: textoBruto,
          cidade: cidadeSel,
          bairro: bairroSel,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setMsgSucessoIa(`✨ Conhecimento extraído e formatado com sucesso pela IA! Cadastrado: "${json.data.conhecimento.titulo}"`);
        setTextoBruto('');
        setBairroSel('');
        carregarDadosAdmin(adminToken);
      } else {
        setErroIa(json.message || 'Falha ao processar texto bruto com IA.');
      }
    } catch (err) {
      setErroIa('Erro de conexão ao servidor.');
    } finally {
      setProcessandoIa(false);
    }
  };

  const handleSalvarAjusteCreditos = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!corretorSelecionado || !adminToken) return;
    setSalvandoCredito(true);

    try {
      const res = await fetch(`${API_BASE_URL}/admin/corretores/creditos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          email: corretorSelecionado.email,
          quantidade: Number(qtdCreditos),
          motivo: motivoAjuste,
        }),
      });

      const json = await res.json();
      if (json.success) {
        alert(`Créditos ajustados com sucesso para ${corretorSelecionado.email}!`);
        setCorretorSelecionado(null);
        carregarDadosAdmin(adminToken);
      } else {
        alert(json.message || 'Erro ao ajustar créditos.');
      }
    } catch (err) {
      alert('Erro de conexão ao servidor.');
    } finally {
      setSalvandoCredito(false);
    }
  };

  const handleEnviarConvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken) return;
    setMsgSucessoConvite(null);
    setErroConvite(null);
    setEnviandoConvite(true);

    try {
      const res = await fetch(`${API_BASE_URL}/admin/convidar-corretor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          telefone: telefoneConvite,
          creditos_bonus: Number(creditosConvite),
          nome_sugerido: nomeConvite,
        }),
      });

      const json = await res.json();
      if (json.success) {
        setMsgSucessoConvite(json.message || `Convite enviado com sucesso para ${telefoneConvite}!`);
        setTelefoneConvite('');
        setNomeConvite('');
        setCreditosConvite(3);
        carregarDadosAdmin(adminToken);
      } else {
        setErroConvite(json.message || 'Falha ao enviar convite.');
      }
    } catch (err) {
      setErroConvite('Erro de conexão ao servidor no Railway.');
    } finally {
      setEnviandoConvite(false);
    }
  };

  // RENDERIZAÇÃO TELA DE LOGIN SE NÃO ESTIVER AUTENTICADO COMO ADMIN
  if (!adminToken) {
    return (
      <div className="bg-slate-950 min-h-screen flex items-center justify-center p-4 text-slate-100">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <ShieldCheck className="w-40 h-40 text-blue-500" />
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-purple-950 text-purple-300 border border-purple-800 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-6">
              <Lock className="w-3.5 h-3.5" /> Área Restrita ao Desenvolvedor
            </div>

            <h1 className="text-2xl font-black text-white tracking-tight mb-2">Painel do Desenvolvedor</h1>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Ambiente protegido por criptografia JWT e privilégios master. Insira suas credenciais de administrador para acessar o RAG e gestão de rede.
            </p>

            {erroAuth && (
              <div className="bg-red-950/90 border border-red-800 text-red-200 text-xs p-3.5 rounded-xl mb-6 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{erroAuth}</span>
              </div>
            )}

            <form onSubmit={handleLoginAdmin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  E-mail Master Admin
                </label>
                <input
                  type="email"
                  required
                  value={emailLogin}
                  onChange={(e) => setEmailLogin(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Senha Criptografada
                </label>
                <div className="relative">
                  <input
                    type={mostrarSenha ? 'text' : 'password'}
                    required
                    value={senhaLogin}
                    onChange={(e) => setSenhaLogin(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-blue-500 font-medium pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarSenha(!mostrarSenha)}
                    className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
                  >
                    {mostrarSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={autenticando}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                {autenticando ? (
                  <span>Validando Criptografia...</span>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Autenticar Sessão Master</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // RENDERIZAÇÃO DO DASHBOARD ADMINISTRATIVO SE AUTENTICADO
  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 pb-20">
      {/* Top Header Admin */}
      <div className="border-b border-slate-800 bg-slate-900/60 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600/20 border border-blue-500/30 rounded-xl text-blue-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight text-white">Painel do Desenvolvedor / Admin</h1>
                <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Sessão Protegida JWT
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Base de Conhecimento Ampliada: <strong className="text-slate-200">Taboão da Serra & Embu das Artes</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => carregarDadosAdmin(adminToken)}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-all text-xs flex items-center gap-1.5 font-bold"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Atualizar
            </button>
            <button
              onClick={handleLogoutAdmin}
              title="Encerrar Sessão Master"
              className="p-2.5 text-slate-400 hover:text-red-400 hover:bg-red-950/40 border border-slate-800 rounded-xl transition-all text-xs flex items-center gap-1 font-bold"
            >
              <LogOut className="w-4 h-4" /> Sair
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8">
        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2 font-bold uppercase tracking-wider">
              <span>Corretores</span>
              <Users className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-3xl font-black text-white">{stats?.total_corretores ?? 0}</div>
            <div className="text-[11px] text-slate-500 mt-1">Contas ativas na rede</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2 font-bold uppercase tracking-wider">
              <span>Anúncios no Portal</span>
              <Building2 className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-3xl font-black text-white">{stats?.anuncios_ativos ?? 0}</div>
            <div className="text-[11px] text-slate-500 mt-1">Total acumulado: {stats?.total_anuncios ?? 0}</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2 font-bold uppercase tracking-wider">
              <span>Créditos Circulando</span>
              <Coins className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-black text-white">{stats?.total_creditos_rede ?? 0}</div>
            <div className="text-[11px] text-slate-500 mt-1">Saldo total dos corretores</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2 font-bold uppercase tracking-wider">
              <span>Uso Gemini IA</span>
              <Cpu className="w-4 h-4 text-yellow-400" />
            </div>
            <div className="text-3xl font-black text-white">
              {geminiMetrics?.total_tokens_all_keys ? (geminiMetrics.total_tokens_all_keys).toLocaleString('pt-BR') : 0}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {geminiMetrics?.total_requests_all_keys ?? 0} requisições IA
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl col-span-2 md:col-span-1">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-2 font-bold uppercase tracking-wider">
              <span>Nuvem Imóveis Taboão</span>
              <HardDrive className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-3xl font-black text-white">{stats?.espaco_salvo_gb || '0.00 GB'}</div>
            <div className="text-[11px] text-slate-500 mt-1">{stats?.total_fotos_acervo ?? 0} fotos salvas em alta</div>
          </div>
        </div>

        {/* Central de operação: transforma contagens em ações priorizadas */}
        <section className="mb-8 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-slate-800 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-blue-400">Central operacional</p>
              <h2 className="text-lg font-black text-white mt-1">O que exige atenção agora</h2>
              <p className="text-xs text-slate-400 mt-1">Fila de aprovação, exceções e saúde de créditos calculadas a partir dos anúncios e corretores atuais.</p>
            </div>
            <span className={`text-xs font-black px-3 py-1.5 rounded-lg border ${(stats?.operacao?.exigem_atencao || 0) > 0 ? 'text-rose-300 border-rose-800 bg-rose-950/60' : 'text-emerald-300 border-emerald-800 bg-emerald-950/60'}`}>
              {(stats?.operacao?.exigem_atencao || 0) > 0 ? `${stats?.operacao?.exigem_atencao} anúncio(s) precisam de ação` : 'Nenhuma exceção crítica agora'}
            </span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-px bg-slate-800">
            <div className="bg-slate-900 p-4"><div className="text-[10px] uppercase font-black tracking-wider text-blue-400">Processando</div><div className="text-2xl font-black text-white mt-1">{stats?.operacao?.em_processamento ?? 0}</div><div className="text-[11px] text-slate-500 mt-1">Pipeline de IA</div></div>
            <div className="bg-slate-900 p-4"><div className="text-[10px] uppercase font-black tracking-wider text-amber-400">Aprovação</div><div className="text-2xl font-black text-white mt-1">{stats?.operacao?.aguardando_aprovacao ?? 0}</div><div className="text-[11px] text-slate-500 mt-1">Aguardando corretor</div></div>
            <div className="bg-slate-900 p-4"><div className="text-[10px] uppercase font-black tracking-wider text-rose-400">Exceções</div><div className="text-2xl font-black text-white mt-1">{stats?.operacao?.exigem_atencao ?? 0}</div><div className="text-[11px] text-slate-500 mt-1">Rejeitados ou expirados</div></div>
            <div className="bg-slate-900 p-4"><div className="text-[10px] uppercase font-black tracking-wider text-rose-400">Sem saldo</div><div className="text-2xl font-black text-white mt-1">{stats?.operacao?.corretores_sem_credito ?? 0}</div><div className="text-[11px] text-slate-500 mt-1">Corretores bloqueados</div></div>
            <div className="bg-slate-900 p-4"><div className="text-[10px] uppercase font-black tracking-wider text-amber-400">Saldo baixo</div><div className="text-2xl font-black text-white mt-1">{stats?.operacao?.corretores_saldo_baixo ?? 0}</div><div className="text-[11px] text-slate-500 mt-1">1 ou 2 créditos</div></div>
          </div>
          <div className="p-5">
            {(stats?.operacao?.itens_atencao || []).length === 0 ? (
              <div className="text-sm text-slate-400 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Nenhum anúncio aguardando ação administrativa no momento.</div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {(stats?.operacao?.itens_atencao || []).map((item) => (
                  <div key={item.ad_id} className="border border-slate-800 bg-slate-950/60 rounded-xl p-4 flex items-start justify-between gap-4">
                    <div className="min-w-0"><div className="text-[10px] uppercase font-black text-amber-400">{item.referencia} · {item.status}</div><div className="font-bold text-white text-sm truncate mt-1">{item.titulo}</div><div className="text-xs text-slate-400 truncate mt-1">{item.corretor_email}</div><div className="text-xs text-slate-300 mt-2">{item.next_action}</div></div>
                    <button onClick={() => { setAbaAtiva('anuncios'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="shrink-0 text-xs font-bold px-3 py-2 border border-slate-700 rounded-lg text-slate-200 hover:border-blue-500 hover:text-blue-300">Ver</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* NAVEGAÇÃO DE ABAS */}
        <div className="flex border-b border-slate-800 mb-8 gap-2 overflow-x-auto">
          <button
            onClick={() => setAbaAtiva('conhecimento')}
            className={`py-3 px-5 text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              abaAtiva === 'conhecimento'
                ? 'border-blue-500 text-blue-400 bg-blue-500/10 rounded-t-xl'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Brain className="w-4 h-4" /> Base de Conhecimento IA ({conhecimentoList.length})
          </button>
          <button
            onClick={() => setAbaAtiva('corretores')}
            className={`py-3 px-5 text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              abaAtiva === 'corretores'
                ? 'border-blue-500 text-blue-400 bg-blue-500/10 rounded-t-xl'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" /> Corretores & Créditos ({corretores.length})
          </button>
          <button
            onClick={() => setAbaAtiva('anuncios')}
            className={`py-3 px-5 text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              abaAtiva === 'anuncios'
                ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10 rounded-t-xl'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className="w-4 h-4 text-emerald-400" /> Anúncios Ativos & Gestão ({anunciosList.length})
          </button>
          <button
            onClick={() => setAbaAtiva('metricas')}
            className={`py-3 px-5 text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              abaAtiva === 'metricas'
                ? 'border-amber-500 text-amber-400 bg-amber-500/10 rounded-t-xl'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-4 h-4 text-yellow-400" /> Métricas Gemini IA & Chaves
          </button>
        </div>

        {/* ABA 1: BASE DE CONHECIMENTO RAG */}
        {abaAtiva === 'conhecimento' && (
          <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form de Inserção de Texto Bruto com IA */}
            <div className="lg:col-span-1 bg-slate-900 border border-slate-800 p-6 rounded-2xl h-fit">
              <div className="flex items-center gap-2 mb-2 text-blue-400 font-bold text-sm">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                <span>Alimentar Conhecimento com IA</span>
              </div>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                Cole qualquer texto solto sobre bairros, comércios ou pontos turísticos de <strong className="text-slate-200">Taboão da Serra ou Embu das Artes</strong>. O Gemini organizará os dados automaticamente.
              </p>

              {msgSucessoIa && (
                <div className="bg-emerald-950/80 border border-emerald-800 text-emerald-200 text-xs p-3 rounded-xl mb-4 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                  <span>{msgSucessoIa}</span>
                </div>
              )}

              {erroIa && (
                <div className="bg-red-950/80 border border-red-800 text-red-200 text-xs p-3 rounded-xl mb-4 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                  <span>{erroIa}</span>
                </div>
              )}

              <form onSubmit={handleEnviarTextoBrutoIa} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Região / Cidade
                  </label>
                  <select
                    value={cidadeSel}
                    onChange={(e) => setCidadeSel(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Taboão da Serra">Taboão da Serra</option>
                    <option value="Embu das Artes">Embu das Artes</option>
                    <option value="São Paulo (Zona Sul / Vila Sônia)">São Paulo (Vila Sônia / Morumbi)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Bairro (Opcional)
                  </label>
                  <input
                    type="text"
                    value={bairroSel}
                    onChange={(e) => setBairroSel(e.target.value)}
                    placeholder="Ex: Parque Assunção, Centro Histórico de Embu..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Texto Bruto / Informações Locais
                  </label>
                  <textarea
                    rows={6}
                    required
                    value={textoBruto}
                    onChange={(e) => setTextoBruto(e.target.value)}
                    placeholder="Ex: O bairro Jardim Amanda em Embu das Artes possui fácil acesso à Rodovia Régis Bittencourt e fica a 5 min da feirinha de artesanato. Tem o novo supermercado Assaí próximo e feira livre aos domingos..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={processandoIa}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {processandoIa ? (
                    <span>IA Extraindo e Formatando...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Processar e Inserir na Base</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Lista de Conhecimentos Cadastrados */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-purple-400" />
                  Base de Conhecimento Ativa na Nuvem ({conhecimentoList.length})
                </h3>
              </div>

              {conhecimentoList.length === 0 ? (
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center text-slate-400 text-sm">
                  Nenhum conhecimento registrado na base ainda. Cole um texto ao lado para criar o primeiro!
                </div>
              ) : (
                <div className="space-y-4">
                  {conhecimentoList.map((item) => (
                    <div key={item.id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl hover:border-slate-700 transition-all">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <span className="inline-block bg-purple-950 text-purple-300 border border-purple-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider mb-1">
                            {item.cidade} {item.bairro ? `• ${item.bairro}` : ''}
                          </span>
                          <h4 className="text-lg font-bold text-white">{item.titulo}</h4>
                        </div>
                        <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Validado
                        </span>
                      </div>

                      <p className="text-slate-300 text-xs leading-relaxed mb-3">{item.descricao}</p>

                      {item.pontos_interesse && item.pontos_interesse.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {item.pontos_interesse.map((pi, idx) => (
                            <span key={idx} className="bg-slate-950 border border-slate-800 text-slate-400 text-[11px] px-2 py-0.5 rounded-md">
                              📍 {pi}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <CuradoriaRegionalAdmin adminToken={adminToken} />
          </>
        )}

        {/* ABA 2: CORRETORES & GESTÃO DE CRÉDITOS */}
        {abaAtiva === 'corretores' && (
          <div className="space-y-8">
            {/* Card de Convite de Novos Corretores */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 p-6 rounded-2xl shadow-xl relative overflow-hidden">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1">
                    <Sparkles className="w-3 h-3 text-emerald-400" /> Prospecção & Expansão de Corretores
                  </div>
                  <h3 className="text-lg font-black text-white">Convidar Novo Corretor via WhatsApp com Créditos Bônus</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Envie um convite oficial para o WhatsApp do corretor. Quando ele responder, a IA assumirá o cadastro e liberará os créditos bônus + 1 de boas-vindas.
                  </p>
                </div>
              </div>

              {msgSucessoConvite && (
                <div className="bg-emerald-950/90 border border-emerald-800 text-emerald-200 text-xs p-3.5 rounded-xl mb-4 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{msgSucessoConvite}</span>
                </div>
              )}

              {erroConvite && (
                <div className="bg-red-950/90 border border-red-800 text-red-200 text-xs p-3.5 rounded-xl mb-4 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{erroConvite}</span>
                </div>
              )}

              <form onSubmit={handleEnviarConvite} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Telefone WhatsApp *
                  </label>
                  <input
                    type="text"
                    required
                    value={telefoneConvite}
                    onChange={(e) => setTelefoneConvite(e.target.value)}
                    placeholder="Ex: 11989161897 ou (11) 98916-1897"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Créditos Bônus
                  </label>
                  <select
                    value={creditosConvite}
                    onChange={(e) => setCreditosConvite(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-blue-500 font-medium"
                  >
                    <option value={1}>1 Crédito Bônus (+1 grátis = 2 total)</option>
                    <option value={2}>2 Créditos Bônus (+1 grátis = 3 total)</option>
                    <option value={3}>3 Créditos Bônus (+1 grátis = 4 total)</option>
                    <option value={5}>5 Créditos Bônus (+1 grátis = 6 total)</option>
                    <option value={10}>10 Créditos Bônus (+1 grátis = 11 total)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Nome / Apelido (Opcional)
                  </label>
                  <input
                    type="text"
                    value={nomeConvite}
                    onChange={(e) => setNomeConvite(e.target.value)}
                    placeholder="Ex: Carlos Corretor"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={enviandoConvite || !telefoneConvite}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50 h-[42px]"
                  >
                    {enviandoConvite ? (
                      <span>Disparando Convite...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Enviar Convite WhatsApp</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Tabela de Corretores */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
              <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-900">
                <div>
                  <h3 className="font-bold text-white text-base">Rede de Corretores Cadastrados ({corretores.length})</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Visão executiva de saldo de créditos, WhatsApp e contagem de anúncios ativos por corretor.</p>
                </div>
              </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-4">Corretor / Nome</th>
                    <th className="p-4">Contato / WhatsApp</th>
                    <th className="p-4 text-center">Anúncios Ativos</th>
                    <th className="p-4">Saldo Créditos</th>
                    <th className="p-4">Plano</th>
                    <th className="p-4 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-medium">
                  {corretores.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500">
                        Nenhum corretor cadastrado na plataforma até o momento.
                      </td>
                    </tr>
                  ) : (
                    corretores.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-850 transition-colors">
                        <td className="p-4">
                          <div className="font-bold text-white text-sm">{c.nome}</div>
                          <div className="text-slate-400 text-xs font-mono">{c.email}</div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1.5 text-slate-300 font-medium">
                            <PhoneCall className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>{c.telefone || 'Não informado'}</span>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 font-black px-3 py-1 rounded-full text-xs">
                            {c.anuncios_ativos ?? 0} ativos
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="bg-amber-950 text-amber-300 border border-amber-800 font-black px-2.5 py-1 rounded-lg">
                            🪙 {c.saldo_creditos} Créditos
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                            {c.plano_atual}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => setCorretorSelecionado(c)}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-all flex items-center gap-1.5 ml-auto shadow-md"
                          >
                            <Coins className="w-4 h-4" /> Adicionar Créditos
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        )}

        {/* ABA 3: GESTÃO & EXCLUSÃO DE ANÚNCIOS DO PORTAL */}
        {abaAtiva === 'anuncios' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-900">
              <div>
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-emerald-400" />
                  Anúncios Publicados no Portal ({anunciosList.length})
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Como Administrador Master, você pode visualizar detalhes e excluir qualquer anúncio com 1 clique.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-4">Imóvel / Capa</th>
                    <th className="p-4">Tipo & Valor</th>
                    <th className="p-4">Corretor Responsável</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-right">Ações Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-medium">
                  {anunciosList.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-12 text-center text-slate-500">
                        Nenhum imóvel ativo ou publicado no portal no momento.
                      </td>
                    </tr>
                  ) : (
                    anunciosList.map((ad) => (
                      <tr key={ad.id} className="hover:bg-slate-850 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={ad.foto_capa}
                              alt={ad.titulo}
                              className="w-14 h-14 object-cover rounded-xl border border-slate-800 shrink-0 bg-slate-950"
                            />
                            <div>
                              <div className="font-bold text-white text-sm line-clamp-1 max-w-xs">{ad.titulo}</div>
                              <div className="text-slate-400 text-xs">REF / ID: <span className="font-mono text-amber-400 font-bold">{ad.ad_id}</span> • {ad.total_fotos} fotos</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-emerald-400 text-sm">
                            {ad.preco > 0
                              ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(ad.preco)
                              : 'Sob Consulta'}
                          </div>
                          <div className="text-slate-400 text-xs">
                            <span className="bg-slate-950 text-slate-300 px-2 py-0.5 rounded border border-slate-800 uppercase text-[10px] font-bold">
                              {ad.transacao}
                            </span> • {ad.tipo}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-white">{ad.corretor_nome}</div>
                          <div className="text-slate-400 text-xs font-mono">{ad.corretor_email}</div>
                          <div className="text-slate-500 text-[11px]">{ad.corretor_telefone}</div>
                        </td>
                        <td className="p-4 text-center">
                          <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                            {ad.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/imovel/${ad.id}`}
                              target="_blank"
                              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-all text-xs flex items-center gap-1 font-bold"
                              title="Ver anúncio no site"
                            >
                              <ExternalLink className="w-3.5 h-3.5" /> Ver
                            </Link>

                            <button
                              onClick={() => handleExcluirAnuncioAdmin(ad.id, ad.titulo)}
                              className="p-2.5 bg-red-950/80 hover:bg-red-900 border border-red-800/80 text-red-300 rounded-xl transition-all text-xs flex items-center gap-1 font-bold"
                              title="Excluir este anúncio do portal"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-red-400" /> Excluir
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ABA 3: MÉTRICAS GEMINI IA & CHAVES */}
        {abaAtiva === 'metricas' && (
          <div className="space-y-6">
            {/* Header de Status do Cluster de IA */}
            <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-indigo-950/40 border border-amber-500/20 p-6 rounded-2xl">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1">
                      <Zap className="w-3 h-3 text-yellow-400" /> Cluster de IA Multimodal Operacional
                    </span>
                    <span className="bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                      Modelo: {geminiMetrics?.model_configured || 'gemini-1.5-flash'}
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-white">Métricas de Consumo de Tokens & Pool de Chaves</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Monitoramento em tempo real do rodízio de chaves API do Google Gemini (Flash, Pro & Media Kit).
                  </p>
                </div>

                <div className="flex items-center gap-4 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                  <div className="text-right">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Acumulado</div>
                    <div className="text-xl font-black text-amber-400">
                      {geminiMetrics?.total_tokens_all_keys ? (geminiMetrics.total_tokens_all_keys).toLocaleString('pt-BR') : 0} tokens
                    </div>
                  </div>
                  <div className="h-8 w-px bg-slate-800"></div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Chaves Ativas</div>
                    <div className="text-xl font-black text-emerald-400">
                      {geminiMetrics?.configured_keys_count ?? (geminiMetrics?.keys?.length || 4)} chaves
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Grid de Métricas por Chave */}
            {geminiMetrics?.keys && geminiMetrics.keys.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {geminiMetrics.keys.map((k, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl hover:border-slate-700 transition-all relative overflow-hidden">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Key className="w-4 h-4 text-amber-400" />
                      <span className="font-bold text-xs text-white truncate max-w-[140px]">{k.key_alias}</span>
                    </div>
                    <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                      Configurada
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-slate-300">
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Requisições:</span>
                      <span className="font-bold text-white">{k.total_requests}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Tokens de Entrada:</span>
                      <span className="font-bold text-slate-200">{k.total_prompt_tokens.toLocaleString('pt-BR')}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Tokens de Saída:</span>
                      <span className="font-bold text-slate-200">{k.total_completion_tokens.toLocaleString('pt-BR')}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-800">
                      <span className="text-slate-400">Total Tokens:</span>
                      <span className="font-bold text-amber-400">{(k.total_tokens || 0).toLocaleString('pt-BR')}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">Rate Limits (429):</span>
                      <span className={`font-bold ${k.errors_count > 0 ? 'text-red-400' : 'text-slate-400'}`}>{k.errors_count}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-800/80 text-[10px] text-slate-500 flex items-center justify-between">
                    <span>Último uso:</span>
                    <span className="text-slate-400 font-mono">
                      {k.last_used_at ? new Date(k.last_used_at).toLocaleTimeString('pt-BR') : 'Sem registros'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center text-slate-400 text-xs font-medium">
                Nenhuma chave de API Gemini foi detectada nas variáveis de ambiente do Railway.
              </div>
            )}

            {/* Painel Informativo sobre as Regras do Gemini em Produção */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                Regras de Negócio e Segurança da Inteligência Artificial em Produção
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="font-bold text-blue-300 mb-1">🗺️ Validação Dupla de Endereço (RAG)</div>
                  <p className="text-slate-400 leading-relaxed">
                    Para apartamentos e condomínios em Taboão da Serra e Embu, o endereço é cruzado pelo menos 2x com o Google Maps e a base local de condomínios. Se não validado, o imóvel é registrado sem endereço aproximado para 0% de alucinações.
                  </p>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="font-bold text-green-300 mb-1">🏷️ JSON Estrito de Preço Condicional</div>
                  <p className="text-slate-400 leading-relaxed">
                    A IA gera estritamente a chave <code className="text-slate-200">precoVenda</code> para Venda ou <code className="text-slate-200">precoLocacao</code> para Locação, eliminando ambiguidade de valores no portal.
                  </p>
                </div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="font-bold text-purple-300 mb-1">🔄 Fallback de Chaves & Resiliência</div>
                  <p className="text-slate-400 leading-relaxed">
                    Se a chave <code className="text-slate-200">GEMINI_PRO_KEY</code> atingir o limite ou falhar, o sistema faz o fallback gracioso instantâneo para a <code className="text-slate-200">GEMINI_FLASH_KEY_1</code> sem derrubar o fluxo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL DE ADICIONAR CRÉDITOS */}
      {corretorSelecionado && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 max-w-md w-full p-6 rounded-2xl shadow-2xl relative">
            <h3 className="text-lg font-bold text-white mb-1">Ajustar Créditos do Corretor</h3>
            <p className="text-xs text-slate-400 mb-4">
              Corretor: <strong className="text-white">{corretorSelecionado.nome}</strong> ({corretorSelecionado.email})
            </p>

            <form onSubmit={handleSalvarAjusteCreditos} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Quantidade de Créditos a Adicionar (ou remover com -)
                </label>
                <input
                  type="number"
                  required
                  value={qtdCreditos}
                  onChange={(e) => setQtdCreditos(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-blue-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Motivo / Observação
                </label>
                <input
                  type="text"
                  required
                  value={motivoAjuste}
                  onChange={(e) => setMotivoAjuste(e.target.value)}
                  placeholder="Ex: Bonificação de Parceria Admin"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={salvandoCredito}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl text-xs transition-all"
                >
                  {salvandoCredito ? 'Salvando...' : 'Confirmar Ajuste'}
                </button>
                <button
                  type="button"
                  onClick={() => setCorretorSelecionado(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-3 rounded-xl text-xs transition-all"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
