import { Metadata } from 'next';
import { ShieldAlert, Trash2, Mail, CheckCircle2, Lock, ArrowRight, FileText, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Instruções de Exclusão de Dados do Usuário | Imóveis Taboão',
  description: 'Instruções detalhadas de como solicitar a exclusão de dados pessoais e de aplicativo em conformidade com a LGPD e as Políticas da Meta Platform.',
  alternates: {
    canonical: 'https://imoveistaboao.com.br/exclusao-de-dados',
  },
};

export default function ExclusaoDadosPage() {
  return (
    <div className="bg-paper min-h-screen py-16 text-ink">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabeçalho */}
        <div className="text-center mb-12">
          <div className="inline-flex p-3 bg-danger/10 rounded-2xl text-danger mb-4 border border-danger/30 shadow-xs">
            <Trash2 size={32} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-brand-900 tracking-tight mb-4">
            Instruções de Exclusão de Dados do Usuário
          </h1>
          <p className="text-ink max-w-2xl mx-auto text-sm sm:text-base font-medium">
            Em conformidade com a <strong>LGPD (Lei Geral de Proteção de Dados - Lei 13.709/2018)</strong> e as políticas da <strong>Meta Platform (Facebook & WhatsApp Cloud API)</strong>, você tem total autonomia para solicitar a remoção completa dos seus dados de nossos servidores.
          </p>
          <p className="text-xs text-muted mt-3 font-bold uppercase tracking-wider">
            Última atualização: Agosto de 2026
          </p>
        </div>

        {/* Conteúdo Principal */}
        <div className="bg-white rounded-3xl border border-line shadow-sm p-6 sm:p-12 space-y-10">
          
          {/* Seção 1: Contexto e Integração Meta */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-brand-900 flex items-center gap-2">
              <ShieldAlert className="text-brand-800" size={20} />
              1. Integração com a Plataforma Meta (WhatsApp & Facebook)
            </h2>
            <p className="text-ink text-sm leading-relaxed">
              O portal <strong>Imóveis Taboão</strong> utiliza serviços autorizados da Meta Platform (como a <em>WhatsApp Business Cloud API</em>) para permitir que corretores e clientes enviem dados de captação de imóveis, recebam links de aprovação e interajam com nossos consultores de forma automatizada e segura.
            </p>
          </section>

          {/* Seção 2: Como solicitar a exclusão de dados */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-brand-900 flex items-center gap-2">
              <Trash2 className="text-danger" size={20} />
              2. Como Solicitar a Exclusão dos Seus Dados
            </h2>
            <p className="text-ink text-sm leading-relaxed">
              Você pode solicitar a exclusão permanente dos seus dados pessoais e de seus imóveis a qualquer momento através de um dos canais abaixo:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              
              {/* Opção 1: Por E-mail (Recomendado) */}
              <div className="bg-paper border border-line rounded-2xl p-5 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 font-bold text-brand-900 text-sm">
                    <Mail className="text-brand-800" size={18} />
                    <span>Opção 1: Via E-mail Oficial</span>
                  </div>
                  <p className="text-xs text-ink leading-relaxed">
                    Envie um e-mail para nossa equipe de privacidade com o assunto <strong>&ldquo;Solicitação de Exclusão de Dados (LGPD)&rdquo;</strong> contendo seu nome, e-mail cadastrado ou telefone.
                  </p>
                </div>
                <a
                  href="mailto:contato@imoveistaboao.com.br?subject=Solicitação%20de%20Exclusão%20de%20Dados%20(LGPD)&body=Olá,%20gostaria%20de%20solicitar%20a%20exclusão%20completa%20dos%20meus%20dados%20pessoais%20e%20anúncios%20cadastrados%20no%20Imóveis%20Taboão."
                  className="w-full py-2.5 px-4 bg-brand-900 hover:bg-brand-800 text-white font-bold rounded-xl text-xs text-center transition-colors block"
                >
                  contato@imoveistaboao.com.br
                </a>
              </div>

              {/* Opção 2: Pelo Painel do Corretor */}
              <div className="bg-paper border border-line rounded-2xl p-5 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 font-bold text-brand-900 text-sm">
                    <Lock className="text-success" size={18} />
                    <span>Opção 2: Pelo Painel do Corretor</span>
                  </div>
                  <p className="text-xs text-ink leading-relaxed">
                    Acesse seu painel com sua conta, vá na lista de imóveis e utilize o botão <strong>&ldquo;Excluir Anúncio&rdquo;</strong> para apagar dados e fotos imediatamente dos servidores.
                  </p>
                </div>
                <Link
                  href="/dashboard"
                  className="w-full py-2.5 px-4 bg-brand-900 hover:bg-brand-800 text-white font-bold rounded-xl text-xs text-center transition-colors block"
                >
                  Acessar Painel do Corretor
                </Link>
              </div>

            </div>
          </section>

          {/* Seção 3: O que acontece após a solicitação */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-brand-900 flex items-center gap-2">
              <CheckCircle2 className="text-success" size={20} />
              3. Quais Dados São Excluídos?
            </h2>
            <p className="text-ink text-sm leading-relaxed">
              Ao processar a sua solicitação de exclusão, os seguintes registros são permanentemente removidos:
            </p>
            <ul className="space-y-2.5 text-xs sm:text-sm text-ink">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="text-success shrink-0 mt-0.5" size={16} />
                <span><strong>Dados de Identificação:</strong> Nome completo, e-mail, telefone/celular e número de CRECI.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="text-success shrink-0 mt-0.5" size={16} />
                <span><strong>Anúncios e Fichas Técnicas:</strong> Todos os imóveis cadastrados, descrições, preços e endereços no banco de dados.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="text-success shrink-0 mt-0.5" size={16} />
                <span><strong>Acervo de Mídia:</strong> Todas as fotografias e imagens armazenadas em servidores de CDN (Cloudinary) e backups em nuvem (Cloudflare R2).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="text-success shrink-0 mt-0.5" size={16} />
                <span><strong>Sessões e Tokens:</strong> Tokens de autenticação JWT, tokens mágicos de aprovação e histórico de eventos.</span>
              </li>
            </ul>
          </section>

          {/* Seção 4: Prazos e SLAs */}
          <section className="space-y-3 bg-brand-900/5 border border-brand-700/30 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-brand-800 flex items-center gap-2">
              <HelpCircle className="text-brand-800" size={18} />
              Prazo de Atendimento
            </h3>
            <p className="text-xs text-brand-800 leading-relaxed">
              As solicitações manuais enviadas por e-mail são confirmadas e executadas em um prazo máximo de <strong>até 48 horas úteis</strong>. Após a conclusão, um e-mail de confirmação é enviado ao solicitante comprovando a eliminação definitiva dos registros.
            </p>
          </section>

          {/* Seção 5: Como remover aplicativo no Facebook/Meta */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-brand-900 flex items-center gap-2">
              <FileText className="text-ink" size={20} />
              4. Como Remover o Aplicativo pelas Configurações do Facebook/Meta
            </h2>
            <p className="text-ink text-sm leading-relaxed">
              Caso você tenha conectado sua conta Meta ao nosso aplicativo, você também pode revogar os acessos diretamente pela sua conta do Facebook:
            </p>
            <ol className="list-decimal pl-5 space-y-1.5 text-xs sm:text-sm text-ink font-medium">
              <li>Acesse o Facebook e vá em <strong>Configurações e Privacidade</strong> ➔ <strong>Configurações</strong>.</li>
              <li>No menu lateral esquerdo, clique em <strong>Aplicativos e Sites</strong>.</li>
              <li>Localize o aplicativo <strong>Imóveis Taboão</strong> na lista de aplicativos ativos.</li>
              <li>Clique em <strong>Remover</strong>.</li>
            </ol>
          </section>

          {/* Encarregado DPO */}
          <div className="pt-6 border-t border-line flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-muted">
            <div>
              <p className="font-bold text-ink">Encarregado de Proteção de Dados (DPO):</p>
              <p>Departamento de Privacidade e Segurança — Imóveis Taboão</p>
            </div>
            <Link
              href="/politica-de-privacidade"
              className="text-brand-800 hover:text-brand-800 font-bold flex items-center gap-1"
            >
              <span>Ver Política de Privacidade Completa</span>
              <ArrowRight size={14} />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
