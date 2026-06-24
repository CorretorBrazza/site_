'use client';

import React, { useState, useEffect, useRef } from 'react';

const TABELA_MCMV_2026 = [
    { renda: 1500, financiamento: 86551.61, parcela: 449.99, subsidio_com: 55000.00, subsidio_sem: 16500.00 },
    { renda: 1600, financiamento: 92583.50, parcela: 479.99, subsidio_com: 55000.00, subsidio_sem: 16500.00 },
    { renda: 1700, financiamento: 98615.39, parcela: 509.99, subsidio_com: 55000.00, subsidio_sem: 16500.00 },
    { renda: 1800, financiamento: 104647.29, parcela: 539.99, subsidio_com: 55000.00, subsidio_sem: 16500.00 },
    { renda: 1900, financiamento: 110679.18, parcela: 569.99, subsidio_com: 55000.00, subsidio_sem: 16500.00 },
    { renda: 2000, financiamento: 116711.07, parcela: 599.99, subsidio_com: 50777.00, subsidio_sem: 15233.00 },
    { renda: 2100, financiamento: 122742.96, parcela: 629.99, subsidio_com: 44812.00, subsidio_sem: 13443.00 },
    { renda: 2200, financiamento: 124802.43, parcela: 659.99, subsidio_com: 39562.00, subsidio_sem: 11868.00 },
    { renda: 2300, financiamento: 130648.25, parcela: 689.99, subsidio_com: 34440.00, subsidio_sem: 10332.00 },
    { renda: 2400, financiamento: 136494.07, parcela: 719.99, subsidio_com: 29735.00, subsidio_sem: 8920.00 },
    { renda: 2500, financiamento: 142339.89, parcela: 749.99, subsidio_com: 25438.00, subsidio_sem: 7631.00 },
    { renda: 2600, financiamento: 148185.72, parcela: 779.99, subsidio_com: 21538.00, subsidio_sem: 6461.00 },
    { renda: 2700, financiamento: 154031.54, parcela: 809.99, subsidio_com: 18026.00, subsidio_sem: 5407.00 },
    { renda: 2800, financiamento: 159877.36, parcela: 839.99, subsidio_com: 14893.00, subsidio_sem: 4467.00 },
    { renda: 2900, financiamento: 151319.11, parcela: 869.99, subsidio_com: 12351.00, subsidio_sem: 3705.00 },
    { renda: 3000, financiamento: 156818.49, parcela: 899.99, subsidio_com: 9909.00, subsidio_sem: 2972.00 },
    { renda: 3100, financiamento: 162317.87, parcela: 929.99, subsidio_com: 7819.00, subsidio_sem: 2345.00 },
    { renda: 3200, financiamento: 167817.25, parcela: 959.99, subsidio_com: 6072.00, subsidio_sem: 1821.00 },
    { renda: 3300, financiamento: 173316.63, parcela: 989.99, subsidio_com: 4659.00, subsidio_sem: 0 },
    { renda: 3400, financiamento: 178816.02, parcela: 1019.99, subsidio_com: 3571.00, subsidio_sem: 0 },
    { renda: 3500, financiamento: 184315.40, parcela: 1049.99, subsidio_com: 2799.00, subsidio_sem: 0 },
    { renda: 3600, financiamento: 178933.54, parcela: 1079.99, subsidio_com: 2384.00, subsidio_sem: 0 },
    { renda: 3700, financiamento: 184117.67, parcela: 1109.99, subsidio_com: 2214.00, subsidio_sem: 0 },
    { renda: 3800, financiamento: 189301.79, parcela: 1139.99, subsidio_com: 2192.00, subsidio_sem: 0 },
    { renda: 3900, financiamento: 194485.92, parcela: 1169.99, subsidio_com: 2171.00, subsidio_sem: 0 },
    { renda: 4000, financiamento: 199670.04, parcela: 1199.99, subsidio_com: 2149.00, subsidio_sem: 0 },
    { renda: 4100, financiamento: 183124.89, parcela: 1229.99, subsidio_com: 0, subsidio_sem: 0 },
    { renda: 4200, financiamento: 187759.13, parcela: 1259.99, subsidio_com: 0, subsidio_sem: 0 },
    { renda: 4300, financiamento: 192393.36, parcela: 1289.99, subsidio_com: 0, subsidio_sem: 0 },
    { renda: 4400, financiamento: 197027.60, parcela: 1319.99, subsidio_com: 0, subsidio_sem: 0 },
    { renda: 4500, financiamento: 201661.83, parcela: 1349.99, subsidio_com: 0, subsidio_sem: 0 },
    { renda: 4600, financiamento: 206296.07, parcela: 1379.99, subsidio_com: 0, subsidio_sem: 0 },
    { renda: 4700, financiamento: 210930.30, parcela: 1409.99, subsidio_com: 0, subsidio_sem: 0 },
    { renda: 4800, financiamento: 186671.14, parcela: 1439.99, subsidio_com: 0, subsidio_sem: 0 },
    { renda: 4863, financiamento: 189250.60, parcela: 1458.89, subsidio_com: 0, subsidio_sem: 0 },
    { renda: 4900, financiamento: 190765.52, parcela: 1469.99, subsidio_com: 0, subsidio_sem: 0 },
    { renda: 5000, financiamento: 194859.91, parcela: 1499.99, subsidio_com: 0, subsidio_sem: 0 },
    { renda: 5100, financiamento: 198954.29, parcela: 1529.99, subsidio_com: 0, subsidio_sem: 0 },
    { renda: 5200, financiamento: 203048.67, parcela: 1559.99, subsidio_com: 0, subsidio_sem: 0 },
    { renda: 5300, financiamento: 207143.06, parcela: 1589.99, subsidio_com: 0, subsidio_sem: 0 },
    { renda: 5400, financiamento: 211237.44, parcela: 1619.99, subsidio_com: 0, subsidio_sem: 0 },
    { renda: 5500, financiamento: 215331.82, parcela: 1649.99, subsidio_com: 0, subsidio_sem: 0 },
    { renda: 5600, financiamento: 219426.21, parcela: 1679.99, subsidio_com: 0, subsidio_sem: 0 },
    { renda: 5700, financiamento: 223520.59, parcela: 1709.99, subsidio_com: 0, subsidio_sem: 0 },
    { renda: 5800, financiamento: 227614.98, parcela: 1739.99, subsidio_com: 0, subsidio_sem: 0 },
    { renda: 5900, financiamento: 231709.36, parcela: 1769.99, subsidio_com: 0, subsidio_sem: 0 },
    { renda: 6000, financiamento: 235803.74, parcela: 1799.99, subsidio_com: 0, subsidio_sem: 0 },
    { renda: 6100, financiamento: 239898.13, parcela: 1829.99, subsidio_com: 0, subsidio_sem: 0 },
    { renda: 6200, financiamento: 243992.51, parcela: 1859.99, subsidio_com: 0, subsidio_sem: 0 },
    { renda: 6300, financiamento: 248086.89, parcela: 1889.99, subsidio_com: 0, subsidio_sem: 0 },
    { renda: 6400, financiamento: 252181.28, parcela: 1919.99, subsidio_com: 0, subsidio_sem: 0 },
    { renda: 6500, financiamento: 256275.66, parcela: 1949.99, subsidio_com: 0, subsidio_sem: 0 },
    { renda: 6600, financiamento: 260370.05, parcela: 1979.99, subsidio_com: 0, subsidio_sem: 0 },
    { renda: 6700, financiamento: 264464.43, parcela: 2009.99, subsidio_com: 0, subsidio_sem: 0 },
    { renda: 6800, financiamento: 268558.81, parcela: 2039.99, subsidio_com: 0, subsidio_sem: 0 },
    { renda: 6900, financiamento: 272653.20, parcela: 2069.99, subsidio_com: 0, subsidio_sem: 0 },
    { renda: 7000, financiamento: 276747.58, parcela: 2099.99, subsidio_com: 0, subsidio_sem: 0 },
    { renda: 7100, financiamento: 280000.00, parcela: 2123.83, subsidio_com: 0, subsidio_sem: 0 },
    { renda: 8700, financiamento: 293662.97, parcela: 2609.99, subsidio_com: 0, subsidio_sem: 0 },
    { renda: 10000, financiamento: 338584.94, parcela: 2999.99, subsidio_com: 0, subsidio_sem: 0 },
    { renda: 12000, financiamento: 400000.00, parcela: 3533.18, subsidio_com: 0, subsidio_sem: 0 },
    { renda: 15000, financiamento: 384334.74, parcela: 3749.99, subsidio_com: 0, subsidio_sem: 0 },
    { renda: 16210, financiamento: 415966.15, parcela: 4052.49, subsidio_com: 0, subsidio_sem: 0 }
];

