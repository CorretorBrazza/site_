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
      // Envio de formulário usando o token de ativação do FormSubmit
      const response = await fetch('https://formsubmit.co/ajax/64cee96f2e8b53a77b5af43a643a3614', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `Novo Contato: ${formData.nome}`,
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
    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Envie uma mensagem</h3>

      {status === 'success' ? (
        <div className="bg-green-50 border border-green-100 text-green-800 p-6 rounded-xl space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="text-green-600" size={24} />
            <span className="font-bold text-lg">Mensagem enviada!</span>
          </div>
          <p className="text-sm">
            Agradecemos o seu contato. Um de nossos corretores entrará em contato com você o mais breve possível.
          </p>
          <button
            onClick={() => setStatus('idle')}
            className="text-xs font-bold text-green-700 underline hover:text-green-800 pt-2"
          >
            Enviar outra mensagem
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="nome" className="block text-sm font-semibold text-gray-700 mb-1.5">
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
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400 text-gray-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
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
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400 text-gray-900"
              />
            </div>
            <div>
              <label htmlFor="telefone" className="block text-sm font-semibold text-gray-700 mb-1.5">
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
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400 text-gray-900"
              />
            </div>
          </div>

          <div>
            <label htmlFor="mensagem" className="block text-sm font-semibold text-gray-700 mb-1.5">
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
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400 text-gray-900 resize-none"
            />
          </div>

          {status === 'error' && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
              <AlertCircle size={16} />
              <span>Ocorreu um erro ao enviar. Tente novamente ou chame no WhatsApp.</span>
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2 disabled:opacity-55 disabled:cursor-not-allowed"
          >
            <Send size={18} />
            {status === 'submitting' ? 'Enviando...' : 'Enviar Mensagem'}
          </button>
        </form>
      )}
    </div>
  );
}
