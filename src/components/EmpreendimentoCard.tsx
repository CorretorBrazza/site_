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
            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:shadow-black/5 transition-all duration-500 border border-black/5 h-full flex flex-col p-2"
        >
            <Link href={`/empreendimento/${slug}`} className="block relative aspect-[16/11] overflow-hidden rounded-xl">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
                    <span className="bg-primary/90 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5">
                        <Building2 size={13} />
                        {status}
                    </span>
                    <span className="bg-accent text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5">
                        <Calendar size={13} />
                        Entrega: {deliveryDate}
                    </span>
                </div>
            </Link>

            <div className="p-6 pt-5 flex flex-col flex-grow">
                <div className="mb-4">
                    <Link href={`/empreendimento/${slug}`}>
                        <h3 className="text-[20px] font-serif font-semibold text-primary mb-2 group-hover:text-accent transition-colors tracking-tight">
                            {name}
                        </h3>
                    </Link>
                    <div className="flex items-start gap-1.5 text-slate-500">
                        <MapPin size={15} className="text-accent shrink-0 mt-0.5" />
                        <span className="text-[13px] leading-snug line-clamp-2 font-medium">{address}</span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-6">
                    {amenities.slice(0, 3).map((amenity) => (
                        <span
                            key={amenity}
                            className="text-[11px] font-semibold text-slate-600 bg-slate-50 border border-black/5 px-3 py-1 rounded-lg uppercase tracking-wider"
                        >
                            {amenity}
                        </span>
                    ))}
                    {amenities.length > 3 && (
                        <span className="text-[11px] font-semibold text-slate-400 py-1 px-1.5">
                            +{amenities.length - 3}
                        </span>
                    )}
                </div>

                <div className="mb-6">
                    <span className="inline-block border border-black/5 text-primary bg-slate-50/50 px-4 py-1.5 rounded-lg text-[13px] font-semibold">
                        {dormitorios}
                    </span>
                </div>

                <Link
                    href={`/empreendimento/${slug}`}
                    className="mt-auto block w-full text-center bg-accent hover:bg-accent-hover text-white py-3.5 rounded-xl font-semibold text-[15px] transition-all shadow-sm shadow-accent/15 active:scale-[0.98]"
                >
                    Ver Detalhes
                </Link>
            </div>
        </motion.div>
    );
}
