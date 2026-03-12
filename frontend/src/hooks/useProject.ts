import { useState, useEffect } from 'react';
import type { Project } from '../types/Project';
import { projectService } from '../servicios/projectService';

export function useProject(slug: string | undefined) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!slug) {
        setError('URL inválida. Falta el identificador del proyecto.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const data = await projectService.getBySlug(slug);
        
        if (data) {
          setProject(data);
        } else {
          setError('Proyecto no encontrado en la base de datos.');
        }
      } catch (err) {
        console.error("Error en useProject:", err);
        setError('Ocurrió un error de conexión al cargar el proyecto.');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [slug]);

  return { project, loading, error };
}