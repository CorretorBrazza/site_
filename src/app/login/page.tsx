'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Building2, Lock, Mail, User, Phone, ShieldCheck, Eye, EyeOff, Sparkles, ArrowRight, Loader2 } from 'lucide-react';

import { exchangeMagicToken, persistBrokerSession, stripTokenFromUrl } from '@/lib/api';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const recargaParam = searchParams.get('recarga');
  const tokenDinamico = searchParams.get('token') || searchParams.get('auth_token');

  const [modo, setModo] = useState<'login' | 'cadastro'>('login');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [validandoSessao, setValidandoSessao] = useState(true);

  // Form states
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [creci, setCreci] = useState('');

  // 1. Validação de Login Dinâmico / Sessão Ativa
  useEffect(() => {
    // Se veio com token na URL (login dinâmico / magic link de 24h do resumo do WhatsApp)
    if (tokenDinamico) {
      // O token da URL NÃO é uma sessão. Precisa ser trocado por uma sessão validada pela
      // API (POST /auth/magic-login) antes de qualquer gravação. A versão anterior gravava o
      // token cru em localStorage+cookie e redirecionava para /dashboard sem verificar nada,
      // o que deixava uma credencial não validada persistida e entrava na área autenticada
      // mesmo em caso de falha.
      (async () => {
        // Limpa a URL antes da chamada: o token já está em memória, então não há motivo para
        // deixá-lo exposto em Referer, histórico e logs durante o round-trip.
        stripTokenFromUrl();
        const result = await exchangeMagicToken(tokenDinamico);

        if (!result.success) {
          setErro(result.error || 'Link de acesso inválido ou expirado.');
          setValidandoSessao(false);
          return;
        }

        persistBrokerSession(result.data!.sessionToken, result.data!.user);
        const targetUrl = recargaParam ? `/dashboard?recarga=${encodeURIComponent(recargaParam)}` : '/dashboard';
        router.replace(targetUrl);
      })();
      return;
    }

    // Sessão ativa é decidida pelo cookie httpOnly, que o JS não enxerga.
    // Checar localStorage aqui (resquício da migração) gerava redirect loop
    // quando havia auth_token sem user_info válido.
    // Não há login dinâmico nem sessão prévia: exibe formulário
    setValidandoSessao(false);
  }, [tokenDinamico, recargaParam, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);
    setLoading(true);

    // Mesmo-origin de propósito. A sessão vive em cookie httpOnly, e cookie só
    // pertence ao domínio que o Recebeu: chamando a Railway direto daqui, o
    // Set-Cookie seria gravado em up.railway.app e o dashboard, que chama pelo
    // proxy em imoveistaboao.com.br, não veria o cookie. O sintoma era entrar e
    // sair na hora: primeiro request do painel vinha sem credencial e caía em 401.
    const endpoint = modo === 'login' ? '/api/v1/auth/login/' : '/api/v1/auth/register/';

    const body = modo === 'login'
      ? { email, senha }
      : { nome, email, senha, telefone, creci };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'same-origin',
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setErro(json.message || 'Erro ao realizar autenticação. Verifique os dados.');
        return;
      }

      // Guarda so o perfil. O token fica em cookie httpOnly, invisivel ao JS:
      // guardar em localStorage devolveria o problema que a migracao resolveu.
      if (json.data?.token) {
        persistBrokerSession(json.data.token, json.data.user);
      }

      // Redireciona para o Dashboard preservando o parâmetro de recarga se houver
      const targetUrl = recargaParam ? `/dashboard?recarga=${encodeURIComponent(recargaParam)}` : '/dashboard';
      router.push(targetUrl);
    } catch {
      setErro('Não foi possível conectar ao servidor. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };

  // Se estiver validando o token dinâmico ou sessão ativa, oculta formulários de login/senha
  if (validandoSessao) {
    return (
      <div className="min-h-screen bg-paper flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-line py-10 px-8 shadow-xl rounded-3xl text-center space-y-4 max-w-sm w-full">
          <Loader2 className="w-10 h-10 text-brand-800 animate-spin mx-auto" />
          <h2 className="text-lg font-black text-brand-900">Acessando Painel do Corretor</h2>
          <p className="text-xs text-muted font-medium leading-relaxed">
            Identificamos sua sessão dinâmica. Redirecionando para o seu dashboard com segurança...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Luzes de fundo decorativas sutis */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <Link href="/" className="inline-flex items-center gap-2 text-2xl font-extrabold text-brand-900 tracking-tight">
          <Building2 className="w-8 h-8 text-brand-800" />
          <span>Imóveis <span className="text-brand-800">Taboão</span></span>
        </Link>
        <h2 className="mt-4 text-2xl font-black text-brand-900">
          {modo === 'login' ? 'Acesse o Painel do Corretor' : 'Crie sua Conta de Corretor'}
        </h2>
        <p className="mt-1 text-sm text-ink font-medium">
          {modo === 'login'
            ? 'Gerencie seus imóveis, créditos e backups de fotos em alta resolução.'
            : 'Ganhe 1 Crédito Grátis + Central de Backups R2 ao se cadastrar.'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white border border-line py-8 px-4 shadow-xl rounded-3xl sm:px-10">
          
          {/* Seletor de Modo (Login vs Cadastro) */}
          <div className="flex bg-paper p-1.5 rounded-2xl border border-line mb-6">
            <button
              type="button"
              onClick={() => { setModo('login'); setErro(null); }}
              className={`flex-1 py-2.5 text-xs font-extrabold rounded-xl transition-all ${
                modo === 'login' ? 'bg-brand-900 text-white shadow-sm' : 'text-ink hover:text-brand-900'
              }`}
            >
              Entrar na Conta
            </button>
            <button
              type="button"
              onClick={() => { setModo('cadastro'); setErro(null); }}
              className={`flex-1 py-2.5 text-xs font-extrabold rounded-xl transition-all ${
                modo === 'cadastro' ? 'bg-brand-900 text-white shadow-sm' : 'text-ink hover:text-brand-900'
              }`}
            >
              Criar Conta Grátis
            </button>
          </div>

          {/* Banner de Bônus de Cadastro */}
          {modo === 'cadastro' && (
            <div className="bg-brand-900/5 border border-brand-700/30 rounded-2xl p-3.5 mb-6 text-xs text-brand-800 flex items-start gap-2.5">
              <Sparkles className="w-5 h-5 text-brand-800 shrink-0 mt-0.5" />
              <div>
                <strong className="text-brand-800 block font-bold">Bônus de Boas-Vindas!</strong>
                Cadastre-se agora e receba <strong>1 crédito grátis</strong> para publicar seu primeiro imóvel por 90 dias.
              </div>
            </div>
          )}

          {erro && (
            <div className="bg-danger/10 border border-danger/30 text-danger text-xs p-3.5 rounded-2xl mb-6 font-semibold">
              ⚠️ {erro}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {modo === 'cadastro' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
                    Nome Completo
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Seu nome ou nome da imobiliária"
                      className="w-full bg-paper focus:bg-white border border-line rounded-xl py-3 pl-10 pr-3 text-sm text-brand-900 placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-brand-700 font-medium transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
                      Telefone / Celular
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={telefone}
                        onChange={(e) => setTelefone(e.target.value)}
                        placeholder="(11) 99999-9999"
                        className="w-full bg-paper focus:bg-white border border-line rounded-xl py-3 pl-10 pr-3 text-sm text-brand-900 placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-brand-700 font-medium transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
                      CRECI (Opcional)
                    </label>
                    <div className="relative">
                      <ShieldCheck className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={creci}
                        onChange={(e) => setCreci(e.target.value)}
                        placeholder="12345-F"
                        className="w-full bg-paper focus:bg-white border border-line rounded-xl py-3 pl-10 pr-3 text-sm text-brand-900 placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-brand-700 font-medium transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1.5">
                E-mail Profissional
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="corretor@seuemail.com.br"
                  className="w-full bg-paper focus:bg-white border border-line rounded-xl py-3 pl-10 pr-3 text-sm text-brand-900 placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-brand-700 font-medium transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-ink uppercase tracking-wider">
                  Senha de Acesso
                </label>
                {modo === 'login' && (
                  <Link href="/esqueci-senha" className="text-xs text-brand-800 hover:text-brand-800 font-bold">
                    Esqueceu a senha?
                  </Link>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={mostrarSenha ? 'text' : 'password'}
                  required
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-paper focus:bg-white border border-line rounded-xl py-3 pl-10 pr-10 text-sm text-brand-900 placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-brand-700 font-medium transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
                >
                  {mostrarSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-4 bg-brand-900 hover:bg-brand-800 text-white font-extrabold rounded-xl shadow-lg shadow-brand-900/20/20 transition-all text-sm flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
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

          <div className="mt-6 border-t border-line pt-4 text-center">
            <p className="text-xs text-muted font-medium">
              Ambiente 100% seguro com criptografia JWT.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-paper flex items-center justify-center text-muted font-medium">Carregando...</div>}>
      <LoginContent />
    </Suspense>
  );
}
