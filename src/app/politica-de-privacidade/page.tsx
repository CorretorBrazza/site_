import { Metadata } from 'next';
import { Shield, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Política de Privacidade | Imóveis Taboão',
  description: 'Conheça nossa Política de Privacidade. Saiba como coletamos, usamos e protegemos seus dados pessoais de acordo com a LGPD.',
};

export default function PoliticaPrivacidadePage() {
  return (
    <div className="bg-[#F9FAFB] min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex p-3 bg-blue-50 rounded-2xl text-blue-600 mb-4 border border-blue-100">
            <Shield size={32} />
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4">Política de Privacidade</h1>
          <p className="text-gray-500 max-w-xl mx-auto font-medium">
            Entenda como cuidamos das suas informações em conformidade com a LGPD (Lei Geral de Proteção de Dados).
          </p>
          <p className="text-xs text-gray-400 mt-2 font-semibold uppercase tracking-wider">Última atualização: Junho de 2026</p>
        </div>

        {/* Content Box */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 md:p-12 space-y-10">
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Eye className="text-blue-600" size={20} />
              1. Informações que Coletamos
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Coletamos informações pessoais que você nos fornece voluntariamente ao interagir com o site, tais como ao preencher formulários de contato, solicitar tabelas de valores, ou interagir pelo WhatsApp. Esses dados podem incluir:
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-600 font-medium">
              <li className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <CheckCircle2 className="text-green-500 shrink-0" size={16} />
                Nome Completo
              </li>
              <li className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <CheckCircle2 className="text-green-500 shrink-0" size={16} />
                Endereço de E-mail
              </li>
              <li className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <CheckCircle2 className="text-green-500 shrink-0" size={16} />
                Telefone / WhatsApp
              </li>
              <li className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <CheckCircle2 className="text-green-500 shrink-0" size={16} />
                Preferências de Imóveis
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="text-blue-600" size={20} />
              2. Como Utilizamos Seus Dados
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Os dados coletados são utilizados exclusivamente para:
            </p>
            <ul className="space-y-2 text-gray-600 pl-4 list-disc">
              <li>Responder a dúvidas, consultas e solicitações de atendimento;</li>
              <li>Enviar informações sobre imóveis de seu interesse, tabelas de preços e campanhas promocionais;</li>
              <li>Personalizar e melhorar a sua experiência de navegação em nosso site;</li>
              <li>Cumprir obrigações legais e regulatórias.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Lock className="text-blue-600" size={20} />
              3. Cookies e Rastreamento
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Utilizamos cookies e tecnologias similares (como Google Analytics) para analisar o tráfego do site, entender o comportamento do usuário e melhorar constantemente a usabilidade. Você pode desativar os cookies nas configurações do seu navegador a qualquer momento, embora isso possa afetar algumas funcionalidades do site.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Shield className="text-blue-600" size={20} />
              4. Compartilhamento de Dados e Segurança
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Não vendemos, alugamos ou comercializamos seus dados pessoais com terceiros. Seus dados só serão compartilhados com parceiros estratégicos (como construtoras e correspondentes bancários) mediante a sua autorização expressa ou para viabilizar as negociações imobiliárias solicitadas por você.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Adotamos medidas técnicas e administrativas avançadas para proteger seus dados contra acessos não autorizados, perdas ou alterações indesejadas.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <CheckCircle2 className="text-blue-600" size={20} />
              5. Seus Direitos (LGPD)
            </h2>
            <p className="text-gray-600 leading-relaxed">
              De acordo com a Lei Geral de Proteção de Dados (LGPD), você é o proprietário dos seus dados e tem o direito de:
            </p>
            <ul className="space-y-2 text-gray-600 pl-4 list-disc">
              <li>Confirmar a existência do tratamento de dados;</li>
              <li>Acessar seus dados pessoais coletados;</li>
              <li>Solicitar a correção de dados incompletos, inexatos ou desatualizados;</li>
              <li>Requerer a exclusão definitiva dos seus dados de nossa base de dados (revogação de consentimento).</li>
            </ul>
            <p className="text-gray-600 leading-relaxed pt-2">
              Para exercer qualquer um desses direitos, entre em contato conosco através do e-mail <span className="font-semibold text-blue-600">contato@imoveistaboao.com.br</span>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
