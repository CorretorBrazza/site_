'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  MessageSquare,
  Copy,
  Check,
  Smartphone,
  Cpu,
  ArrowRight,
  RefreshCw,
  Instagram,
  FileText,
  Video,
  Hash,
} from 'lucide-react';

const PRESETS = [
  {
    id: 'pitangueiras',
    label: '🏢 Apto 2 Dorms - Cond. Pitangueiras 2',
    rawText: 'Apartamento no Condomínio Pitangueiras 2, 58m², 2 dormitórios, 1 banheiro, 1 vaga coberta, armários planejados na cozinha e quartos, sacada com vista livre, condomínio R$ 420, IPTU R$ 110, valor de venda R$ 360.000. Aceita financiamento bancário e FGTS.',
    output: {
      titulo: 'Apartamento com 2 Quartos para Venda no Condomínio Pitangueiras 2 - 58m² - 1 Vaga Coberta - Taboão da Serra',
      portalDesc: 'Excelente apartamento de 58m² úteis no prestigiado Condomínio Residencial Pitangueiras 2, em Taboão da Serra. Composto por 2 dormitórios amplos com armários planejados, living integrado à sacada com vista livre e agradável iluminação natural, cozinha planejada moderna, área de serviço ventilada e 1 vaga de garagem coberta e demarcada.\n\nO condomínio oferece infraestrutura completa de lazer e segurança: piscina adulto e infantil, academia equipada, quadra poliesportiva, salão de festas decorado, churrasqueira e portaria 24 horas.\n\nLocalização privilegiada com fácil acesso à Rodovia Régis Bittencourt, Avenida Francisco Morato, Rodoanel e a apenas 3 minutos do Shopping Taboão.\n\nDocumentação 100% regularizada. Aceita financiamento bancário e uso de FGTS.',
      instagram: '✨ OPORTUNIDADE EM TABOÃO DA SERRA! 🌟\n\nJá se imaginou morando em um 2 dormitórios completo, com armários planejados e vaga coberta no cobiçado Condomínio Pitangueiras 2?\n\n📐 58m² de área privativa\n🛏️ 2 Quartos planejados\n🚗 1 Vaga de garagem coberta\n🏊‍♂️ Lazer clube com piscina, academia e quadra\n📍 A 3 minutos do Shopping Taboão\n\n💰 R$ 360.000 (Aceita Financiamento e FGTS)\nCondomínio: R$ 420 | IPTU: R$ 110/mês\n\n📲 Agende sua visita agora mesmo pelo WhatsApp no link da bio!\n\n#TaboaoDaSerra #Pitangueiras2 #ApartamentoTaboao #ImoveisTaboao #CondominioPitangueiras #CorretorDeImoveis',
      whatsapp: '🏢 *CONDOMÍNIO PITANGUEIRAS 2 — TABOÃO DA SERRA*\n\n• *Área:* 58m² úteis\n• *Dormitórios:* 2 quartos (com planejados)\n• *Garagem:* 1 vaga coberta\n• *Destaques:* Sacada com vista livre, armários planejados na cozinha e dormitórios.\n• *Lazer Completo:* Piscina, Academia, Quadra, Salão de Festas, Portaria 24h.\n\n💵 *Valor de Venda:* R$ 360.000\n🏢 *Condomínio:* R$ 420/mês | 🏛️ *IPTU:* R$ 110/mês\n🏦 *Condições:* Aceita Financiamento & FGTS\n\n📲 *Interessado? Agende uma visita diretamente com o corretor responsável!*',
      roteiro: [
        { cena: 'Cena 1 (Living / Sacada)', fala: 'Procurando um 2 dormitórios pronto para morar no coração de Taboão da Serra?', textoTela: '2 Dorms • 58m² • Pitangueiras 2' },
        { cena: 'Cena 2 (Cozinha Planejada)', fala: 'Olha o acabamento dessa cozinha com armários planejados de altíssima qualidade!', textoTela: 'Cozinha Planejada + Sacada' },
        { cena: 'Cena 3 (Lazer & Fechamento)', fala: 'Condomínio clube a 3 minutos do Shopping Taboão por apenas R$ 360 mil. Me chame no WhatsApp!', textoTela: 'R$ 360.000 • Aceita FGTS' },
      ],
      tags: ['apartamento taboao da serra', 'pitangueiras 2', 'imovel taboao', 'shopping taboao', 'financiamento caixa taboao'],
    },
  },
  {
    id: 'firenze',
    label: '🌳 Apto 3 Dorms - Parque Firenze (Grupo 12)',
    rawText: 'Apartamento no Parque Firenze Grupo 12, 125m², 3 dormitórios sendo 1 suíte, varanda gourmet com churrasqueira, 2 vagas de garagem cobertas, dependência de empregada, condomínio R$ 680, valor R$ 620.000.',
    output: {
      titulo: 'Apartamento de 125m² com 3 Quartos (1 Suíte) e Varanda Gourmet no Parque Firenze Grupo 12 - Taboão da Serra',
      portalDesc: 'Amplo apartamento de 125m² de área útil no renomado Parque Firenze Grupo 12 da Cooperativa Habitacional Vida Nova. Planta inteligente com 3 dormitórios confortáveis sendo 1 suíte master, living para 2 ambientes integrado a uma generosa varanda gourmet com churrasqueira a carvão, cozinha espaçosa com copa, dependência completa de serviço e 2 vagas de garagem cobertas.\n\nCondomínio com segurança 24 horas, salão de festas, quadra, playground e ampla área verde preservada.\n\nLocalização com acesso rápido à Rodovia Régis Bittencourt e centro de Taboão e Embu.',
      instagram: '🔥 PLANTA RARA DE 125m² NO PARQUE FIRENZE! 🏡\n\nEspaço de sobra para toda a sua família no Grupo 12! Varanda gourmet espaçosa com churrasqueira e vista panorâmica incrível.\n\n📐 125m² úteis\n🛏️ 3 Dormitórios (1 Suíte Master)\n🥩 Varanda Gourmet com Churrasqueira\n🚗 2 Vagas de garagem cobertas\n\n💰 R$ 620.000\n\n👉 Clique no link da bio para agendar sua visita exclusiva!\n\n#ParqueFirenze #CooperativaVidaNova #TaboaoDaSerra #ApartamentoGrande #VarandaGourmet',
      whatsapp: '🌳 *PARQUE FIRENZE GRUPO 12 — 125m² COM VARANDA GOURMET*\n\n• *Área Útil:* 125m²\n• *Dormitórios:* 3 dormitórios (1 Suíte)\n• *Vagas:* 2 vagas cobertas\n• *Destaques:* Varanda gourmet com churrasqueira, dependência de empregada.\n• *Condomínio:* R$ 680/mês\n\n💵 *Valor:* R$ 620.000\n\n📲 *Chame no WhatsApp para detalhes e visitas!*',
      roteiro: [
        { cena: 'Cena 1 (Varanda Gourmet)', fala: 'Se você precisa de espaço, olha o tamanho dessa varanda gourmet no Parque Firenze Grupo 12!', textoTela: '125m² • Varanda Gourmet' },
        { cena: 'Cena 2 (Suíte Master)', fala: 'São 3 dormitórios com 1 suíte espaçosa e 2 vagas cobertas de garagem.', textoTela: '3 Dorms (1 Suíte) + 2 Vagas' },
        { cena: 'Cena 3 (Fechamento)', fala: 'Oportunidade única por R$ 620 mil. Me mande uma mensagem no WhatsApp agora!', textoTela: 'R$ 620.000 • Agende sua Visita' },
      ],
      tags: ['parque firenze', 'grupo 12 firenze', 'cooperativa vida nova', 'apartamento 125m taboao'],
    },
  },
  {
    id: 'casa',
    label: '🏡 Sobrado 3 Dorms - Jardim Maria Rosa',
    rawText: 'Sobrado no Jardim Maria Rosa, 3 quartos sendo 1 suite, sala 2 ambientes, quintal com churrasqueira, 2 vagas cobertas com portão automático, lavabo, valor R$ 580.000, iptu 180.',
    output: {
      titulo: 'Sobrado Residencial com 3 Quartos (1 Suíte) e Quintal com Churrasqueira no Jardim Maria Rosa - Taboão da Serra',
      portalDesc: 'Excelente sobrado residencial localizado no tradicional e valorizado bairro Jardim Maria Rosa, em Taboão da Serra. Imóvel com 160m² de área construída, 3 dormitórios confortáveis sendo 1 suíte, sala de estar e jantar com lavabo, cozinha arejada com armários, quintal privativo nos fundos com espaço gourmet e churrasqueira coberta, área de serviço independente e garagem coberta para 2 veículos com portão automático.\n\nBairro residencial tranquilo com completa infraestrutura de comércios, escolas, padarias e transporte público.',
      instagram: '🏡 SEU SOBRADO DOS SONHOS NO JD. MARIA ROSA! ✨\n\nPara quem busca a privacidade e o conforto de uma casa completa com quintal e churrasqueira em uma das melhores localizações de Taboão da Serra!\n\n🛏️ 3 Quartos (1 Suíte)\n🥩 Quintal privativo com Churrasqueira\n🚗 Garagem coberta para 2 carros (Portão Automático)\n📐 160m² de área construída\n\n💰 R$ 580.000 (Aceita Financiamento Bancário)\n\n📲 Me chame no WhatsApp para agendar sua visita!\n\n#JardimMariaRosa #SobradoTaboao #CasaTaboao #TaboaoDaSerra #ImoveisTaboao',
      whatsapp: '🏡 *SOBRADO NO JARDIM MARIA ROSA — TABOÃO DA SERRA*\n\n• *Área Construída:* 160m²\n• *Dormitórios:* 3 quartos (1 Suíte)\n• *Vagas:* 2 vagas cobertas (portão automático)\n• *Lazer Privativo:* Quintal com churrasqueira coberta\n• *IPTU:* R$ 180/mês\n\n💵 *Valor:* R$ 580.000 (Aceita Financiamento)\n\n📲 *Agende sua visita agora mesmo pelo WhatsApp!*',
      roteiro: [
        { cena: 'Cena 1 (Fachada / Garagem)', fala: 'Cansado de condomínio fechado? Conheça esse sobrado incrível no Jardim Maria Rosa!', textoTela: 'Sobrado no Jd. Maria Rosa' },
        { cena: 'Cena 2 (Quintal Gourmet)', fala: 'Quintal privativo com churrasqueira para receber os amigos nos finais de semana.', textoTela: 'Quintal + Espaço Gourmet' },
        { cena: 'Cena 3 (Fechamento)', fala: '3 quartos sendo 1 suíte por R$ 580 mil. Chame no WhatsApp para visitar!', textoTela: 'R$ 580.000 • Aceita Financiamento' },
      ],
      tags: ['sobrado jardim maria rosa', 'casa taboao da serra', 'sobrado com churrasqueira taboao'],
    },
  },
];

