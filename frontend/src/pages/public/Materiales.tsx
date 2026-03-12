import { useMaterials } from "../../hooks/useMaterial";

export default function Materiales() {

  const { materiales, loading, error } = useMaterials();

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case 'PDF': return 'bg-red-100 text-red-700 border-red-200';
      case 'Código': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Video': return 'bg-purple-100 text-purple-700 border-purple-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto pb-12">
      
      <header className="border-b border-gray-soft pb-4">
        <h1 className="text-3xl text-carbon tracking-tight">Recursos Didácticos</h1>
        <p className="mt-2 text-gray-dark font-sans text-lg">
          Cuadernillos, guías de ejercicios y material de apoyo del laboratorio.
        </p>
      </header>
      
      {loading && (
        <div className="py-12 text-center text-gray-dark animate-pulse font-sans">
          Cargando biblioteca...
        </div>
      )}

      {error && (
        <div className="py-12 text-center text-red-500 font-sans font-bold">
          {error}
        </div>
      )}

      {!loading && !error && materiales.length === 0 && (
        <div className="py-12 text-center text-gray-mid font-sans border-2 border-dashed border-gray-soft rounded-xl bg-bone/50">
          <p>La biblioteca está vacía por el momento.</p>
        </div>
      )}

      {!loading && !error && materiales.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {materiales.map((mat) => (
            <article key={mat.id} className="bg-white p-6 rounded-xl border border-gray-soft shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
              
              <div className="mb-4">
                <span className={`px-2 py-1 border text-xs font-bold uppercase tracking-wider rounded ${getBadgeStyle(mat.type)}`}>
                  {mat.type}
                </span>
              </div>
              
              <h2 className="text-xl font-bold text-carbon mb-2 leading-tight">{mat.title}</h2>
              <p className="text-gray-dark font-sans text-sm mb-6 flex-grow">
                {mat.description}
              </p>
              
              <div className="space-y-4 mt-auto">
                {mat.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {mat.tags.map((tag, i) => (
                      <span key={i} className="text-xs bg-bone text-gray-dark px-2 py-1 rounded font-mono">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
                
                <a 
                  href={mat.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="block w-full text-center bg-orange text-white font-bold py-2 px-4 rounded hover:bg-orange/90 transition-colors shadow-sm"
                >
                  Abrir Recurso
                </a>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}