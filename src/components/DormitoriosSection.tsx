'use client';

import { Bed, Ruler } from 'lucide-react';

interface DormitorioOption {
    dormitorios: string;
    area: string;
    vagas: string;
}

interface DormitoriosSectionProps {
    options: DormitorioOption[];
}

export default function DormitoriosSection({ options }: DormitoriosSectionProps) {
    return (
        <section className="max-w-7xl mx-auto px-4 py-12 bg-gradient-to-b from-transparent to-blue-50 -mx-4 px-4">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
                    Opções de Dormitórios
                </h2>
                <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
                    Escolha entre as melhores opções de plantas que se adaptam ao seu estilo de vida
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {options.map((option, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all hover:scale-105"
                        >
                            {/* Icon */}
                            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                                <Bed className="text-blue-600 group-hover:text-white transition-colors" size={32} />
                            </div>

                            {/* Dormitórios */}
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                {option.dormitorios}
                            </h3>

                            {/* Details */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-gray-700">
                                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                        <Ruler size={20} className="text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Área</p>
                                        <p className="font-semibold">{option.area}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 text-gray-700">
                                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                        🚗
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Vagas de Garagem</p>
                                        <p className="font-semibold">{option.vagas}</p>
                                    </div>
                                </div>
                            </div>

                            {/* CTA Button */}
                            <button className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors">
                                Solicitar Informações
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
