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
      // Envio de formulário assíncrono para o Web3Forms
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
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
    <div className="bg-white p-8 rounded-xl border border-black/5 shadow-sm">
      <h3 className="text-xl font-serif font-semibold text-primary mb-6">Envie uma mensagem</h3>

      {status === 'success' ? (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-6 rounded-lg space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="text-emerald-600" size={22} />
            <span className="font-bold text-base">Mensagem enviada!</span>
          </div>
          <p className="text-xs leading-relaxed">
            Agradecemos o seu contato. Um de nossos consultores retornará o seu contato o mais breve possível.
          </p>
          <button
            onClick={() => setStatus('idle')}
            className="text-xs font-semibold text-emerald-700 underline hover:text-emerald-800 pt-2"
          >
            Enviar outra mensagem
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="nome" className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Nome Completo
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              required
              value={formData.nome}
              onChange={handleChange}
              placeholder="Digite seu nome completo"
              className="w-full px-4 py-2.5 rounded-lg border border-black/10 focus:outline-none focus:ring-2 focus:ring-accent/15 focus:border-accent transition-all placeholder:text-slate-400 text-sm text-primary bg-slate-50/20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                E-mail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                className="w-full px-4 py-2.5 rounded-lg border border-black/10 focus:outline-none focus:ring-2 focus:ring-accent/15 focus:border-accent transition-all placeholder:text-slate-400 text-sm text-primary bg-slate-50/20"
              />
            </div>
            <div>
              <label htmlFor="telefone" className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                WhatsApp
              </label>
              <input
                type="tel"
                id="telefone"
                name="telefone"
                required
                value={formData.telefone}
                onChange={handleChange}
                placeholder="(11) 99999-9999"
                className="w-full px-4 py-2.5 rounded-lg border border-black/10 focus:outline-none focus:ring-2 focus:ring-accent/15 focus:border-accent transition-all placeholder:text-slate-400 text-sm text-primary bg-slate-50/20"
              />
            </div>
          </div>

          <div>
            <label htmlFor="mensagem" className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Mensagem
            </label>
            <textarea
              id="mensagem"
              name="mensagem"
              required
              rows={4}
              value={formData.mensagem}
              onChange={handleChange}
              placeholder="Olá, gostaria de saber mais informações sobre..."
              className="w-full px-4 py-2.5 rounded-lg border border-black/10 focus:outline-none focus:ring-2 focus:ring-accent/15 focus:border-accent transition-all placeholder:text-slate-400 text-sm text-primary bg-slate-50/20 resize-none"
            />
          </div>

          {status === 'error' && (
            <div className="flex items-center gap-2 text-xs text-red-650 bg-red-50 p-3 rounded-lg border border-red-100">
              <AlertCircle size={16} />
              <span>Ocorreu um erro ao enviar. Tente novamente ou chame no WhatsApp.</span>
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full bg-accent hover:bg-accent-hover text-white font-semibold py-3.5 rounded-lg shadow-sm shadow-accent/10 transition-all flex items-center justify-center gap-2 disabled:opacity-55 disabled:cursor-not-allowed"
          >
            <Send size={16} />
            {status === 'submitting' ? 'Enviando...' : 'Enviar Mensagem'}
          </button>
        </form>
      )}
    </div>
  );
}
