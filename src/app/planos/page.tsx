import { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, Check, Zap, ShieldCheck, ArrowRight, Building2, HardDrive, MessageSquare, HelpCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Planos e Créditos de Anúncios — Imóveis Taboão',
  description: 'Confira nossos pacotes de créditos para publicar e destacar seus imóveis em Taboão da Serra e região com IA e backup de mídias.',
  openGraph: {
    title: 'Planos e Créditos de Anúncios — Imóveis Taboão',
    description: 'Confira nossos pacotes de créditos para publicar e destacar seus imóveis em Taboão da Serra e região com IA e backup de mídias.',
    url: 'https://imoveistaboao.com.br/planos',
    type: 'website',
  },
};

export default function PlanosPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <main className="flex-1">
        
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-slate-900 via-blue-950 to-slate-950 py-16 px-4 text-center overflow-hidden border-b border-slate-800">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-yellow-300 fill-yellow-300" />
              Tabela Oficial de Créditos & Pacotes
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Anuncie com Inteligência Artificial e Alta Visibilidade
            </h1>
            <p className="text-sm md:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Cada crédito permite publicar ou reativar 1 imóvel por 90 dias com legenda comercial enriquecida via IA, Media Kit automático e 1 ano de backup de fotos na nuvem.
            </p>

            <div className="pt-2 flex justify-center">
              <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-extrabold px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                🎁 Novos Corretores Ganham 1 Crédito Grátis ao se cadastrar!
              </span>
            </div>
          </div>
        </section>

        {/* Tabela de 3 Pacotes Principais */}
        <section className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            
            {/* PACOTE START */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between hover:border-slate-700 transition-all relative">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pacote Individual</span>
                  <span className="bg-slate-800 text-slate-300 text-[10px] font-bold px-2.5 py-1 rounded-full">START</span>
                </div>

                <div>
                  <h3 className="text-2xl font-black text-white">1 Crédito</h3>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-4xl font-black text-white">R$ 12,90</span>
                    <span className="text-xs text-slate-400 font-medium">/ pagamento único</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Ideal para experimentar ou publicar 1 imóvel específico por 90 dias.</p>
                </div>

                <div className="border-t border-slate-800 pt-6 space-y-3 text-xs text-slate-300 font-medium">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>1 Anúncio Ativo por 90 Dias</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Redação Comercial com IA (Gemini)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Aprovação Mágica via WhatsApp</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>1 Anos de Backup de Fotos em Alta</span>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <Link
                  href="/cadastro"
                  className="w-full py-3.5 px-4 bg-slate-800 hover:bg-slate-700 text-white font-extrabold rounded-xl text-xs transition-all flex items-center justify-center gap-2 border border-slate-700"
                >
                  <span>Cadastrar e Testar Grátis</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* PACOTE PRO (MAIS POPULAR) */}
            <div className="bg-gradient-to-b from-blue-950/80 to-slate-900 border-2 border-blue-500 rounded-3xl p-8 flex flex-col justify-between shadow-2xl relative">
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-black uppercase tracking-wider px-4 py-1 rounded-full shadow-lg">
                ★ Mais Escolhido
              </span>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Pacote Recomendado</span>
                  <span className="bg-blue-600/30 text-blue-300 border border-blue-500/40 text-[10px] font-bold px-2.5 py-1 rounded-full">PRO</span>
                </div>

                <div>
                  <h3 className="text-2xl font-black text-white">3 Créditos</h3>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-4xl font-black text-amber-400">R$ 33,90</span>
                    <span className="text-xs text-slate-400 font-medium">/ total</span>
                  </div>
                  <div className="inline-block bg-emerald-950 text-emerald-300 border border-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-md mt-1">
                    12% OFF • R$ 11,30 por crédito
                  </div>
                </div>

                <div className="border-t border-slate-800/80 pt-6 space-y-3 text-xs text-slate-200 font-medium">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>3 Anúncios Ativos</strong> por 90 dias cada</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Media Kit de IA (Legendas + Stories)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Receba Contatos de Clientes no WhatsApp</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>1 Ano de Armazenamento de Mídias</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Painel do Corretor Completo</span>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <Link
                  href="/login"
                  className="w-full py-4 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <Zap className="w-4 h-4 fill-white" />
                  <span>Adquirir Pacote Pro</span>
                </Link>
              </div>
            </div>

            {/* PACOTE ELITE */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col justify-between hover:border-slate-700 transition-all relative">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Alta Frequência</span>
                  <span className="bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-full">ELITE</span>
                </div>

                <div>
                  <h3 className="text-2xl font-black text-white">10 Créditos</h3>
                  <div className="flex items-baseline gap-1 mt-2">
                    <span className="text-4xl font-black text-white">R$ 89,90</span>
                    <span className="text-xs text-slate-400 font-medium">/ total</span>
                  </div>
                  <div className="inline-block bg-emerald-950 text-emerald-300 border border-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-md mt-1">
                    30% OFF • R$ 8,99 por crédito
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-6 space-y-3 text-xs text-slate-300 font-medium">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>10 Anúncios Ativos</strong> no Portal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Economia Máxima de R$ 39,10</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Prioridade na Indexação SEO no Google</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Backup ilimitado no acervo R2</span>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <Link
                  href="/login"
                  className="w-full py-3.5 px-4 bg-slate-800 hover:bg-slate-700 text-white font-extrabold rounded-xl text-xs transition-all flex items-center justify-center gap-2 border border-slate-700"
                >
                  <span>Comprar Pacote Elite</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* Diferenciais da Tecnologia */}
        <section className="bg-slate-900 border-y border-slate-800 py-16 px-4">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-black text-white">Por que anunciar no Imóveis Taboão?</h2>
              <p className="text-xs md:text-sm text-slate-400">Tecnologia desenvolvida sob medida para corretores e imobiliárias da região.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300">
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3">
                <div className="w-10 h-10 bg-blue-600/20 border border-blue-500/30 rounded-xl flex items-center justify-center text-blue-400">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Envio 100% por WhatsApp</h3>
                <p className="text-slate-400 leading-relaxed">
                  Envie fotos e um texto simples pelo WhatsApp. Nossa IA compõe o anúncio comercial completo em segundos.
                </p>
              </div>

              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3">
                <div className="w-10 h-10 bg-purple-600/20 border border-purple-500/30 rounded-xl flex items-center justify-center text-purple-400">
                  <HardDrive className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Acervo de Fotos na Nuvem</h3>
                <p className="text-slate-400 leading-relaxed">
                  Suas fotos originais ficam armazenadas em nuvem de alta velocidade por 1 ano para você baixar quando quiser.
                </p>
              </div>

              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3">
                <div className="w-10 h-10 bg-emerald-600/20 border border-emerald-500/30 rounded-xl flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Sem Mensalidades Fixas</h3>
                <p className="text-slate-400 leading-relaxed">
                  Pague apenas pelos créditos que usar via Pix ou Cartão pelo Mercado Pago. Créditos não expiram se não utilizados.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ - Perguntas Frequentes */}
        <section className="max-w-4xl mx-auto px-4 py-16 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black text-white flex items-center justify-center gap-2">
              <HelpCircle className="w-6 h-6 text-amber-500" />
              Perguntas Frequentes sobre Créditos
            </h2>
          </div>

          <div className="space-y-4 text-xs text-slate-300">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
              <strong className="block text-sm font-bold text-white">Como funciona o crédito grátis de boas-vindas?</strong>
              <p className="text-slate-400 leading-relaxed">
                Ao criar sua conta no portal via <Link href="/cadastro" className="text-blue-400 underline">página de cadastro</Link>, você recebe **1 crédito bônus** imediatamente em seu saldo para publicar seu primeiro imóvel por 90 dias sem nenhum custo.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
              <strong className="block text-sm font-bold text-white">Quanto tempo dura a publicação de um imóvel?</strong>
              <p className="text-slate-400 leading-relaxed">
                Cada crédito mantém o imóvel ativo e publicado no portal durante **90 dias consecutivos**. Se o imóvel for vendido antes, você pode desativá-lo pelo painel.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
              <strong className="block text-sm font-bold text-white">Quais as formas de pagamento aceitas?</strong>
              <p className="text-slate-400 leading-relaxed">
                Aceitamos **Pix com aprovação instantânea em segundos** e **Cartão de Crédito/Débito** via Mercado Pago de forma 100% segura.
              </p>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
