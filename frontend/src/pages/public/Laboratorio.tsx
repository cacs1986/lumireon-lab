import { Link } from 'react-router-dom';
import { useProjects } from '../../hooks/useProjects'; // ← Aquí conectamos el motor real

export default function Laboratorio() {
  // Extraemos los datos, el estado de carga y los errores de nuestro hook
  const { projects, loading, error } = useProjects();

  return (
    <div className="space-y-8">
      <header className="border-b border-gray-soft pb-4">
        <h1 className="text-3xl text-carbon tracking-tight">Laboratorio</h1>
        <p className="mt-2 text-gray-dark font-sans text-lg">
          Proyectos técnicos en evolución. Se valora el proceso tanto como el resultado.
        </p>
      </header>
      
      {/* Manejo de estados de la base de datos */}
      {loading && <div className="py-12 text-center text-gray-dark font-sans animate-pulse">Cargando laboratorio...</div>}
      {error && <div className="py-12 text-center text-orange font-sans">{error}</div>}

      {/* Renderizado de los datos reales de SQLite */}
      {!loading && !error && (
        <div className="grid gap-8 py-4">
          {projects.map((project) => (
            <article 
              key={project.id} 
              className="flex flex-col gap-3 rounded-lg border border-gray-soft bg-white p-6 shadow-sm transition-all hover:border-orange/50 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-carbon">
                    {project.title}
                  </h2>
                  <p className="mt-1 font-sans text-sm text-gray-dark">
                    {project.context}
                  </p>
                </div>
                
                <span className={`shrink-0 rounded px-2.5 py-1 text-xs font-bold uppercase tracking-wider font-sans ${
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