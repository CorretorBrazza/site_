'use client';

import { useState } from 'react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    mensagem: '',
  });

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          access_key: '7d915857-c79e-4ff4-b507-ac4edaa6ce5c',
          subject: `Novo Contato: ${formData.nome}`,
          nome: formData.nome,
          email: formData.email,
          telefone: formData.telefone,
          mensagem: formData.mensagem,
        }),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ nome: '', email: '', telefone: '', mensagem: '' });
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <div className="bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
      <h3 className="text-xl font-black text-white">Envie uma Mensagem</h3>

      {status === 'success' ? (
        <div className="bg-emerald-950/80 border border-emerald-800 text-emerald-200 p-6 rounded-2xl space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="text-emerald-400" size={22} />
            <span className="font-bold text-base">Mensagem Enviada com Sucesso!</span>
          </div>
          <p className="text-xs leading-relaxed">
            Agradecemos o seu contato. Nossa equipe responderá sua mensagem por e-mail o mais breve possível.
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
          <div>
            <label htmlFor="nome" className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Nome Completo *
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              required
              value={formData.nome}
              onChange={handleChange}
              placeholder="Digite seu nome completo"
              className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 text-xs md:text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                E-mail *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 text-xs md:text-sm"
              />
            </div>
            <div>
              <label htmlFor="telefone" className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Telefone / Celular *
              </label>
              <input
                type="tel"
                id="telefone"
                name="telefone"
                required
                value={formData.telefone}
                onChange={handleChange}
                placeholder="(11) 99999-9999"
                className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 text-xs md:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="mensagem" className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Mensagem *
            </label>
            <textarea
              id="mensagem"
              name="mensagem"
              required
              rows={4}
              value={formData.mensagem}
              onChange={handleChange}
              placeholder="Digite sua dúvida ou mensagem..."
              className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950 text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 text-xs md:text-sm resize-none"
            />
          </div>

          {status === 'error' && (
            <div className="flex items-center gap-2 text-xs text-red-200 bg-red-950/80 p-3 rounded-xl border border-red-800">
              <AlertCircle size={16} />
              <span>Ocorreu um erro ao enviar. Tente novamente ou envie por e-mail.</span>
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-slate-950 font-black py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider disabled:opacity-50"
          >
            <Send size={16} />
            {status === 'submitting' ? 'Enviando...' : 'Enviar Mensagem'}
          </button>
        </form>
      )}
    </div>
  );
}
