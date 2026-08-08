'use client';

import { useState } from 'react';
import { X, Check, Zap, Sparkles, ShieldCheck, QrCode, CreditCard } from 'lucide-react';

interface ModalRecargaCreditosProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
}

export default function ModalRecargaCreditos({ isOpen, onClose, userEmail = 'corretor@taboao.com.br' }: ModalRecargaCreditosProps) {
  const [pacoteSelecionado, setPacoteSelecionado] = useState<'start' | 'pro' | 'elite'>('pro');
  const [metodoPagamento, setMetodoPagamento] = useState<'pix' | 'checkout'>('pix');
  const [loading, setLoading] = useState(false);
  const [pixData, setPixData] = useState<{ qr_code: string; qr_code_base64: string; ticket_url: string } | null>(null);
  const [copiado, setCopiado] = useState(false);

  if (!isOpen) return null;

  const handleGerarPagamento = async () => {
    setLoading(true);
    setPixData(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const response = await fetch(`${apiUrl}/api/v1/payments/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          pacote_id: pacoteSelecionado,
          method: metodoPagamento,
        }),
      });

      const json = await response.json();

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
      }
    } catch (err) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden relative">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2 text-blue-200 font-semibold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-yellow-300 fill-yellow-300" />
            Recarga Instantânea de Créditos
          </div>
          <h2 className="text-2xl font-bold">Escolha seu Pacote de Anúncios</h2>
          <p className="text-blue-100 text-sm mt-1">
            Cada crédito permite publicar ou reativar um anúncio por 90 dias com backup completo.
          </p>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {pixData ? (
            /* Tela do QR Code PIX */
            <div className="text-center space-y-4 py-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-200">
                <Check className="w-4 h-4" /> QR Code PIX Gerado com Sucesso!
              </div>

              {pixData.qr_code_base64 && (
                <div className="flex justify-center my-4">
                  <img
                    src={`data:image/jpeg;base64,${pixData.qr_code_base64}`}
                    alt="QR Code Pix Mercado Pago"
                    className="w-48 h-48 rounded-xl border border-gray-200 shadow-md"
                  />
                </div>
              )}

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-left">
                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Código Pix Copia e Cola:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={pixData.qr_code}
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs font-mono text-gray-700 truncate"
                  />
                  <button
                    onClick={handleCopiarPix}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
                  >
                    {copiado ? 'Copiado! ✓' : 'Copiar'}
                  </button>
                </div>
              </div>

              <p className="text-xs text-gray-500">
                Após realizar o pagamento no app do seu banco, seus créditos entram **automaticamente** em até 60 segundos.
              </p>

              <button
                onClick={() => setPixData(null)}
                className="text-xs font-bold text-blue-600 hover:underline mt-2 inline-block"
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
                      ? 'border-blue-600 bg-blue-50/40 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="text-xs font-bold text-gray-500 uppercase">Start</div>
                  <div className="text-xl font-bold text-gray-900 mt-1">1 Crédito</div>
                  <div className="text-2xl font-black text-blue-600 mt-2">R$ 9,99</div>
                  <p className="text-[11px] text-gray-500 mt-2">Ideal para testar 1 anúncio</p>
                </div>

                {/* Pacote PRO (Popular) */}
                <div
                  onClick={() => setPacoteSelecionado('pro')}
                  className={`cursor-pointer p-4 rounded-xl border-2 transition-all relative ${
                    pacoteSelecionado === 'pro'
                      ? 'border-blue-600 bg-blue-50/40 shadow-md ring-2 ring-blue-600/20'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                    Mais Popular
                  </span>
                  <div className="text-xs font-bold text-blue-600 uppercase">Pro</div>
                  <div className="text-xl font-bold text-gray-900 mt-1">5 Créditos</div>
                  <div className="text-2xl font-black text-blue-600 mt-2">R$ 39,90</div>
                  <div className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md inline-block mt-1">
                    R$ 7,98 / crédito
                  </div>
                  <p className="text-[11px] text-gray-500 mt-2">Economize R$ 10,00</p>
                </div>

                {/* Pacote ELITE */}
                <div
                  onClick={() => setPacoteSelecionado('elite')}
                  className={`cursor-pointer p-4 rounded-xl border-2 transition-all relative ${
                    pacoteSelecionado === 'elite'
                      ? 'border-blue-600 bg-blue-50/40 shadow-sm'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                    Melhor Valor
                  </span>
                  <div className="text-xs font-bold text-amber-600 uppercase">Elite</div>
                  <div className="text-xl font-bold text-gray-900 mt-1">10 Créditos</div>
                  <div className="text-2xl font-black text-blue-600 mt-2">R$ 69,90</div>
                  <div className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md inline-block mt-1">
                    R$ 6,99 / crédito
                  </div>
                  <p className="text-[11px] text-gray-500 mt-2">Máximo rendimento</p>
                </div>
              </div>

              {/* Escolha do Método de Pagamento */}
              <div className="pt-2 border-t border-gray-100">
                <label className="text-xs font-bold text-gray-600 uppercase tracking-wider block mb-3">
                  Forma de Pagamento:
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setMetodoPagamento('pix')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border font-bold text-sm transition-all ${
                      metodoPagamento === 'pix'
                        ? 'border-green-600 bg-green-50 text-green-800 shadow-xs'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-green-600" />
                    PIX Instantâneo
                  </button>

                  <button
                    type="button"
                    onClick={() => setMetodoPagamento('checkout')}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border font-bold text-sm transition-all ${
                      metodoPagamento === 'checkout'
                        ? 'border-blue-600 bg-blue-50 text-blue-800 shadow-xs'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    Cartão Mercado Pago
                  </button>
                </div>
              </div>

              {/* Botão de Ação */}
              <button
                onClick={handleGerarPagamento}
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-base"
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

              <div className="flex items-center justify-center gap-2 text-xs text-gray-500 pt-2">
                <ShieldCheck className="w-4 h-4 text-green-600" />
                Pagamento seguro processado oficialmente pelo Mercado Pago
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
