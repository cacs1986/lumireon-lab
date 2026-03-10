import type { Project } from '../types/Project';

export const mockProjects: Project[] = [
  {
    id: 'proj-001',
    title: 'Plataforma Clasear',
    slug: 'plataforma-clasear',
    context: 'Aplicación principal desarrollada como espacio educativo y portafolio técnico. El sistema gestiona un catálogo de materias estructurado.',
    problem: 'La experiencia de usuario (UX) al explorar materias era confusa. Se requería un sistema robusto de filtrado y paginación, además de alinear los componentes visuales a la identidad corporativa (específicamente el uso del azul corporativo en estados inactivos).',
    process: 'Se refactorizó la lógica de filtrado del catálogo de materias. A nivel visual, se ajustaron los componentes para respetar los lineamientos de la marca, asegurando una navegación sin fricciones para el estudiante.',
    difficulties: 'Manejar el estado complejo del filtrado combinado con la paginación sin comprometer el rendimiento de la aplicación en React.',
    learnings: 'Mejor comprensión sobre la gestión del estado y el refinamiento de la UX mediante detalles visuales sutiles que guían al usuario.',
    status: 'En evolución',
    tags: ['React', 'TypeScript', 'UX/UI', 'Educación'],
    createdAt: '2026-02-15T10:00:00Z',
  },
  {
    id: 'proj-002',
    title: 'Robótica en el Aula con Arduino',
    slug: 'robotica-aula-arduino',
    context: 'Proyecto orientado a fusionar la programación orientada a objetos (OOP) con la robótica educativa para facilitar el aprendizaje práctico.',
    problem: 'El código monolítico tradicional de los autos robóticos dificultaba que los alumnos entendieran el comportamiento individual de cada sensor y motor de forma aislada.',
    process: 'Aplicación de conceptos de OOP y patrones de diseño para encapsular la lógica de los componentes de hardware en clases reutilizables.',
    difficulties: 'Adaptar conceptos abstractos de arquitectura de software al entorno de memoria limitada de un microcontrolador y explicarlo a un nivel inicial.',
    learnings: 'La abstracción a través de clases no solo limpia el código, sino que proporciona un modelo mental mucho más didáctico para que los estudiantes entiendan el flujo de datos.',
    status: 'Cerrado',
    tags: ['Arduino', 'OOP', 'Robótica', 'Docencia'],
    createdAt: '2025-11-20T14:30:00Z',
  }
];