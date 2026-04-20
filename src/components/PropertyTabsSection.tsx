'use client';

import { useState } from 'react';
import { Image, Home, Video, FileText, MapPin } from 'lucide-react';
import ImageCarousel from './ImageCarousel';

interface PropertyTabsSectionProps {
    images: string[];
    plantImages?: string[];
    virtualTourUrl?: string;
    fichaUrl?: string;
    croquiUrl?: string;
    propertyName: string;
}

export default function PropertyTabsSection({
    images,
    plantImages = [],
    virtualTourUrl,
    fichaUrl,
    croquiUrl,
    propertyName
}: PropertyTabsSectionProps) {
    const [activeTab, setActiveTab] = useState('gallery');

    const tabs = [
        { id: 'gallery', label: 'Galeria de Imagens', icon: Image, content: 'gallery' },
        { id: 'plants', label: 'Plantas', icon: Home, content: 'plants', disabled: !plantImages.length },
        { id: 'tour', label: 'Tour Virtual', icon: Video, content: 'tour', disabled: !virtualTourUrl },
        { id: 'tech', label: 'Ficha Técnica', icon: FileText, content: 'tech', disabled: !fichaUrl },
        { id: 'croqui', label: 'Croqui', icon: MapPin, content: 'croqui', disabled: !croquiUrl }
    ];

    return (
        <section className="max-w-7xl mx-auto px-4 py-12">
            {/* Tabs Navigation */}
            <div className="flex flex-wrap gap-2 md:gap-4 mb-8 border-b border-gray-200 pb-4">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => !tab.disabled && setActiveTab(tab.id)}
                            disabled={tab.disabled}
                            className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
                                activeTab === tab.id
                                    ? 'bg-blue-600 text-white shadow-lg'
                                    : tab.disabled
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                            }`}
                        >
                            <Icon size={18} />
                            <span className="hidden sm:inline">{tab.label}</span>
                            <span className="sm:hidden text-sm">{tab.label.split(' ')[0]}</span>
                        </button>
                    );
                })}
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Gallery Tab */}
                {activeTab === 'gallery' && (
                    <div className="p-6 md:p-10">
                        <h2 className="text-2xl font-bold mb-6 text-gray-900">Galeria de Imagens</h2>
                        <div className="rounded-xl overflow-hidden shadow-lg aspect-video md:aspect-[16/9] bg-gray-100">
                            <ImageCarousel images={images} alt={propertyName} />
                        </div>
                        <p className="text-sm text-gray-600 mt-4">
                            Total de {images.length} imagens - Clique nas setas para navegar ou use os pontos abaixo
                        </p>
                    </div>
                )}

                {/* Plants Tab */}
                {activeTab === 'plants' && plantImages.length > 0 && (
                    <div className="p-6 md:p-10">
                        <h2 className="text-2xl font-bold mb-6 text-gray-900">Plantas do Empreendimento</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {plantImages.map((image, index) => (
                                <div key={index} className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                                    <img
                                        src={image}
                                        alt={`Planta ${index + 1}`}
                                        className="w-full h-auto object-cover cursor-pointer hover:scale-105 transition-transform"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tour Virtual Tab */}
                {activeTab === 'tour' && virtualTourUrl && (
                    <div className="p-6 md:p-10">
                        <h2 className="text-2xl font-bold mb-6 text-gray-900">Tour Virtual</h2>
                        <div className="rounded-lg overflow-hidden shadow-lg aspect-video">
                            <iframe
                                src={virtualTourUrl}
                                className="w-full h-full"
                                frameBorder="0"
                                allowFullScreen
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            />
                        </div>
                        <p className="text-sm text-gray-600 mt-4">
                            Explore o empreendimento em 360° - Use o mouse ou dedos para navegar
                        </p>
                    </div>
                )}

                {/* Ficha Técnica Tab */}
                {activeTab === 'tech' && fichaUrl && (
                    <div className="p-6 md:p-10">
                        <h2 className="text-2xl font-bold mb-6 text-gray-900">Ficha Técnica</h2>
                        <div className="rounded-lg overflow-hidden shadow-lg aspect-[4/3] md:aspect-auto">
                            <iframe
                                src={fichaUrl}
                                className="w-full h-96 md:h-[600px]"
                                frameBorder="0"
                                allowFullScreen
                            />
                        </div>
                        <a
                            href={fichaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                        >
                            Abrir em tela cheia
                        </a>
                    </div>
                )}

                {/* Croqui Tab */}
                {activeTab === 'croqui' && croquiUrl && (
                    <div className="p-6 md:p-10">
                        <h2 className="text-2xl font-bold mb-6 text-gray-900">Croqui do Empreendimento</h2>
                        <div className="rounded-lg overflow-hidden shadow-lg">
                            <iframe
                                src={croquiUrl}
                                className="w-full h-96 md:h-[600px]"
                                frameBorder="0"
                                allowFullScreen
                            />
                        </div>
                        <a
                            href={croquiUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                        >
                            Abrir em tela cheia
                        </a>
                    </div>
                )}
            </div>
        </section>
    );
}
