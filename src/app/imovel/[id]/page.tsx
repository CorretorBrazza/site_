import { Metadata } from 'next';
import { getImoveis } from '@/app/actions/imovel-server-actions';
import { notFound } from 'next/navigation';
import ImageCarousel from '@/components/ImageCarousel';
import ShareButton from '@/components/ShareButton';
import { BedDouble, ShowerHead, Car, Maximize, MapPin, Mail, ShieldCheck, Phone, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export const dynamicParams = false;

export async function generateStaticParams() {
  const imoveis = await getImoveis();
  return imoveis.map((imovel) => ({
    id: imovel.id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const imoveis = await getImoveis();
  const imovel = imoveis.find((i) => i.id === id);

  if (!imovel) {
    return {
      title: 'Imóvel não encontrado | Imóveis Taboão',
    };
  }

  return {
    title: `${imovel.titulo} — Taboão da Serra e imediações`,
    description: imovel.descricao.substring(0, 160) + '...',
    openGraph: {
      title: `${imovel.titulo} — Taboão da Serra e imediações`,
      description: imovel.descricao.substring(0, 160) + '...',
      images: imovel.fotos.length > 0 ? [imovel.fotos[0]] : [],
      type: 'website',
    },
  };
}

export default async function ImovelDetalhes({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const imoveis = await getImoveis();
  const imovel = imoveis.find((i) => i.id === id);

  if (!imovel) {
    notFound();
  }

  const preco = imovel.transacao === 'Venda' ? imovel.precoVenda : imovel.precoLocacao;
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const rawPhone = imovel.corretor?.telefone || '5511932785602';
  const cleanPhone = rawPhone.replace(/\D/g, '') || '5511932785602';
  const phoneWithCountry = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;

  const whatsappMessage = encodeURIComponent(
    `Olá! Tenho interesse no imóvel REF: ${imovel.referencia} (${imovel.titulo}) anunciado no site Imóveis Taboão da Serra e imediações. Gostaria de agendar uma visita ou receber mais informações!`
  );
  const whatsappUrl = `https://wa.me/${phoneWithCountry}?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-[#0b132b] text-slate-100 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Cabeçalho do Imóvel */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider">
              <span className="bg-amber-500/20 text-amber-400 px-3 py-1 rounded-xl border border-amber-500/30">
                {imovel.transacao}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300">REF: {imovel.referencia}</span>
            </div>
            
            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              {imovel.titulo}
            </h1>
            
            <div className="flex items-center gap-1.5 text-slate-400 text-xs sm:text-sm font-medium">
              <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
              <span>{imovel.endereco?.bairro || 'Taboão da Serra'}, Taboão da Serra e imediações - SP</span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <ShareButton />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Coluna Principal: Galeria & Descrição */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Galeria de Fotos */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-2 shadow-2xl overflow-hidden">
              <ImageCarousel images={imovel.fotos} alt={imovel.titulo} />
            </div>

            {/* Descrição Completa */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                <span>Descrição do Imóvel</span>
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-normal">
                {imovel.descricao}
              </p>
            </div>

            {/* Ficha Técnica / Características */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4">
              <h2 className="text-xl font-extrabold text-white">Especificações do Imóvel</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl text-center space-y-1">
                  <BedDouble className="w-6 h-6 text-amber-500 mx-auto" />
                  <span className="block font-black text-lg text-white">{imovel.caracteristicas?.quartos || 0}</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Quartos</span>
                </div>

                <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl text-center space-y-1">
                  <ShowerHead className="w-6 h-6 text-amber-500 mx-auto" />
                  <span className="block font-black text-lg text-white">{imovel.caracteristicas?.suites || 0}</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Suítes</span>
                </div>

                <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl text-center space-y-1">
                  <ShowerHead className="w-6 h-6 text-amber-500 mx-auto" />
                  <span className="block font-black text-lg text-white">{imovel.caracteristicas?.banheiros || 0}</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Banheiros</span>
                </div>

                <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl text-center space-y-1">
                  <Maximize className="w-6 h-6 text-amber-500 mx-auto" />
                  <span className="block font-black text-lg text-white">{imovel.caracteristicas?.areaUtil || 0}m²</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Área Útil</span>
                </div>
              </div>
            </div>

          </div>

          {/* Coluna Lateral: Card de Contato & Valor */}
          <div className="lg:col-span-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl sticky top-24">
              
              <div className="border-b border-slate-800 pb-6 space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Valor do Imóvel</span>
                <p className="text-3xl font-black text-amber-400">
                  {preco ? formatCurrency(preco) : 'Consulte'}
                  {imovel.transacao === 'Locação' && <span className="text-sm font-semibold text-slate-400"> /mês</span>}
                </p>
              </div>

              <div className="space-y-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 hover:from-emerald-400 hover:to-emerald-600 text-white font-black rounded-2xl text-xs uppercase tracking-wider shadow-lg shadow-emerald-900/30 transition-all flex items-center justify-center gap-2.5"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Chamar no WhatsApp ({imovel.referencia})</span>
                </a>
              </div>

              <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 text-xs text-slate-400 space-y-2">
                <div className="flex items-center gap-2 font-bold text-white">
                  <ShieldCheck className="w-4 h-4 text-amber-500" />
                  <span>Atendimento em Taboão da Serra e imediações</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Entre em contato diretamente com nossos consultores para agendar uma visita ao imóvel REF: <strong>{imovel.referencia}</strong>.
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
