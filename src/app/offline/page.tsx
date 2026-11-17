import Link from "next/link";
import { WifiOff } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sem conexão | Imóveis Taboão",
  description: "Você está sem conexão com a internet.",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <section className="mx-auto flex w-full max-w-xl flex-col items-center px-5 py-16 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-900/10 text-brand-900">
        <WifiOff size={30} aria-hidden="true" />
      </div>
      <h1 className="font-serif text-3xl font-bold text-brand-900">Você está sem conexão</h1>
      <p className="mt-3 text-base leading-relaxed text-ink/70">
        Não conseguimos carregar esta página agora. Verifique seu sinal de internet e tente
        novamente. Seus anúncios e créditos não são salvos neste aparelho: ao voltar a conexão,
        entre no painel para ver os dados atualizados.
      </p>
      <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        {/* Full reload e intencional: no offline, o router do Next pode servir
            novamente o HTML em cache em vez de tentar a rede. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a
          href="/"
          className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-brand-900 px-6 py-3 text-sm font-bold text-white"
        >
          Tentar novamente
        </a>
        <Link
          href="/dashboard"
          className="inline-flex min-h-[48px] items-center justify-center rounded-xl border border-brand-900/20 px-6 py-3 text-sm font-bold text-brand-900"
        >
          Ir para o painel
        </Link>
      </div>
    </section>
  );
}
