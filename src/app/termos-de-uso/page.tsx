import { Metadata } from 'next';
import { FileText, AlertCircle, ShieldAlert, Scale, HelpCircle, Lock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Termos de Uso | Imóveis Taboão',
  description: 'Leia os Termos de Uso do site Imóveis Taboão. Saiba quais são as regras de navegação, direitos autorais e limites de responsabilidade.',
};

export default function TermosUsoPage() {
  return (
    <div className="bg-[#F9FAFB] min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex p-3 bg-blue-50 rounded-2xl text-blue-600 mb-4 border border-blue-100">
            <FileText size={32} />
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4">Termos de Uso</h1>
          <p className="text-gray-500 max-w-xl mx-auto font-medium">
            Por favor, leia atentamente as regras e condições de uso do nosso portal imobiliário.
          </p>
          <p className="text-xs text-gray-400 mt-2 font-semibold uppercase tracking-wider">Última atualização: Junho de 2026</p>
        </div>

        {/* Content Box */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 md:p-12 space-y-10">
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Scale className="text-blue-600" size={20} />
              1. Aceitação dos Termos
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Ao acessar, navegar ou utilizar o site <span className="font-semibold text-gray-900">Imóveis Taboão</span>, você concorda em cumprir e estar vinculado a estes Termos de Uso, bem como a todas as leis e regulamentos aplicáveis. Se você não concordar com algum destes termos, solicitamos que não utilize este site.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <ShieldAlert className="text-blue-600" size={20} />
              2. Propriedade Intelectual e Uso do Conteúdo
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Todo o conteúdo disponibilizado neste site, incluindo, mas não se limitando a: textos, fotos de imóveis, logotipos, ilustrações, códigos e design da interface, é de propriedade exclusiva do Imóveis Taboão ou de seus licenciadores, e está protegido pelas leis de direitos autorais brasileiras e tratados internacionais.
            </p>
            <p className="text-gray-600 leading-relaxed">
              É terminantemente proibido copiar, reproduzir, modificar, republicar ou distribuir qualquer material deste site sem a nossa autorização prévia por escrito.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <AlertCircle className="text-blue-600" size={20} />
              3. Precisão das Informações sobre Imóveis
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Trabalhamos diligentemente para garantir que as informações sobre os imóveis (valores, metragens, características e disponibilidade) sejam precisas e atualizadas. No entanto, estes dados podem ser alterados sem aviso prévio por parte dos proprietários ou construtoras parceiras.
            </p>
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-5 text-sm text-amber-800 leading-relaxed">
              <strong className="block mb-1">Aviso Importante:</strong>
              As imagens, renders artísticos e plantas dos empreendimentos em lançamento são meramente ilustrativos. Os valores oficiais e condições exatas devem ser confirmados diretamente com nossos corretores de plantão por meio do envio da tabela oficial de vendas atualizada.
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Lock className="text-blue-600" size={20} />
              4. Limitações de Responsabilidade
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Em nenhuma circunstância o Imóveis Taboão, seus diretores ou corretores parceiros serão responsáveis por quaisquer danos diretos, indiretos ou consequentes decorrentes do uso ou da impossibilidade de usar os materiais em nosso site, mesmo que tenhamos sido notificados sobre a possibilidade de tais danos.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <HelpCircle className="text-blue-600" size={20} />
              5. Modificações dos Termos
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Reservamo-nos o direito de revisar estes Termos de Uso a qualquer momento, sem aviso prévio. Ao continuar a utilizar este site após a publicação de modificações, você concorda em estar vinculado à versão mais recente deste documento.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Em caso de dúvidas relacionadas aos Termos de Uso, entre em contato pelo e-mail <span className="font-semibold text-blue-600">contato@imoveistaboao.com.br</span>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
