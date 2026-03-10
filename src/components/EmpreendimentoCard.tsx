'use client';

import { motion } from 'framer-motion';
import { MapPin, Building2, Calendar } from 'lucide-react';
import Link from 'next/link';

interface EmpreendimentoCardProps {
    slug: string;
    name: string;
    address: string;
    status: string;
    image: string;
    amenities: string[];
    dormitorios: string;
    deliveryDate: string;
}

export default function EmpreendimentoCard({
    slug,
    name,
    address,
    status,
    image,
    amenities,
    dormitorios,
    deliveryDate,
}: EmpreendimentoCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 h-full flex flex-col p-2"
        >
            <Link href={`/empreendimento/${slug}`} className="block relative aspect-[16/11] overflow-hidden rounded-[24px]">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
                    <span className="bg-[#2563EB] text-white text-[12px] font-bold px-4 py-2 rounded-xl shadow-lg flex items-center gap-2">
                        <Building2 size={14} />
                        {status}
                    </span>
                    <span className="bg-[#DC2626] text-white text-[12px] font-bold px-4 py-2 rounded-xl shadow-lg flex items-center gap-2">
                        <Calendar size={14} />
                        Entrega: {deliveryDate}
                    </span>
                </div>
            </Link>

            <div className="p-6 pt-5 flex flex-col flex-grow">
                <div className="mb-4">
                    <h3 className="text-[24px] font-bold text-[#111827] mb-3 group-hover:text-blue-600 transition-colors tracking-tight">
                        {name}
                    </h3>
                    <div className="flex items-start gap-1.5 text-gray-500">
                        <MapPin size={16} className="text-blue-500 shrink-0 mt-0.5" />
                        <span className="text-[14px] leading-snug line-clamp-2">{address}</span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                    {amenities.slice(0, 4).map((amenity) => (
                        <span
                            key={amenity}
                            className="text-[13px] font-medium text-gray-600 bg-gray-100/80 px-4 py-1.5 rounded-xl uppercase tracking-tight"
                        >
                            {amenity}
                        </span>
                    ))}
                    {amenities.length > 4 && (
                        <span className="text-[13px] font-medium text-gray-400 py-1.5 px-2">
                            +{amenities.length - 4}
                        </span>
                    )}
                </div>

                <div className="mb-8">
                    <span className="inline-block border border-gray-200 text-[#111827] px-5 py-2 rounded-2xl text-[14px] font-semibold">
                        {dormitorios}
                    </span>
                </div>

                <Link
                    href={`/empreendimento/${slug}`}
                    className="mt-auto block w-full text-center bg-[#2563EB] hover:bg-blue-700 text-white py-4 rounded-[20px] font-bold text-[16px] transition-all shadow-lg active:scale-[0.98]"
                >
                    Ver Detalhes
                </Link>
            </div>
        </motion.div>
    );
}
