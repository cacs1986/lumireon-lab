import type{ Project } from '../types/Project';

// Cambia la URL fija por esto:
const API_URL = import.meta.env.VITE_API_URL + '/projects';

export const projectService = {
  // 1. Obtener todos los proyectos
  getAll: async (): Promise<Project[]> => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Error de red');
      return await response.json();
    } catch (error) {
      console.error("Error fetching projects:", error);
      return [];
    }
  },

  // 2. Obtener un proyecto por slug
  getBySlug: async (slug: string): Promise<Project | undefined> => {
    try {
      const response = await fetch(`${API_URL}/${slug}`);
      if (!response.ok) return undefined;
      return await response.json();
    } catch (error) {
      console.error("Error fetching project:", error);
      return undefined;
    }
  },

  // 3. Crear 
  create: async (projectData: Omit<Project, 'id' | 'createdAt'>): Promise<{ success: boolean; id?: string }> => {
    try {
      const token = localStorage.getItem('lumireon_token');
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          // 2. FUNDAMENTAL: Adjuntamos el token en la cabecera
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        // Leemos la respuesta del servidor
        const errorText = await response.text();
        console.error("CÓDIGO HTTP:", response.status);
        console.error("MOTIVO DEL RECHAZO:", errorText);
        
        throw new Error('Error en el servidor al guardar');
      }
      
      const data = await response.json();
      return { success: true, id: data.id };
    } catch (error) {
      console.error("Error al enviar proyecto:", error);
      return { success: false };
    }
  },

  // 4. Obtener por ID
  getById: async (id: string): Promise<Project | undefined> => {
    try {
      const response = await fetch(`${API_URL}/id/${id}`);
      if (!response.ok) return undefined;
      return await response.json();
    } catch (error) {
      console.error("Error fetching project by ID:", error);
      return undefined;
    }
  },

  // 5. Actualizar (PUT)
  update: async (id: string, projectData: Omit<Project, 'id' | 'createdAt'>): Promise<{ success: boolean }> => {
    try {
      const token = localStorage.getItem('lumireon_token');
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT', // Usamos el método de actualización
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) throw new Error('Error al actualizar en el servidor');
      return { success: true };
    } catch (error) {
      console.error("Error al actualizar proyecto:", error);
      return { success: false };
    }
  },

  // 6. Eliminar (DELETE)
  delete: async (id: string): Promise<{ success: boolean }> => {
    try {
      const token = localStorage.getItem('lumireon_token');
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}` 
        }
      });

      if (!response.ok) throw new Error('Error al eliminar en el servidor');
      return { success: true };
    } catch (error) {
      console.error("Error al eliminar proyecto:", error);
      return { success: false };
    }
  }
  
};