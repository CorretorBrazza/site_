'use client';

import { useState, useEffect } from 'react';
import { X, Zap, Smartphone, ExternalLink } from 'lucide-react';

export default function BannerAutoResponder() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Verifica se o usuário já fechou o banner anteriormente
    const isDismissed = localStorage.getItem('bannerAutoResponder_dismissed');
    if (!isDismissed) {
      // Pequeno delay para aparecer após o carregamento
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('bannerAutoResponder_dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-2 md:p-4 animate-slide-up">
      <div className="max-w-5xl mx-auto relative">
        {/* Botão Fechar */}
        <button 
          onClick={handleDismiss}
          className="absolute -top-2 -right-2 bg-white text-gray-800 rounded-full p-1 shadow-lg hover:bg-gray-100 transition-colors z-10 border border-gray-200"
          aria-label="Fechar banner"
        >
          <X size={16} />
        </button>

        {/* Link principal do Banner */}
        <a 
          href="https://play.google.com/store/apps/details?id=br.com.colegacorretor.brautoresponder.basic"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col md:flex-row items-center justify-between bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 text-white rounded-2xl p-4 md:px-8 md:py-4 shadow-2xl hover:scale-[1.01] transition-transform duration-300 border border-white/20"
        >
          <div className="flex items-center gap-4 mb-3 md:mb-0">
            <div className="bg-yellow-400 p-2 rounded-xl text-blue-900 shadow-inner animate-pulse">
              <Zap size={24} fill="currentColor" />
            </div>
            <div>
              <h3 className="font-black text-sm md:text-lg uppercase tracking-tight leading-tight">
                ⚡ Já perdeu cliente por demora?
              </h3>
              <p className="text-[10px] md:text-xs font-medium text-blue-50 opacity-90">
                BR AutoResponder responde por você 24/7 no WhatsApp e Instagram!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden lg:block text-[10px] font-bold uppercase tracking-widest text-blue-100">O único que funciona!</span>
            <div className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full font-black text-sm shadow-lg flex items-center gap-2 transition-all group">
              <Smartphone size={16} />
              INSTALAR GRÁTIS
              <ExternalLink size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </a>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
}
