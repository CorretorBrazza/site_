'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Building2, KeyRound, Mail, Lock, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

function EsqueciSenhaForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tokenParam = searchParams.get('token');
  const emailParam = searchParams.get('email');

  const [modo, setModo] = useState<'solicitar' | 'redefinir'>('solicitar');
  const [email, setEmail] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (tokenParam) {
      setModo('redefinir');
    }
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [tokenParam, emailParam]);

  const handleSolicitarReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setMensagemSucesso(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/v1/auth/forgot-password/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const json = await res.json();
      if (json.success) {
        setMensagemSucesso(json.message || 'Se o e-mail estiver cadastrado, enviamos o link de redefinição via Resend.');
      } else {
        setErro(json.message || 'Ocorreu um erro ao processar a solicitação.');
      }
    } catch {
      setErro('Não foi possível conectar ao servidor de e-mails.');
    } finally {
      setLoading(false);
    }
  };

  const handleRedefinirSenha = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setMensagemSucesso(null);

    if (novaSenha !== confirmarSenha) {
      setErro('As senhas não coincidem. Digite novamente.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/v1/auth/reset-password/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: tokenParam, senha: novaSenha }),
      });

      const json = await res.json();
      if (json.success) {
        setMensagemSucesso(json.message || 'Senha alterada com sucesso!');
        setTimeout(() => {
          router.push('/login');
        }, 2500);
      } else {
        setErro(json.message || 'Token de redefinição inválido ou expirado.');
      }
    } catch {
      setErro('Não foi possível conectar ao servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-brand-900 border border-brand-700 py-8 px-4 shadow-2xl rounded-2xl sm:px-10">
      {mensagemSucesso ? (
        <div className="text-center space-y-4 py-4">
          <div className="w-12 h-12 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto border border-success/50/20">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Solicitação Processada</h3>
          <p className="text-xs text-muted-80 leading-relaxed">{mensagemSucesso}</p>
          <Link
            href="/login"
            className="inline-block mt-4 text-xs font-bold text-gold-400 hover:text-gold-400 hover:underline"
          >
            ← Voltar para a tela de Login
          </Link>
        </div>
      ) : modo === 'solicitar' ? (
        /* Form 1: Digitar E-mail para receber link */
        <form onSubmit={handleSolicitarReset} className="space-y-4">
          {erro && (
            <div className="bg-danger/80 border border-danger/50 text-danger text-xs p-3.5 rounded-xl mb-4 font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-danger" />
              <span>{erro}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-muted-80 uppercase tracking-wider mb-1">
              E-mail da sua Conta
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="corretor@seuemail.com.br"
                className="w-full bg-brand-950 border border-brand-700 rounded-xl py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-muted/70 focus:outline-none focus:border-brand-700 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-brand-900 to-brand-900 hover:from-brand-900 hover:to-brand-900 text-white font-bold rounded-xl shadow-lg hover:shadow-brand-900/20/25 transition-all text-sm flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
          >
            {loading ? (
              <span>Disparando E-mail via Resend...</span>
            ) : (
              <>
                <span>Enviar Link de Recuperação</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="text-center pt-2">
            <Link href="/login" className="text-xs font-bold text-muted hover:text-white transition-colors">
              ← Lembra da senha? Fazer Login
            </Link>
          </div>
        </form>
      ) : (
        /* Form 2: Digitar Nova Senha */
        <form onSubmit={handleRedefinirSenha} className="space-y-4">
          {erro && (
            <div className="bg-danger/80 border border-danger/50 text-danger text-xs p-3.5 rounded-xl mb-4 font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-danger" />
              <span>{erro}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-muted-80 uppercase tracking-wider mb-1">
              Nova Senha
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                className="w-full bg-brand-950 border border-brand-700 rounded-xl py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-muted/70 focus:outline-none focus:border-brand-700 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-muted-80 uppercase tracking-wider mb-1">
              Confirmar Nova Senha
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                placeholder="Repita a nova senha"
                className="w-full bg-brand-950 border border-brand-700 rounded-xl py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-muted/70 focus:outline-none focus:border-brand-700 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-brand-900 to-brand-900 hover:from-brand-900 hover:to-brand-900 text-white font-bold rounded-xl shadow-lg hover:shadow-brand-900/20/25 transition-all text-sm flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
          >
            {loading ? (
              <span>Atualizando Senha...</span>
            ) : (
              <>
                <span>Salvar Nova Senha</span>
                <CheckCircle2 className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}

export default function EsqueciSenhaPage() {
  return (
    <div className="min-h-screen bg-brand-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-brand-900/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <Link href="/" className="inline-flex items-center gap-2 text-2xl font-black text-white tracking-tight">
          <Building2 className="w-8 h-8 text-brand-800" />
          <span>Imóveis <span className="text-brand-800">Taboão</span></span>
        </Link>
        <h2 className="mt-4 text-2xl font-extrabold text-white flex items-center justify-center gap-2">
          <KeyRound className="w-6 h-6 text-gold-400" />
          Recuperação de Senha
        </h2>
        <p className="mt-1 text-sm text-muted">
          Informe seu e-mail cadastrado para receber o link de redefinição seguro via Resend.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Suspense fallback={<div className="text-white text-center">Carregando...</div>}>
          <EsqueciSenhaForm />
        </Suspense>
      </div>
    </div>
  );
}
