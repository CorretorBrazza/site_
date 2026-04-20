'use client';

import {
    Waves,
    Car,
    PawPrint,
    Dumbbell,
    UtensilsCrossed,
    Monitor,
    Bike,
    Play,
    Film,
    Flame,
    Zap,
    Gamepad2,
    Pizza,
    Baby,
    Sparkles,
    Music,
    Droplets,
    ShowerHead,
    BarChart3,
    Tv,
    Wind
} from 'lucide-react';

interface AmenitiesGridProps {
    amenities: string[];
}

const amenityIcons: Record<string, React.ReactNode> = {
    'Piscina': <Waves size={24} />,
    'Garagem': <Car size={24} />,
    'Pet Place': <PawPrint size={24} />,
    'Academia': <Dumbbell size={24} />,
    'Salão de Festas': <UtensilsCrossed size={24} />,
    'Home Office': <Monitor size={24} />,
    'Bicicletário': <Bike size={24} />,
    'Playground': <Play size={24} />,
    'Cinema': <Film size={24} />,
    'Churrasqueira': <Flame size={24} />,
    'Fitness Externo': <Zap size={24} />,
    'Sala de Jogos': <Gamepad2 size={24} />,
    'Pizza Lounge': <Pizza size={24} />,
    'Brinquedoteca': <Baby size={24} />,
    'Car Wash': <Sparkles size={24} />,
    'Ferramentaria': <BarChart3 size={24} />,
    'Pub': <Wine size={24} />,
    'Sala de Massagem': <ShowerHead size={24} />,
    'Zen Spa': <Wind size={24} />,
    'Garage Band': <Music size={24} />,
    'Salão de Beleza': <Tv size={24} />,
    'Coworking': <Monitor size={24} />,
    'Piscina Sky': <Waves size={24} />,
    'Piscina Climatizada': <Waves size={24} />,
    'Lazer Completo': <Zap size={24} />,
    'Quadra': <Play size={24} />,
    'Espaço Fitness': <Dumbbell size={24} />,
    'Mini Quadra': <Play size={24} />,
    'Rooftop': <Wind size={24} />,
    'Espaço Gourmet': <UtensilsCrossed size={24} />,
    'Deck Solar': <Zap size={24} />,
    'Portaria 24h': <Monitor size={24} />,
    'Pet Care': <PawPrint size={24} />,
    'Redário': <Play size={24} />,
};

function Wine({ size = 24 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 4h12v5c0 1.1-.9 2-2 2v3h6v2h-6v3c0 1.1-.9 2-2 2h-8c-1.1 0-2-.9-2-2v-3H2v-2h6v-3c-1.1 0-2-.9-2-2V4z" />
        </svg>
    );
}

export default function AmenitiesGrid({ amenities }: AmenitiesGridProps) {
    return (
        <section className="max-w-7xl mx-auto px-4 py-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
                Recursos e Lazer
            </h2>
            <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
                Mais de {amenities.length} opções de amenidades para você aproveitar ao máximo sua qualidade de vida
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {amenities.map((amenity, index) => (
                    <div
                        key={index}
                        className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-xl hover:scale-105 transition-all flex flex-col items-center text-center hover:bg-blue-50 cursor-pointer"
                    >
                        <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-all">
                            <span className="text-blue-600 group-hover:text-white">
                                {amenityIcons[amenity] || <Zap size={24} />}
                            </span>
                        </div>
                        <p className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">
                            {amenity}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
