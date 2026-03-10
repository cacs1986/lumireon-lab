import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { projectService } from "../../servicios/projectService"; 
import type { Project } from "../../types/Project";

export default function ExperimentosRecientes() {

  const [experimentos, setExperimentos] = useState<Project[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        
        const datos = await projectService.getAll(); 
        
        setExperimentos(datos.slice(0, 3));
      } catch (error) {
        console.error("Error al cargar los experimentos:", error);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  return (
    <section className="w-full bg-bone py-20">
      <div className="mx-auto max-w-5xl px-6">
        
        <div className="mb-12 flex items-baseline justify-between">
          <h2 className="font-sans text-3xl font-bold tracking-tight text-carbon md:text-4xl">
            Experimentos recientes
          </h2>
          <Link 
            to="/laboratorio" 
            className="text-sm font-medium text-orange transition-colors hover:text-orange/80 hover:underline underline-offset-4"
          >
            Ver todo el laboratorio →
          </Link>
        </div>

        {cargando ? (
          <div className="py-12 text-center text-gray-mid">Cargando registros del laboratorio...</div>
        ) : (
          
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {experimentos.map((exp) => (
              
              <Link 
                key={exp.id} 
                to={`/laboratorio/${exp.slug}`} 
                className="group flex flex-col justify-between rounded-xl border border-gray-soft bg-white p-6 transition-all hover:-translate-y-1 hover:border-orange/30 hover:shadow-lg hover:shadow-orange/5"
              >
                <div>
                  <div className="mb-3 flex gap-2 flex-wrap">
                    <span className="inline-block rounded-full bg-orange-subtle px-3 py-1 text-xs font-semibold text-orange">
                      {exp.status}
                    </span>
                    {exp.tags && exp.tags.length > 0 && (
                      <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-dark">
                        {exp.tags[0]}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="mb-2 font-sans text-xl font-bold text-carbon group-hover:text-orange transition-colors">
                    {exp.title}
                  </h3>
                  
                  <p className="text-sm leading-relaxed text-gray-dark">
                    {exp.context && exp.context.length > 100 
                      ? `${exp.context.substring(0, 100)}...` 
                      : exp.context}
                  </p>
                </div>
                
                <div className="mt-6 flex items-center text-sm font-bold text-gray-mid group-hover:text-orange transition-colors">
                  Explorar registro
                  <svg className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </Link>

            ))}
          </div>
        )}
      </div>
    </section>
  );
}