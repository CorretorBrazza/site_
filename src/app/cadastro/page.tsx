'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Sparkles, Check, ArrowRight, ShieldCheck, Zap, AlertCircle, Loader2 } from 'lucide-react';
import { registerCorretor } from '@/lib/api';

export default function CadastroPage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [plano, setPlano] = useState<'basico' | 'premium'>('basico');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !nome) return;

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await registerCorretor({ nome, email, telefone, plano });
      if (res.success) {
        setSubmitted(true);
      } else {
        setErrorMsg(res.error || res.message || 'Falha ao registrar cadastro na API.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro de conexão ao enviar o cadastro.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1">

        {/* Hero Banner */}
        <section className="bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 text-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              Recarga & Cadastro de Corretores
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Gere Media Kits Profissionais de Imóveis em Segundos com IA
            </h1>
            <p className="text-base text-slate-300 max-w-2xl mx-auto">
              Envie fotos e texto bruto no WhatsApp ou e-mail. Nossa inteligência artificial cuida da validação de condomínio, geocodificação e gera 6 variações de copy prontas.
            </p>
          </div>
        </section>

        {/* Form & Planos */}
        <section className="max-w-5xl mx-auto px-4 py-12 -mt-8">
          {submitted ? (
            <div className="bg-white border border-emerald-200 rounded-3xl p-8 text-center shadow-xl space-y-4 max-w-xl mx-auto">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                <Check className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">Cadastro Recebido!</h2>
              <p className="text-sm text-slate-600">
                Obrigado, <strong>{nome}</strong>! As instruções de recarga de créditos para o e-mail <strong>{email}</strong> foram enviadas.
              </p>
              <div className="pt-2">
                <a
                  href="/"
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md"
                >
                  Voltar ao Portal Imóveis Taboão
                </a>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

              {/* Escolha de Planos */}
              <div className="lg:col-span-7 space-y-6">
                <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-600" />
                  <span>Escolha seu Pacote de Créditos</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  {/* Plano Básico */}
                  <div
                    onClick={() => setPlano('basico')}
                    className={`cursor-pointer border-2 rounded-2xl p-5 transition-all bg-white relative ${
                      plano === 'basico'
                        ? 'border-blue-600 ring-2 ring-blue-500/20 shadow-md'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {plano === 'basico' && (
                      <span className="absolute -top-3 right-4 bg-blue-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                        SELECIONADO
                      </span>
                    )}
                    <h3 className="text-base font-extrabold text-slate-900">Pacote Básico</h3>
                    <div className="text-2xl font-black text-blue-600 my-1">
                      10 Créditos
                    </div>
                    <p className="text-xs text-slate-500 mb-4">Ideal para corretores autônomos.</p>
                    <ul className="text-xs text-slate-600 space-y-2">
                      <li className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-500" /> 10 Imóveis com Media Kit</li>
                      <li className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-500" /> RAG & Validação de Condomínios</li>
                      <li className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-500" /> Otimização Cloudinary</li>
                    </ul>
                  </div>

                  {/* Plano Premium */}
                  <div
                    onClick={() => setPlano('premium')}
                    className={`cursor-pointer border-2 rounded-2xl p-5 transition-all bg-white relative ${
                      plano === 'premium'
                        ? 'border-blue-600 ring-2 ring-blue-500/20 shadow-md'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {plano === 'premium' && (
                      <span className="absolute -top-3 right-4 bg-blue-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                        SELECIONADO
                      </span>
                    )}
                    <h3 className="text-base font-extrabold text-slate-900">Pacote Premium</h3>
                    <div className="text-2xl font-black text-blue-600 my-1">
                      30 Créditos
                    </div>
                    <p className="text-xs text-slate-500 mb-4">Para imobiliárias e corretores de alto volume.</p>
                    <ul className="text-xs text-slate-600 space-y-2">
                      <li className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-500" /> 30 Imóveis com Media Kit</li>
                      <li className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-500" /> Suporte Prioritário</li>
                      <li className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-500" /> Publicação Automática</li>
                    </ul>
                  </div>

                </div>

                {/* Diferenciais */}
                <div className="bg-slate-100 rounded-2xl p-5 space-y-3 text-xs text-slate-700">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>Como funciona o consumo de créditos?</span>
                  </div>
                  <p>
                    Um crédito só é debitado quando você <strong>revisa e aprova</strong> o anúncio gerado. Se você rejeitar ou não aprovar, nada é cobrado.
                  </p>
                </div>
              </div>

              {/* Form de Cadastro */}
              <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-xl space-y-4">
                <h3 className="text-lg font-extrabold text-slate-900">
                  Cadastrar ou Solicitar Recarga
                </h3>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nome Completo</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: João Brazza"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">E-mail Cadastrado</label>
                    <input
                      type="email"
                      required
                      placeholder="corretor@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp</label>
                    <input
                      type="tel"
                      placeholder="(11) 99999-9999"
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  {errorMsg && (
                    <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-extrabold transition-all shadow-md mt-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Enviando cadastro...</span>
                      </>
                    ) : (
                      <>
                        <span>Confirmar Cadastro e Recarga</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>

            </div>
          )}
        </section>

      </main>

      <Footer />
    </div>
  );
}