export default function DemoPage() {
  const [selectedPreset, setSelectedPreset] = useState(PRESETS[0]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeTab, setActiveTab] = useState<'instagram' | 'whatsapp' | 'portal' | 'roteiro' | 'tags'>('instagram');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleSelectPreset = (preset: typeof PRESETS[0]) => {
    setSelectedPreset(preset);
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 450);
  };

  const handleSimulate = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 600);
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const output = selectedPreset.output;

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 pb-20">
      {/* Header / Hero */}
      <div className="bg-gradient-to-b from-slate-950 via-blue-950/60 to-slate-950 text-white pt-14 pb-12 px-4 text-center relative overflow-hidden border-b border-slate-800">
        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <span className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Simulador Interativo de IA (Sem Login Necessário)
          </span>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Veja a IA Criar um <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">Media Kit Completo</span> em Segundos
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Selecione uma captação de exemplo abaixo para ver o que o corretor enviou e o conteúdo completo de 5 canais que nosso robô gera instantaneamente.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-8 space-y-8">
        {/* Seletor de Exemplos */}
        <div className="space-y-3">
          <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400">
            1. Escolha uma Captação de Exemplo para Simular:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className={`p-4 rounded-2xl border text-left transition-all text-xs font-bold ${
                  selectedPreset.id === preset.id
                    ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-600/10'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input Box / Preview do Texto do WhatsApp (Apenas Visualização) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>O que o corretor mandou no WhatsApp (Texto Bruto):</span>
            </div>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-2.5 py-0.5 rounded font-mono">
              Exemplo Real
            </span>
          </div>

          <div className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-5 text-xs sm:text-sm text-slate-200 font-mono leading-relaxed select-text shadow-inner">
            {selectedPreset.rawText}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-blue-400" />
              Extração Visual + RAG Regional (Taboão da Serra & Região)
            </span>

            <button
              onClick={handleSimulate}
              disabled={isSimulating}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {isSimulating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>{isSimulating ? 'Gerando Media Kit...' : '🚀 Simular Media Kit Deste Imóvel'}</span>
            </button>
          </div>
        </div>

        {/* Resultado: Media Kit Multi-Canal */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-black text-amber-400 uppercase tracking-wider mb-1">
                <Sparkles className="w-4 h-4" /> Resultado Instantâneo do Robô
              </div>
              <h3 className="text-xl font-black text-white">
                Media Kit Profissional Pronto para 5 Canais
              </h3>
            </div>

            {/* Abas de Navegação de Canais */}
            <div className="flex flex-wrap gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveTab('instagram')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'instagram' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Instagram className="w-3.5 h-3.5" />
                <span>Instagram Feed</span>
              </button>
              <button
                onClick={() => setActiveTab('whatsapp')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'whatsapp' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>
              <button
                onClick={() => setActiveTab('portal')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'portal' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Portais</span>
              </button>
              <button
                onClick={() => setActiveTab('roteiro')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'roteiro' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Stories/Reels</span>
              </button>
              <button
                onClick={() => setActiveTab('tags')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'tags' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Hash className="w-3.5 h-3.5" />
                <span>SEO Tags</span>
              </button>
            </div>
          </div>

          {/* Conteúdo Aba Instagram */}
          {activeTab === 'instagram' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400 font-bold">Copy com gancho, emojis, preço e hashtags locais:</span>
                <button
                  onClick={() => handleCopy(output.instagram, 'insta')}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold transition-colors"
                >
                  {copiedKey === 'insta' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'insta' ? 'Copiado!' : 'Copiar Legenda'}</span>
                </button>
              </div>
              <pre className="bg-slate-950 border border-slate-800 rounded-2xl p-5 text-xs text-slate-300 font-sans whitespace-pre-wrap leading-relaxed">
                {output.instagram}
              </pre>
            </div>
          )}

          {/* Conteúdo Aba WhatsApp */}
          {activeTab === 'whatsapp' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400 font-bold">Texto estruturado com marcadores para envio a clientes:</span>
                <button
                  onClick={() => handleCopy(output.whatsapp, 'wa')}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold transition-colors"
                >
                  {copiedKey === 'wa' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'wa' ? 'Copiado!' : 'Copiar Texto WhatsApp'}</span>
                </button>
              </div>
              <pre className="bg-slate-950 border border-slate-800 rounded-2xl p-5 text-xs text-emerald-300 font-mono whitespace-pre-wrap leading-relaxed">
                {output.whatsapp}
              </pre>
            </div>
          )}

          {/* Conteúdo Aba Portais */}
          {activeTab === 'portal' && (
            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <span className="font-bold text-slate-400 uppercase text-[10px]">Título Comercial Otimizado:</span>
                <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl font-bold text-white text-sm">
                  {output.titulo}
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="font-bold text-slate-400 uppercase text-[10px]">Descrição Enriquecida para Portais (Sem Alucinações):</span>
                <pre className="bg-slate-950 border border-slate-800 rounded-2xl p-5 text-slate-300 font-sans whitespace-pre-wrap leading-relaxed">
                  {output.portalDesc}
                </pre>
              </div>
            </div>
          )}

          {/* Conteúdo Aba Roteiro */}
          {activeTab === 'roteiro' && (
            <div className="space-y-3">
              <span className="text-xs text-slate-400 font-bold block">Roteiro de Teleprompter para Gravação de Stories ou Reels:</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {output.roteiro.map((cena, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2">
                    <span className="text-[11px] font-black text-amber-400 uppercase block">{cena.cena}</span>
                    <p className="text-xs text-slate-200 leading-relaxed italic">&quot;{cena.fala}&quot;</p>
                    <div className="text-[10px] bg-slate-900 border border-slate-800 p-2 rounded-lg text-slate-400">
                      <strong>Texto na tela:</strong> {cena.textoTela}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Conteúdo Aba Tags */}
          {activeTab === 'tags' && (
            <div className="space-y-3">
              <span className="text-xs text-slate-400 font-bold block">Palavras-chave regionais para rankear no Google:</span>
              <div className="flex flex-wrap gap-2">
                {output.tags.map((tag, idx) => (
                  <span key={idx} className="bg-slate-950 border border-slate-800 text-blue-300 text-xs px-3 py-1.5 rounded-xl font-mono">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Big CTA Lead Magnet */}
        <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 border-2 border-blue-500/50 rounded-3xl p-8 sm:p-10 text-center shadow-2xl space-y-5">
          <span className="inline-flex items-center gap-2 bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider">
            🎁 1 Crédito Grátis Liberado para Novos Corretores
          </span>

          <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight max-w-2xl mx-auto">
            Quer Gerar o Media Kit do Seu Imóvel Real Agora?
          </h3>

          <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Basta enviar as fotos e o texto do seu imóvel pelo WhatsApp oficial. Não precisa de cartão nem mensalidade para começar.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <a
              href="https://wa.me/5511989161897?text=Ol%C3%A1%2C%20quero%20testar%20meu%20cr%C3%A9dito%20gr%C3%A1tis%20de%20Media%20Kit"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl shadow-xl transition-all text-xs uppercase tracking-wider flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>Enviar Imóvel no WhatsApp (11) 98916-1897</span>
            </a>

            <Link
              href="/planos"
              className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl border border-slate-700 transition-all text-xs flex items-center gap-2"
            >
              <span>Ver Pacotes de Créditos</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
