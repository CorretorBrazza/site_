export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-blue-400">Imóveis Taboão</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Especialistas em realizar sonhos em Taboão da Serra. 
              Segurança e transparência em cada negociação de venda ou locação.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contato</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-center gap-2">
                <span>📍</span> Taboão da Serra, SP
              </li>
              <li className="flex items-center gap-2">
                <span>📞</span> (11) 93278-5602
              </li>
              <li className="flex items-center gap-2">
                <span>📧</span> contato@imoveistabao.com.br
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Acesso Rápido</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="/venda" className="hover:text-blue-400 transition-colors">Imóveis para Venda</a></li>
              <li><a href="/locacao" className="hover:text-blue-400 transition-colors">Imóveis para Locação</a></li>
              <li><a href="/dashboard" className="hover:text-blue-400 transition-colors">Área do Administrador</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-xs">
          &copy; {new Date().getFullYear()} Imóveis Taboão. Desenvolvido para máxima performance.
        </div>
      </div>
    </footer>
  );
}
