'use client';

import { useState, useEffect } from 'react';
import { X, Bot, ExternalLink, MessageSquareText } from 'lucide-react';

export default function BannerAutoResponder() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Verifica se o usuário já fechou o banner anteriormente
    const isDismissed = localStorage.getItem('bannerMarketplaceAutoReply_dismissed');
    if (!isDismissed) {
      // Pequeno delay para aparecer após o carregamento
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('bannerMarketplaceAutoReply_dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <>
      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .mar-banner-wrap {
          animation: slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes bot-bounce {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        .mar-bot-icon {
          animation: bot-bounce 2s ease-in-out infinite;
        }
        .mar-glow {
          box-shadow: 0 0 28px 0 rgba(109, 40, 217, 0.35);
        }
        .mar-btn-pulse:hover {
          box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.25);
        }
      `}</style>

      <div className="fixed bottom-0 left-0 right-0 z-[100] p-2 md:p-4 mar-banner-wrap">
        <div className="max-w-5xl mx-auto relative">

          {/* Botão Fechar */}
          <button
            onClick={handleDismiss}
            className="absolute -top-2 -right-2 z-10 flex items-center justify-center w-6 h-6 rounded-full border border-purple-200 bg-white text-purple-700 shadow-md hover:bg-purple-50 transition-colors"
            aria-label="Fechar banner"
          >
            <X size={13} />
          </button>

          {/* Banner principal */}
          <a
            href="https://play.google.com/store/apps/details?id=com.colegacorretor.marketplaceauto"
            target="_blank"
            rel="noopener noreferrer"
            className="mar-glow flex flex-col md:flex-row items-center justify-between rounded-2xl border border-purple-300/40 overflow-hidden hover:scale-[1.015] transition-transform duration-300"
            style={{
              background: 'linear-gradient(135deg, #1E1B4B 0%, #3B0764 40%, #5B21B6 100%)',
            }}
          >
            {/* Faixa decorativa lateral (desktop) */}
            <div
              className="hidden md:block absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
              style={{ background: 'linear-gradient(to bottom, #7C3AED, #3B82F6)' }}
            />

            {/* Lado esquerdo — ícone + textos */}
            <div className="flex items-center gap-3 md:gap-5 px-5 py-4 md:py-5 w-full md:w-auto">
              {/* Ícone robô animado */}
              <div
                className="mar-bot-icon flex-shrink-0 flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-2xl shadow-lg"
                style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}
              >
                <Bot size={28} className="text-white" strokeWidth={1.8} />
              </div>

              {/* Textos */}
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span
                    className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(124,58,237,0.35)', color: '#C4B5FD' }}
                  >
                    Novidade
                  </span>
                </div>
                <h3 className="font-black text-sm md:text-base text-white leading-tight">
                  Marketplace Auto Reply
                </h3>
                <p className="text-[10px] md:text-xs font-medium mt-0.5" style={{ color: '#C4B5FD' }}>
                  Responda leads do Messenger e Facebook Marketplace 24/7 no automático!
                </p>
              </div>
            </div>

            {/* Lado direito — CTA */}
            <div className="flex items-center gap-3 px-5 pb-4 md:py-5 md:pb-5 w-full md:w-auto justify-end md:justify-normal">
              <span className="hidden lg:block text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#A78BFA' }}>
                Saiba mais →
              </span>
              <div
                className="mar-btn-pulse flex items-center gap-2 px-5 py-2.5 rounded-full font-black text-sm text-white transition-all duration-200"
                style={{ background: 'linear-gradient(135deg, #7C3AED, #4F46E5)' }}
              >
                <MessageSquareText size={15} />
                INSTALAR GRÁTIS
                <ExternalLink size={13} />
              </div>
            </div>
          </a>
        </div>
      </div>
    </>
  );
}
