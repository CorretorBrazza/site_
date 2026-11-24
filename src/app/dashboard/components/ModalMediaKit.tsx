'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  MessageCircle,
  Instagram,
  FileText,
  Video,
  Tag,
  X,
  RefreshCw,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { fetchBrokerApi } from '@/lib/api';

interface MediaKitData {
  canal_1_portais?: {
    titulo_curto?: string;
    titulo_comercial?: string;
    descricao_enxuta?: string;
    descricao_completa?: string;
    ficha_tecnica?: string;
  };
  canal_2_whatsapp?: string;
  canal_3_meta_ads?: string;
  canal_4_roteiro_canva?: Array<{
    cena?: number;
    falar?: string;
    texto_tela_canva?: string;
  }>;
  canal_5_seo_tags?: string[];
  copy_instagram?: string;
  copy_whatsapp?: string;
  copy_portal?: string;
  descricao_completa?: string;
  mensagem_whatsapp?: string;
  titulo_seo?: string;
}

type ContentStatus = 'PENDING' | 'GENERATING' | 'READY' | 'FAILED' | null | undefined;

interface ModalMediaKitProps {
  isOpen: boolean;
  onClose: () => void;
  adId: string;
  referencia: string;
  mediaKit?: MediaKitData | null;
  contentStatus?: ContentStatus;
  contentError?: string | null;
  onUpdated?: () => void;
}

function hasRealKit(mediaKit: MediaKitData | null | undefined): boolean {
  if (!mediaKit) return false;
  const c1 = mediaKit.canal_1_portais;
  return Boolean(
    c1?.descricao_completa ||
    c1?.titulo_comercial ||
    mediaKit.canal_2_whatsapp ||
    mediaKit.canal_3_meta_ads ||
    (mediaKit.canal_4_roteiro_canva && mediaKit.canal_4_roteiro_canva.length > 0) ||
    (mediaKit.canal_5_seo_tags && mediaKit.canal_5_seo_tags.length > 0)
  );
}

