import Link from 'next/link';
import { Building2, ChevronRight } from 'lucide-react';

export default function BannerLocacao() {
    return (
        <Link
            href="#"
            className="group relative block rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700" />
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center opacity-15 group-hover:opacity-20 transition-opacity duration-500" />
            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 px-6 sm:px-8 py-6 sm:py-8 md:py-10">
                <div className="shrink-0 w-14 h-14 sm:w-16 sm:h-16 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    <Building2 size={28} className="text-white sm:w-8 sm:h-8" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-tight leading-tight mb-1">
                        Você sabia que pode comprar um imóvel?
                    </h3>
                    <p className="text-blue-100 text-xs sm:text-sm md:text-base font-medium">
                        Existem muitas oportunidades! Conheça nossos imóveis em construção com condições especiais.
                    </p>
                </div>
                <div className="shrink-0 bg-white text-blue-700 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-bold text-xs sm:text-sm flex items-center gap-2 group-hover:bg-blue-50 group-hover:gap-3 transition-all duration-300 shadow-lg">
                    Ver Oportunidades
                    <ChevronRight size={16} className="sm:w-[18px] sm:h-[18px]" />
                </div>
            </div>
        </Link>
    );
}
