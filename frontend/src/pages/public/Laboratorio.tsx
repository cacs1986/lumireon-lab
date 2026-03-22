import { useState } from 'react'; // IMPORTANTE: Agregamos useState
import { Link } from 'react-router-dom';
import { useProjects } from '../../hooks/useProjects'; 

export default function Laboratorio() {
  const { projects, loading, error } = useProjects();
  // NUEVO ESTADO: Controla qué pestaña está activa. Por defecto mostramos los personales.
  const [activeTab, setActiveTab] = useState<'personal' | 'pedagogico'>('personal');

  // NUEVO FILTRO: Toma la lista completa y crea una sub-lista solo con los que coinciden con la pestaña activa.
  // Si un proyecto viejo no tiene 'tipo' guardado, lo asume como 'personal'.
  const filteredProjects = projects.filter(project => {
    const projectType = project.tipo || 'personal'; 
    return projectType === activeTab;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto pb-12">
      
      <header className="border-b border-gray-soft pb-4">
        <h1 className="text-3xl text-carbon tracking-tight">Laboratorio</h1>
        <p className="mt-2 text-gray-dark font-sans text-lg">
          Proyectos técnicos en evolución. Se valora el proceso tanto como el resultado.
        </p>
      </header>
      
      {/* NUEVO COMPONENTE: Pestañas de Navegación */}
      <div className="flex space-x-4 border-b border-gray-soft pb-2">
        <button
          onClick={() => setActiveTab('personal')}
          className={`pb-2 font-bold font-sans text-lg transition-colors border-b-2 ${
            activeTab === 'personal' 
              ? 'border-orange text-orange' 
              : 'border-transparent text-gray-dark hover:text-carbon'
          }`}
        >
          👨‍💻 Mis Proyectos
        </button>
        <button
          onClick={() => setActiveTab('pedagogico')}
          className={`pb-2 font-bold font-sans text-lg transition-colors border-b-2 ${
            activeTab === 'pedagogico' 
              ? 'border-orange text-orange' 
              : 'border-transparent text-gray-dark hover:text-carbon'
          }`}
        >
          🎓 Recursos del Aula
        </button>
      </div>

      {loading && <div className="py-12 text-center text-gray-dark font-sans animate-pulse">Cargando laboratorio...</div>}
      {error && <div className="py-12 text-center text-orange font-sans">{error}</div>}

      {/* MENSAJE DE ESTADO VACÍO (Por si entran a una pestaña que aún no tiene proyectos) */}
      {!loading && !error && filteredProjects.length === 0 && (
        <div className="py-12 text-center text-gray-dark font-sans">
          Aún no hay proyectos cargados en esta categoría.
        </div>
      )}

      {!loading && !error && filteredProjects.length > 0 && (
        <div className="grid gap-8 py-4">
          {/* CAMBIO CRÍTICO: Usamos filteredProjects.map en lugar de projects.map */}
          {filteredProjects.map((project) => (
            <article 
              key={project.id} 
              className="flex flex-col gap-3 rounded-lg border border-gray-soft bg-white p-6 shadow-sm transition-all hover:border-orange/50 hover:shadow-md"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                
                <div className="flex flex-col">
                  <h2 className="text-2xl font-bold text-carbon">
                    {project.title}
                  </h2>
                  
                  <div className="mt-2 mb-1 md:hidden">
                    <span className={`inline-block rounded px-2.5 py-1 text-xs font-bold uppercase tracking-wider font-sans shadow-sm ${
                      project.status === 'En evolución' ? 'bg-orange-subtle text-orange' : 'bg-gray-soft text-gray-dark'
                    }`}>
                      {project.status}
                    </span>
                  </div>

                  <p className="mt-1 font-sans text-sm text-gray-dark">
                    {project.context}
                  </p>
                </div>
                
                <span className={`hidden md:inline-block shrink-0 rounded px-2.5 py-1 text-xs font-bold uppercase tracking-wider font-sans shadow-sm ${
                  project.status === 'En evolución' ? 'bg-orange-subtle text-orange' : 'bg-gray-soft text-gray-dark'
                }`}>
                  {project.status}
                </span>
                
              </div>

              <div className="mt-4 border-l-2 border-gray-soft pl-4 font-sans text-sm text-gray-dark">
                <p><strong>El problema:</strong> {project.problem}</p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-gray-soft bg-bone px-3 py-1 font-mono text-xs text-gray-mid">
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="mt-4 text-right">
                <Link 
                  to={`/laboratorio/${project.slug}`}
                  className="font-sans text-sm font-medium text-orange hover:underline underline-offset-4"
                >
                  Leer proceso completo →
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}