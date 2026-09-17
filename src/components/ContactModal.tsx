'use client';

import { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, X, Mail, ShieldCheck } from 'lucide-react';

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
const WEB3FORMS_ACCESS_KEY = '7d915857-c79e-4ff4-b507-ac4edaa6ce5c';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const campoBase =
  'w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-950 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 text-xs md:text-sm';

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    assunto: '',
    mensagem: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [consentimento, setConsentimento] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consentimento) return;
    setStatus('submitting');

    try {
      const response = await fetch(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `Imóveis Taboão — ${formData.assunto || 'Contato via portal'}`,
          from_name: formData.nome,
          nome: formData.nome,
          email: formData.email,
          telefone: formData.telefone,
          assunto: formData.assunto,
          mensagem: formData.mensagem,
          _replyto: formData.email,
          _template: 'box',
          _captcha: false,
        }),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ nome: '', email: '', telefone: '', assunto: '', mensagem: '' });
        setConsentimento(false);
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <div className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 max-w-lg w-full max-h-[92dvh] flex flex-col shadow-2xl relative border border-slate-800 rounded-3xl overflow-hidden animate-in fade-in zoom-in duration-200 my-auto">
        
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-slate-950 via-[#0b132b] to-slate-950 border-b border-slate-800 p-4 sm:p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-5 sm:right-5 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-all z-10"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>

          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-extrabold uppercase tracking-wider">
            <Mail className="w-3 h-3" />
            Atendimento &amp; Ouvidoria
          </span>
          <h3 className="text-lg sm:text-xl font-black text-white tracking-tight mt-2 pr-8">
            Fale Conosco
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-400 mt-1 pr-8">
            Preencha o formulário e nossa equipe responderá por e-mail o mais breve possível.
          </p>
        </div>

        {/* Corpo do Formulário */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {status === 'success' ? (
            <div className="bg-emerald-950/80 border border-emerald-800 text-emerald-200 p-6 rounded-2xl space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-emerald-400" size={22} />
                <span className="font-bold text-sm sm:text-base">Mensagem Enviada com Sucesso!</span>
              </div>
              <p className="text-xs leading-relaxed">
                Agradecemos o seu contato. Nossa equipe responderá sua mensagem o mais breve possível.
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="text-xs font-bold text-emerald-400 underline hover:text-emerald-300 pt-2"
              >
                Enviar outra mensagem
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="absolute -left-[9999px] h-px w-px opacity-0"
              />

              <div>
                <label htmlFor="cm-nome" className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  id="cm-nome"
                  name="nome"
                  required
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Digite seu nome completo"
                  className={campoBase}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="cm-email" className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    id="cm-email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="seu@email.com"
                    className={campoBase}
                  />
                </div>
                <div>
                  <label htmlFor="cm-telefone" className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Telefone / Celular *
                  </label>
                  <input
                    type="tel"
                    id="cm-telefone"
                    name="telefone"
                    required
                    value={formData.telefone}
                    onChange={handleChange}
                    placeholder="(11) 99999-9999"
                    className={campoBase}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="cm-assunto" className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Assunto *
                </label>
                <select
                  id="cm-assunto"
                  name="assunto"
                  required
                  value={formData.assunto}
                  onChange={handleChange}
                  className={`${campoBase} cursor-pointer`}
                >
                  <option value="" disabled>Selecione o assunto...</option>
                  <option value="Dúvidas sobre imóveis">Dúvidas sobre imóveis</option>
                  <option value="Anunciar meu imóvel">Anunciar meu imóvel</option>
                  <option value="Área do Corretor">Área do Corretor</option>
                  <option value="Suporte técnico">Suporte técnico</option>
                  <option value="Ouvidoria / Reclamação">Ouvidoria / Reclamação</option>
                  <option value="Outros assuntos">Outros assuntos</option>
                </select>
              </div>

              <div>
                <label htmlFor="cm-mensagem" className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Texto da Mensagem *
                </label>
                <textarea
                  id="cm-mensagem"
                  name="mensagem"
                  required
                  rows={4}
                  value={formData.mensagem}
                  onChange={handleChange}
                  placeholder="Digite sua dúvida ou mensagem..."
                  className={`${campoBase} resize-none`}
                />
              </div>

              <label className="flex items-start gap-2 text-[11px] leading-relaxed text-slate-400">
                <input
                  type="checkbox"
                  checked={consentimento}
                  onChange={(event) => setConsentimento(event.target.checked)}
                  className="mt-0.5 accent-amber-500"
                  required
                />
                <span>
                  Autorizo o uso dos meus dados para receber resposta sobre esta mensagem, conforme a{' '}
                  <a href="/politica-de-privacidade" target="_blank" className="font-bold text-amber-400 underline">Política de Privacidade</a>.
                </span>
              </label>

              {status === 'error' && (
                <div className="flex items-center gap-2 text-xs text-red-200 bg-red-950/80 p-3 rounded-xl border border-red-800">
                  <AlertCircle size={16} />
                  <span>Ocorreu um erro ao enviar sua mensagem. Tente novamente.</span>
                </div>
              )}

              <button
                type="submit"
                disabled={status === 'submitting' || !consentimento}
                className="w-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-slate-950 font-black py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider disabled:opacity-50"
              >
                <Send size={16} />
                {status === 'submitting' ? 'Enviando...' : 'Enviar Mensagem'}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Seus dados são usados apenas para responder esta mensagem (LGPD).
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => onClose()}
            className="w-full py-2.5 text-xs font-bold text-slate-300 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/70 rounded-xl transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}