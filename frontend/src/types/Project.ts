export type ProjectStatus = 'En evolución' | 'Cerrado' | 'Replanteado';

export interface Project {
  id: string;
  title: string;
  slug: string;
  imagen_url?: string;      
  repositorio_url?: string; 
  codigo_snippet?: string;
  context: string;
  problem: string;
  process: string;
  difficulties: string;
  learnings: string;
  status: string;
  tags: string[];
  tipo: string;
  createdAt?: string;
}