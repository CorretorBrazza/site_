import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-blue-700">
              Imóveis <span className="text-gray-800 text-base font-medium">Taboão</span>
            </Link>
          </div>
          <div className="flex gap-2 sm:gap-4 items-center">
            <div className="flex space-x-3 sm:space-x-6 mr-2 sm:mr-6">
              <Link href="/venda" className="text-gray-600 hover:text-blue-700 text-sm sm:text-base font-medium transition-colors">Venda</Link>
              <Link href="/locacao" className="text-gray-600 hover:text-blue-700 text-sm sm:text-base font-medium transition-colors">Locação</Link>
            </div>
            {process.env.NODE_ENV === 'development' && (
              <Link href="/dashboard" className="bg-blue-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold hover:bg-blue-700 transition-all shadow-sm">
                Dash
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
