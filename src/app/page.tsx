export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="bg-blue-50 p-8 rounded-full mb-6">
        <span className="text-6xl">🏠</span>
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4 font-serif">Imóveis Taboão</h1>
      <p className="text-gray-600 text-lg max-w-md mx-auto leading-relaxed">
        Seu novo portal imobiliário está sendo construído. 
        Em breve, a melhor experiência para encontrar seu novo lar em Taboão da Serra.
      </p>
      <div className="mt-10 flex gap-4">
        <a 
          href="https://wa.me/5511932785602" 
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold shadow-md hover:bg-green-700 transition-all"
        >
          Falar no WhatsApp
        </a>
      </div>
    </div>
  );
}
