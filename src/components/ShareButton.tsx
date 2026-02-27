'use client';

import { useState } from 'react';
import { Share2, Check, Copy } from 'lucide-react';

export default function ShareButton() {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        const url = window.location.href;

        try {
            if (navigator.share) {
                await navigator.share({
                    title: document.title,
                    url: url,
                });
            } else {
                await navigator.clipboard.writeText(url);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }
        } catch (err) {
            console.error('Erro ao compartilhar:', err);
            // Fallback para copiar link
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
            title="Compartilhar Imóvel"
        >
            {copied ? (
                <>
                    <Check size={18} className="text-green-600" />
                    <span className="text-green-600">Link Copiado!</span>
                </>
            ) : (
                <>
                    <Share2 size={18} className="text-blue-600" />
                    <span>Compartilhar</span>
                </>
            )}
        </button>
    );
}