interface Message {
    type: 'bot' | 'user';
    content: string;
    isHtml?: boolean;
}

interface Variables {
    nome?: string;
    renda?: number;
    dependentes?: boolean;
    telefone?: string;
    consentimento?: boolean;
}

export default function SimuladorClient() {
    const [isChatActive, setIsChatActive] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [step, setStep] = useState(0);
    const [variables, setVariables] = useState<Variables>({});
    const [inputValue, setInputValue] = useState('');
    const [inputType, setInputType] = useState<'text' | 'number' | 'tel' | 'choices' | 'actions' | 'none'>('none');
    const [inputPlaceholder, setInputPlaceholder] = useState('');
    const [choices, setChoices] = useState<Array<{ label: string; value: any; emoji: string }>>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [dadosAutomaticos, setDadosAutomaticos] = useState<any>({});

    const chatAreaRef = useRef<HTMLDivElement>(null);
    const totalSteps = 8;

    // Referência mutável para as variáveis para evitar stale closures nos temporizadores
    const variablesRef = useRef(variables);
    useEffect(() => {
        variablesRef.current = variables;
    }, [variables]);

    // Detectar dispositivo e origem no cliente
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setDadosAutomaticos({
                dispositivo: /android/i.test(navigator.userAgent) ? 'Android' : /iPad|iPhone|iPod/.test(navigator.userAgent) ? 'iOS' : 'Desktop',
                origem: new URLSearchParams(window.location.search).get('utm_source') || 'Orgânico/Direto',
                dataSimulacao: new Date().toLocaleString('pt-BR')
            });
        }
    }, []);

    // Rolar chat para baixo quando novas mensagens forem adicionadas
    useEffect(() => {
        if (chatAreaRef.current) {
            chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    // Lógica principal do fluxo do Chatbot
    useEffect(() => {
        if (!isChatActive) return;

        if (step === 1) {
            // Boas-vindas
            setIsTyping(true);
            const timer = setTimeout(() => {
                setIsTyping(false);
                setMessages([
                    {
                        type: 'bot',
                        content: `🏠 Olá! Seja bem-vindo ao <strong>Simulador de Financiamento</strong>!<br><br>Vou te ajudar a descobrir uma estimativa do seu financiamento habitacional com base nas regras do programa <strong>Minha Casa Minha Vida</strong>.<br><br><div style="background: rgba(0,0,0,0.05); padding: 8px; border-radius: 6px; font-size: 12px; color: #555;"><em>Nota: Esta é uma simulação independente e não possui vínculo oficial com a Caixa Econômica Federal.</em></div><br>São apenas 4 perguntas rápidas! Vamos começar? 😊`,
                        isHtml: true
                    }
                ]);
                setStep(2);
            }, 1200);
            return () => clearTimeout(timer);
        }

        if (step === 2) {
            // Pergunta do Nome
            const timer = setTimeout(() => {
                setMessages(prev => [...prev, { type: 'bot', content: '📝 Qual o seu nome completo?' }]);
                setInputType('text');
                setInputPlaceholder('Digite seu nome...');
            }, 1000);
            return () => clearTimeout(timer);
        }

        if (step === 3) {
            // Pergunta da Renda
            const timer = setTimeout(() => {
                setMessages(prev => [...prev, { type: 'bot', content: '💰 Qual sua <strong>renda bruta mensal</strong>? (Ex: 3500)', isHtml: true }]);
                setInputType('number');
                setInputPlaceholder('Digite sua renda...');
            }, 500);
            return () => clearTimeout(timer);
        }

        if (step === 4) {
            // Pergunta de Dependentes
            const timer = setTimeout(() => {
                setMessages(prev => [...prev, { type: 'bot', content: '👨👩👧👦 Você tem filhos menores de 18 anos ou dependentes?' }]);
                setInputType('choices');
                setChoices([
                    { label: 'Sim', value: true, emoji: '✅' },
                    { label: 'Não', value: false, emoji: '❌' }
                ]);
            }, 500);
            return () => clearTimeout(timer);
        }

        if (step === 5) {
            // Resultado
            setIsTyping(true);
            const timer = setTimeout(() => {
                setIsTyping(false);

                const rendaUsuario = variablesRef.current.renda || 0;
                let d = TABELA_MCMV_2026.find(f => f.renda >= rendaUsuario) || TABELA_MCMV_2026[TABELA_MCMV_2026.length - 1];
                const subsidio = variablesRef.current.dependentes ? d.subsidio_com : d.subsidio_sem;
                const total = d.financiamento + subsidio;
                const formatar = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

                const htmlResultado = `
                    <div class="result-card">
                        <div style="text-align:center;margin-bottom:12px; font-weight:700; color:var(--primary);">RESULTADO ESTIMADO</div>
                        <div style="font-size:12px; color:#666;">🏦 Financiamento</div>
                        <div class="value">${formatar(d.financiamento)}</div>
                        <div style="margin-top:10px;">
                            <div style="font-size:12px; color:#666;">📅 Parcela Estimada</div>
                            <div class="value">${formatar(d.parcela)}</div>
                        </div>
                        <div style="margin-top:10px;">
                            <div style="font-size:12px; color:#666;">🎁 Subsídio</div>
                            <div class="value" style="color:#00c853;">${formatar(subsidio)}</div>
                        </div>
                        <div class="result-total">
                            <div style="font-size:11px; opacity:0.8;">VALOR TOTAL LIBERADO</div>
                            <div style="font-size:22px; font-weight:800;">${formatar(total)}</div>
                        </div>
                    </div>
                `;

                setMessages(prev => [...prev, { type: 'bot', content: htmlResultado, isHtml: true }]);
                setVariables(prev => ({ ...prev, resultado: { total } }));
                setStep(6);
            }, 1200);
            return () => clearTimeout(timer);
        }

        if (step === 6) {
            // Pergunta do Celular
            const timer = setTimeout(() => {
                setMessages(prev => [...prev, { type: 'bot', content: '📱 Para falar com um especialista, informe seu WhatsApp com DDD:' }]);
                setInputType('tel');
                setInputPlaceholder('(11) 99999-9999');
            }, 1500);
            return () => clearTimeout(timer);
        }

        if (step === 7) {
            // Privacidade (LGPD)
            const timer = setTimeout(() => {
                setMessages(prev => [
                    ...prev,
                    {
                        type: 'bot',
                        content: `🔒 <strong>Privacidade (LGPD)</strong><br><br>Você aceita que um especialista entre em contato para apresentar as melhores opções de imóveis em Taboão da Serra?`,
                        isHtml: true
                    }
                ]);
                setInputType('choices');
                setChoices([
                    { label: 'Sim, aceito', value: true, emoji: '✅' },
                    { label: 'Não aceito', value: false, emoji: '❌' }
                ]);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isChatActive, step]);

    const iniciarSimulacao = () => {
        if (typeof window !== 'undefined' && (window as any).dataLayer) {
            (window as any).dataLayer.push({ 'event': 'iniciou_simulacao' });
        }
        setIsChatActive(true);
        setStep(1);
    };

    const handleTextSubmit = () => {
        if (!inputValue.trim()) return;

        const val = inputValue.trim();
        setInputValue('');

        if (step === 2) {
            // Resposta do Nome
            setVariables(prev => ({ ...prev, nome: val }));
            setMessages(prev => [...prev, { type: 'user', content: val }]);
            setInputType('none');
            setStep(3);
        } else if (step === 3) {
            // Resposta da Renda
            const num = parseFloat(val.replace(/\D/g, '')) || 0;
            setVariables(prev => ({ ...prev, renda: num }));
            setMessages(prev => [...prev, { type: 'user', content: `R$ ${num.toLocaleString('pt-BR')}` }]);
            setInputType('none');
            setStep(4);
        } else if (step === 6) {
            // Resposta do WhatsApp
            setVariables(prev => ({ ...prev, telefone: val }));
            setMessages(prev => [...prev, { type: 'user', content: val }]);
            setInputType('none');
            setStep(7);
        }
    };

    const handleChoiceClick = (value: any, label: string) => {
        if (step === 4) {
            // Resposta de Dependentes
            setVariables(prev => ({ ...prev, dependentes: value }));
            setMessages(prev => [...prev, { type: 'user', content: label }]);
            setInputType('none');
            setStep(5);
        } else if (step === 7) {
            // Resposta do Consentimento
            setVariables(prev => ({ ...prev, consentimento: value }));
            setMessages(prev => [...prev, { type: 'user', content: label }]);
            setInputType('none');
            finalizarSimulacao(value);
        }
    };

    const finalizarSimulacao = (aceitou: boolean) => {
        const lead = { ...variables, consentimento: aceitou, ...dadosAutomaticos };

        if (aceitou) {
            // Enviar Lead com consentimento diretamente para o e-mail real
            fetch('https://formsubmit.co/ajax/corretorbrazza@gmail.com', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ _subject: `Novo Lead: ${lead.nome}`, ...lead })
            });

            if (typeof window !== 'undefined' && (window as any).dataLayer) {
                (window as any).dataLayer.push({ 'event': 'lead_consentido', 'lead_data': lead });
            }

            setIsTyping(true);
            setTimeout(() => {
                setIsTyping(false);
                setMessages(prev => [
                    ...prev,
                    {
                        type: 'bot',
                        content: `🎉 <strong>Tudo certo, ${variables.nome}!</strong><br><br>Seus dados foram enviados. Clique no botão abaixo para falar agora mesmo com o corretor pelo WhatsApp!`,
                        isHtml: true
                    }
                ]);
                setInputType('actions');
            }, 1200);
        } else {
            // Enviar dados anônimos
            if (typeof window !== 'undefined' && (window as any).dataLayer) {
                (window as any).dataLayer.push({ 'event': 'simulacao_anonima', 'dados': { renda: variables.renda } });
            }

            setIsTyping(true);
            setTimeout(() => {
                setIsTyping(false);
                setMessages(prev => [
                    ...prev,
                    {
                        type: 'bot',
                        content: `Entendemos seu desejo de privacidade! 🛡️<br>Seus dados de contato não foram salvos.<br><br>Que tal avaliar nossa empresa no Google? Sua opinião é muito importante!`,
                        isHtml: true
                    }
                ]);
                setInputType('actions');
            }, 1200);
        }
    };

    // Calcular percentual de progresso
    const percentualProgresso = isChatActive ? Math.min((step / totalSteps) * 100, 100) : 0;

    return (
        <div className="fixed inset-0 z-[9999] bg-[#f5f7fa] overflow-y-auto antialiased">
            {/* CSS Global Isolado para a Landing Page e Simulador */}
            <style dangerouslySetInnerHTML={{ __html: `
                :root {
                    --primary: #0033a0;
                    --primary-light: #0055ff;
                    --secondary: #00c853;
                    --text-main: #1a2332;
                    --text-muted: #6b7a8f;
                    --bg-light: #f5f7fa;
                    --white: #ffffff;
                }
                .lp-container { max-width: 600px; margin: 0 auto; background: var(--white); min-height: 100vh; display: flex; flex-direction: column; box-shadow: 0 4px 30px rgba(0,0,0,0.05); }
                .hero {
                    position: relative; padding: 60px 24px; text-align: center;
                    background: linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.65)), url('/images/simulado/dor-aluguel.png');
                    background-size: cover; background-position: center; color: var(--white);
                }
                .hero h1 { font-size: 28px; font-weight: 800; margin-bottom: 16px; line-height: 1.2; font-family: 'Inter', sans-serif; }
                .hero p { font-size: 16px; opacity: 0.9; font-family: 'Inter', sans-serif; }
                .section { padding: 32px 24px; }
                .section-title { font-size: 22px; font-weight: 700; margin-bottom: 20px; color: var(--primary); font-family: 'Inter', sans-serif; }
                .benefit-item { display: flex; gap: 16px; margin-bottom: 20px; align-items: flex-start; }
                .benefit-icon { font-size: 24px; flex-shrink: 0; }
                .benefit-text h3 { font-size: 16px; font-weight: 700; margin-bottom: 4px; font-family: 'Inter', sans-serif; }
                .benefit-text p { font-size: 14px; color: var(--text-muted); font-family: 'Inter', sans-serif; }
                .cta-box { padding: 32px 24px; background: #f0f4f8; text-align: center; border-radius: 24px 24px 0 0; margin-top: auto; }
                .btn-main {
                    display: block; width: 100%; padding: 18px;
                    background: linear-gradient(135deg, var(--primary), var(--primary-light));
                    color: var(--white); text-decoration: none; border-radius: 16px;
                    font-weight: 700; font-size: 18px; margin-bottom: 16px;
                    box-shadow: 0 8px 20px rgba(0, 51, 160, 0.3); transition: transform 0.2s;
                    border: none; cursor: pointer; font-family: 'Inter', sans-serif;
                    text-align: center;
                }
                .btn-main:active { transform: scale(0.98); }
                .btn-sub { color: var(--text-muted); text-decoration: underline; font-size: 14px; background: none; border: none; cursor: pointer; font-family: 'Inter', sans-serif; display: inline-block; }

                /* ChatBot Styles */
                .chat-container { display: flex; position: fixed; top: 0; left: 0; width: 100%; height: 100dvh; background: var(--white); z-index: 1000; flex-direction: column; }
                .chat-header { background: var(--primary); padding: 16px 20px; color: var(--white); }
                .header-logos { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
                .logos-group { display: flex; align-items: center; gap: 10px; background: white; padding: 4px 10px; border-radius: 6px; }
                .logos-group img { height: 18px; }
                .chat-area { flex: 1; overflow-y: auto; padding: 20px; background: #f8faff; }
                .input-area { padding: 16px 20px 24px; background: var(--white); border-top: 1px solid #e8edf5; }

                /* Messages */
                .message { margin-bottom: 16px; display: flex; flex-direction: column; animation: slideUp 0.3s ease; }
                .message.bot { align-items: flex-start; }
                .message.user { align-items: flex-end; }
                .bubble { padding: 12px 16px; border-radius: 18px; max-width: 85%; font-size: 15px; font-family: 'Inter', sans-serif; }
                .bot .bubble { background: var(--white); color: var(--text-main); border-bottom-left-radius: 4px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
                .user .bubble { background: var(--primary); color: var(--white); border-bottom-right-radius: 4px; }

                /* Result Card */
                .result-card { background: var(--white); border: 2px solid var(--primary); border-radius: 16px; padding: 20px; width: 100%; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
                .result-card .value { font-size: 24px; font-weight: 800; color: var(--primary); font-family: 'Inter', sans-serif; }
                .result-total { background: var(--primary); color: white; padding: 12px; border-radius: 10px; text-align: center; margin-top: 12px; font-family: 'Inter', sans-serif; }

                /* Form Styles */
                .input-group { display: flex; gap: 10px; }
                .input-group input { flex: 1; padding: 14px; border: 2px solid #e0e8f0; border-radius: 12px; outline: none; font-family: 'Inter', sans-serif; font-size: 15px; }
                .input-group button { padding: 14px 20px; background: var(--primary); color: white; border: none; border-radius: 12px; font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif; }
                .choices { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
                .choice-btn { padding: 12px; border: 2px solid #e0e8f0; border-radius: 12px; background: white; font-weight: 600; cursor: pointer; font-family: 'Inter', sans-serif; font-size: 14px; display: flex; align-items: center; justify-content: center; gap: 6px; }
                .choice-btn:active { background: #f0f4f8; }
                .disclaimer { font-size: 10px; color: var(--text-muted); text-align: center; padding: 10px; background: #f8faff; font-family: 'Inter', sans-serif; }

                /* Typing Indicator */
                .typing-indicator { display: flex; gap: 4px; padding: 8px 0; }
                .typing-indicator span { width: 8px; height: 8px; background: #6b7a8f; border-radius: 50%; animation: typing 1.4s infinite both; }
                .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
                .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
                @keyframes typing { 0%, 60%, 100% { transform: translateY(0); opacity: 0.4; } 30% { transform: translateY(-8px); opacity: 1; } }
                @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            ` }} />

            {!isChatActive ? (
                /* Landing Page UI */
                <div id="landingPage" className="lp-container">
                    <section className="hero">
                        <h1>Cansado de pagar aluguel ou morar de favor?</h1>
                        <p>Chegou a hora de ter um lugar só seu, com a sua cara e a sua liberdade. Imagine a segurança de ter as chaves da sua própria casa.</p>
                    </section>

                    <section className="section">
                        <h2 className="section-title">Seu futuro começa agora:</h2>
                        <div className="benefit-item">
                            <div className="benefit-icon">💰</div>
                            <div className="benefit-item-content benefit-text">
                                <h3>Onde está indo o seu dinheiro?</h3>
                                <p>O valor do seu aluguel poderia ser o investimento no seu próprio lar.</p>
                            </div>
                        </div>
                        <div className="benefit-item">
                            <div className="benefit-icon">🔓</div>
                            <div className="benefit-item-content benefit-text">
                                <h3>Sua total liberdade</h3>
                                <p>Sonha em decorar, reformar e ter um espaço para chamar de seu? Liberte-se!</p>
                            </div>
                        </div>
                        <div className="benefit-item">
                            <div className="benefit-icon">👨‍👩‍👧‍👦</div>
                            <div className="benefit-item-content benefit-text">
                                <h3>Segurança para sua família</h3>
                                <p>Dê o conforto e o futuro seguro que quem você ama merece.</p>
                            </div>
                        </div>
                    </section>

                    <section className="section" style={{ background: '#f8faff' }}>
                        <h2 className="section-title">A casa própria está próxima!</h2>
                        <p style={{ marginBottom: '20px', fontSize: '15px' }}>Com o programa <strong>Minha Casa Minha Vida</strong> e a <strong>CAIXA</strong>, você tem acesso a:</p>
                        <ul style={{ listStyle: 'none', fontSize: '14px', color: '#4a5a6f' }}>
                            <li style={{ marginBottom: '10px' }}>✅ Taxas de juros reduzidas</li>
                            <li style={{ marginBottom: '10px' }}>✅ Subsídios do governo (um desconto que você não devolve!)</li>
                            <li style={{ marginBottom: '10px' }}>✅ Parcelas que cabem no seu bolso</li>
                        </ul>
                    </section>

                    <div className="cta-box">
                        <button id="startChat" onClick={iniciarSimulacao} className="btn-main">👉 FAZER MINHA SIMULAÇÃO GRATUITA</button>
                        <a href="/" className="btn-sub">Apenas ver os imóveis disponíveis no site</a>
                    </div>
                </div>
            ) : (
                /* ChatBot Interface */
                <div id="chatContainer" className="chat-container">
                    <div className="chat-header">
                        <div className="header-logos">
                            <div className="logos-group">
                                <img src="/images/simulado/logo-caixa.jpg" alt="CAIXA" />
                                <img src="/images/simulado/logo-mcmv.png" alt="MCMV" style={{ borderLeft: '1px solid #ddd', paddingLeft: '8px' }} />
                            </div>
                            <div style={{ fontSize: '12px', fontWeight: 700, background: 'rgba(255,255,255,0.2)', padding: '4px 8px', borderRadius: '4px' }}>SIMULADOR</div>
                        </div>
                        <div style={{ height: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px', overflow: 'hidden' }}>
                            <div id="progressFill" style={{ height: '100%', background: '#00c853', width: `${percentualProgresso}%`, transition: 'width 0.3s' }}></div>
                        </div>
                    </div>

                    <div id="chatArea" className="chat-area" ref={chatAreaRef}>
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.type}`}>
                                <div className="bubble">
                                    {msg.isHtml ? (
                                        <div dangerouslySetInnerHTML={{ __html: msg.content }} />
                                    ) : (
                                        msg.content
                                    )}
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="message bot typing">
                                <div className="bubble">
                                    <div className="typing-indicator">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div id="inputArea" className="input-area">
                        {inputType === 'text' && (
                            <div className="input-group">
                                <input
                                    type="text"
                                    value={inputValue}
                                    placeholder={inputPlaceholder}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter') handleTextSubmit(); }}
                                    autoFocus
                                />
                                <button onClick={handleTextSubmit}>Enviar</button>
                            </div>
                        )}

                        {inputType === 'number' && (
                            <div className="input-group">
                                <input
                                    type="number"
                                    value={inputValue}
                                    placeholder={inputPlaceholder}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter') handleTextSubmit(); }}
                                    autoFocus
                                />
                                <button onClick={handleTextSubmit}>Enviar</button>
                            </div>
                        )}

                        {inputType === 'tel' && (
                            <div className="input-group">
                                <input
                                    type="tel"
                                    value={inputValue}
                                    placeholder={inputPlaceholder}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === 'Enter') handleTextSubmit(); }}
                                    autoFocus
                                />
                                <button onClick={handleTextSubmit}>Enviar</button>
                            </div>
                        )}

                        {inputType === 'choices' && (
                            <div className="choices">
                                {choices.map((opt, i) => (
                                    <button key={i} className="choice-btn" onClick={() => handleChoiceClick(opt.value, opt.label)}>
                                        <span>{opt.emoji}</span> {opt.label}
                                    </button>
                                ))}
                            </div>
                        )}

                        {inputType === 'actions' && (
                            <div>
                                {variables.consentimento ? (
                                    <a
                                        href={`https://wa.me/5511970988512?text=${encodeURIComponent(`Olá! Fiz a simulação no site. Minha renda é R$ ${variables.renda} e gostaria de saber mais sobre os imóveis.`)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-main"
                                        style={{ display: 'block', textDecoration: 'none', background: '#25d366', boxShadow: '0 8px 20px rgba(37, 211, 102, 0.3)' }}
                                    >
                                        💬 FALAR NO WHATSAPP
                                    </a>
                                ) : (
                                    <a
                                        href="https://www.google.com/search?q=imoveis+taboao+da+serra+avaliacoes"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-main"
                                        style={{ display: 'block', textDecoration: 'none', background: '#ffb400', color: '#000' }}
                                    >
                                        ⭐ AVALIAR NO GOOGLE
                                    </a>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="disclaimer">⚠️ Simulador independente baseado em dados públicos. Sem vínculo oficial com a CEF ou Governo.</div>
                </div>
            )}
        </div>
    );
}
