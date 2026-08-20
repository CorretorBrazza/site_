import Link from 'next/link';
import {
  MessageSquare,
  Sparkles,
  HardDrive,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Smartphone,
  Share2,
  Flame,
  HelpCircle,
  AlertCircle,
  Check,
  Cpu,
  Layers,
  Camera,
  Coins,
  Video,
  FileCheck2,
} from 'lucide-react';

export const metadata = {
  title: 'Como Funciona a Tecnologia & IA | Imóveis Taboão — Ferramenta Oficial do Corretor',
  description: 'Descubra como a Inteligência Artificial e a Visão Computacional do Imóveis Taboão transformam fotos e textos brutos em Media Kits completos em 15 segundos.',
};

export default function ComoFuncionaPage() {
  const whatsappUrl = 'https://wa.me/5511989161897?text=Ol%C3%A1%2C%20quero%20enviar%20um%20im%C3%B3vel%20para%20anunciar';

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 pb-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-slate-950 via-blue-950/60 to-slate-950 text-white pt-16 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider mb-6">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Tecnologia de Inteligência Artificial & Visão Computacional
          </span>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight mb-6">
            Como Funciona o <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">Imóveis Taboão</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            De fotos soltas no celular e texto bruto a um <strong>Media Kit profissional de 5 canais</strong> e anúncio publicado no portal em apenas <strong>15 segundos</strong>. Tudo pelo WhatsApp oficial <strong className="text-white">(11) 98916-1897</strong>.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-extrabold px-8 py-4 rounded-2xl shadow-xl hover:shadow-emerald-500/25 transition-all flex items-center gap-2.5 text-sm uppercase tracking-wider"
            >
              <MessageSquare className="w-5 h-5 fill-white" />
              <span>Testar Grátis no WhatsApp (1 Crédito Cortesia)</span>
            </a>
            <Link
              href="/planos"
              className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-bold px-8 py-4 rounded-2xl transition-all flex items-center gap-2 text-sm"
            >
              <span>Ver Tabela de Planos</span>
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
            <h3 className="text-xl font-black text-white mb-3">Envie até 20 Fotos + Texto Bruto</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Abra seu WhatsApp e envie as fotos originais (até 20 fotos por imóvel) e uma mensagem rápida com os detalhes. Sem formulários cansativos!
            </p>
          </div>

          {/* Passo 2 */}
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl hover:border-slate-700 transition-all relative group">
            <div className="w-12 h-12 rounded-2xl bg-purple-950 border border-purple-800 text-purple-400 flex items-center justify-center font-black text-lg mb-6 group-hover:scale-110 transition-transform">
              2
            </div>
            <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" /> IA + Visão Computacional
            </div>
            <h3 className="text-xl font-black text-white mb-3">Extração & RAG Regional</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              A IA analisa fotos e textos, identifica condomínios de Taboão e Embu, calcula distâncias e monta o Media Kit completo para 5 canais.
            </p>
          </div>

          {/* Passo 3 */}
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl hover:border-slate-700 transition-all relative group">
            <div className="w-12 h-12 rounded-2xl bg-amber-950 border border-amber-800 text-amber-400 flex items-center justify-center font-black text-lg mb-6 group-hover:scale-110 transition-transform">
              3
            </div>
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">
              <Share2 className="w-4 h-4" /> Validação & Divulgação
            </div>
            <h3 className="text-xl font-black text-white mb-3">Aprovação com 1 Clique & Divulgação</h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Você recebe o Link Mágico no WhatsApp. Revisa, ajusta se quiser e aprova. O anúncio entra no ar e seu Media Kit fica liberado no painel!
            </p>
          </div>
        </div>
      </div>

      {/* DEMONSTRAÇÃO ANTES & DEPOIS REAL (PROVA SOCIAL TÉCNICA) */}
      <div className="max-w-5xl mx-auto px-4 mt-20">
        <div className="text-center mb-10">
          <span className="text-amber-400 font-bold text-xs uppercase tracking-wider bg-amber-950/60 border border-amber-800/80 px-3 py-1 rounded-full">
            ✨ Demonstração Real de Processamento
          </span>
          <h2 className="text-3xl font-black text-white tracking-tight mt-3">
            O Que Acontece em 15 Segundos
          </h2>
          <p className="text-slate-400 text-xs mt-1">Veja a transformação do material bruto do corretor em conteúdo comercial pronto para vender.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Lado Esquerdo: O Que o Corretor Envia */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-slate-300 font-bold text-sm">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span>O que você envia no WhatsApp:</span>
              </div>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">Entrada Bruta</span>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-slate-300 space-y-2 leading-relaxed">
              <p className="text-emerald-400 font-bold">📸 12 fotos da captação (sala, quartos, cozinha, vista)</p>
              <p className="text-slate-400 italic">
                &quot;Apartamento no Pitangueiras 2, 2 quartos, 1 vaga coberta, armário na cozinha, condomínio 420 reais, IPTU 110, valor 360 mil. Aceita financiamento.&quot;
              </p>
            </div>

            <div className="bg-blue-950/40 border border-blue-800/40 rounded-2xl p-4 text-xs text-blue-300 space-y-1">
              <strong className="text-white block font-bold flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-blue-400" /> O que a Visão Computacional enxerga:
              </strong>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Identifica iluminação natural, piso cerâmico, armários planejados na cozinha, sacada livre e condomínio fechado com piscina.
              </p>
            </div>
          </div>

          {/* Lado Direito: O Que a IA Entrega */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-800/60 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-indigo-800/60 pb-3">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>O Media Kit que você recebe pronto:</span>
              </div>
              <span className="text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded font-bold uppercase">5 Recursos Prontos</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-emerald-400">1. Título Comercial & Portais</span>
                <p className="font-bold text-white text-xs mt-0.5">
                  Apartamento com 2 Quartos para Venda no Condomínio Pitangueiras 2 - 1 Vaga Coberta - Taboão da Serra
                </p>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-purple-400">2. Copy Instagram / Facebook (Com Gancho & Hashtags)</span>
                <p className="text-slate-300 text-[11px] mt-0.5 italic">
                  &quot;Oportunidade no Condomínio Pitangueiras 2! 🌟 58m² com armários planejados e vista livre a 3 min do Shopping Taboão...&quot;
                </p>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-blue-400">3. Roteiro de Vídeo (Stories & Reels)</span>
                <p className="text-slate-300 text-[11px] mt-0.5">
                  <strong>Cena 1 (Living):</strong> &quot;Buscando um 2 dorms pronto para morar no Taboão?&quot; | <em>Texto tela: &quot;2 Dorms • Pitangueiras 2&quot;</em>
                </p>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl">
                <span className="text-[10px] uppercase font-bold text-amber-400">4. Nuvem & Portal</span>
                <p className="text-slate-300 text-[11px] mt-0.5">
                  Fotos salvas em alta resolução por 1 ano + Página no ar com botão direto para o seu WhatsApp particular.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* COFRE DE FOTOS NA NUVEM: BACKUP POR 365 DIAS */}
      <div className="max-w-5xl mx-auto px-4 mt-20">
        <div className="bg-gradient-to-r from-slate-900 via-blue-950/50 to-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2 space-y-4">
              <div className="inline-flex items-center gap-1.5 bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                <HardDrive className="w-3.5 h-3.5 text-blue-400" /> Acervo Digital Permanente
              </div>
              <h3 className="text-2xl font-black text-white">Seu Acervo de Fotos em Alta na Nuvem por 1 Ano</h3>
              <p className="text-slate-300 text-xs leading-relaxed font-normal">
                Corretor não perde mais foto ao trocar de celular ou limpar a memória do WhatsApp. A plataforma armazena as fotos originais em alta resolução no cofre da nuvem por <strong>365 dias</strong>. Baixe o pacote original em formato ZIP ou foto a foto quando quiser com 1 clique.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                <div className="flex items-center gap-2 text-slate-300 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Sem limite de espaço em GB</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Download em alta resolução</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Organizado por código de referência</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Incluso em todos os pacotes</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 text-center space-y-3">
              <HardDrive className="w-12 h-12 text-blue-400 mx-auto" />
              <div className="text-2xl font-black text-white">365 Dias</div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Suas fotos originais preservadas e prontas para reuso mesmo após o imóvel ser alugado ou vendido.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* GUIA DICAS EDUCATIVAS DE ENTRADA DE DADOS */}
      <div className="max-w-5xl mx-auto px-4 mt-16">
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 border border-blue-800/60 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center font-black">
              💡
            </div>
            <div>
              <h3 className="text-xl font-black text-white">Dicas de Envio: &quot;A IA é Inteligente, mas Não é Vidente!&quot;</h3>
              <p className="text-xs text-slate-300">Como mandar os detalhes no WhatsApp para o robô reconhecer tudo com 100% de exatidão</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-1.5">
              <strong className="text-amber-400 font-bold block flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" /> Garagem Coberta vs Descoberta
              </strong>
              <p className="text-slate-300 leading-relaxed">
                Se você enviar apenas &quot;garagem&quot;, a IA gera <em>1 vaga de garagem</em>. Se o imóvel possui cobertura, especifique <strong>&quot;garagem coberta&quot;</strong> no texto do WhatsApp.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-1.5">
              <strong className="text-amber-400 font-bold block flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" /> Grupos de Condomínio (Ex: Cooperativa)
              </strong>
              <p className="text-slate-300 leading-relaxed">
                Em empreendimentos divididos por fases, sempre mencione o grupo específico. Exemplo: <strong>&quot;Parque Firenze Grupo 12&quot;</strong> ou <strong>&quot;Jardim das Artes Grupo 4&quot;</strong>.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-1.5">
              <strong className="text-amber-400 font-bold block flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" /> A Família dos Bosques (Apartamentos)
              </strong>
              <p className="text-slate-300 leading-relaxed">
                Especifique o nome exato (ex: <em>Bosque da Serra</em>, <em>Mirante do Bosque</em>). Se mandar apenas &quot;Bosque&quot;, inclua o nome da rua para a IA identificar o condomínio correto.
              </p>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-1.5">
              <strong className="text-amber-400 font-bold block flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" /> Vias Mistas (Ex: Estrada Kizaemon Takeuti)
              </strong>
              <p className="text-slate-300 leading-relaxed">
                Em avenidas comerciais que possuem tanto casas quanto apartamentos, sempre informe a tipologia (ex: <strong>&quot;Apartamento na Kizaemon Takeuti&quot;</strong> ou <strong>&quot;Sobrado comercial&quot;</strong>).
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
              Preciso pagar para testar a plataforma?
            </h4>
            <p className="text-slate-300 leading-relaxed">
              <strong>Não!</strong> Ao iniciar seu cadastro no WhatsApp, você ganha <strong>1 crédito de cortesia</strong> para processar seu primeiro imóvel completo, receber o Media Kit e testar toda a tecnologia sem pagar nada.
            </p>
          </div>

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
              E se a IA errar algum dado ou valor?
            </h4>
            <p className="text-slate-300 leading-relaxed">
              Você tem controle soberano total (Hierarquia 1)! Antes de qualquer publicação, você confere o resumo no WhatsApp ou no Link Mágico e pode corrigir qualquer dado antes de aprovar. Zero alucinações.
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
            Envie as fotos e texto bruto do seu próximo imóvel no WhatsApp Oficial e receba seu Media Kit completo com 1 crédito grátis de boas-vindas.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold px-8 py-3.5 rounded-xl shadow-lg transition-all text-xs flex items-center gap-2 uppercase tracking-wider"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>Enviar Imóvel no WhatsApp (11) 98916-1897</span>
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

