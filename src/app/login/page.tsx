'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Building2, Lock, Mail, User, Phone, ShieldCheck, Eye, EyeOff, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

import { API_BASE_URL } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [modo, setModo] = useState<'login' | 'cadastro'>('login');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [creci, setCreci] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setLoading(true);

    const endpoint = modo === 'login' ? `${API_BASE_URL}/auth/login` : `${API_BASE_URL}/auth/register`;

    const body = modo === 'login'
      ? { email, senha }
      : { nome, email, senha, telefone, creci };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setErro(json.message || 'Erro ao realizar autenticação. Verifique os dados.');
        return;
      }

      // Salva a sessão no localStorage e Cookie seguro
      if (json.data?.token) {
        localStorage.setItem('auth_token', json.data.token);
        localStorage.setItem('user_info', JSON.stringify(json.data.user));
        document.cookie = `auth_token=${json.data.token}; path=/; max-age=86400; SameSite=Lax`;
      }

      // Redireciona para o Dashboard do Corretor
      router.push('/dashboard');
    } catch (err: any) {
      setErro('Não foi possível conectar ao servidor. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Luzes de fundo decorativas */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-600/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <Link href="/" className="inline-flex items-center gap-2 text-2xl font-black text-white tracking-tight">
          <Building2 className="w-8 h-8 text-blue-500" />
          <span>Imóveis <span className="text-blue-500">Taboão</span></span>
        </Link>
        <h2 className="mt-4 text-2xl font-extrabold text-white">
          {modo === 'login' ? 'Acesse o Painel do Corretor' : 'Crie sua Conta de Corretor'}
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          {modo === 'login'
            ? 'Gerencie seus imóveis, créditos e backups de fotos em alta resolução.'
            : 'Ganhe 1 Crédito Grátis + Central de Backups R2 ao se cadastrar.'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-slate-900 border border-slate-800 py-8 px-4 shadow-2xl rounded-2xl sm:px-10">
          
          {/* Seletor de Modo (Login vs Cadastro) */}
          <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-800 mb-6">
            <button
              type="button"
              onClick={() => { setModo('login'); setErro(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                modo === 'login' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Entrar na Conta
            </button>
            <button
              type="button"
              onClick={() => { setModo('cadastro'); setErro(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                modo === 'cadastro' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Criar Conta Grátis
            </button>
          </div>

          {/* Banner de Bônus de Cadastro */}
          {modo === 'cadastro' && (
            <div className="bg-blue-950/60 border border-blue-800/50 rounded-xl p-3 mb-6 text-xs text-blue-200 flex items-start gap-2.5">
              <Sparkles className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-bold">Bônus de Boas-Vindas!</strong>
                Cadastre-se agora e receba <strong>1 crédito grátis</strong> para publicar seu primeiro imóvel por 90 dias.
              </div>
            </div>
          )}

          {erro && (
            <div className="bg-red-950/80 border border-red-800 text-red-200 text-xs p-3.5 rounded-xl mb-6 font-medium">
              ⚠️ {erro}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {modo === 'cadastro' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Nome Completo
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Seu nome ou nome da imobiliária"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      WhatsApp / Fone
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={telefone}
                        onChange={(e) => setTelefone(e.target.value)}
                        placeholder="(11) 99999-9999"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                      CRECI (Opcional)
                    </label>
                    <div className="relative">
                      <ShieldCheck className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={creci}
                        onChange={(e) => setCreci(e.target.value)}
                        placeholder="12345-F"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                E-mail Profissional
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="corretor@seuemail.com.br"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Senha de Acesso
                </label>
                {modo === 'login' && (
                  <Link href="/esqueci-senha" className="text-xs text-blue-400 hover:text-blue-300 font-medium">
                    Esqueceu a senha?
                  </Link>
                )}
              </div>
              <div className="relative">

                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={mostrarSenha ? 'text' : 'password'}
                  required
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {mostrarSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all text-sm flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
            >
              {loading ? (
                <span>Autenticando...</span>
              ) : (
                <>
                  <span>{modo === 'login' ? 'Entrar no Dashboard' : 'Criar Minha Conta e Ganhar Crédito'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-slate-800 pt-4 text-center">
            <p className="text-xs text-slate-500">
              Ambiente 100% seguro com criptografia JWT.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
