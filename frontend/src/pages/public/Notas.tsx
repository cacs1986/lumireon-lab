import { useNotes } from "../../hooks/useNotes";

export default function Notas() {
  const { notas, loading, error } = useNotes();

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto pb-12">
      
      <header className="border-b border-gray-soft pb-4">
        <h1 className="text-3xl text-carbon tracking-tight">Notas del Laboratorio</h1>
        <p className="mt-2 text-gray-dark font-sans text-lg">
          Reflexiones breves, ideas sueltas y observaciones durante el proceso.
        </p>
      </header>
      
      {loading && (
        <div className="py-12 text-center text-gray-dark animate-pulse font-sans">
          Cargando reflexiones...
        </div>
      )}

      {error && (
        <div className="py-12 text-center text-red-500 font-sans font-bold">
          {error}
        </div>
      )}

      {!loading && !error && notas.length === 0 && (
        <div className="py-12 text-center text-gray-mid font-sans border-2 border-dashed border-gray-soft rounded-xl bg-bone/50">
          <p>Aún no hay notas registradas en este sector.</p>
        </div>
      )}

      {!loading && !error && notas.length > 0 && (
        <div className="grid gap-6">
          {notas.map((nota) => (
            <article 
              key={nota.id} 
              className="bg-white p-6 md:p-8 rounded-xl border border-gray-soft shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-orange-subtle/50 to-transparent opacity-50 -z-0 rounded-tr-xl"></div>
              
              <div className="relative z-10">
                <h2 className="text-xl font-bold text-carbon mb-3">{nota.title}</h2>
                <p className="text-gray-dark font-sans text-base whitespace-pre-wrap leading-relaxed">
                  {nota.content}
                </p>
                
                <div className="mt-6 pt-4 border-t border-gray-soft/50 flex items-center text-gray-mid text-sm font-mono">
                  <span className="material-symbols-outlined text-[16px] mr-2">calendar_today</span>
                  {new Date(nota.createdAt).toLocaleDateString('es-AR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}