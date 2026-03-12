import { useState, useEffect} from 'react';
import { obtenerNotas, crearNota, eliminarNota } from '../../servicios/noteService';
import type { Nota } from '../../types/Note';
import toast from 'react-hot-toast';

export default function AdminNotas() {
  const [notas, setNotas] = useState<Nota[]>([]);
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [notaAEliminar, setNotaAEliminar] = useState<{id: string, title: string} | null>(null);

  const token = localStorage.getItem('lumireon_token') || '';

  useEffect(() => {
    const fetchInicial = async () => {
      try {
        const data = await obtenerNotas();
        setNotas(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchInicial();
  }, []); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await crearNota(titulo, contenido, token);
      setTitulo(''); 
      setContenido('');
      
      const data = await obtenerNotas();
      setNotas(data);
      toast.success('Chispa guardada con éxito');
    } catch (error) {
      console.error(error);
      toast.error('Error al guardar la nota');
    }
  };

  const clickEliminar = (id: string, title: string) => {
    setNotaAEliminar({ id, title });
  };

  const confirmarEliminacion = async () => {
    if (!notaAEliminar) return;
    try {
      await eliminarNota(notaAEliminar.id, token);
      const data = await obtenerNotas();
      setNotas(data);
      toast.success('Nota eliminada permanentemente');
    } catch (error) {
      console.error(error);
      toast.error('Error al intentar eliminar la nota');
    } finally {
      setNotaAEliminar(null);
    }
  };

  return (
    <div className="space-y-6 relative">
      
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-soft pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-carbon">Gestor de Notas</h1>
          <p className="text-sm text-gray-dark mt-1 font-sans">Registra las micro-bitácoras y chispas de conocimiento de Lumireon.</p>
        </div>
      </header>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-gray-soft shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium text-carbon mb-1">Título de la chispa</label>
          <input 
            type="text" required value={titulo} onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ej: 🔥 Chispa #042 - Peleando con Tailwind"
            className="w-full border border-gray-soft rounded-md p-3 focus:border-orange focus:ring-1 focus:ring-orange outline-none font-sans"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-carbon mb-1">Contenido / Reflexión</label>
          <textarea 
            required value={contenido} onChange={(e) => setContenido(e.target.value)} rows={4}
            placeholder="¿Qué aprendiste hoy? ¿Qué se rompió y cómo lograste resurgir de las cenizas?"
            className="w-full border border-gray-soft rounded-md p-3 focus:border-orange focus:ring-1 focus:ring-orange outline-none font-sans resize-y"
          ></textarea>
        </div>
        <div className="flex justify-end pt-2">
          <button 
            type="submit" 
            className="bg-carbon text-white px-6 py-2.5 rounded font-bold hover:bg-orange transition-colors shadow-sm"
          >
            Guardar Registro
          </button>
        </div>
      </form>

      <div className="space-y-4 pt-6">
        <h3 className="text-xl font-bold text-carbon">Historial de registros</h3>
        
        {notas.length === 0 ? (
          <div className="bg-bone/50 border border-dashed border-gray-soft rounded-xl p-8 text-center text-gray-mid">
            Aún no hay notas. Escribe la primera chispa arriba.
          </div>
        ) : (
          <div className="grid gap-4">
            {notas.map((nota) => (
              <div key={nota.id} className="bg-white p-5 rounded-xl border border-gray-soft flex flex-col md:flex-row md:justify-between md:items-start gap-4 shadow-sm hover:border-orange/30 transition-colors">
                <div className="space-y-2 w-full">
                  <h4 className="font-bold text-lg text-carbon">{nota.title}</h4>
                  <p className="text-gray-dark whitespace-pre-wrap font-sans text-sm md:text-base">{nota.content}</p>
                  <span className="text-xs text-gray-mid font-mono block pt-2">
                    {new Date(nota.createdAt).toLocaleString('es-AR')}
                  </span>
                </div>
                <button 
                  onClick={() => clickEliminar(nota.id, nota.title)} 
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 text-sm font-bold px-4 py-2 border border-red-200 rounded-md transition-colors flex-shrink-0 self-start mt-2 md:mt-0"
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {notaAEliminar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-carbon/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-bone w-full max-w-md rounded-xl shadow-2xl overflow-hidden border border-gray-soft">
            <div className="bg-red-500/10 px-6 py-4 border-b border-red-500/20">
              <h3 className="text-xl font-bold font-sans text-red-600 flex items-center gap-2">
                ¿Estás segura de eliminar esta nota?
              </h3>
            </div>
            <div className="px-6 py-6 space-y-4">
              <p className="text-carbon font-sans">Estás a punto de eliminar permanentemente la chispa:</p>
              <p className="font-bold text-lg text-orange border-l-4 border-orange pl-3 bg-orange-subtle/30 py-2 rounded-r">
                {notaAEliminar.title}
              </p>
              <p className="text-sm text-gray-dark italic">Esta acción no se puede deshacer.</p>
            </div>
            <div className="bg-gray-soft/20 px-6 py-4 flex justify-end gap-3 border-t border-gray-soft">
              <button onClick={() => setNotaAEliminar(null)} className="px-4 py-2 rounded text-carbon font-bold hover:bg-gray-soft transition-colors text-sm">
                Cancelar
              </button>
              <button onClick={confirmarEliminacion} className="px-4 py-2 rounded bg-red-600 text-white font-bold hover:bg-red-700 transition-colors shadow-sm text-sm">
                Sí, eliminar nota
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}