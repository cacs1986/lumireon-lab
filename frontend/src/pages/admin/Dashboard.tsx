import { useState } from "react";
import { Link } from "react-router-dom";
import { useProjects } from "../../hooks/useProjects";
import { projectService } from "../../servicios/projectService";
import toast from "react-hot-toast";

export default function Dashboard() {
    const { projects, loading, error } = useProjects();
    const [proyectoAEliminar, setProyectoAEliminar] = useState<{id: string, title: string} | null>(null);
    
    const clickEliminar = (id: string, title: string) => {
        setProyectoAEliminar({ id, title });
    };

    const confirmarEliminacion = async () => {
        if (!proyectoAEliminar) return;

        try {
            const result = await projectService.delete(proyectoAEliminar.id);

            if (result.success) {
                toast.success('Experimento eliminado del laboratorio');
                
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                toast.error("Hubo un error al intentar eliminar el proyecto.");
            }
        } catch  {
            toast.error("Error de conexión con el servidor.");
        } finally {
            setProyectoAEliminar(null); 
        }
    };

    return (
        <div className="space-y-6 relative">

            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-soft pb-4 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-carbon">Panel de Control</h1>
                    <p className="text-sm text-gray-dark mt-1 font-sans">Gestiona los proyectos de tu laboratorio.</p>
                </div>

                <div className="flex flex-wrap gap-3">
                    
                    <Link
                        to="/admin/proyecto/nuevo"
                        className="bg-orange text-white px-4 py-2 rounded text-sm font-bold hover:bg-orange/90 transition-colors shadow-sm flex items-center gap-2"
                    >
                        + Nuevo Proyecto
                    </Link>
                </div>
            </header>

            {loading && <div className="py-8 text-center text-gray-dark animate-pulse">Cargando datos...</div>}
            {error && <div className="py-8 text-center text-red-600">{error}</div>}

            {!loading && !error && (
                <div className="bg-white border border-gray-soft rounded-lg overflow-hidden shadow-sm font-sans">

                    <div className="bg-bone border-b border-gray-soft px-4 py-3">
                        <h2 className="font-bold text-carbon text-sm uppercase tracking-wide">Inventario de Proyectos</h2>
                    </div>
                    <table className="w-full text-left border-collapse block md:table">

                        <thead className="hidden md:table-header-group border-b border-gray-soft text-sm text-gray-dark">
                            <tr>
                                <th className="p-4 font-bold w-2/5">Título del Proyecto</th>
                                <th className="p-4 font-bold">Estado</th>
                                <th className="p-4 font-bold">Fecha de Creación</th>
                                <th className="p-4 font-bold text-right">Acciones</th>
                            </tr>
                        </thead>

                        <tbody className="block md:table-row-group text-sm">
                            {projects.map((project) => (

                                <tr key={project.id} className="block md:table-row border-b border-gray-soft last:border-0 hover:bg-bone/30 transition-colors p-4 md:p-0">

                                    <td className="block md:table-cell md:p-4 font-medium text-carbon mb-3 md:mb-0">
                                        <div className="text-lg md:text-sm font-bold md:font-medium">{project.title}</div>
                                        <div className="text-xs text-gray-mid mt-0.5 font-mono">{project.slug}</div>
                                    </td>

                                    <td className="block md:table-cell md:p-4 mb-3 md:mb-0">
                                        <span className="md:hidden text-xs text-gray-dark font-bold mr-2 uppercase">Estado:</span>
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider inline-block ${project.status === 'En evolución' ? 'bg-orange-subtle text-orange' : 'bg-gray-soft text-gray-dark'
                                            }`}>
                                            {project.status}
                                        </span>
                                    </td>

                                    <td className="block md:table-cell md:p-4 text-gray-dark mb-4 md:mb-0">
                                        <span className="md:hidden text-xs text-gray-dark font-bold mr-2 uppercase">Creado:</span>
                                        {project.createdAt 
                                            ? new Date(project.createdAt).toLocaleDateString('es-AR', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                              })
                                            : <span className="text-gray-mid italic">Sin fecha</span>
                                        }
                                    </td>

                                    <td className="block md:table-cell md:p-4 md:text-right space-x-3 border-t border-gray-soft pt-4 md:border-0 md:pt-0 mt-2 md:mt-0">
                                        <Link
                                            to={`/admin/proyecto/editar/${project.id}`}
                                            className="text-orange hover:text-carbon font-bold font-sans text-sm transition-colors md:inline-block inline-flex items-center justify-center px-4 py-2 border border-orange md:border-0 md:px-0 md:py-0 rounded"
                                        >
                                            Editar
                                        </Link>
                                        <button
                                            onClick={() => clickEliminar(project.id, project.title)}
                                            className="text-red-500 hover:text-red-700 font-bold font-sans text-sm transition-colors md:inline-block inline-flex items-center justify-center px-4 py-2 border border-red-500 md:border-0 md:px-0 md:py-0 rounded"
                                        >
                                            Eliminar
                                        </button>
                                    </td>

                                </tr>
                            ))}
                        </tbody>

                    </table>
                </div>
            )}

            
            {proyectoAEliminar && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-carbon/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-bone w-full max-w-md rounded-xl shadow-2xl overflow-hidden border border-gray-soft">
                        
                        <div className="bg-red-500/10 px-6 py-4 border-b border-red-500/20">
                            <h3 className="text-xl font-bold font-sans text-red-600 flex items-center gap-2">
                                ¿Estás segura de eliminar este proyecto?
                            </h3>
                        </div>
                        
                        <div className="px-6 py-6 space-y-4">
                            <p className="text-carbon font-sans">
                                Estás a punto de eliminar permanentemente el proyecto:
                            </p>
                            <p className="font-bold text-lg text-orange border-l-4 border-orange pl-3 bg-orange-subtle/30 py-2 rounded-r">
                                {proyectoAEliminar.title}
                            </p>
                            <p className="text-sm text-gray-dark italic">
                                Esta acción destruirá los datos en la base de datos y no se puede deshacer.
                            </p>
                        </div>

                        <div className="bg-gray-soft/20 px-6 py-4 flex justify-end gap-3 border-t border-gray-soft">
                            <button
                                onClick={() => setProyectoAEliminar(null)}
                                className="px-4 py-2 rounded text-carbon font-bold hover:bg-gray-soft transition-colors text-sm"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmarEliminacion}
                                className="px-4 py-2 rounded bg-red-600 text-white font-bold hover:bg-red-700 transition-colors shadow-sm text-sm"
                            >
                                Sí, eliminar proyecto
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}