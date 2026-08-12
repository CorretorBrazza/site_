'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
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
  XCircle,
  AlertTriangle,
  Loader2,
  Sparkles,
  Edit3,
  Image as ImageIcon,
  FileText,
  DollarSign,
  Save,
  Check,
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
      setErrorMsg('Token de segurança não fornecido no link. Verifique o link recebido no WhatsApp.');
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
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="text-center space-y-3">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto" />
            <p className="text-sm font-medium text-slate-600">Validando token e carregando anúncio...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <Navbar />
        <main className="flex-1 max-w-xl mx-auto w-full p-6 flex items-center justify-center">
          <div className="bg-white border border-red-200 rounded-3xl p-8 text-center shadow-lg space-y-4">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-900">Acesso Não Autorizado</h2>
            <p className="text-sm text-slate-600">{errorMsg}</p>
            <div className="pt-2">
              <a
                href="/"
                className="inline-flex items-center justify-center px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Voltar à Página Inicial
              </a>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const refinados = adData?.dados_refinados || {};
  const mediaKit = adData?.media_kit || {};

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 space-y-6">

        {/* Banner de Status se Aprovado */}
        {(approvalStatus === 'APPROVED' || approvalStatus === 'DELIVERED') && (
          <div className="bg-emerald-600 text-white rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-200 shrink-0" />
              <div>
                <h3 className="text-lg font-extrabold">Anúncio Aprovado com Sucesso!</h3>
                <p className="text-xs text-emerald-100 mt-0.5">
                  1 crédito foi debitado do seu saldo. O Media Kit pronto foi entregue no seu e-mail e WhatsApp.
                </p>
              </div>
            </div>
            <a
              href={`/imovel?id=${adData.referencia.toLowerCase()}`}
              className="px-4 py-2 bg-white text-emerald-800 rounded-xl text-xs font-extrabold hover:bg-emerald-50 transition-colors shrink-0"
            >
              Ver Imóvel no Site
            </a>
          </div>
        )}

        {/* Header do Anúncio */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-blue-100 text-blue-800 text-xs font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                Ref: {adData.referencia}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Corretor: {adData.corretor_email}
              </span>
            </div>
            <h1 className="text-xl font-extrabold text-slate-900">
              {titulo || 'Anúncio de Imóvel'}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {refinados.endereco?.rua ? `${refinados.endereco.rua}, ` : ''}
              {refinados.endereco?.bairro || 'Taboão da Serra'} - SP
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-extrabold px-3 py-1 rounded-full uppercase ${
                approvalStatus === 'APPROVED' || approvalStatus === 'DELIVERED'
                  ? 'bg-emerald-100 text-emerald-800'
                  : approvalStatus === 'REJEITADO'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {approvalStatus === 'APPROVED' || approvalStatus === 'DELIVERED' ? 'Aprovado & Publicado' : approvalStatus === 'REJEITADO' ? 'Rejeitado' : 'Pendente de Aprovação'}
            </span>
          </div>
        </div>

        {/* Navegação por Abas */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'preview'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>1. Preview & Edições</span>
          </button>

          <button
            onClick={() => setActiveTab('fotos')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'fotos'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>2. Fotos ({fotos.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('mediakit')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'mediakit'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>3. Media Kit Gerado</span>
          </button>
        </div>

        {/* Conteúdo Aba 1: Preview & Edições */}
        {activeTab === 'preview' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span>Editar Dados do Imóvel</span>
              </h3>
              {feedbackMsg && (
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">
                  {feedbackMsg}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="md:col-span-2 lg:col-span-4">
                <label className="block text-xs font-bold text-slate-700 mb-1">Título do Anúncio</label>
                <input
                  type="text"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tipo de Imóvel</label>
                <select
                  value={tipoImovel}
                  onChange={(e) => setTipoImovel(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
                <label className="block text-xs font-bold text-slate-700 mb-1">Finalidade / Negócio</label>
                <select
                  value={finalidade}
                  onChange={(e) => setFinalidade(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="Venda">Venda</option>
                  <option value="Locação">Locação</option>
                  <option value="Venda e Locação">Venda e Locação</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Preço de Venda (R$)</label>
                <input
                  type="number"
                  value={precoVenda}
                  onChange={(e) => setPrecoVenda(e.target.value ? Number(e.target.value) : '')}
                  placeholder="Ex: 320000"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Preço de Locação (R$)</label>
                <input
                  type="number"
                  value={precoLocacao}
                  onChange={(e) => setPrecoLocacao(e.target.value ? Number(e.target.value) : '')}
                  placeholder="Ex: 2200"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Condomínio (R$)</label>
                <input
                  type="number"
                  value={condominio}
                  onChange={(e) => setCondominio(e.target.value ? Number(e.target.value) : '')}
                  placeholder="Ex: 450"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">IPTU Mensal/Anual (R$)</label>
                <input
                  type="number"
                  value={iptu}
                  onChange={(e) => setIptu(e.target.value ? Number(e.target.value) : '')}
                  placeholder="Ex: 120"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Área Útil (m²)</label>
                <input
                  type="number"
                  value={areaUtil}
                  onChange={(e) => setAreaUtil(e.target.value ? Number(e.target.value) : '')}
                  placeholder="Ex: 68"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Bairro</label>
                <input
                  type="text"
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                  placeholder="Ex: Parque das Cigarras"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Características Quantitativas */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">🛏️ Quartos</label>
                <input
                  type="number"
                  value={quartos}
                  onChange={(e) => setQuartos(e.target.value ? Number(e.target.value) : '')}
                  placeholder="Ex: 2"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">🚿 Suítes</label>
                <input
                  type="number"
                  value={suites}
                  onChange={(e) => setSuites(e.target.value ? Number(e.target.value) : '')}
                  placeholder="Ex: 1"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">🚽 Banheiros Totais</label>
                <input
                  type="number"
                  value={banheiros}
                  onChange={(e) => setBanheiros(e.target.value ? Number(e.target.value) : '')}
                  placeholder="Ex: 2"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">🚗 Vagas de Garagem</label>
                <input
                  type="number"
                  value={vagas}
                  onChange={(e) => setVagas(e.target.value ? Number(e.target.value) : '')}
                  placeholder="Ex: 1"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="md:col-span-2 lg:col-span-4">
                <label className="block text-xs font-bold text-slate-700 mb-1">Descrição Comercial</label>
                <textarea
                  rows={6}
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSaveEdits}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
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
          <div className="sticky bottom-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3 z-30">
            <div className="text-xs text-slate-600">
              Ao aprovar, <strong>1 crédito</strong> será debitado do seu saldo e o kit final será entregue.
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleReject}
                disabled={isSubmitting}
                className="flex-1 sm:flex-none px-4 py-2.5 border border-red-200 hover:bg-red-50 text-red-700 rounded-xl text-xs font-bold transition-colors"
              >
                Rejeitar Anúncio
              </button>

              <button
                onClick={handleApprove}
                disabled={isSubmitting}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-extrabold transition-all shadow-md"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>Aprovar & Liberar Anúncio</span>
              </button>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}

export default function AprovarPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Carregando tela de aprovação...</div>}>
      <AprovarContent />
    </Suspense>
  );
}
