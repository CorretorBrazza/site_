export default function LoadingVitrine() {
  return (
    <div className="min-h-[60vh] bg-[#070e1c] text-white" aria-busy="true" aria-label="Carregando vitrine">
      <div className="mx-auto max-w-4xl animate-pulse px-4 py-10">
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
          <div className="h-28 w-28 shrink-0 rounded-full bg-brand-800 sm:h-32 sm:w-32" />
          <div className="w-full space-y-3">
            <div className="h-8 w-2/3 rounded bg-brand-800" />
            <div className="h-4 w-full max-w-xl rounded bg-brand-800/80" />
            <div className="h-4 w-1/2 max-w-md rounded bg-brand-800/60" />
            <div className="h-10 w-40 rounded-xl bg-brand-800" />
          </div>
        </div>
        <div className="mt-8 grid grid-cols-3 gap-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="h-20 rounded-xl bg-brand-900" />
          ))}
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="h-64 rounded-2xl bg-brand-900" />
          ))}
        </div>
      </div>
    </div>
  );
}
