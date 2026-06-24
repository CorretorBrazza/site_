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
    { renda: 3100, financiamento: 162317.87, parcela: 929.99, subsidio_com: 7819.00, subsidio_sem: 2345.05 },
    { renda: 3200, financiamento: 167817.25, parcela: 959.99, subsidio_com: 6072.00, subsidio_sem: 1821.60 },
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

    // Referência mutável para as variáveis para evitar stale closures
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

    // Rolar chat para baixo
    useEffect(() => {
        if (chatAreaRef.current) {
            chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    // Fluxo do Chatbot
    useEffect(() => {
        if (!isChatActive) return;

        if (step === 1) {
            setIsTyping(true);
            const timer = setTimeout(() => {
                setIsTyping(false);
                setMessages([
                    {
                        type: 'bot',
                        content: `Olá! Seja bem-vindo ao nosso <strong>Estudo de Viabilidade de Financiamento</strong>.<br><br>Vou te guiar em uma simulação com base nas regras de crédito da <strong>Caixa Econômica Federal</strong> e do programa <strong>Minha Casa Minha Vida</strong>.<br><br><div style="background: rgba(0,0,0,0.03); padding: 8px; border-radius: 6px; font-size: 11px; color: #64748b; border: 1px solid rgba(0,0,0,0.05);"><em>Nota: Esta ferramenta é uma simulação independente e não possui vínculo corporativo oficial com a CEF.</em></div><br>Vamos iniciar?`,
                        isHtml: true
                    }
                ]);
                setStep(2);
            }, 1200);
            return () => clearTimeout(timer);
        }

        if (step === 2) {
            const timer = setTimeout(() => {
                setMessages(prev => [...prev, { type: 'bot', content: 'Por favor, informe o seu nome completo:' }]);
                setInputType('text');
                setInputPlaceholder('Digite seu nome completo...');
            }, 1000);
            return () => clearTimeout(timer);
        }

        if (step === 3) {
            const timer = setTimeout(() => {
                setMessages(prev => [...prev, { type: 'bot', content: 'Qual é a sua <strong>renda bruta mensal</strong> comprovada? (Apenas números, ex: 3500)', isHtml: true }]);
                setInputType('number');
                setInputPlaceholder('Renda mensal em R$...');
            }, 500);
            return () => clearTimeout(timer);
        }

        if (step === 4) {
            const timer = setTimeout(() => {
                setMessages(prev => [...prev, { type: 'bot', content: 'Você possui filhos menores de 18 anos ou dependentes financeiros?' }]);
                setInputType('choices');
                setChoices([
                    { label: 'Sim, possuo', value: true, emoji: '✓' },
                    { label: 'Não possuo', value: false, emoji: '✗' }
                ]);
            }, 500);
            return () => clearTimeout(timer);
        }

        if (step === 5) {
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
                        <div style="text-align:center; margin-bottom:14px; font-weight:700; color:var(--primary); font-size:14px; tracking:0.05em; font-family:serif; text-transform:uppercase;">Estimativa Calculada</div>
                        <div style="font-size:11px; color:#64748b; text-transform:uppercase; font-weight:600; tracking:0.05em;">🏦 Financiamento Estimado</div>
                        <div class="value" style="font-family:serif; margin-bottom:10px;">${formatar(d.financiamento)}</div>
                        <div>
                            <div style="font-size:11px; color:#64748b; text-transform:uppercase; font-weight:600; tracking:0.05em;">📅 Parcela Inicial Estimada</div>
                            <div class="value" style="font-family:serif; margin-bottom:10px;">${formatar(d.parcela)}</div>
                        </div>
                        <div>
                            <div style="font-size:11px; color:#64748b; text-transform:uppercase; font-weight:600; tracking:0.05em;">🎁 Subsídio Estimado</div>
                            <div class="value" style="color:#10b981; font-family:serif; margin-bottom:10px;">${formatar(subsidio)}</div>
                        </div>
                        <div class="result-total" style="background:var(--primary);">
                            <div style="font-size:10px; opacity:0.8; text-transform:uppercase; tracking:0.1em; font-weight:600;">VALOR TOTAL APROXIMADO LIBERADO</div>
                            <div style="font-size:20px; font-weight:700; font-family:serif; margin-top:4px;">${formatar(total)}</div>
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
            const timer = setTimeout(() => {
                setMessages(prev => [...prev, { type: 'bot', content: 'Para que um especialista da nossa imobiliária analise as opções que se enquadram no seu perfil, informe seu WhatsApp com DDD:' }]);
                setInputType('tel');
                setInputPlaceholder('(11) 99999-9999');
            }, 1500);
            return () => clearTimeout(timer);
        }

        if (step === 7) {
            const timer = setTimeout(() => {
                setMessages(prev => [
                    ...prev,
                    {
                        type: 'bot',
                        content: `🔒 <strong>Consentimento (LGPD)</strong><br><br>Você autoriza que nosso consultor entre em contato para apresentar imóveis compatíveis com o seu resultado em Taboão da Serra?`,
                        isHtml: true
                    }
                ]);
                setInputType('choices');
                setChoices([
                    { label: 'Autorizo', value: true, emoji: '✓' },
                    { label: 'Não autorizo', value: false, emoji: '✗' }
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
            setVariables(prev => ({ ...prev, nome: val }));
            setMessages(prev => [...prev, { type: 'user', content: val }]);
            setInputType('none');
            setStep(3);
        } else if (step === 3) {
            const num = parseFloat(val.replace(/\D/g, '')) || 0;
            setVariables(prev => ({ ...prev, renda: num }));
            setMessages(prev => [...prev, { type: 'user', content: `R$ ${num.toLocaleString('pt-BR')}` }]);
            setInputType('none');
            setStep(4);
        } else if (step === 6) {
            setVariables(prev => ({ ...prev, telefone: val }));
            setMessages(prev => [...prev, { type: 'user', content: val }]);
            setInputType('none');
            setStep(7);
        }
    };

    const handleChoiceClick = (value: any, label: string) => {
        if (step === 4) {
            setVariables(prev => ({ ...prev, dependentes: value }));
            setMessages(prev => [...prev, { type: 'user', content: label }]);
            setInputType('none');
            setStep(5);
        } else if (step === 7) {
            setVariables(prev => ({ ...prev, consentimento: value }));
            setMessages(prev => [...prev, { type: 'user', content: label }]);
            setInputType('none');
            finalizarSimulacao(value);
        }
    };

    const finalizarSimulacao = (aceitou: boolean) => {
        const lead = { ...variables, consentimento: aceitou, ...dadosAutomaticos };

        if (aceitou) {
            // Enviar Lead com consentimento usando o token de ativação do Web3Forms
            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    access_key: '7d915857-c79e-4ff4-b507-ac4edaa6ce5c',
                    subject: `Novo Lead: ${lead.nome}`,
                    ...lead
                })
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
                        content: `<strong>Tudo pronto, ${variables.nome}!</strong><br><br>Seus dados foram enviados com sucesso. Clique no botão abaixo para conversar agora mesmo com o nosso consultor especialista via WhatsApp.`,
                        isHtml: true
                    }
                ]);
                setInputType('actions');
            }, 1200);
        } else {
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
                        content: `Entendemos seu desejo de privacidade. Seus dados de contato não foram salvos.<br><br>Agradecemos a utilização do nosso simulador. Se desejar, sinta-se à vontade para avaliar nossa empresa no Google.`,
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
        <div className="fixed inset-0 z-[9999] bg-[#faf9f6] overflow-y-auto antialiased">
            {/* CSS Global Isolado para a Landing Page e Simulador */}
            <style dangerouslySetInnerHTML={{ __html: `
                :root {
                    --primary: #0f172a;
                    --primary-light: #1e293b;
                    --secondary: #128c7e;
                    --accent: #bfa15f;
                    --accent-hover: #ab8e4f;
                    --text-main: #0f172a;
                    --text-muted: #64748b;
                    --bg-light: #faf9f6;
                    --white: #ffffff;
                }
                .lp-container { 
                    max-width: 600px; 
                    margin: 0 auto; 
                    background: var(--white); 
                    min-height: 100vh; 
                    display: flex; 
                    flex-direction: column; 
                    box-shadow: 0 4px 30px rgba(0,0,0,0.02); 
                    border-left: 1px solid rgba(0,0,0,0.05);
                    border-right: 1px solid rgba(0,0,0,0.05);
                }
                .hero {
                    position: relative; 
                    padding: 60px 24px; 
                    text-align: center;
                    background: linear-gradient(rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.95)), url('/images/simulado/dor-aluguel.png');
                    background-size: cover; 
                    background-position: center; 
                    color: var(--white);
                }
                .hero h1 { 
                    font-size: 38px; 
                    margin-bottom: 16px; 
                    line-height: 1.1; 
                }
                .hero p { 
                    font-size: 14px; 
                    opacity: 0.85; 
                    font-family: 'Plus Jakarta Sans', sans-serif; 
                }
                .section { 
                    padding: 32px 24px; 
                }
                .section-title { 
                    font-size: 18px; 
                    margin-bottom: 20px; 
                    color: var(--primary); 
                }
                .benefit-item { 
                    display: flex; 
                    gap: 16px; 
                    margin-bottom: 20px; 
                    align-items: flex-start; 
                }
                .benefit-icon { 
                    font-size: 20px; 
                    flex-shrink: 0; 
                }
                .benefit-text h3 { 
                    font-size: 14px; 
                    font-weight: 600; 
                    margin-bottom: 4px; 
                    color: var(--primary);
                }
                .benefit-text p { 
                    font-size: 12px; 
                    color: var(--text-muted); 
                    line-height: 1.5;
                }
                .cta-box { 
                    padding: 32px 24px; 
                    text-align: center; 
                    margin-top: auto; 
                }
                .btn-main {
                    display: block; 
                    width: 100%; 
                    padding: 16px;
                    background: var(--accent);
                    color: var(--white); 
                    text-decoration: none; 
                    border-radius: 12px;
                    font-weight: 600; 
                    font-size: 16px; 
                    margin-bottom: 16px;
                    box-shadow: 0 4px 12px rgba(191, 161, 95, 0.15); 
                    transition: all 0.2s;
                    border: none; 
                    cursor: pointer;
                    text-align: center;
                }
                .btn-main:hover {
                    background: var(--accent-hover);
                }
                .btn-main:active { 
                    transform: scale(0.98); 
                }
                .btn-sub { 
                    color: var(--text-muted); 
                    text-decoration: none; 
                    font-size: 12px; 
                    background: none; 
                    border: none; 
                    cursor: pointer; 
                    display: inline-block; 
                }
                .btn-sub:hover {
                    color: var(--primary);
                    text-decoration: underline;
                }

                /* ChatBot Styles */
                .chat-container { 
                    display: flex; 
                    position: fixed; 
                    top: 0; 
                    left: 0; 
                    width: 100%; 
                    height: 100dvh; 
                    background: var(--white); 
                    z-index: 1000; 
                    flex-direction: column; 
                }
                .chat-header { 
                    background: var(--primary); 
                    padding: 16px 20px; 
                    color: var(--white); 
                }
                .header-logos { 
                    display: flex; 
                    align-items: center; 
                    justify-content: space-between; 
                    margin-bottom: 12px; 
                }
                .logos-group { 
                    display: flex; 
                    align-items: center; 
                    gap: 8px; 
                    background: white; 
                    padding: 4px 10px; 
                    border-radius: 6px; 
                }
                .logos-group img { 
                    height: 18px; 
                }
                .chat-area { 
                    flex: 1; 
                    overflow-y: auto; 
                    padding: 20px; 
                    background: #f8fafc; 
                }
                .input-area { 
                    padding: 16px 20px 24px; 
                    background: var(--white); 
                    border-top: 1px solid #f1f5f9; 
                }

                /* Messages */
                .message { 
                    margin-bottom: 16px; 
                    display: flex; 
                    flex-direction: column; 
                    animation: slideUp 0.3s ease; 
                }
                .message.bot { 
                    align-items: flex-start; 
                }
                .message.user { 
                    align-items: flex-end; 
                }
                .bubble { 
                    padding: 12px 16px; 
                    border-radius: 14px; 
                    max-width: 85%; 
                    font-size: 14px; 
                    line-height: 1.5;
                }
                .bot .bubble { 
                    background: var(--white); 
                    color: var(--text-main); 
                    border-bottom-left-radius: 4px; 
                    box-shadow: 0 1px 3px rgba(0,0,0,0.05); 
                    border: 1px solid #f1f5f9;
                }
                .user .bubble { 
                    background: var(--accent); 
                    color: var(--white); 
                    border-bottom-right-radius: 4px; 
                }

                /* Result Card */
                .result-card { 
                    background: var(--white); 
                    border: 1px solid var(--accent); 
                    border-radius: 12px; 
                    padding: 20px; 
                    width: 100%; 
                    box-shadow: 0 2px 8px rgba(0,0,0,0.02); 
                }
                .result-card .value { 
                    font-size: 22px; 
                    font-weight: 700; 
                    color: var(--primary); 
                }
                .result-total { 
                    background: var(--primary); 
                    color: white; 
                    padding: 12px; 
                    border-radius: 8px; 
                    text-align: center; 
                    margin-top: 12px; 
                }

                /* Form Styles */
                .input-group { 
                    display: flex; 
                    gap: 10px; 
                }
                .input-group input { 
                    flex: 1; 
                    padding: 12px 14px; 
                    border: 1px solid #e2e8f0; 
                    border-radius: 8px; 
                    outline: none; 
                    font-size: 14px; 
                    color: var(--text-main);
                    background: #f8fafc;
                }
                .input-group input:focus {
                    border-color: var(--accent);
                    background: var(--white);
                }
                .input-group button { 
                    padding: 12px 20px; 
                    background: var(--accent); 
                    color: white; 
                    border: none; 
                    border-radius: 8px; 
                    font-weight: 600; 
                    cursor: pointer; 
                    font-size: 14px;
                }
                .input-group button:hover {
                    background: var(--accent-hover);
                }
                .choices { 
                    display: grid; 
                    grid-template-columns: 1fr 1fr; 
                    gap: 10px; 
                }
                .choice-btn { 
                    padding: 12px; 
                    border: 1px solid #e2e8f0; 
                    border-radius: 8px; 
                    background: white; 
                    font-weight: 600; 
                    cursor: pointer; 
                    font-size: 14px; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    gap: 6px; 
                    color: var(--text-main);
                }
                .choice-btn:hover {
                    border-color: var(--accent);
                    background: #fafafa;
                }
                .disclaimer { 
                    font-size: 10px; 
                    color: var(--text-muted); 
                    text-align: center; 
                    padding: 10px; 
                    background: #faf9f6; 
                }

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
                    {/* Header com as marcas de credibilidade */}
                    <header className="flex justify-between items-center px-6 py-4 border-b border-black/5 bg-[#faf9f6]">
                        <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-lg border border-black/5 shadow-xs">
                            <img src="/images/simulado/logo-caixa.jpg" alt="CAIXA" className="h-6 object-contain" />
                            <img src="/images/simulado/logo-mcmv.png" alt="MCMV" className="h-6 object-contain border-l border-slate-200 pl-3" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">Simulador de Viabilidade</span>
                    </header>

                    <section className="hero">
                        <h1 className="font-serif italic font-semibold text-accent text-5xl mb-4">Até quando?</h1>
                        <p className="text-slate-300 text-base leading-relaxed">
                            Até quando você vai pagar o aluguel de outra pessoa? Planeje a conquista do seu próprio espaço e descubra o valor aproximado do seu financiamento.
                        </p>
                    </section>

                    <section className="section bg-white">
                        <h2 className="section-title font-serif text-primary text-lg font-semibold mb-6">Mude o rumo do seu futuro patrimonial:</h2>
                        <div className="benefit-item">
                            <div className="benefit-icon text-accent">💰</div>
                            <div className="benefit-text">
                                <h3 className="text-primary font-semibold text-sm mb-1">Até quando no aluguel?</h3>
                                <p className="text-slate-500 text-xs">Mensalidades que sobem todos os anos sem gerar nenhum patrimônio para você. Direcione esse valor para o que é seu.</p>
                            </div>
                        </div>
                        <div className="benefit-item">
                            <div className="benefit-icon text-accent">🔓</div>
                            <div className="benefit-text">
                                <h3 className="text-primary font-semibold text-sm mb-1">Até quando sem autonomia?</h3>
                                <p className="text-slate-500 text-xs">Regras de terceiros, restrições para reformas ou animais. Conquiste a total liberdade de ter um lar com a sua cara.</p>
                            </div>
                        </div>
                        <div className="benefit-item">
                            <div className="benefit-icon text-accent">👨‍👩‍👧‍👦</div>
                            <div className="benefit-text">
                                <h3 className="text-primary font-semibold text-sm mb-1">Até quando sem estabilidade?</h3>
                                <p className="text-slate-500 text-xs">Dê a segurança e estabilidade que a sua família merece, livre das preocupações com renovações ou reajustes contratuais.</p>
                            </div>
                        </div>
                    </section>

                    <section className="section bg-[#faf9f6] border-y border-black/5">
                        <h2 className="section-title font-serif text-primary text-base font-semibold mb-4">A casa própria é viável</h2>
                        <p className="text-slate-500 text-xs mb-4 font-medium">Pelo programa <strong>Minha Casa Minha Vida</strong> e o crédito facilitado da <strong>CAIXA Econômica Federal</strong>, as condições são exclusivas:</p>
                        <ul className="space-y-2.5 text-xs text-slate-650 font-medium">
                            <li className="flex items-center gap-2">✓ Taxas de juros significativamente reduzidas</li>
                            <li className="flex items-center gap-2">✓ Subsídios do governo (um desconto real na sua entrada!)</li>
                            <li className="flex items-center gap-2">✓ Parcelas dimensionadas para caber no seu orçamento</li>
                        </ul>
                    </section>

                    <div className="cta-box bg-white border-t border-black/5">
                        <button id="startChat" onClick={iniciarSimulacao} className="btn-main">
                            👉 FAZER MINHA SIMULAÇÃO GRATUITA
                        </button>
                        <a href="/" className="btn-sub">
                            Apenas ver os imóveis disponíveis no site
                        </a>
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
                            <div style={{ fontSize: '11px', fontWeight: 700, background: 'rgba(255,255,255,0.15)', padding: '4px 8px', borderRadius: '4px', color: '#fff', tracking: '0.05em' }}>SIMULADOR CAIXA</div>
                        </div>
                        <div style={{ height: '3px', background: 'rgba(255,255,255,0.15)', borderRadius: '1.5px', overflow: 'hidden' }}>
                            <div id="progressFill" style={{ height: '100%', background: 'var(--accent)', width: `${percentualProgresso}%`, transition: 'width 0.3s' }}></div>
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
                                        href={`https://wa.me/5511970988512?text=${encodeURIComponent(`Olá! Fiz a simulação no site com o mote 'Até quando?'. Minha renda é R$ ${variables.renda} e gostaria de saber mais sobre os imóveis.`)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-main"
                                        style={{ display: 'block', textDecoration: 'none', background: '#128c7e', boxShadow: '0 4px 12px rgba(18, 140, 126, 0.15)' }}
                                    >
                                        Falar com Especialista no WhatsApp
                                    </a>
                                ) : (
                                    <a
                                        href="https://www.google.com/search?q=imoveis+taboao+da+serra+avaliacoes"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-main"
                                        style={{ display: 'block', textDecoration: 'none', background: 'var(--accent)', color: '#fff' }}
                                    >
                                        Avaliar no Google
                                    </a>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="disclaimer">⚠️ Simulador independente baseado em dados públicos. Sem vínculo oficial com a CEF ou Governo Federal.</div>
                </div>
            )}
        </div>
    );
}
