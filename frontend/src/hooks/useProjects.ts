import { useState, useEffect } from 'react';
import type { Project } from '../types/Project';
import { projectService } from '../servicios/projectService';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await projectService.getAll();
        setProjects(data);
      } catch {
        setError('Error al cargar los proyectos.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return { projects, loading, error };
}