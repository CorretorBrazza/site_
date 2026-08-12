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
      setFinalidade(refinados.finalidade || (refinados.precoLocacao ? 'Locação' : 'Venda'));
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
      setFeedbackMsg('Edições salvas com sucesso!');
      setTimeout(() => setFeedbackMsg(null), 3000);
    } else {
      alert(`Erro ao salvar edições: ${result.error}`);
    }
  };

  // Ação: Reordenar Fotos
  const handleReorderPhotos = async (newPhotos: PhotoItem[]) => {
    if (!adData) return;
    setFotos(newPhotos);

    const novaOrdem = newPhotos.map((p) => p.ordem);
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
      setApprovalStatus('APPROVED');
      setFeedbackMsg('Anúncio Aprovado com sucesso!');
    } else {
      alert(`Erro ao aprovar anúncio: ${result.error}`);
    }
  };

  // Ação: Rejeitar
  const handleReject = async () => {
    if (!adData) return;
    const motivo = prompt('Por favor, informe o motivo da rejeição (opcional):');
    if (motivo === null) return;

    setIsSubmitting(true);

    const result = await rejectAd(token, adData.ad_id, motivo);
    setIsSubmitting(false);

    if (result.success) {
      setApprovalStatus('REJEITADO');
    } else {
      alert(`Erro ao rejeitar anúncio: ${result.error}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b132b] text-slate-100 flex flex-col justify-center items-center p-6">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-amber-500 animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-300">Validando token e gerando prévia em Taboão da Serra e imediações...</p>
        </div>
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen bg-[#0b132b] text-slate-100 flex items-center justify-center p-6">
        <div className="bg-slate-900 border border-red-500/40 rounded-3xl p-8 text-center shadow-2xl space-y-4 max-w-md">
          <div className="w-14 h-14 bg-red-950/80 rounded-2xl flex items-center justify-center mx-auto text-red-400 border border-red-800">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-white">Acesso Não Autorizado</h2>
          <p className="text-xs text-slate-300 leading-relaxed">{errorMsg}</p>
          <div className="pt-2">
            <a
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-amber-500 text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider shadow-md"
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
    <div className="min-h-screen bg-[#0b132b] text-slate-100 py-8 px-4">
      <main className="max-w-5xl mx-auto space-y-6">

        {/* Banner de Status se Aprovado */}
        {(approvalStatus === 'APPROVED' || approvalStatus === 'DELIVERED') && (
          <div className="bg-gradient-to-r from-emerald-900 via-emerald-950 to-slate-950 border border-emerald-500/40 text-white rounded-3xl p-6 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 shrink-0" />
              <div>
                <h3 className="text-lg font-black text-white">Anúncio Aprovado com Sucesso!</h3>
                <p className="text-xs text-emerald-200 mt-0.5">
                  1 crédito debitado do seu saldo. O Media Kit pronto foi entregue no seu e-mail.
                </p>
              </div>
            </div>
            <a
              href={`/imovel/${adData.referencia.toLowerCase()}`}
              className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider transition-colors shrink-0 shadow-md"
            >
              Ver Imóvel no Site
            </a>
          </div>
        )}

        {/* Header do Anúncio em Estilo Dark Luxury */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-black px-3 py-1 rounded-xl uppercase">
                REF: {adData.referencia}
              </span>
              <span className="text-xs text-slate-400 font-semibold">
                Corretor: {adData.corretor_email}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {titulo || 'Anúncio de Imóvel'}
            </h1>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>{refinados.endereco?.bairro || 'Taboão da Serra'}, Taboão da Serra e imediações - SP</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider ${
                approvalStatus === 'APPROVED' || approvalStatus === 'DELIVERED'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : approvalStatus === 'REJEITADO'
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}
            >
              {approvalStatus === 'APPROVED' || approvalStatus === 'DELIVERED' ? 'Aprovado & Publicado' : approvalStatus === 'REJEITADO' ? 'Rejeitado' : 'Pendente de Aprovação'}
            </span>
          </div>
        </div>

        {/* Navegação por Abas */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all ${
              activeTab === 'preview'
                ? 'bg-amber-500 text-slate-950 shadow-lg'
                : 'bg-slate-900 text-slate-300 border border-slate-800 hover:text-white'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>1. Preview & Edições</span>
          </button>

          <button
            onClick={() => setActiveTab('fotos')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all ${
              activeTab === 'fotos'
                ? 'bg-amber-500 text-slate-950 shadow-lg'
                : 'bg-slate-900 text-slate-300 border border-slate-800 hover:text-white'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>2. Fotos ({fotos.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('mediakit')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all ${
              activeTab === 'mediakit'
                ? 'bg-amber-500 text-slate-950 shadow-lg'
                : 'bg-slate-900 text-slate-300 border border-slate-800 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>3. Media Kit Gerado</span>
          </button>
        </div>

        {/* Conteúdo Aba 1: Preview & Edições */}
        {activeTab === 'preview' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-500" />
                <span>Editar Dados do Imóvel</span>
              </h3>
              {feedbackMsg && (
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-xl border border-emerald-800">
                  {feedbackMsg}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="md:col-span-2 lg:col-span-4">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Título do Anúncio</label>
                <input
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tipo de Imóvel</label>
                <select
                  value={tipoImovel}
                  onChange={(e) => setTipoImovel(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
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
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Finalidade / Negócio</label>
                <select
                  value={finalidade}
                  onChange={(e) => setFinalidade(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Venda">Venda</option>
                  <option value="Locação">Locação</option>
                  <option value="Venda e Locação">Venda e Locação</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Preço de Venda (R$)</label>
                <input
                  type="number"
                  value={precoVenda}
                  onChange={(e) => setPrecoVenda(e.target.value ? Number(e.target.value) : '')}
                  placeholder="Ex: 320000"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Preço de Locação (R$)</label>
                <input
                  type="number"
                  value={precoLocacao}
                  onChange={(e) => setPrecoLocacao(e.target.value ? Number(e.target.value) : '')}
                  placeholder="Ex: 2200"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Condomínio (R$)</label>
                <input
                  type="number"
                  value={condominio}
                  onChange={(e) => setCondominio(e.target.value ? Number(e.target.value) : '')}
                  placeholder="Ex: 450"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">IPTU Mensal/Anual (R$)</label>
                <input
                  type="number"
                  value={iptu}
                  onChange={(e) => setIptu(e.target.value ? Number(e.target.value) : '')}
                  placeholder="Ex: 120"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Área Útil (m²)</label>
                <input
                  type="number"
                  value={areaUtil}
                  onChange={(e) => setAreaUtil(e.target.value ? Number(e.target.value) : '')}
                  placeholder="Ex: 68"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Bairro em Taboão da Serra e imediações</label>
                <input
                  type="text"
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                  placeholder="Ex: Parque das Cigarras"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">🛏️ Quartos</label>
                <input
                  type="number"
                  value={quartos}
                  onChange={(e) => setQuartos(e.target.value ? Number(e.target.value) : '')}
                  placeholder="Ex: 2"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">🚿 Suítes</label>
                <input
                  type="number"
                  value={suites}
                  onChange={(e) => setSuites(e.target.value ? Number(e.target.value) : '')}
                  placeholder="Ex: 1"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">🚽 Banheiros Totais</label>
                <input
                  type="number"
                  value={banheiros}
                  onChange={(e) => setBanheiros(e.target.value ? Number(e.target.value) : '')}
                  placeholder="Ex: 2"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">🚗 Vagas de Garagem</label>
                <input
                  type="number"
                  value={vagas}
                  onChange={(e) => setVagas(e.target.value ? Number(e.target.value) : '')}
                  placeholder="Ex: 1"
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="md:col-span-2 lg:col-span-4">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Descrição Comercial</label>
                <textarea
                  rows={6}
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSaveEdits}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all shadow-md"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 text-amber-500" />}
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
          <MediaKitDisplay mediaKit={mediaKit} referencia={adData.referencia} />
        )}

        {/* Sticky Actions Footer se pendente */}
        {approvalStatus !== 'APPROVED' && approvalStatus !== 'DELIVERED' && (
          <div className="sticky bottom-4 bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3 z-30">
            <div className="text-xs text-slate-300">
              Ao aprovar, <strong>1 crédito</strong> será debitado do seu saldo e o kit final será publicado em Taboão da Serra e imediações.
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleReject}
                disabled={isSubmitting}
                className="flex-1 sm:flex-none px-5 py-3 border border-red-500/40 bg-red-950/40 hover:bg-red-950 text-red-300 rounded-xl text-xs font-bold transition-colors"
              >
                Rejeitar Anúncio
              </button>

              <button
                onClick={handleApprove}
                disabled={isSubmitting}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-slate-950 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-xl"
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
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Carregando tela de aprovação...</div>}>
      <AprovarContent />
    </Suspense>
  );
}
