'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import PhotoReorder, { PhotoItem } from '@/components/PhotoReorder';
import MediaKitDisplay from '@/components/MediaKitDisplay';
import {
  validateMagicToken,
  getApprovalDetails,
  approveAd,
  rejectAd,
  editAd,
  reorderPhotos,
} from '@/lib/api';
import { normalizeApprovalFinalidade } from '@/lib/approval-form';
import {
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Sparkles,
  Edit3,
  Image as ImageIcon,
  FileText,
  Save,
  MapPin,
  Building2,
  Send,
} from 'lucide-react';

function AprovarContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const adIdParam = searchParams.get('ad_id') || searchParams.get('adId') || '';

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [adData, setAdData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'preview' | 'fotos' | 'mediakit'>('preview');

  // Formulário de Edição Completo
  const [titulo, setTitulo] = useState('');
  const [tipoImovel, setTipoImovel] = useState('Apartamento');
  const [finalidade, setFinalidade] = useState('Venda');
  const [descricao, setDescricao] = useState('');
  const [precoVenda, setPrecoVenda] = useState<number | ''>('');
  const [precoLocacao, setPrecoLocacao] = useState<number | ''>('');
  const [condominio, setCondominio] = useState<number | ''>('');
  const [iptu, setIptu] = useState<number | ''>('');
  const [quartos, setQuartos] = useState<number | ''>('');
  const [suites, setSuites] = useState<number | ''>('');
  const [banheiros, setBanheiros] = useState<number | ''>('');
  const [vagas, setVagas] = useState<number | ''>('');
  const [areaUtil, setAreaUtil] = useState<number | ''>('');
  const [bairro, setBairro] = useState('');

  // Fotos
  const [fotos, setFotos] = useState<PhotoItem[]>([]);

  // Estados de Ação
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setErrorMsg('Token de segurança não fornecido no link. Verifique o link recebido no seu e-mail.');
      setLoading(false);
      return;
    }

    async function loadAdData() {
      setLoading(true);
      setErrorMsg(null);

      // Valida token
      const valResult = await validateMagicToken(token, adIdParam || undefined);
      if (!valResult.success) {
        setErrorMsg(valResult.error || 'Magic Link inválido ou expirado.');
        setLoading(false);
        return;
      }

      // Salva sessão dinâmica para que a Navbar e o Painel reconheçam o corretor automaticamente
      if (valResult.data?.session_token) {
        localStorage.setItem('auth_token', valResult.data.session_token);
        document.cookie = `auth_token=${valResult.data.session_token}; path=/; max-age=2592000; SameSite=Lax`;
      }
      if (valResult.data?.user) {
        localStorage.setItem('user_info', JSON.stringify(valResult.data.user));
      }

      const adId = valResult.data?.ad_id || adIdParam;
      const detailsResult = await getApprovalDetails(adId, token);

      if (!detailsResult.success || !detailsResult.data) {
        setErrorMsg(detailsResult.error || 'Não foi possível carregar os detalhes do imóvel.');
        setLoading(false);
        return;
      }

      const data = detailsResult.data;
      setAdData(data);
      setApprovalStatus(data.status);

      // Preenche form completo
      const refinados = data.dados_refinados || {};
      const carac = refinados.caracteristicas || {};
      setTitulo(refinados.titulo || '');
      setTipoImovel(refinados.tipoImovel || 'Apartamento');
      setFinalidade(normalizeApprovalFinalidade(refinados));
      setDescricao(refinados.descricao || '');
      setPrecoVenda(refinados.precoVenda ?? '');
      setPrecoLocacao(refinados.precoLocacao ?? '');
      setCondominio(refinados.condominio ?? '');
      setIptu(refinados.iptu ?? '');
      setQuartos(carac.quartos ?? '');
      setSuites(carac.suites ?? '');
      setBanheiros(carac.banheiros ?? '');
      setVagas(carac.vagas ?? '');
      setAreaUtil(carac.areaUtil ?? carac.areaTotal ?? '');
      setBairro(refinados.endereco?.bairro || '');
      setFotos(data.fotos || []);

      setLoading(false);
    }

    loadAdData();
  }, [token, adIdParam]);

  const getPayloadEditado = () => ({
    titulo,
    tipoImovel,
    finalidade,
    descricao,
    precoVenda: precoVenda === '' ? null : Number(precoVenda),
    precoLocacao: precoLocacao === '' ? null : Number(precoLocacao),
    condominio: condominio === '' ? null : Number(condominio),
    iptu: iptu === '' ? null : Number(iptu),
    bairro,
    caracteristicas: {
      quartos: quartos === '' ? 0 : Number(quartos),
      suites: suites === '' ? 0 : Number(suites),
      banheiros: banheiros === '' ? 0 : Number(banheiros),
      vagas: vagas === '' ? 0 : Number(vagas),
      areaUtil: areaUtil === '' ? 0 : Number(areaUtil),
    },
  });

  // Ação: Salvar Edições
  const handleSaveEdits = async () => {
    if (!adData) return;
    setIsSubmitting(true);
    setFeedbackMsg(null);

    const result = await editAd(token, adData.ad_id, getPayloadEditado());

    setIsSubmitting(false);

    if (result.success) {
      const responseData: any = result.data;
      if (responseData?.media_kit) {
        setAdData((prev: any) => ({
          ...prev,
          media_kit: responseData.media_kit,
        }));
      }
      setFeedbackMsg('Edições salvas e Media Kit recalibrado com sucesso!');
      setTimeout(() => setFeedbackMsg(null), 4000);
    } else {
      alert(`Erro ao salvar edições: ${result.error}`);
    }
  };

  // Ação: Reordenar Fotos
  const handleReorderPhotos = async (newPhotos: PhotoItem[]) => {
    if (!adData) return;
    setFotos(newPhotos);

    // A API recebe os índices do array original; `ordem` muda na interface e não identifica a foto.
    const novaOrdem = newPhotos.map((photo, index) => photo.source_index ?? index);
    const result = await reorderPhotos(token, adData.ad_id, novaOrdem);

    if (!result.success) {
      alert(`Erro ao reordenar fotos: ${result.error}`);
    }
  };

  // Ação: Aprovar
  const handleApprove = async () => {
    if (!adData) return;
    if (!confirm('Deseja realmente APROVAR este anúncio? 1 crédito será debitado do seu saldo.')) return;

    setIsSubmitting(true);
    setFeedbackMsg(null);

    const result = await approveAd(token, adData.ad_id, getPayloadEditado());

    setIsSubmitting(false);

    if (result.success) {
      const refreshed = await getApprovalDetails(adData.ad_id, token);
      if (refreshed.success && refreshed.data) {
        const nextData: any = refreshed.data;
        const nextRefinados = nextData.dados_refinados || {};
        const nextCarac = nextRefinados.caracteristicas || {};
        setAdData(nextData);
        setApprovalStatus(nextData.status || result.data?.status || 'DELIVERED');
        setFotos(nextData.fotos || []);
        setTitulo(nextRefinados.titulo || '');
        setTipoImovel(nextRefinados.tipoImovel || 'Apartamento');
        setFinalidade(normalizeApprovalFinalidade(nextRefinados));
        setDescricao(nextRefinados.descricao || '');
        setPrecoVenda(nextRefinados.precoVenda ?? '');
        setPrecoLocacao(nextRefinados.precoLocacao ?? '');
        setCondominio(nextRefinados.condominio ?? '');
        setIptu(nextRefinados.iptu ?? '');
        setQuartos(nextCarac.quartos ?? '');
        setSuites(nextCarac.suites ?? '');
        setBanheiros(nextCarac.banheiros ?? '');
        setVagas(nextCarac.vagas ?? '');
        setAreaUtil(nextCarac.areaUtil ?? nextCarac.areaTotal ?? '');
        setBairro(nextRefinados.endereco?.bairro || '');
      } else {
        setApprovalStatus(result.data?.status || 'DELIVERED');
        setAdData((prev: any) => ({
          ...prev,
          status: result.data?.status || 'DELIVERED',
          media_kit: result.data?.media_kit || prev.media_kit,
        }));
      }
      setFeedbackMsg('Anúncio Aprovado com sucesso! Fotos e Media Kit foram liberados.');
    } else {
      alert(`Erro ao aprovar anúncio: ${result.error}`);
    }
  };

  // Ação: Rejeitar / Descartar
  const handleReject = async () => {
    if (!adData) return;
    const confirmou = window.confirm('Deseja realmente DESCARTAR este imóvel?\n\n🛡️ Nenhum crédito será debitado do seu saldo e o processamento será cancelado.');
    if (!confirmou) return;

    setIsSubmitting(true);
    const result = await rejectAd(token, adData.ad_id, 'Descartado pelo corretor');
    setIsSubmitting(false);

    if (result.success) {
      setApprovalStatus('REJEITADO');
    } else {
      alert(`Erro ao descartar imóvel: ${result.error}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-600">Validando token e gerando prévia em Taboão da Serra e imediações...</p>
        </div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex items-center justify-center p-6">
        <div className="bg-white border border-red-200 rounded-3xl p-8 text-center shadow-xl space-y-4 max-w-md">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto text-red-600 border border-red-200">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-slate-900">Acesso Não Autorizado</h2>
          <p className="text-xs text-slate-600 leading-relaxed">{errorMsg}</p>
          <div className="pt-2">
            <a
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md"
            >
              Voltar ao Portal
            </a>
          </div>
        </div>
      </div>
    );
  }

  const refinados = adData?.dados_refinados || {};
  const mediaKit = adData?.media_kit || {};

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-8 px-4">
      <main className="max-w-5xl mx-auto space-y-6">

        {/* Banner de Status se Descartado */}
        {approvalStatus === 'REJEITADO' && (
          <div className="bg-amber-50 border border-amber-200 text-amber-950 rounded-3xl p-6 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-10 h-10 text-amber-600 shrink-0" />
              <div>
                <h3 className="text-lg font-black text-amber-900">Imóvel Descartado com Sucesso</h3>
                <p className="text-xs text-amber-700 mt-0.5">
                  Nenhum crédito foi consumido do seu saldo. As fotos temporárias foram removidas da nuvem.
                </p>
              </div>
            </div>
            <a
              href="/painel"
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors shrink-0 shadow-md"
            >
              Ir para o Painel
            </a>
          </div>
        )}

        {/* Banner de Status se Aprovado */}
        {(approvalStatus === 'APPROVED' || approvalStatus === 'DELIVERED') && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-3xl p-6 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 shrink-0" />
              <div>
                <h3 className="text-lg font-black text-emerald-900">Anúncio Aprovado com Sucesso!</h3>
                <p className="text-xs text-emerald-700 mt-0.5">
                  1 crédito debitado do seu saldo. O Media Kit pronto foi entregue no seu e-mail.
                </p>
              </div>
            </div>
            <a
              href={`/imovel/${adData.ad_id}`}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors shrink-0 shadow-md"
            >
              Ver Imóvel no Site
            </a>
          </div>
        )}

        {/* Header do Anúncio */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-black px-3 py-1 rounded-xl uppercase">
                REF: {adData.referencia}
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                Corretor: {adData.corretor_email}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {titulo || 'Anúncio de Imóvel'}
            </h1>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>{refinados.endereco?.bairro || 'Taboão da Serra'}, Taboão da Serra e imediações - SP</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider ${
                approvalStatus === 'APPROVED' || approvalStatus === 'DELIVERED'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : approvalStatus === 'REJEITADO'
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}
            >
              {approvalStatus === 'APPROVED' || approvalStatus === 'DELIVERED' ? 'Aprovado & Publicado' : approvalStatus === 'REJEITADO' ? 'Rejeitado' : 'Pendente de Aprovação'}
            </span>
          </div>
        </div>

        {/* Navegação por Abas */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all ${
              activeTab === 'preview'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>1. Preview & Edições</span>
          </button>

          <button
            onClick={() => setActiveTab('fotos')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all ${
              activeTab === 'fotos'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>2. Fotos ({fotos.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('mediakit')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all ${
              activeTab === 'mediakit'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>3. Media Kit Gerado</span>
          </button>
        </div>

        {/* Conteúdo Aba 1: Preview & Edições */}
        {activeTab === 'preview' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span>Editar Dados do Imóvel</span>
              </h3>
              {feedbackMsg && (
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                  {feedbackMsg}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="md:col-span-2 lg:col-span-4">
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Título do Anúncio</label>
                <input
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Tipo de Imóvel</label>
                <select
                  value={tipoImovel}
                  onChange={(e) => setTipoImovel(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                >
                  <option value="Apartamento">Apartamento</option>
                  <option value="Casa">Casa</option>
                  <option value="Casa em Condomínio">Casa em Condomínio</option>
                  <option value="Sobrado">Sobrado</option>
                  <option value="Terreno">Terreno</option>
                  <option value="Galpão">Galpão / Galpão Comercial</option>
                  <option value="Comercial">Sala / Prédio Comercial</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Finalidade / Negócio</label>
                <select
                  value={finalidade}
                  onChange={(e) => setFinalidade(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                >
                  <option value="Venda">Venda</option>
                  <option value="Locação">Locação</option>
                  <option value="Venda e Locação">Venda e Locação</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Preço de Venda (R$)</label>
                <input
                  type="number"
                  value={precoVenda}
                  onChange={(e) => setPrecoVenda(e.target.value ? Number(e.target.value) : '')}
                  placeholder="Ex: 320000"
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Preço de Locação (R$)</label>
                <input
                  type="number"
                  value={precoLocacao}
                  onChange={(e) => setPrecoLocacao(e.target.value ? Number(e.target.value) : '')}
                  placeholder="Ex: 2200"
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Condomínio (R$)</label>
                <input
                  type="number"
                  value={condominio}
                  onChange={(e) => setCondominio(e.target.value ? Number(e.target.value) : '')}
                  placeholder="Ex: 450"
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">IPTU Mensal/Anual (R$)</label>
                <input
                  type="number"
                  value={iptu}
                  onChange={(e) => setIptu(e.target.value ? Number(e.target.value) : '')}
                  placeholder="Ex: 120"
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Área Útil (m²)</label>
                <input
                  type="number"
                  value={areaUtil}
                  onChange={(e) => setAreaUtil(e.target.value ? Number(e.target.value) : '')}
                  placeholder="Ex: 68"
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Bairro em Taboão da Serra e imediações</label>
                <input
                  type="text"
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                  placeholder="Ex: Parque das Cigarras"
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">🛏️ Quartos</label>
                <input
                  type="number"
                  value={quartos}
                  onChange={(e) => setQuartos(e.target.value ? Number(e.target.value) : '')}
                  placeholder="Ex: 2"
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">🚿 Suítes</label>
                <input
                  type="number"
                  value={suites}
                  onChange={(e) => setSuites(e.target.value ? Number(e.target.value) : '')}
                  placeholder="Ex: 1"
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">🚽 Banheiros Totais</label>
                <input
                  type="number"
                  value={banheiros}
                  onChange={(e) => setBanheiros(e.target.value ? Number(e.target.value) : '')}
                  placeholder="Ex: 2"
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">🚗 Vagas de Garagem</label>
                <input
                  type="number"
                  value={vagas}
                  onChange={(e) => setVagas(e.target.value ? Number(e.target.value) : '')}
                  placeholder="Ex: 1"
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
                />
              </div>

              <div className="md:col-span-2 lg:col-span-4">
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Descrição Comercial</label>
                <textarea
                  rows={6}
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none font-medium text-sm leading-relaxed"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSaveEdits}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-md"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 text-blue-400" />}
                <span>Salvar Edições</span>
              </button>
            </div>
          </div>
        )}

        {/* Conteúdo Aba 2: Fotos */}
        {activeTab === 'fotos' && (
          <PhotoReorder
            initialPhotos={fotos}
            onSaveOrder={handleReorderPhotos}
            isLoading={isSubmitting}
          />
        )}

        {/* Conteúdo Aba 3: Media Kit */}
        {activeTab === 'mediakit' && (
          approvalStatus === 'APPROVED' || approvalStatus === 'DELIVERED' ? (
            <MediaKitDisplay mediaKit={adData.media_kit || mediaKit} referencia={adData.referencia} />
          ) : (
            <div className="bg-white border border-blue-200 rounded-3xl p-8 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-center mx-auto text-blue-600">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-slate-900">🔒 Media Kit & Mídias Bloqueadas para Download</h3>
              <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
                O Media Kit profissional (legendas otimizadas por IA para Instagram e WhatsApp, tags de SEO e arquivos em alta resolução na nuvem) será **liberado instantaneamente** assim que você conferir os dados e clicar em <strong>"Aprovar & Publicar Anúncio"</strong>.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 max-w-md mx-auto text-xs text-blue-800 font-bold">
                💳 O débito de 1 crédito do seu saldo só ocorre no momento da aprovação!
              </div>
              <button
                onClick={handleApprove}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg transition-all"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>Aprovar Anúncio Agora & Liberar Kit</span>
              </button>
            </div>
          )
        )}

        {/* Sticky Actions Footer se pendente */}
        {approvalStatus !== 'APPROVED' && approvalStatus !== 'DELIVERED' && (
          <div className="sticky bottom-4 bg-white/95 backdrop-blur-md border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3 z-30">
            <div className="text-xs text-slate-600 font-medium">
              Ao aprovar, <strong>1 crédito</strong> será debitado do seu saldo e o kit final será publicado em Taboão da Serra e imediações.
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleReject}
                disabled={isSubmitting}
                className="flex-1 sm:flex-none px-5 py-3.5 border border-slate-300 bg-slate-100 hover:bg-red-50 hover:text-red-700 hover:border-red-300 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <span>🗑️ Descartar Imóvel (0 Créditos)</span>
              </button>

              <button
                onClick={handleApprove}
                disabled={isSubmitting}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>Aprovar & Publicar Anúncio</span>
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default function AprovarPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500 font-medium">Carregando tela de aprovação...</div>}>
      <AprovarContent />
    </Suspense>
  );
}
