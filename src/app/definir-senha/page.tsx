'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { persistBrokerSession, stripTokenFromUrl } from '@/lib/api';

function DefinirSenhaForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState<string | null>(null);
  const [senha, setSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    // O token chega na query porque o link é clicado no WhatsApp. Depois de
    // ler, ele sai da URL: a query inteira vai para o histórico do navegador e
    // para o header Referer em qualquer recurso carregado depois.
    const raw = searchParams.get('token');
    stripTokenFromUrl();
    setToken(raw && raw.length > 0 ? raw : null);
    setCarregando(false);
  }, [searchParams]);

  const submeter = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);

    if (senha.length < 8) {
      setErro('A senha precisa ter no mínimo 8 caracteres.');
      return;
    }
    if (senha !== confirmar) {
      setErro('As senhas não são iguais.');
      return;
    }

    setEnviando(true);
    try {
      // Mesma base same-origin do login: o cookie de sessão precisa nascer em
      // imoveistaboao.com.br, e não em up.railway.app.
      const res = await fetch('/api/v1/auth/definir-senha/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ token, senha }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        setErro(json.message || 'Não foi possível criar sua senha. O link pode ter expirado.');
        setEnviando(false);
        return;
      }

      // A sessão já vem em cookie httpOnly; aqui só guardamos o perfil, igual
      // ao login. O token nunca é persistido no navegador.
      if (json.data?.token) {
        persistBrokerSession(json.data.token, json.data.user);
      }
      router.push('/dashboard');
    } catch {
      setErro('Não foi possível conectar ao servidor. Verifique sua conexão.');
      setEnviando(false);
    }
  };

  if (carregando) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500 text-sm">Carregando...</p>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow p-8 max-w-md text-center">
          <h1 className="text-xl font-bold text-slate-800 mb-2">Link inválido</h1>
          <p className="text-sm text-slate-600 mb-6">
            Este link não tem código de acesso. Ele chega junto da mensagem de
            conclusão do cadastro no WhatsApp.
          </p>
          <a
            href="/login"
            className="inline-block bg-slate-900 text-white px-6 py-3 rounded-xl text-sm font-semibold"
          >
            Ir para o login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-slate-900 mb-1">Criar sua senha</h1>
        <p className="text-sm text-slate-500 mb-6">
          É só sua primeira senha de acesso ao painel.
        </p>

        <form onSubmit={submeter} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="senha">
              Senha
            </label>
            <input
              id="senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              minLength={8}
              required
              autoComplete="new-password"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              placeholder="mínimo 8 caracteres"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="confirmar">
              Repita a senha
            </label>
            <input
              id="confirmar"
              type="password"
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              minLength={8}
              required
              autoComplete="new-password"
              className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          {erro && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {erro}
            </p>
          )}

          <button
            type="submit"
            disabled={enviando}
            className="w-full bg-slate-900 text-white py-3 rounded-xl text-sm font-semibold disabled:opacity-60"
          >
            {enviando ? 'Criando...' : 'Criar senha e entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}

// `useSearchParams` exige fronteira de Suspense no App Router; sem isso o
// `next build` falha ao gerar a página estática.
export default function DefinirSenhaPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 text-sm">
          Carregando...
        </div>
      }
    >
      <DefinirSenhaForm />
    </Suspense>
  );
}
