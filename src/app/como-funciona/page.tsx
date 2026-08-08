import Link from 'next/link';
import { Mail, Sparkles, HardDrive, ShieldCheck, CheckCircle2, ArrowRight, Smartphone, Share2, Flame } from 'lucide-react';

export const metadata = {
  title: 'Como Funciona | Imóveis Taboão — Ferramenta Oficial do Corretor',
  description: 'Descubra como enviar imóveis por e-mail, gerar Media Kits com inteligência artificial, liberar espaço no celular e anunciar grátis por 90 dias em Taboão da Serra.',
};

export default function ComoFuncionaPage() {
  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 text-white pt-20 pb-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            Tecnologia Exclusiva para Corretores de Taboão da Serra
          </span>
          
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight mb-6">
            Como Funciona o <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Imóveis Taboão</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Sem formulários chatos! Envie seus imóveis por e-mail, gere Media Kits de IA para o seu Instagram/WhatsApp, libere memória no seu celular e ganhe 90 dias de divulgação no portal.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="mailto:captacao@imoveistaboao.com.br"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all flex items-center gap-2 text-base"
            >
              <Mail className="w-5 h-5" /> Enviar Imóvel por E-mail
            </a>
            <Link
              href="/dashboard"
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold px-8 py-4 rounded-xl transition-all flex items-center gap-2 text-base"
            >
              Acessar Meu Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* 3 Passos Simples */}
      <div className="max-w-5xl mx-auto px-4 -mt-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Passo 1 */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xl hover:shadow-2xl transition-all relative group">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-black text-xl mb-6 group-hover:scale-110 transition-transform">
              1
            </div>
            <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider mb-2">
              <Mail className="w-4 h-4" /> Sem Formulários
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Envie por E-mail</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Abra o aplicativo de e-mail no seu celular, anexe as fotos brutas do imóvel e escreva a descrição simples. Envie direto para <strong className="text-slate-900">captacao@imoveistaboao.com.br</strong>.
            </p>
          </div>

          {/* Passo 2 */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xl hover:shadow-2xl transition-all relative group">
            <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-black text-xl mb-6 group-hover:scale-110 transition-transform">
              2
            </div>
            <div className="flex items-center gap-2 text-purple-600 font-bold text-xs uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" /> Inteligência Artificial
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Processamento & IA</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Nossa IA organiza as informações, salva suas fotos brutas na nuvem (liberando espaço no seu celular) e gera o Media Kit com textos perfeitos para redes sociais.
            </p>
          </div>

          {/* Passo 3 */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xl hover:shadow-2xl transition-all relative group">
            <div className="w-14 h-14 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center font-black text-xl mb-6 group-hover:scale-110 transition-transform">
              3
            </div>
            <div className="flex items-center gap-2 text-green-600 font-bold text-xs uppercase tracking-wider mb-2">
              <Share2 className="w-4 h-4" /> Divulgação & Vendas
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Aprove & Venda</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Acesse o Link Mágico de Aprovação, copie o texto do WhatsApp/Instagram em 1 clique e publique o imóvel gratuitamente no portal por 90 dias!
            </p>
          </div>
        </div>
      </div>

      {/* Seção Destaques de Benefícios */}
      <div className="max-w-5xl mx-auto px-4 mt-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Por que os Corretores de Taboão da Serra Escolhem o Portal?
          </h2>
          <p className="text-slate-600 mt-2">Tecnologia desenvolvida sob medida para a rotina do corretor de imóveis</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 flex items-start gap-4 shadow-sm">
            <div className="p-3 bg-amber-100 text-amber-700 rounded-xl">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base mb-1">Celular Sempre com Espaço</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Suas fotos de alta resolução ficam salvas no seu acervo em nuvem. Você pode deletar as fotos pesadas do celular com total segurança.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 flex items-start gap-4 shadow-sm">
            <div className="p-3 bg-purple-100 text-purple-700 rounded-xl">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base mb-1">Copys Prontas em 1 Clique</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Legendas persuasivas com hashtags de Taboão da Serra prontas para copiar e colar no Instagram e grupos de WhatsApp.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 flex items-start gap-4 shadow-sm">
            <div className="p-3 bg-blue-100 text-blue-700 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base mb-1">90 Dias de Anúncio Válido</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Sem anúncios desatualizados ou imóveis fantasma. Transparência total para os compradores de Taboão da Serra.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 flex items-start gap-4 shadow-sm">
            <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base mb-1">Foco no Mercado Regional</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Conhecimento geográfico refinado sobre os principais condomínios e bairros de Taboão da Serra.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Final */}
      <div className="max-w-4xl mx-auto px-4 mt-20 text-center">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl p-10 text-white shadow-2xl relative overflow-hidden">
          <h2 className="text-3xl font-black mb-3">Pronto para Otimizar suas Vendas?</h2>
          <p className="text-blue-100 text-sm max-w-xl mx-auto mb-8">
            Envie as fotos do seu próximo imóvel por e-mail ou acesse seu painel para gerenciar seu acervo de fotos.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="mailto:captacao@imoveistaboao.com.br"
              className="bg-white text-blue-900 font-bold px-8 py-3.5 rounded-xl shadow-md hover:bg-blue-50 transition-all text-sm"
            >
              Enviar Imóvel Agora
            </a>
            <Link
              href="/dashboard"
              className="bg-blue-900/60 hover:bg-blue-900 text-white font-bold px-8 py-3.5 rounded-xl border border-blue-400/30 transition-all text-sm"
            >
              Ir para o Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
