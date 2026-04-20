'use client';

import { MapPin, CheckCircle2 } from 'lucide-react';
import { Empreendimento } from '@/data/empreendimentos';

interface PropertyHeroBannerProps {
    property: Empreendimento;
    logoUrl?: string;
}

export default function PropertyHeroBanner({ property, logoUrl }: PropertyHeroBannerProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Lançamento':
                return 'bg-yellow-500 text-white';
            case 'Em Construção':
                return 'bg-blue-600 text-white';
            case 'Pronto para Morar':
                return 'bg-green-600 text-white';
            default:
                return 'bg-gray-600 text-white';
        }
    };

    return (
        <div className="relative w-full h-96 md:h-[500px] bg-gradient-to-br from-blue-600 to-blue-900 overflow-hidden group">
            {/* Background Video or Image */}
            {property.videoUrl ? (
                <div className="absolute inset-0 w-full h-full">
                    <iframe
                        className="w-full h-full object-cover"
                        src={property.videoUrl.replace('watch?v=', 'embed/') + '?autoplay=0&controls=0'}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                </div>
            ) : (
                <>
                    <img
                        src={property.heroImage}
                        alt={property.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                </>
            )}

            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
                {logoUrl && (
                    <img
                        src={logoUrl}
                        alt={property.name}
                        className="h-20 md:h-28 mb-4 object-contain drop-shadow-lg"
                    />
                )}

                <h1 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg">
                    {property.name}
                </h1>

                {/* Info badges */}
                <div className="flex flex-col md:flex-row gap-3 md:gap-6 justify-center flex-wrap">
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md ${getStatusColor(property.status)}`}>
                        <CheckCircle2 size={18} />
                        <span className="font-semibold">{property.status}</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white backdrop-blur-md">
                        <MapPin size={18} />
                        <span className="font-semibold">{property.address.split('-')[0].trim()}</span>
                    </div>
                </div>
            </div>

            {/* Splash LANÇAMENTO */}
            {property.status === 'Lançamento' && (
                <div className="absolute top-6 right-6 z-20 flex flex-col items-center">
                    <div
                        style={{
                            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                            boxShadow: '0 0 0 4px rgba(245,158,11,0.3), 0 4px 24px rgba(217,119,6,0.5)',
                            animation: 'pulse 1.8s infinite',
                            borderRadius: '50%',
                            width: '88px',
                            height: '88px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transform: 'rotate(12deg)',
                            border: '3px solid rgba(255,255,255,0.5)',
                        }}
                    >
                        <span style={{ fontSize: '18px', lineHeight: 1 }}>🚀</span>
                        <span style={{ fontSize: '9px', fontWeight: 900, color: '#fff', letterSpacing: '0.05em', lineHeight: 1.2, textAlign: 'center', textTransform: 'uppercase' }}>
                            LANÇA<br />MENTO
                        </span>
                    </div>
                </div>
            )}

            {/* Scroll indicator */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 animate-bounce">
                <div className="flex flex-col items-center text-white/80">
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
}
