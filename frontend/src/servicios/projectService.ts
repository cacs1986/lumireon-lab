import type{ Project } from '../types/Project';

const API_URL = import.meta.env.VITE_API_URL + '/projects';

export const projectService = {
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

  create: async (projectData: Omit<Project, 'id' | 'createdAt'>): Promise<{ success: boolean; id?: string }> => {
    try {
      const token = localStorage.getItem('lumireon_token');
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
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

  update: async (id: string, projectData: Omit<Project, 'id' | 'createdAt'>): Promise<{ success: boolean }> => {
    try {
      const token = localStorage.getItem('lumireon_token');
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT', 
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