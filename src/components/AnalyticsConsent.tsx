'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const GTM_ID = 'GTM-M3S6MFXN';
const GA_ID = 'G-PYS517T5RR';
const ADSENSE_CLIENT = 'ca-pub-2483076017143821';

function loadAnalytics() {
  if (typeof window === 'undefined' || document.querySelector('[data-analytics-loaded="true"]')) return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'analytics_consent_granted',
    analytics_storage: 'granted',
    ad_storage: 'granted',
  });

  const gtmScript = document.createElement('script');
  gtmScript.async = true;
  gtmScript.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
  gtmScript.dataset.analyticsLoaded = 'true';
  document.head.appendChild(gtmScript);

  const gaScript = document.createElement('script');
  gaScript.async = true;
  gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(gaScript);

  window.gtag = window.gtag || function gtag(...args: unknown[]) {
    window.dataLayer?.push(args);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID, { anonymize_ip: true });

  const adsScript = document.createElement('script');
  adsScript.async = true;
  adsScript.crossOrigin = 'anonymous';
  adsScript.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
  document.head.appendChild(adsScript);
}

export default function AnalyticsConsent() {
  const [choice, setChoice] = useState<'unknown' | 'accepted' | 'rejected'>('unknown');

  useEffect(() => {
    const saved = window.localStorage.getItem('analytics_consent');
    if (saved === 'accepted') {
      setChoice('accepted');
      loadAnalytics();
    } else if (saved === 'rejected') {
      setChoice('rejected');
    }
  }, []);

  const decide = (value: 'accepted' | 'rejected') => {
    window.localStorage.setItem('analytics_consent', value);
    setChoice(value);
    if (value === 'accepted') loadAnalytics();
  };

  if (choice !== 'unknown') return null;

  return (
    <aside
      role="dialog"
      aria-label="Preferências de privacidade"
      className="fixed inset-x-3 bottom-3 z-[90] mx-auto max-w-3xl rounded-2xl border border-slate-700 bg-slate-950/95 p-4 text-slate-100 shadow-2xl backdrop-blur-md sm:inset-x-6 sm:p-5"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-slate-300 sm:max-w-xl">
          Usamos cookies e tecnologias semelhantes para medir audiência, melhorar o portal e avaliar campanhas. Você pode aceitar ou recusar a medição não essencial. Consulte a{' '}
          <Link href="/politica-de-privacidade" className="font-bold text-amber-400 underline hover:text-amber-300">
            Política de Privacidade
          </Link>.
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => decide('rejected')}
            className="rounded-xl border border-slate-700 px-3 py-2 text-xs font-bold text-slate-300 transition hover:border-slate-500 hover:text-white"
          >
            Recusar
          </button>
          <button
            type="button"
            onClick={() => decide('accepted')}
            className="rounded-xl bg-amber-500 px-3 py-2 text-xs font-black text-slate-950 transition hover:bg-amber-400"
          >
            Aceitar medição
          </button>
        </div>
      </div>
    </aside>
  );
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}
