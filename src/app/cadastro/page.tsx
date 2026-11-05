'use client';

import React, { useState } from 'react';
import { Sparkles, Check, ArrowRight, ShieldCheck, AlertCircle, Loader2, Lock, Mail, User, Phone } from 'lucide-react';
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
      setErrorMsg('Nome, e-mail, senha e telefone são obrigatórios.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      // Mesmo caminho do login: passando pelo proxy do site, o cookie de sessão
      // nasce em imoveistaboao.com.br. Chamando a Railway direto, o cookie
      // nasceria no domínio do Railway e o navegador o ignoraria.
      const response = await fetch('/api/v1/auth/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ nome, email, senha, telefone, creci }),
      });

      const json = await response.json();

      if (json.success) {
        setSubmitted(true);
        setSuccessMsg(json.message || 'Cadastro efetuado com sucesso! Em instantes você receberá um e-mail de boas-vindas com todas as informações.');
      } else {
        setErrorMsg(json.message || json.error || 'Erro ao realizar cadastro.');
      }
    } catch {
      setErrorMsg('Erro de conexão ao enviar o cadastro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col justify-between">
      <main className="flex-1">
        {/* Hero Banner */}
        <section className="bg-gradient-to-b from-brand-900 via-brand-800 to-brand-900 text-white py-14 px-4">
          <div className="max-w-4xl mx-auto text-center space-y-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-900/20 border border-brand-700/30 text-gold-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-gold" />
              Cadastro de Novo Corretor
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Crie sua Conta Grátis e Ganhe 1 Crédito
            </h1>
            <p className="text-sm md:text-base text-muted-80 max-w-2xl mx-auto">
              Experimente a geração de Media Kits de imóveis com Inteligência Artificial. Cadastre-se em segundos e receba seu crédito inicial.
            </p>
          </div>
        </section>

        {/* Formulário Exclusivo de Cadastro */}
        <section className="max-w-xl mx-auto px-4 py-12 -mt-8">
          {submitted ? (
            <div className="bg-white border border-success/30 rounded-3xl p-8 text-center shadow-xl space-y-4">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto text-success">
                <Check className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-extrabold text-brand-900">Cadastro Concluído!</h2>
              <p className="text-sm text-ink leading-relaxed font-medium">
                {successMsg}
              </p>
              <div className="bg-brand-900/5 border border-brand-700/30 text-brand-800 p-4 rounded-2xl text-xs text-left space-y-1">
                <strong className="block font-bold">🎁 Seu Bônus:</strong>
                <span>Você ganhou <strong>1 Crédito Grátis</strong> para publicar seu primeiro imóvel por 90 dias com IA.</span>
              </div>
              <div className="pt-4">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-900 hover:bg-brand-800 text-white rounded-xl text-xs font-extrabold transition-all shadow-md w-full"
                >
                  <span>Acessar Minha Conta / Login</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-line rounded-3xl p-8 shadow-xl space-y-6">
              <div className="border-b border-line pb-4">
                <h2 className="text-xl font-extrabold text-brand-900">Dados do Novo Corretor</h2>
                <p className="text-xs text-muted mt-1">Preencha seus dados para ativar sua conta no portal.</p>
              </div>

              {errorMsg && (
                <div className="bg-danger/10 border border-danger/30 text-danger p-3.5 rounded-xl text-xs flex items-center gap-2 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0 text-danger" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-ink mb-1">Nome Completo *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="Ex: João Brazza"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      className="w-full px-3.5 py-2.5 pl-10 border border-line rounded-xl text-xs font-medium text-brand-900 focus:ring-2 focus:ring-brand-700 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink mb-1">E-mail / Login *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="corretor@seuemail.com.br"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 pl-10 border border-line rounded-xl text-xs font-medium text-brand-900 focus:ring-2 focus:ring-brand-700 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-ink mb-1">Senha de Acesso *</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        className="w-full px-3.5 py-2.5 pl-10 border border-line rounded-xl text-xs font-medium text-brand-900 focus:ring-2 focus:ring-brand-700 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-ink mb-1">Telefone / Celular *</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        placeholder="(11) 99999-9999"
                        value={telefone}
                        onChange={(e) => setTelefone(e.target.value)}
                        className="w-full px-3.5 py-2.5 pl-10 border border-line rounded-xl text-xs font-medium text-brand-900 focus:ring-2 focus:ring-brand-700 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink mb-1">CRECI (Opcional)</label>
                  <div className="relative">
                    <ShieldCheck className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Ex: 12345-F"
                      value={creci}
                      onChange={(e) => setCreci(e.target.value)}
                      className="w-full px-3.5 py-2.5 pl-10 border border-line rounded-xl text-xs font-medium text-brand-900 focus:ring-2 focus:ring-brand-700 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-900 hover:bg-brand-800 disabled:opacity-50 text-white rounded-xl text-xs font-extrabold transition-all shadow-md mt-2"
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

              <div className="text-center pt-2 border-t border-line">
                <p className="text-xs text-muted">
                  Já possui conta? <Link href="/login" className="text-brand-800 font-bold hover:underline">Faça login aqui</Link>
                </p>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
