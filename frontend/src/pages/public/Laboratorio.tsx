import { Link } from 'react-router-dom';
import { useProjects } from '../../hooks/useProjects'; 

export default function Laboratorio() {
  const { projects, loading, error } = useProjects();

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto pb-12">
      
      <header className="border-b border-gray-soft pb-4">
        <h1 className="text-3xl text-carbon tracking-tight">Laboratorio</h1>
        <p className="mt-2 text-gray-dark font-sans text-lg">
          Proyectos técnicos en evolución. Se valora el proceso tanto como el resultado.
        </p>
      </header>
      
      {loading && <div className="py-12 text-center text-gray-dark font-sans animate-pulse">Cargando laboratorio...</div>}
      {error && <div className="py-12 text-center text-orange font-sans">{error}</div>}

      {!loading && !error && (
        <div className="grid gap-8 py-4">
          {projects.map((project) => (
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