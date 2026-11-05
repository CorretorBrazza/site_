import { useState, useEffect } from 'react';
import { X, Check, Zap, Sparkles, ShieldCheck, QrCode, CreditCard } from 'lucide-react';
import { fetchBrokerApi } from '@/lib/api';

interface ModalRecargaCreditosProps {
  isOpen: boolean;
  onClose: () => void;
  pacoteInicial?: 'start' | 'pro' | 'elite';
}

export default function ModalRecargaCreditos({ isOpen, onClose, pacoteInicial = 'pro' }: ModalRecargaCreditosProps) {
  const [pacoteSelecionado, setPacoteSelecionado] = useState<'start' | 'pro' | 'elite'>(pacoteInicial);
  const [metodoPagamento, setMetodoPagamento] = useState<'pix' | 'checkout'>('pix');
  const [loading, setLoading] = useState(false);
  const [pixData, setPixData] = useState<{ qr_code: string; qr_code_base64: string; ticket_url: string } | null>(null);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    if (pacoteInicial && (pacoteInicial === 'start' || pacoteInicial === 'pro' || pacoteInicial === 'elite')) {
      setPacoteSelecionado(pacoteInicial);
    }
  }, [pacoteInicial]);

  if (!isOpen) return null;

  const handleGerarPagamento = async () => {
    setLoading(true);
    setPixData(null);

    try {
      const json = await fetchBrokerApi('/payments/checkout', {
        method: 'POST',
        body: JSON.stringify({
          pacote_id: pacoteSelecionado,
          method: metodoPagamento,
        }),
      });

      if (!json.success) {
        alert(json.message || 'Erro ao gerar checkout. Tente novamente.');
        return;
      }

      if (metodoPagamento === 'pix' && json.data?.qr_code) {
        setPixData({
          qr_code: json.data.qr_code,
          qr_code_base64: json.data.qr_code_base64,
          ticket_url: json.data.ticket_url,
        });
      } else if (json.data?.init_point) {
        // Redireciona pro Mercado Pago Checkout Pro
        window.location.href = json.data.init_point;
      } else {
        alert('Não foi possível gerar o pagamento. Tente outro método.');
      }
    } catch {
      alert('Falha ao conectar com a API de pagamentos.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopiarPix = () => {
    if (pixData?.qr_code) {
      navigator.clipboard.writeText(pixData.qr_code);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-line overflow-hidden relative flex flex-col max-h-[92dvh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-900 to-brand-800 p-4 sm:p-6 text-white relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2 text-gold-400 font-semibold text-xs uppercase tracking-wider mb-1 pr-10">
            <Sparkles className="w-4 h-4 text-gold fill-gold" />
            Recarga Instantânea de Créditos
          </div>
          <h2 className="text-xl sm:text-2xl font-bold pr-10">Escolha seu Pacote de Anúncios</h2>
          <p className="text-gold-400 text-xs sm:text-sm mt-1">
            Cada crédito permite publicar ou reativar um anúncio por 90 dias com backup completo.
          </p>
        </div>

        <div className="p-4 sm:p-6 space-y-6 max-h-[80dvh] overflow-y-auto flex-1 min-h-0">
          {pixData ? (
            /* Tela do QR Code PIX */
            <div className="text-center space-y-4 py-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-success/10 text-success text-xs font-bold rounded-full border border-success/30">
                <Check className="w-4 h-4" /> QR Code PIX Gerado com Sucesso!
              </div>

              {pixData.qr_code_base64 && (
                <div className="flex justify-center my-4">
                  <img
                    src={`data:image/jpeg;base64,${pixData.qr_code_base64}`}
                    alt="QR Code Pix Mercado Pago"
                    className="w-48 h-48 rounded-xl border border-line shadow-md"
                  />
                </div>
              )}

              <div className="bg-paper p-4 rounded-xl border border-line text-left">
                <label className="text-xs font-bold text-muted uppercase block mb-1">Código Pix Copia e Cola:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={pixData.qr_code}
                    className="w-full bg-white border border-line rounded-lg px-3 py-2 text-xs font-mono text-ink truncate"
                  />
                  <button
                    onClick={handleCopiarPix}
                    className="bg-brand-900 hover:bg-brand-800 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
                  >
                    {copiado ? 'Copiado! ✓' : 'Copiar'}
                  </button>
                </div>
              </div>

              <p className="text-xs text-muted">
                Após realizar o pagamento no app do seu banco, seus créditos entram **automaticamente** em até 60 segundos.
              </p>

              <button
                onClick={() => setPixData(null)}
                className="text-xs font-bold text-brand-800 hover:underline mt-2 inline-block"
              >
                ← Escolher outro pacote
              </button>
            </div>
          ) : (
            /* Seleção dos 3 Pacotes */
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Pacote START */}
                <div
                  onClick={() => setPacoteSelecionado('start')}
                  className={`cursor-pointer p-4 rounded-xl border-2 transition-all relative ${
                    pacoteSelecionado === 'start'
                      ? 'border-brand-700 bg-brand-900/5/40 shadow-sm'
                      : 'border-line hover:border-line bg-white'
                  }`}
                >
                  <div className="text-xs font-bold text-muted uppercase">Start</div>
                  <div className="text-xl font-bold text-brand-900 mt-1">1 Crédito</div>
                  <div className="text-2xl font-black text-brand-800 mt-2">R$ 12,90</div>
                  <p className="text-[11px] text-muted mt-2">R$ 12,90 / crédito</p>
                </div>

                {/* Pacote PRO (Popular) */}
                <div
                  onClick={() => setPacoteSelecionado('pro')}
                  className={`cursor-pointer p-4 rounded-xl border-2 transition-all relative ${
                    pacoteSelecionado === 'pro'
                      ? 'border-brand-700 bg-brand-900/5/40 shadow-md ring-2 ring-brand-700/20'
                      : 'border-line hover:border-line bg-white'
                  }`}
                >
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-900 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                    Mais Popular
                  </span>
                  <div className="text-xs font-bold text-brand-800 uppercase">Pro</div>
                  <div className="text-xl font-bold text-brand-900 mt-1">3 Créditos</div>
                  <div className="text-2xl font-black text-brand-800 mt-2">R$ 33,90</div>
                  <div className="text-[10px] font-bold text-success bg-success/10 px-2 py-0.5 rounded-md inline-block mt-1">
                    12% OFF • R$ 11,30 / crédito
                  </div>
                  <p className="text-[11px] text-muted mt-2">Economize R$ 4,80</p>
                </div>

                {/* Pacote ELITE (Melhor Custo-Benefício) */}
                <div
                  onClick={() => setPacoteSelecionado('elite')}
                  className={`cursor-pointer p-4 rounded-xl border-2 transition-all relative ${
                    pacoteSelecionado === 'elite'
                      ? 'border-brand-700 bg-brand-900/5/40 shadow-sm'
                      : 'border-line hover:border-line bg-white'
                  }`}
                >
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                    Melhor Custo-Benefício
                  </span>
                  <div className="text-xs font-bold text-gold uppercase">Elite</div>
                  <div className="text-xl font-bold text-brand-900 mt-1">10 Créditos</div>
                  <div className="text-2xl font-black text-brand-800 mt-2">R$ 89,90</div>
                  <div className="text-[10px] font-bold text-success bg-success/10 px-2 py-0.5 rounded-md inline-block mt-1">
                    30% OFF • R$ 8,99 / crédito
                  </div>
                  <p className="text-[11px] text-muted mt-2">Economize R$ 39,10</p>
                </div>
              </div>

              {/* Escolha do Método de Pagamento */}
              <div className="pt-2 border-t border-line">
                <label className="text-xs font-bold text-ink uppercase tracking-wider block mb-3">
                  Forma de Pagamento:
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setMetodoPagamento('pix')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border font-bold text-sm transition-all ${
                      metodoPagamento === 'pix'
                        ? 'border-success/50 bg-success/10 text-success shadow-xs'
                        : 'border-line text-ink hover:bg-paper'
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-success" />
                    PIX Instantâneo
                  </button>

                  <button
                    type="button"
                    onClick={() => setMetodoPagamento('checkout')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border font-bold text-sm transition-all ${
                      metodoPagamento === 'checkout'
                        ? 'border-brand-700 bg-brand-900/5 text-brand-800 shadow-xs'
                        : 'border-line text-ink hover:bg-paper'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-brand-800" />
                    Cartão Mercado Pago
                  </button>
                </div>
              </div>

              {/* Botão de Ação */}
              <button
                onClick={handleGerarPagamento}
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-brand-900 to-brand-900 hover:from-brand-800 hover:to-brand-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-base"
              >
                {loading ? (
                  <span>Gerando Pagamento Mercado Pago...</span>
                ) : (
                  <>
                    <Zap className="w-5 h-5 fill-white" />
                    Confirmar e Pagar Agora
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-muted pt-2">
                <ShieldCheck className="w-4 h-4 text-success" />
                Pagamento seguro processado oficialmente pelo Mercado Pago
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
