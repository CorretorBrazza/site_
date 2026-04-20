import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { empreendimentos } from '@/data/empreendimentos';
import { MapPin, Calendar, CheckCircle2, Ruler, BedDouble, Car, PlayCircle, MessageCircle, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import PropertyHeroBanner from '@/components/PropertyHeroBanner';
import PropertyTabsSection from '@/components/PropertyTabsSection';
import AmenitiesGrid from '@/components/AmenitiesGrid';
import DormitoriosSection from '@/components/DormitoriosSection';
import BuildingProgressSection from '@/components/BuildingProgressSection';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const emp = empreendimentos.find((e) => e.slug === slug);

    if (!emp) {
        return {
            title: 'Empreendimento não encontrado | Imóveis Taboão',
        };
    }

    return {
        title: `imoveistaboão, ${emp.name}`,
        description: emp.description.substring(0, 160) + '...',
        openGraph: {
            title: `imoveistaboão, ${emp.name}`,
            description: emp.description.substring(0, 160) + '...',
            images: [emp.heroImage],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: `imoveistaboão, ${emp.name}`,
            description: emp.description.substring(0, 160) + '...',
            images: [emp.heroImage],
        },
    };
}

export default async function EmpreendimentoPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const emp = empreendimentos.find((e) => e.slug === slug);

    if (!emp) {
        notFound();
    }

    const whatsappMessage = `Olá! Tenho interesse no empreendimento ${emp.name}. Poderia me enviar mais informações?`;
    const whatsappUrl = `https://wa.me/5511970988512?text=${encodeURIComponent(whatsappMessage)}`;

    return (
        <div className="min-h-screen bg-[#F9FAFB]">
            {/* Navigation */}
            <div className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center">
                    <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-semibold py-2">
                        <ChevronLeft size={20} />
                        Voltar para o início
                    </Link>
                </div>
            </div>

            {/* Hero Banner */}
            <PropertyHeroBanner property={emp} logoUrl={emp.logoUrl} />

            {/* Quick Info Section */}
            <section className="max-w-7xl mx-auto px-4 -mt-12 relative z-10 mb-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-all">
                        <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-2">Dormitórios</span>
                        <div className="flex items-center gap-3">
                            <BedDouble className="text-blue-600" size={20} />
                            <span className="text-lg font-black text-gray-900">{emp.dormitorios}</span>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-all">
                        <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-2">Entrega</span>
                        <div className="flex items-center gap-3">
                            <Calendar className="text-red-600" size={20} />
                            <span className="text-lg font-black text-gray-900">{emp.deliveryDate}</span>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-all">
                        <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-2">Área</span>
                        <div className="flex items-center gap-3">
                            <Ruler className="text-blue-600" size={20} />
                            <span className="text-lg font-black text-gray-900">{emp.area}</span>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-all">
                        <span className="text-gray-400 text-xs font-bold uppercase tracking-wider block mb-2">Vagas</span>
                        <div className="flex items-center gap-3">
                            <Car className="text-blue-600" size={20} />
                            <span className="text-lg font-black text-gray-900">{emp.vagas}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-12">
                        {/* Tabs Section */}
                        <PropertyTabsSection
                            images={emp.images}
                            plantImages={emp.plantImages}
                            virtualTourUrl={emp.virtualTourUrl}
                            fichaUrl={emp.fichaUrl}
                            croquiUrl={emp.croquiUrl}
                            propertyName={emp.name}
                        />

                        {/* Description */}
                        <div className="bg-white p-8 md:p-12 rounded-2xl border border-gray-100 shadow-sm">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Sobre o Projeto</h2>
                            <p className="text-lg text-gray-700 leading-relaxed">{emp.description}</p>
                        </div>

                        {/* Amenities Grid */}
                        <AmenitiesGrid amenities={emp.amenities} />

                        {/* Dormitorios Section */}
                        {emp.dormitorioOptions && emp.dormitorioOptions.length > 0 && (
                            <DormitoriosSection options={emp.dormitorioOptions} />
                        )}

                        {/* Building Progress */}
                        {emp.progressPercentage !== undefined && (
                            <BuildingProgressSection
                                progressPercentage={emp.progressPercentage}
                                lastUpdateDate={emp.lastUpdateDate || 'N/A'}
                                stages={[
                                    { name: 'Lançamento', percentage: 100, completed: true },
                                    { name: 'Fundação', percentage: 100, completed: true },
                                    { name: 'Construção', percentage: emp.progressPercentage, completed: emp.progressPercentage === 100 },
                                    { name: 'Acabamento', percentage: 0, completed: false }
                                ]}
                            />
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside>
                        <div className="sticky top-24 space-y-6">
                            <div className="bg-gray-950 rounded-2xl p-8 text-white shadow-2xl overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-3xl" />
                                <div className="relative z-10">
                                    <h3 className="text-2xl font-bold leading-tight mb-6">Condições Especiais</h3>
                                    <p className="text-gray-400 mb-8">Solicite agora a tabela de preços e as melhores condições.</p>

                                    <Link
                                        href={whatsappUrl}
                                        target="_blank"
                                        className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold transition-all hover:bg-blue-700 flex items-center justify-center gap-2 mb-4"
                                    >
                                        <MessageCircle size={20} />
                                        Falar com Corretor
                                    </Link>

                                    <div className="mt-6 flex items-center gap-3 bg-white/5 p-3 rounded-lg border border-white/10">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        <p className="text-sm font-medium text-gray-300">Online agora</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </section>

            {/* Sticky Mobile CTA */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-lg border-t border-gray-200 z-50">
                <Link
                    href={whatsappUrl}
                    target="_blank"
                    className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
                >
                    <MessageCircle size={20} />
                    Falar com Consultor
                </Link>
            </div>

            {/* Padding for mobile CTA */}
            <div className="lg:hidden h-20" />
        </div>
    );
}
