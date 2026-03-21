import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { ProjectStatus } from "../../types/Project";
import { projectService } from "../../servicios/projectService";
import BotonSubirImagen from "../../components/admin/BotonSubirImagen";
import toast from 'react-hot-toast';

export default function AdminProyecto() {
  const navigate = useNavigate();
  const { id } = useParams(); 
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    imagen_url: "",      
    repositorio_url: "",
    codigo_snippet: "",
    status: "En evolución" as ProjectStatus,
    tags: "", 
    tipo: "personal", // NUEVO CAMPO AGREGADO
    context: "",
    problem: "",
    process: "",
    difficulties: "",
    learnings: ""
  });

  useEffect(() => {
    if (id) {
      const cargarProyecto = async () => {
        const proyectoData = await projectService.getById(id);
        if (proyectoData) {
          setFormData({
            title: proyectoData.title,
            slug: proyectoData.slug,
            imagen_url: proyectoData.imagen_url || "",           
            repositorio_url: proyectoData.repositorio_url || "", 
            codigo_snippet: proyectoData.codigo_snippet || "",
            status: proyectoData.status as ProjectStatus,
            tags: proyectoData.tags ? proyectoData.tags.join(', ') : "", 
            tipo: proyectoData.tipo || "personal", // RECUPERA EL TIPO SI EXISTE
            context: proyectoData.context,
            problem: proyectoData.problem,
            process: proyectoData.process,
            difficulties: proyectoData.difficulties || "",
            learnings: proyectoData.learnings
          });
        }
      };
      cargarProyecto();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const tagsArray = formData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const projectToSave = {
      ...formData,
      tags: tagsArray
    };

    let result;
    
    if (id) {
      result = await projectService.update(id, projectToSave);
    } else {
      result = await projectService.create(projectToSave);
    }

    if (result.success) {
      toast.success('¡Proyecto guardado con éxito!');
      navigate('/admin/dashboard'); 
    } else {
      toast.error('Hubo un error al guardar el proyecto');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      <header className="flex justify-between items-center border-b border-gray-soft pb-4">
        <div>
          <h1 className="text-2xl font-bold text-carbon">{id ? 'Editar Proyecto' : 'Nuevo Proyecto'}</h1>
          <p className="text-sm text-gray-dark mt-1 font-sans">Documenta el proceso en detalle. Soporta Markdown.</p>
        </div>
        <button 
          onClick={() => navigate('/admin/dashboard')}
          className="text-gray-dark hover:text-carbon font-medium text-sm transition-colors"
        >
          Cancelar
        </button>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-lg border border-gray-soft shadow-sm font-sans">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-carbon">Título del Proyecto</label>
            <input 
              required type="text" name="title" value={formData.title} onChange={handleChange}
              className="w-full border border-gray-soft rounded px-3 py-2 text-carbon focus:border-orange focus:ring-1 focus:ring-orange outline-none"
              placeholder="Ej: Plataforma Clasear"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-bold text-carbon">Slug (URL amigable)</label>
            <input 
              required type="text" name="slug" value={formData.slug} onChange={handleChange}
              className="w-full border border-gray-soft rounded px-3 py-2 text-carbon focus:border-orange focus:ring-1 focus:ring-orange outline-none font-mono text-sm"
              placeholder="ej-plataforma-clasear"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-carbon">Imagen de Portada</label>

            {formData.imagen_url && (
              <div className="mb-2 h-24 w-32 overflow-hidden rounded border border-gray-soft">
                <img src={formData.imagen_url} alt="Vista previa" className="h-full w-full object-cover" />
              </div>
            )}

            <BotonSubirImagen 
              onImagenSubida={(url) => setFormData(prev => ({ ...prev, imagen_url: url }))} 
            />
            
            <p className="text-xs text-gray-mid">
              La imagen se subirá automáticamente a tu nube y se guardará la URL.
            </p>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-bold text-carbon">URL del Código (Repositorio)</label>
            <input 
              type="text" name="repositorio_url" value={formData.repositorio_url} onChange={handleChange}
              className="w-full border border-gray-soft rounded px-3 py-2 text-carbon focus:border-orange focus:ring-1 focus:ring-orange outline-none font-mono text-sm"
              placeholder="Ej: https://github.com/tu-usuario/tu-repo"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-carbon">Estado</label>
            <select 
              name="status" value={formData.status} onChange={handleChange}
              className="w-full border border-gray-soft rounded px-3 py-2 text-carbon focus:border-orange focus:ring-1 focus:ring-orange outline-none bg-white"
            >
              <option value="En evolución">En evolución</option>
              <option value="Cerrado">Cerrado</option>
              <option value="Replanteado">Replanteado</option>
            </select>
          </div>
          
          {/* NUEVO CAMPO: CATEGORÍA (TIPO) */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-carbon">Categoría</label>
            <select 
              name="tipo" value={formData.tipo} onChange={handleChange}
              className="w-full border border-gray-soft rounded px-3 py-2 text-carbon focus:border-orange focus:ring-1 focus:ring-orange outline-none bg-white font-bold"
            >
              <option value="personal">👨‍💻 Proyecto Personal</option>
              <option value="pedagogico">🎓 Proyecto Pedagógico (Aula)</option>
            </select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="block text-sm font-bold text-carbon">Etiquetas (separadas por coma)</label>
            <input 
              type="text" name="tags" value={formData.tags} onChange={handleChange}
              className="w-full border border-gray-soft rounded px-3 py-2 text-carbon focus:border-orange focus:ring-1 focus:ring-orange outline-none font-mono text-sm"
              placeholder="React, TypeScript, Arduino..."
            />
          </div>
        </div>

        <hr className="border-gray-soft" />

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-carbon">Contexto</label>
            <textarea 
              required name="context" value={formData.context} onChange={handleChange} rows={3}
              className="w-full border border-gray-soft rounded px-3 py-2 text-carbon focus:border-orange focus:ring-1 focus:ring-orange outline-none resize-y"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-bold text-carbon">El Problema</label>
            <textarea 
              required name="problem" value={formData.problem} onChange={handleChange} rows={3}
              className="w-full border border-gray-soft rounded px-3 py-2 text-carbon focus:border-orange focus:ring-1 focus:ring-orange outline-none resize-y"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-carbon flex justify-between">
              <span>Proceso de Desarrollo</span>
              <span className="text-xs font-normal text-gray-mid">Soporta listas, negritas y enlaces en Markdown</span>
            </label>
            <textarea 
              required name="process" value={formData.process} onChange={handleChange} rows={6}
              className="w-full border border-gray-soft rounded px-3 py-2 text-carbon focus:border-orange focus:ring-1 focus:ring-orange outline-none resize-y font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-carbon">Código Snippet (Opcional)</label>
            <textarea 
              name="codigo_snippet" value={formData.codigo_snippet} onChange={handleChange} rows={6}
              className="w-full border border-gray-soft rounded px-3 py-2 text-carbon focus:border-orange focus:ring-1 focus:ring-orange outline-none resize-y font-mono text-xs bg-gray-50"
              placeholder="Pega aquí tu código de Arduino directamente..."
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-carbon">Dificultades</label>
            <textarea 
              name="difficulties" value={formData.difficulties} onChange={handleChange} rows={4}
              className="w-full border border-gray-soft rounded px-3 py-2 text-carbon focus:border-orange focus:ring-1 focus:ring-orange outline-none resize-y"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-carbon">Aprendizajes Clave</label>
            <textarea 
              required name="learnings" value={formData.learnings} onChange={handleChange} rows={4}
              className="w-full border border-gray-soft rounded px-3 py-2 text-carbon focus:border-orange focus:ring-1 focus:ring-orange outline-none resize-y font-mono text-sm bg-bone/50"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-soft">
          <button 
            type="submit" 
            className="bg-carbon text-white px-6 py-2.5 rounded font-bold hover:bg-orange transition-colors shadow-sm"
          >
            Guardar Proyecto
          </button>
        </div>

      </form>
    </div>
  );
}