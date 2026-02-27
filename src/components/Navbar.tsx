import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex-shrink-0">
            <Link href="/" className="group flex flex-col">
              <span className="text-2xl font-black text-blue-700 tracking-tight leading-none group-hover:text-blue-800 transition-colors">
                IMÓVEIS
              </span>
              <span className="text-xs font-bold text-gray-500 tracking-[0.2em] leading-none mt-1">
                TABOÃO DA SERRA
              </span>
            </Link>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="hidden md:flex space-x-8">
              <Link href="/venda" className="text-gray-600 hover:text-blue-700 font-semibold transition-colors">
                Comprar
              </Link>
              <Link href="/locacao" className="text-gray-600 hover:text-blue-700 font-semibold transition-colors">
                Alugar
              </Link>
            </div>
            
            <Link 
              href="https://wa.me/5511932785602" 
              className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
            >
              Contato
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
