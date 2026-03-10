import { notFound } from 'next/navigation';
import { empreendimentos } from '@/data/empreendimentos';
import { MapPin, Calendar, CheckCircle2, Ruler, BedDouble, Car, PlayCircle, MessageCircle, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import ImageCarousel from '@/components/ImageCarousel';

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
            {/* navigation / back */}
            <div className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center">
                    <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-semibold py-2">
                        <ChevronLeft size={20} />
                        Voltar para o início
                    </Link>
                </div>
            </div>

            {/* Hero / Galerie */}
            <section className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {/* Galeria */}
                    <div className="rounded-[32px] overflow-hidden shadow-2xl aspect-[16/10] bg-gray-100 relative group">
                        {emp.images.length > 0 ? (
                            <ImageCarousel fotos={emp.images} />
                        ) : (
                            <img
                                src={emp.heroImage}
                                alt={emp.name}
                                className="w-full h-full object-cover"
                            />
                        )}
                        <div className="absolute top-6 right-6 flex flex-col gap-2 scale-90 md:scale-100">
                            <span className="bg-[#2563EB] text-white text-xs font-bold px-5 py-2.5 rounded-2xl shadow-xl flex items-center gap-2">
                                <MapPin size={16} />
                                {emp.status}
                            </span>
                        </div>
                    </div>

                    {/* Informações Rápidas */}
                    <div className="flex flex-col h-full justify-center lg:pl-4">
                        <div className="mb-8">
                            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight leading-[1.1]">
                                {emp.name}
                            </h1>
                            <div className="flex items-start gap-2.5 text-gray-600 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                                <MapPin size={20} className="text-blue-500 shrink-0 mt-1" />
                                <span className="text-lg font-medium leading-tight">{emp.address}</span>
                            </div>
                        </div>

                        {/* Principais Specs */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-1 hover:shadow-md transition-shadow">
                                <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Dormitórios</span>
                                <div className="flex items-center gap-3">
                                    <BedDouble className="text-blue-600" size={24} />
                                    <span className="text-xl font-black text-gray-900">{emp.dormitorios}</span>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-1 hover:shadow-md transition-shadow">
                                <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Previsão Entrega</span>
                                <div className="flex items-center gap-3">
                                    <Calendar className="text-red-600" size={24} />
                                    <span className="text-xl font-black text-gray-900">{emp.deliveryDate}</span>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-1 hover:shadow-md transition-shadow">
                                <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Área Privativa</span>
                                <div className="flex items-center gap-3">
                                    <Ruler className="text-blue-600" size={24} />
                                    <span className="text-xl font-black text-gray-900">{emp.area}</span>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-1 hover:shadow-md transition-shadow">
                                <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Vagas Garagem</span>
                                <div className="flex items-center gap-3">
                                    <Car className="text-blue-600" size={24} />
                                    <span className="text-xl font-black text-gray-900">{emp.vagas}</span>
                                </div>
                            </div>
                        </div>

                        <Link
                            href={whatsappUrl}
                            target="_blank"
                            className="w-full bg-[#2563EB] hover:bg-blue-700 text-white py-5 rounded-[24px] font-black text-[18px] transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-3 active:scale-[0.98]"
                        >
                            <MessageCircle size={24} />
                            Falar com um Consultor
                        </Link>
                    </div>
                </div>
            </section>

            {/* Conteúdo Detalhado */}
            <main className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    <div className="lg:col-span-2 space-y-20">
                        {/* Description */}
                        <section className="bg-white p-8 md:p-12 rounded-[40px] border border-gray-100 shadow-sm">
                            <h2 className="text-3xl font-black text-gray-900 mb-8 tracking-tight">Sobre o Projeto</h2>
                            <div className="prose prose-lg text-gray-600 max-w-none">
                                <p className="leading-relaxed text-xl font-medium">{emp.description}</p>
                            </div>
                        </section>

                        {/* Amenities */}
                        <section>
                            <div className="flex items-end justify-between mb-10 px-4">
                                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Experiência & Lazer</h2>
                                <span className="text-blue-600 font-bold bg-blue-50 px-4 py-1.5 rounded-xl text-sm">Mais de {emp.amenities.length} ítens inclusos</span>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {emp.amenities.map((item) => (
                                    <div key={item} className="flex flex-col gap-3 p-6 bg-white rounded-3xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all group">
                                        <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                            <CheckCircle2 size={20} />
                                        </div>
                                        <span className="font-bold text-gray-700 text-sm">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Video */}
                        {emp.videoUrl && (
                            <section>
                                <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-10 flex items-center gap-4 px-4">
                                    <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-red-600">
                                        <PlayCircle size={24} />
                                    </div>
                                    Conheça por Dentro
                                </h2>
                                <div className="aspect-video rounded-[40px] overflow-hidden shadow-2xl border-8 border-white">
                                    <iframe
                                        className="w-full h-full"
                                        src={emp.videoUrl.replace('watch?v=', 'embed/')}
                                        title="Vídeo do Imóvel"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </section>
                        )}
                    </div>

                    <aside className="hidden lg:block">
                        <div className="sticky top-24 space-y-6">
                            <div className="bg-gray-950 rounded-[40px] p-10 text-white shadow-2xl overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-[64px]" />
                                <div className="relative z-10">
                                    <h3 className="text-3xl font-black leading-tight mb-6">Condições Especiais</h3>
                                    <p className="text-gray-400 mb-8 text-lg">Solicite agora a tabela de preços, plantas e as melhores condições para financiamento.</p>

                                    <div className="space-y-4">
                                        <Link
                                            href={whatsappUrl}
                                            target="_blank"
                                            className="w-full bg-[#2563EB] text-white py-5 rounded-[20px] font-black text-lg transition-all shadow-xl hover:bg-blue-600 flex items-center justify-center gap-2"
                                        >
                                            <MessageCircle size={24} />
                                            Falar com Corretor
                                        </Link>
                                    </div>

                                    <div className="mt-10 flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        <p className="text-sm font-bold text-gray-300">Equipe disponível online</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            {/* Sticky Mobile CTA */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-lg border-t border-gray-100 z-50">
                <Link
                    href={whatsappUrl}
                    target="_blank"
                    className="w-full bg-[#2563EB] text-white py-4 rounded-[18px] font-black text-lg shadow-xl flex items-center justify-center gap-2"
                >
                    <MessageCircle size={22} />
                    Falar com Consultor
                </Link>
            </div>
        </div>
    );
}