export default function ModalMediaKit({
  isOpen,
  onClose,
  adId,
  referencia,
  mediaKit: initialMediaKit,
  contentStatus: initialStatus,
  contentError: initialError,
  onUpdated,
}: ModalMediaKitProps) {
  const [abaAtiva, setAbaAtiva] = useState<'whatsapp' | 'instagram' | 'canva' | 'portais' | 'seo'>('whatsapp');
  const [copiadoTipo, setCopiadoTipo] = useState<string | null>(null);
  const [mediaKit, setMediaKit] = useState<MediaKitData | null>(initialMediaKit || null);
  const [contentStatus, setContentStatus] = useState<ContentStatus>(initialStatus);
  const [contentError, setContentError] = useState<string | null>(initialError || null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const fetchLatest = useCallback(async (silent = false) => {
    if (!adId) return;
    if (!silent) setLoading(true);
    try {
      const res = await fetchBrokerApi(`/me/anuncios/${encodeURIComponent(adId)}/media-kit`, { method: 'GET' });
      const data = res?.data || res;
      if (data) {
        setMediaKit(data.media_kit || null);
        setContentStatus(data.content_status || (data.media_kit ? 'READY' : null));
        setContentError(data.content_error || null);
      }
    } catch {
      // silencioso no poll; mantém estado atual
    } finally {
      if (!silent) setLoading(false);
    }
  }, [adId]);

  useEffect(() => {
    if (!isOpen) return;
    setMediaKit(initialMediaKit || null);
    setContentStatus(initialStatus);
    setContentError(initialError || null);
    setActionMsg(null);
    fetchLatest(true);
  }, [isOpen, adId, initialMediaKit, initialStatus, initialError, fetchLatest]);

  useEffect(() => {
    if (!isOpen) return;
    if (contentStatus !== 'PENDING' && contentStatus !== 'GENERATING') return;
    const t = setInterval(() => fetchLatest(true), 5000);
    return () => clearInterval(t);
  }, [isOpen, contentStatus, fetchLatest]);

  if (!isOpen) return null;

  const handleCopiar = (texto: string, tipo: string) => {
    if (!texto) return;
    navigator.clipboard.writeText(texto);
    setCopiadoTipo(tipo);
    setTimeout(() => setCopiadoTipo(null), 2500);
  };

  const handleGenerate = async () => {
    if (!adId || generating) return;
    setGenerating(true);
    setActionMsg(null);
    setContentStatus('GENERATING');
    setContentError(null);
    try {
      const res = await fetchBrokerApi(`/me/anuncios/${encodeURIComponent(adId)}/media-kit`, { method: 'POST' });
      const data = res?.data || res;
      if (res?.success === false) {
        throw new Error(res?.error || res?.message || 'Falha ao gerar Media Kit.');
      }
      setMediaKit(data?.media_kit || null);
      setContentStatus(data?.content_status || 'READY');
      setContentError(data?.content_error || null);
      setActionMsg('Media Kit gerado com sucesso pela IA Gemini.');
      onUpdated?.();
    } catch (err: any) {
      // Pode ter sido timeout no cliente enquanto o servidor ainda concluiu.
      try {
        const check = await fetchBrokerApi(`/me/anuncios/${encodeURIComponent(adId)}/media-kit`, { method: 'GET' });
        const d = check?.data || check;
        if (d?.content_status === 'READY' && d?.media_kit) {
          setMediaKit(d.media_kit);
          setContentStatus('READY');
          setContentError(null);
          setActionMsg('Media Kit gerado com sucesso pela IA Gemini.');
          onUpdated?.();
          return;
        }
        if (d?.content_status === 'GENERATING' || d?.content_status === 'PENDING') {
          setContentStatus(d.content_status);
          setActionMsg('A geração continua no servidor. Atualizando automaticamente...');
          return;
        }
        setContentStatus(d?.content_status === 'FAILED' ? 'FAILED' : 'FAILED');
        setContentError(d?.content_error || err?.message || 'Falha ao gerar Media Kit.');
      } catch {
        setContentStatus('FAILED');
        setContentError(err?.message || 'Falha ao gerar Media Kit.');
      }
      setActionMsg(null);
    } finally {
      setGenerating(false);
    }
  };

  const kit = mediaKit;
  const ready = hasRealKit(kit);
  const isPending = contentStatus === 'PENDING' || contentStatus === 'GENERATING' || generating;

  const copyWhatsapp =
    kit?.canal_2_whatsapp ||
    kit?.mensagem_whatsapp ||
    kit?.copy_whatsapp ||
    '';

  const copyInstagram =
    kit?.canal_3_meta_ads ||
    kit?.copy_instagram ||
    '';

  const canal1 = kit?.canal_1_portais;
  const copyPortais =
    canal1?.descricao_completa ||
    kit?.descricao_completa ||
    kit?.copy_portal ||
    canal1?.descricao_enxuta ||
    '';

  const roteiroCanva = kit?.canal_4_roteiro_canva || [];
  const roteiroCanvaTexto = roteiroCanva.length > 0
    ? roteiroCanva
        .map((c: any, i: number) => {
          const numCena = c.cena || c.slide || i + 1;
          const textoTela = c.texto_tela_canva || c.destaque || '';
          const oQueFalar = c.falar && c.falar !== 'undefined'
            ? c.falar
            : (textoTela ? `Destaque do imóvel: ${textoTela}. Agende sua visita!` : 'Venha conhecer este lindo imóvel!');
          return `🎬 CENA ${numCena}:\n• O QUE FALAR: "${oQueFalar}"\n• TEXTO CANVA/TELA: "${textoTela}"\n`;
        })
        .join('\n')
    : '';

  const seoTagsList = kit?.canal_5_seo_tags && kit.canal_5_seo_tags.length > 0 ? kit.canal_5_seo_tags : [];
  const seoTagsTexto = seoTagsList.join(', ');

  const statusBanner = () => {
    if (isPending) {
      return (
        <div className="bg-blue-50 border border-blue-200 text-blue-900 px-4 py-3 text-xs flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span><b>IA Gemini gerando o Media Kit...</b> Isso pode levar alguns instantes. A tela atualiza automaticamente.</span>
        </div>
      );
    }
    if (contentStatus === 'FAILED') {
      return (
        <div className="bg-red-50 border border-red-200 text-red-900 px-4 py-3 text-xs space-y-2">
          <div className="flex items-center gap-2"><AlertTriangle className="w-4 h-4" /><b>Falha na geração do Media Kit pela IA.</b></div>
          {contentError && <div className="text-red-700 break-words">{contentError}</div>}
          <button onClick={handleGenerate} disabled={generating} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-700 text-white font-bold disabled:opacity-50">
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />} Tentar gerar novamente
          </button>
        </div>
      );
    }
    if (actionMsg) {
      return <div className="bg-green-50 border border-green-200 text-green-900 px-4 py-3 text-xs flex items-center gap-2"><Check className="w-4 h-4" />{actionMsg}</div>;
    }
    if (!ready) {
      return (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 text-xs space-y-2">
          <div className="font-bold">Media Kit ainda não foi gerado pela IA Gemini para este imóvel.</div>
          <div>Gere agora para criar os 5 canais: Portais, WhatsApp, Meta Ads, Roteiro Canva e SEO.</div>
          <button onClick={handleGenerate} disabled={generating} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-700 text-white font-bold disabled:opacity-50">
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />} Gerar Media Kit com IA
          </button>
        </div>
      );
    }
    return null;
  };

  const emptyMsg = (canal: string) => isPending
    ? `⏳ Gerando conteúdo do ${canal} com IA Gemini...`
    : `Conteúdo do ${canal} ainda não disponível. Clique em "Gerar/Regenerar Media Kit com IA".`;

  return (
    <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92dvh] flex flex-col shadow-2xl relative border border-line overflow-hidden animate-in fade-in zoom-in duration-200 my-auto">

        <div className="bg-brand-900 text-white p-4 sm:p-6 relative shrink-0">
          <button onClick={onClose} className="absolute top-3 right-3 sm:top-5 sm:right-5 p-2 text-white/60 hover:text-white rounded-full hover:bg-brand-800 transition-all z-10">
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3 pr-10">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-brand-900 to-brand-900 flex items-center justify-center text-white font-bold shadow-lg shrink-0">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-xl font-black tracking-tight">Media Kit do Imóvel {referencia}</h3>
                <span className="bg-brand-800 text-gold-400 border border-brand-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase hidden sm:inline">5 Canais IA</span>
                {contentStatus && (
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${contentStatus === 'READY' ? 'bg-green-600 text-white' : contentStatus === 'FAILED' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'}`}>
                    {contentStatus}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-white/70 mt-0.5 hidden sm:block">Gerado pela IA Gemini. Revise, copie e publique.</p>
            </div>
          </div>

          <div className="flex gap-1.5 sm:gap-2 mt-4 sm:mt-6 pt-2 border-t border-brand-700 text-xs font-bold overflow-x-auto no-scrollbar pb-1">
            {([
              ['whatsapp', 'WhatsApp', MessageCircle, 'bg-success text-white shadow-md'],
              ['instagram', 'Meta Ads', Instagram, 'bg-pink-600 text-white shadow-md'],
              ['canva', 'Roteiro Canva', Video, 'bg-indigo-600 text-white shadow-md'],
              ['portais', 'Portais', FileText, 'bg-sky-600 text-white shadow-md'],
              ['seo', 'Tags SEO', Tag, 'bg-amber-600 text-white shadow-md'],
            ] as const).map(([key, label, Icon, activeCls]) => (
              <button key={key} onClick={() => setAbaAtiva(key)}
                className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${abaAtiva === key ? activeCls : 'bg-brand-800 text-white/70 hover:bg-brand-800'}`}>
                <Icon className="w-3.5 h-3.5" /> {label}
              </button>
            ))}
          </div>
        </div>

        {statusBanner()}

        {copiadoTipo && (
          <div className="bg-success text-white px-4 sm:px-6 py-2.5 text-xs font-bold flex items-center gap-2 shadow-md">
            <Check className="w-4 h-4" /> <span>Copiado! Agora é só colar no {copiadoTipo}.</span>
          </div>
        )}

        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {abaAtiva === 'whatsapp' && (
            <div className="bg-success/10 border border-success/30 rounded-2xl p-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-2">
                <div>
                  <h4 className="font-bold text-success text-sm flex items-center gap-2"><MessageCircle className="w-4 h-4 text-success" /> Canal 2: WhatsApp</h4>
                  <p className="text-[11px] text-success">Texto pronto para encaminhar com negrito nativo.</p>
                </div>
                <button onClick={() => handleCopiar(copyWhatsapp, 'WhatsApp')} disabled={!copyWhatsapp} className="bg-success hover:opacity-90 disabled:opacity-40 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md transition-all w-full sm:w-auto justify-center flex items-center gap-1.5">
                  {copiadoTipo === 'WhatsApp' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} {copiadoTipo === 'WhatsApp' ? 'Copiado!' : 'Copiar'}
                </button>
              </div>
              <div className="bg-white p-4 rounded-xl border border-success/30 text-xs text-ink font-mono whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">{copyWhatsapp || emptyMsg('WhatsApp')}</div>
            </div>
          )}

          {abaAtiva === 'instagram' && (
            <div className="bg-pink-50 border border-pink-200 rounded-2xl p-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-2">
                <div>
                  <h4 className="font-bold text-pink-950 text-sm flex items-center gap-2"><Instagram className="w-4 h-4 text-pink-600" /> Canal 3: Meta Ads (Instagram/Facebook)</h4>
                  <p className="text-[11px] text-pink-700">Legenda com hook e hashtags.</p>
                </div>
                <button onClick={() => handleCopiar(copyInstagram, 'Instagram')} disabled={!copyInstagram} className="bg-pink-600 hover:bg-pink-700 disabled:opacity-40 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md transition-all w-full sm:w-auto justify-center flex items-center gap-1.5">
                  {copiadoTipo === 'Instagram' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} {copiadoTipo === 'Instagram' ? 'Copiado!' : 'Copiar'}
                </button>
              </div>
              <div className="bg-white p-4 rounded-xl border border-pink-100 text-xs text-ink whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">{copyInstagram || emptyMsg('Meta Ads')}</div>
            </div>
          )}

          {abaAtiva === 'canva' && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-2">
                <div>
                  <h4 className="font-bold text-indigo-900 text-sm flex items-center gap-2"><Video className="w-4 h-4 text-indigo-600" /> Canal 4: Roteiro Canva/Reels</h4>
                  <p className="text-[11px] text-indigo-700">O que falar e texto para tela.</p>
                </div>
                <button onClick={() => handleCopiar(roteiroCanvaTexto, 'Roteiro Canva')} disabled={!roteiroCanvaTexto} className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md transition-all w-full sm:w-auto justify-center flex items-center gap-1.5">
                  {copiadoTipo === 'Roteiro Canva' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} {copiadoTipo === 'Roteiro Canva' ? 'Copiado!' : 'Copiar'}
                </button>
              </div>
              <div className="bg-white p-4 rounded-xl border border-indigo-100 text-xs text-ink whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">{roteiroCanvaTexto || emptyMsg('Roteiro Canva')}</div>
            </div>
          )}

          {abaAtiva === 'portais' && (
            <div className="bg-sky-50 border border-sky-200 rounded-2xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <h4 className="font-bold text-sky-900 text-sm flex items-center gap-2"><FileText className="w-4 h-4 text-sky-600" /> Canal 1: Portais & Site</h4>
                  <p className="text-[11px] text-sky-700">Títulos e descrição completa.</p>
                </div>
                <button onClick={() => handleCopiar(copyPortais, 'Descrição')} disabled={!copyPortais} className="bg-sky-600 hover:bg-sky-700 disabled:opacity-40 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md transition-all w-full sm:w-auto justify-center flex items-center gap-1.5">
                  {copiadoTipo === 'Descrição' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} {copiadoTipo === 'Descrição' ? 'Copiado!' : 'Copiar'}
                </button>
              </div>
              {canal1?.titulo_curto && <div className="bg-white p-3 rounded-xl border border-sky-100 text-xs"><span className="font-bold text-sky-800 block mb-1">TÍTULO CURTO (OLX / ML):</span><span className="text-ink font-mono">{canal1.titulo_curto}</span></div>}
              {canal1?.titulo_comercial && <div className="bg-white p-3 rounded-xl border border-sky-100 text-xs"><span className="font-bold text-sky-800 block mb-1">TÍTULO COMERCIAL (ZAP / VivaReal):</span><span className="text-ink font-mono">{canal1.titulo_comercial}</span></div>}
              <div className="bg-white p-4 rounded-xl border border-sky-100 text-xs text-ink whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">{copyPortais || emptyMsg('Portais')}</div>
            </div>
          )}

          {abaAtiva === 'seo' && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-2">
                <div>
                  <h4 className="font-bold text-amber-900 text-sm flex items-center gap-2"><Tag className="w-4 h-4 text-amber-600" /> Canal 5: SEO & Tags</h4>
                  <p className="text-[11px] text-amber-700">Palavras-chave para busca.</p>
                </div>
                <button onClick={() => handleCopiar(seoTagsTexto, 'Tags SEO')} disabled={!seoTagsTexto} className="bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md transition-all w-full sm:w-auto justify-center flex items-center gap-1.5">
                  {copiadoTipo === 'Tags SEO' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />} {copiadoTipo === 'Tags SEO' ? 'Copiado!' : 'Copiar'}
                </button>
              </div>
              <div className="bg-white p-4 rounded-xl border border-amber-100 text-xs text-ink font-mono whitespace-pre-wrap">{seoTagsTexto || emptyMsg('SEO')}</div>
            </div>
          )}
        </div>

        <div className="p-3 sm:p-4 bg-paper border-t border-line flex flex-wrap gap-2 justify-between shrink-0">
          <div className="flex gap-2">
            <button type="button" onClick={() => fetchLatest()} disabled={loading} className="px-4 py-2.5 text-xs font-bold text-ink bg-white hover:bg-paper border border-line rounded-xl transition-all inline-flex items-center gap-1.5 disabled:opacity-50">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Atualizar
            </button>
            <button type="button" onClick={handleGenerate} disabled={generating || isPending} className="px-4 py-2.5 text-xs font-bold text-white bg-brand-900 hover:bg-brand-800 rounded-xl transition-all inline-flex items-center gap-1.5 disabled:opacity-50">
              {generating || isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {ready ? 'Regenerar com IA' : 'Gerar com IA'}
            </button>
          </div>
          <button type="button" onClick={onClose} className="px-5 sm:px-6 py-2.5 text-xs font-bold text-ink bg-white hover:bg-paper border border-line rounded-xl transition-all shadow-xs">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
