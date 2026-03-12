import { useState, useEffect } from 'react';
import type { Material } from '../../types/Material';
import { obtenerMateriales, crearMaterial, eliminarMaterial } from '../../servicios/materialService';
import toast from 'react-hot-toast';

export default function AdminMateriales() {
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tipo, setTipo] = useState('PDF');
  const [url, setUrl] = useState('');
  const [tags, setTags] = useState('');
  const [materialAEliminar, setMaterialAEliminar] = useState<{id: string, title: string} | null>(null);

  const token = localStorage.getItem('lumireon_token') || '';

  useEffect(() => {
    const fetchInicial = async () => {
      try {
        const data = await obtenerMateriales();
        setMateriales(data);
      } catch (error) {
        console.error("Error al cargar materiales:", error);
      }
    };
    fetchInicial();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
      await crearMaterial({
        title: titulo, description: descripcion, type: tipo, url: url, tags: tagsArray
      }, token);

      setTitulo(''); setDescripcion(''); setTipo('PDF'); setUrl(''); setTags('');
      const data = await obtenerMateriales();
      setMateriales(data);
      toast.success('Material guardado en la biblioteca');
    } catch (error) {
      console.error("Error al guardar:", error);
      toast.error('Error al guardar el material');
    }
  };

  const clickEliminar = (id: string, title: string) => {
    setMaterialAEliminar({ id, title });
  };

  const confirmarEliminacion = async () => {
    if (!materialAEliminar) return;
    try {
      await eliminarMaterial(materialAEliminar.id, token);
      const data = await obtenerMateriales();
      setMateriales(data);
      toast.success('Recurso eliminado con éxito');
    } catch (error) {
      console.error("Error al eliminar:", error);
      toast.error('Error al eliminar el recurso');
    } finally {
      setMaterialAEliminar(null);
    }
  };

  return (
    <div className="space-y-6 relative">
      
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-soft pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-carbon">Gestor de Materiales</h1>
          <p className="text-sm text-gray-dark mt-1 font-sans">Administra tus cuadernillos, ejercicios y recursos didácticos.</p>
        </div>
      </header>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-gray-soft shadow-sm space-y-4 font-sans">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-carbon mb-1">Título del Material</label>
            <input type="text" required value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ej: Cuadernillo Práctico de POO con C++" className="w-full border border-gray-soft rounded-md p-3 focus:border-orange focus:ring-1 focus:ring-orange outline-none" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-carbon mb-1">Descripción</label>
            <textarea required value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={3} placeholder="¿De qué trata este material y para quién está pensado?" className="w-full border border-gray-soft rounded-md p-3 focus:border-orange focus:ring-1 focus:ring-orange outline-none resize-y"></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-carbon mb-1">Tipo de Recurso</label>
            <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="w-full border border-gray-soft rounded-md p-3 focus:border-orange focus:ring-1 focus:ring-orange outline-none bg-white">
              <option value="PDF">Documento / PDF</option>
              <option value="Código">Código / Repositorio</option>
              <option value="Video">Video / Clase</option>
              <option value="Enlace">Enlace Externo</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-carbon mb-1">URL / Enlace</label>
            <input type="url" required value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://drive.google.com/..." className="w-full border border-gray-soft rounded-md p-3 focus:border-orange focus:ring-1 focus:ring-orange outline-none" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-carbon mb-1">Etiquetas (separadas por coma)</label>
            <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Ej: arduino, robótica, nivel-1" className="w-full border border-gray-soft rounded-md p-3 focus:border-orange focus:ring-1 focus:ring-orange outline-none" />
          </div>
        </div>
        <div className="flex justify-end pt-2">
          <button type="submit" className="bg-carbon text-white px-6 py-2.5 rounded font-bold hover:bg-orange transition-colors shadow-sm">
            Guardar Material
          </button>
        </div>
      </form>

      <div className="space-y-4 pt-6">
        <h3 className="text-xl font-bold text-carbon">Inventario de Materiales</h3>
        
        {materiales.length === 0 ? (
          <div className="bg-bone/50 border border-dashed border-gray-soft rounded-xl p-8 text-center text-gray-mid font-sans">
            No hay materiales cargados. Sube tu primer recurso arriba.
          </div>
        ) : (
          <div className="grid gap-4">
            {materiales.map((mat) => (
              <div key={mat.id} className="bg-white p-5 rounded-xl border border-gray-soft flex flex-col md:flex-row md:justify-between md:items-start gap-4 shadow-sm hover:border-orange/30 transition-colors">
                <div className="space-y-2 w-full">
                  <div className="flex items-center gap-2">
                    <span className="bg-gray-soft text-gray-dark px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">{mat.type}</span>
                    <h4 className="font-bold text-lg text-carbon">{mat.title}</h4>
                  </div>
                  <p className="text-gray-dark font-sans text-sm">{mat.description}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {mat.tags.map((tag, i) => (
                      <span key={i} className="text-xs bg-orange-subtle text-orange px-2 py-1 rounded font-mono">#{tag}</span>
                    ))}
                  </div>
                  <a href={mat.url} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-orange hover:underline inline-block mt-2 font-sans">Ver recurso externo →</a>
                </div>
                <button onClick={() => clickEliminar(mat.id, mat.title)} className="text-red-500 hover:text-red-700 hover:bg-red-50 text-sm font-bold px-4 py-2 border border-red-200 rounded-md transition-colors flex-shrink-0 mt-2 md:mt-0">
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {materialAEliminar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-carbon/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-bone w-full max-w-md rounded-xl shadow-2xl overflow-hidden border border-gray-soft">
            <div className="bg-red-500/10 px-6 py-4 border-b border-red-500/20">
              <h3 className="text-xl font-bold font-sans text-red-600 flex items-center gap-2">
                ¿Eliminar este recurso?
              </h3>
            </div>
            <div className="px-6 py-6 space-y-4">
              <p className="text-carbon font-sans">Se borrará de la base de datos el material:</p>
              <p className="font-bold text-lg text-orange border-l-4 border-orange pl-3 bg-orange-subtle/30 py-2 rounded-r">
                {materialAEliminar.title}
              </p>
              <p className="text-sm text-gray-dark italic">El archivo original en Drive o GitHub no se borrará, pero el enlace desaparecerá de tu laboratorio.</p>
            </div>
            <div className="bg-gray-soft/20 px-6 py-4 flex justify-end gap-3 border-t border-gray-soft">
              <button onClick={() => setMaterialAEliminar(null)} className="px-4 py-2 rounded text-carbon font-bold hover:bg-gray-soft transition-colors text-sm">
                Cancelar
              </button>
              <button onClick={confirmarEliminacion} className="px-4 py-2 rounded bg-red-600 text-white font-bold hover:bg-red-700 transition-colors shadow-sm text-sm">
                Sí, eliminar material
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}