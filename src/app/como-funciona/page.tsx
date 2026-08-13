import Link from 'next/link';
import { MessageSquare, Sparkles, HardDrive, ShieldCheck, CheckCircle2, ArrowRight, Smartphone, Share2, Flame, HelpCircle, AlertCircle, Check } from 'lucide-react';

export const metadata = {
  title: 'Como Funciona | Imóveis Taboão — Ferramenta Oficial do Corretor',
  description: 'Descubra como enviar imóveis pelo WhatsApp Oficial, gerar Media Kits com inteligência artificial, liberar memória no celular e anunciar em Taboão da Serra e imediações.',
};

export default function ComoFuncionaPage() {
  const whatsappUrl = "https://wa.me/5511989161897?text=Ol%C3%A1%2C%20quero%20enviar%20um%20im%C3%B3vel%20para%20anunciar";

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 pb-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-slate-950 via-blue-950/60 to-slate-950 text-white pt-16 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider mb-6">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Canal Oficial via WhatsApp Meta API
          </span>
          
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight mb-6">
            Como Funciona o <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">Imóveis Taboão</span>
          </h1>
          
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Sem formulários chatos! Envie as fotos e informações do imóvel direto pelo WhatsApp Oficial <strong>(11) 98916-1897</strong>. Nossa Inteligência Artificial gera o Media Kit para suas redes sociais, preserva o acervo de fotos em alta na nuvem e publica no portal.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-extrabold px-8 py-4 rounded-2xl shadow-xl hover:shadow-emerald-500/25 transition-all flex items-center gap-2.5 text-sm uppercase tracking-wider"
            >
              <MessageSquare className="w-5 h-5 fill-white" />
              <span>Enviar Imóvel no WhatsApp (11) 98916-1897</span>
            </a>
            <Link
              href="/dashboard"
              className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-bold px-8 py-4 rounded-2xl transition-all flex items-center gap-2 text-sm"
            >
              <span>Acessar Meu Dashboard</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </Link>
          </div>
        </div>
      </div>

      {/* 3 Passos Simples */}
      <div className="max-w-5xl mx-auto px-4 -mt-6 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Passo 1 */}
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl hover:border-slate-700 transition-all relative group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-800 text-emerald-400 flex items-center justify-center font-black text-lg mb-6 group-hover:scale-110 transition-transform">
              1
            </div>
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">
              <MessageSquare className="w-4 h-4" /> Envio por WhatsApp
            </div>
            <h3 className="text-xl font-black text-white mb-3">Envie Fotos + Texto Bruto</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Abra seu WhatsApp e envie as fotos originais + o texto bruto do imóvel direto para o número oficial <strong className="text-white">(11) 98916-1897</strong>. Não precisa preencher cadastros longos!
            </p>
          </div>

          {/* Passo 2 */}
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl hover:border-slate-700 transition-all relative group">
            <div className="w-12 h-12 rounded-2xl bg-purple-950 border border-purple-800 text-purple-400 flex items-center justify-center font-black text-lg mb-6 group-hover:scale-110 transition-transform">
              2
            </div>
            <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" /> Inteligência Artificial
            </div>
            <h3 className="text-xl font-black text-white mb-3">Processamento & Link Mágico</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              A IA analisa os dados, armazena as fotos em alta na <strong>Nuvem Imóveis Taboão</strong> e envia um Link Mágico no seu próprio WhatsApp para você conferir e editar antes de publicar.
            </p>
          </div>

          {/* Passo 3 */}
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl hover:border-slate-700 transition-all relative group">
            <div className="w-12 h-12 rounded-2xl bg-amber-950 border border-amber-800 text-amber-400 flex items-center justify-center font-black text-lg mb-6 group-hover:scale-110 transition-transform">
              3
            </div>
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">
              <Share2 className="w-4 h-4" /> Divulgação & Comissão
            </div>
            <h3 className="text-xl font-black text-white mb-3">Aprove, Divulgue e Venda Rápido</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Ao clicar em <strong>Aprovar</strong>, o anúncio entra no ar no portal e seu <strong>Media Kit de IA</strong> (legendas para Instagram/WhatsApp + Stories) fica liberado no seu Dashboard para copiar e vender rápido!
            </p>
          </div>
        </div>
      </div>

      {/* GUIA DICAS EDUCATIVAS DE ENTRADA DE DADOS: A IA É INTELIGENTE, MAS NÃO É VIDENTE */}
      <div className="max-w-5xl mx-auto px-4 mt-16">
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-blue-800/60 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center font-black">
              💡
            </div>
            <div>
              <h3 className="text-xl font-black text-white">Dicas de Envio: "A IA é Inteligente, mas Não é Vidente!"</h3>
              <p className="text-xs text-slate-300">Como mandar os detalhes no WhatsApp para o robô reconhecer tudo com 100% de exatidão</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-1.5">
              <strong className="text-amber-400 font-bold block flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" /> Garagem Coberta vs Descoberta
              </strong>
              <p className="text-slate-300 leading-relaxed">
                Se você enviar apenas "garagem", a IA gera <em>1 vaga de garagem</em>. Se o imóvel possui cobertura, especifique <strong>"garagem coberta"</strong> no texto do WhatsApp.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-1.5">
              <strong className="text-amber-400 font-bold block flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" /> Grupos de Condomínio (Ex: Cooperativa)
              </strong>
              <p className="text-slate-300 leading-relaxed">
                Em empreendimentos divididos por fases, sempre mencione o grupo específico. Exemplo: <strong>"Parque Firenze Grupo 12"</strong> ou <strong>"Jardim das Artes Grupo 4"</strong>.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-1.5">
              <strong className="text-amber-400 font-bold block flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" /> A Família dos Bosques (Apartamentos)
              </strong>
              <p className="text-slate-300 leading-relaxed">
                Especifique o nome exato (ex: <em>Bosque da Serra</em>, <em>Mirante do Bosque</em>). Se mandar apenas "Bosque", inclua o nome da rua para a IA identificar o condomínio correto.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-1.5">
              <strong className="text-amber-400 font-bold block flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" /> Vias Mistas (Ex: Estrada Kizaemon Takeuti)
              </strong>
              <p className="text-slate-300 leading-relaxed">
                Em avenidas comerciais que possuem tanto casas quanto apartamentos, sempre informe a tipologia (ex: <strong>"Apartamento na Kizaemon Takeuti"</strong> ou <strong>"Sobrado comercial"</strong>).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* QUEBRA DE OBJEÇÕES E PERGUNTAS FREQUENTES (FAQ) */}
      <div className="max-w-5xl mx-auto px-4 mt-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-white tracking-tight">
            Perguntas Frequentes & Quebra de Dúvidas
          </h2>
          <p className="text-slate-400 text-xs mt-1">Respostas diretas para otimizar sua rotina imobiliária</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
            <h4 className="font-extrabold text-white text-sm flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              Preciso baixar algum aplicativo no celular?
            </h4>
            <p className="text-slate-300 leading-relaxed">
              <strong>Não!</strong> Não precisa baixar nada nem lotar a memória do seu aparelho. O portal funciona 100% via WhatsApp Oficial + Painel Web leve acessível pelo navegador do celular ou computador.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
            <h4 className="font-extrabold text-white text-sm flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              E se eu vender ou alugar o imóvel em 1 semana?
            </h4>
            <p className="text-slate-300 leading-relaxed">
              Basta acessar seu Dashboard e marcar o imóvel como <strong>"Vendido"</strong> ou <strong>"Alugado"</strong> com 1 clique. Isso gera selo de sucesso para o seu perfil e você pode reutilizar seus novos créditos em outros anúncios.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
            <h4 className="font-extrabold text-white text-sm flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              O que vem dentro do Media Kit de IA?
            </h4>
            <p className="text-slate-300 leading-relaxed">
              Legenda persuasiva profissional adaptada para Instagram/Facebook, roteiro curto para Stories/Reels, hashtags estratégicas regionais de Taboão da Serra e link direto de visualização.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
            <h4 className="font-extrabold text-white text-sm flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              E se eu apagar as fotos do meu celular por falta de espaço?
            </h4>
            <p className="text-slate-300 leading-relaxed">
              Sem problemas! Suas fotos em alta resolução ficam salvas com segurança na <strong>Nuvem Imóveis Taboão por 1 ano (365 dias)</strong>. Você pode baixá-las novamente a qualquer momento no seu acervo.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Final */}
      <div className="max-w-4xl mx-auto px-4 mt-16 text-center">
        <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 rounded-3xl p-10 text-white shadow-2xl border border-blue-800/50 relative overflow-hidden">
          <h2 className="text-3xl font-black mb-3">Pronto para Divulgar e Vender Rápido?</h2>
          <p className="text-slate-300 text-xs max-w-xl mx-auto mb-8">
            Envie as fotos e texto bruto do seu próximo imóvel no WhatsApp Oficial e receba sua proposta pronta em minutos.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-8 py-3.5 rounded-xl shadow-lg transition-all text-xs flex items-center gap-2 uppercase tracking-wider"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>Enviar Imóvel no WhatsApp</span>
            </a>
            <Link
              href="/dashboard"
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-3.5 rounded-xl border border-slate-700 transition-all text-xs flex items-center gap-1.5"
            >
              <span>Ir para Meu Dashboard</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

