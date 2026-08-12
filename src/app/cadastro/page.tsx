'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Sparkles, Check, ArrowRight, ShieldCheck, AlertCircle, Loader2, Lock, Mail, User, Phone } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';
import Link from 'next/link';

export default function CadastroPage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [telefone, setTelefone] = useState('');
  const [creci, setCreci] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !nome || !senha || !telefone) {
      setErrorMsg('Nome, e-mail, senha e WhatsApp são obrigatórios.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha, telefone, creci }),
      });

      const json = await response.json();

      if (json.success) {
        setSubmitted(true);
        setSuccessMsg(json.message || 'Cadastro efetuado com sucesso! Em instantes você receberá um e-mail de boas-vindas com todas as informações.');
      } else {
        setErrorMsg(json.message || json.error || 'Erro ao realizar cadastro.');
      }
    } catch (err: any) {
      setErrorMsg('Erro de conexão ao enviar o cadastro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1">
        {/* Hero Banner */}
        <section className="bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 text-white py-14 px-4">
          <div className="max-w-4xl mx-auto text-center space-y-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              Cadastro de Novo Corretor
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Crie sua Conta Grátis e Ganhe 1 Crédito
            </h1>
            <p className="text-sm md:text-base text-slate-300 max-w-2xl mx-auto">
              Experimente a geração de Media Kits de imóveis com Inteligência Artificial. Cadastre-se em segundos e receba seu crédito inicial.
            </p>
          </div>
        </section>

        {/* Formulário Exclusivo de Cadastro */}
        <section className="max-w-xl mx-auto px-4 py-12 -mt-8">
          {submitted ? (
            <div className="bg-white border border-emerald-200 rounded-3xl p-8 text-center shadow-xl space-y-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                <Check className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">Cadastro Concluído!</h2>
              <p className="text-sm text-slate-700 leading-relaxed font-medium">
                {successMsg}
              </p>
              <div className="bg-blue-50 border border-blue-100 text-blue-900 p-4 rounded-2xl text-xs text-left space-y-1">
                <strong className="block font-bold">🎁 Seu Bônus:</strong>
                <span>Você ganhou <strong>1 Crédito Grátis</strong> para publicar seu primeiro imóvel por 90 dias com IA.</span>
              </div>
              <div className="pt-4">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition-all shadow-md w-full"
                >
                  <span>Acessar Minha Conta / Login</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl font-extrabold text-slate-900">Dados do Novo Corretor</h2>
                <p className="text-xs text-slate-500 mt-1">Preencha seus dados para ativar sua conta no portal.</p>
              </div>

              {errorMsg && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl text-xs flex items-center gap-2 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nome Completo *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="Ex: João Brazza"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      className="w-full px-3.5 py-2.5 pl-10 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">E-mail / Login *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="corretor@seuemail.com.br"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 pl-10 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Senha de Acesso *</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        className="w-full px-3.5 py-2.5 pl-10 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp *</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        placeholder="(11) 99999-9999"
                        value={telefone}
                        onChange={(e) => setTelefone(e.target.value)}
                        className="w-full px-3.5 py-2.5 pl-10 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">CRECI (Opcional)</label>
                  <div className="relative">
                    <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Ex: 12345-F"
                      value={creci}
                      onChange={(e) => setCreci(e.target.value)}
                      className="w-full px-3.5 py-2.5 pl-10 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-extrabold transition-all shadow-md mt-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Cadastrando...</span>
                    </>
                  ) : (
                    <>
                      <span>Criar Conta e Ganhar 1 Crédito Grátis</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="text-center pt-2 border-t border-slate-100">
                <p className="text-xs text-slate-500">
                  Já possui conta? <Link href="/login" className="text-blue-600 font-bold hover:underline">Faça login aqui</Link>
                </p>
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
