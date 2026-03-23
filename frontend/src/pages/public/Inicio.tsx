import { Link } from "react-router-dom";
import Hero from "../../components/public/Hero";
import ExperimentosRecientes from "../../components/public/ExperimentosRecientes";
import { useNotes } from "../../hooks/useNotes";

export default function Inicio() {
  const { notas, loading, error } = useNotes();
  const notasRecientes = notas.slice(0, 3);

  return (
    <div className="space-y-24 pb-16">
      
      <Hero />
      
      <section className="max-w-4xl mx-auto px-6 text-center md:text-left">
        <div className="border-l-0 md:border-l-[3px] md:border-orange/80 md:pl-6 py-2">
          <h2 className="text-2xl md:text-3xl font-bold text-carbon mb-4 tracking-tight">
            Bitácora Abierta
          </h2>
          <p className="text-lg md:text-xl text-gray-dark leading-relaxed font-sans mb-4">
            "Cada experimento acá es una chispa de luz en la oscuridad. No buscamos la perfección en la primera línea de código, sino entender por qué funciona la última. Explora sin miedo."
          </p>
          <p className="text-sm text-gray-mid font-sans font-bold uppercase tracking-widest">
            — Lumireon
          </p>
        </div>
      </section>

      <ExperimentosRecientes />
      
      <section className="max-w-4xl mx-auto px-6">
        <div className="flex justify-between items-end mb-8 border-b border-gray-soft pb-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-carbon tracking-tight">Apuntes y Reflexiones</h2>
            <p className="text-gray-dark font-medium mt-2 font-sans">Últimas anotaciones del laboratorio.</p>
          </div>
          <Link to="/notas" className="text-orange font-bold hover:underline flex items-center gap-1">
            Ver todas <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>

        {loading && <p className="text-gray-dark animate-pulse font-sans">Cargando bitácora...</p>}
        {error && <p className="text-red-500 font-bold font-sans">{error}</p>}
        
        {!loading && !error && notasRecientes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {notasRecientes.map((nota) => (
              <Link 
                key={nota.id} 
                to="/notas" 
                className="bg-white p-6 rounded-xl border border-gray-soft shadow-sm hover:shadow-md transition-all hover:-translate-y-1 relative overflow-hidden flex flex-col h-full"
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-orange-subtle/50 to-transparent opacity-50 -z-0 rounded-tr-xl"></div>
                
                <h3 className="text-lg font-bold text-carbon mb-3 relative z-10">{nota.title}</h3>
                <p className="text-sm text-gray-dark font-sans whitespace-pre-wrap line-clamp-3 relative z-10 flex-grow">
                  {nota.content}
                </p>
                
                <div className="mt-4 pt-3 border-t border-gray-soft/50 flex items-center text-gray-mid text-xs font-mono relative z-10">
                  <span className="material-symbols-outlined text-[14px] mr-1">calendar_today</span>
                  {new Date(nota.createdAt).toLocaleDateString('es-AR')}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}