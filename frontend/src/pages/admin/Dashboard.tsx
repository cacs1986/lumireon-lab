import { Link } from "react-router-dom";
import { useProjects } from "../../hooks/useProjects";
import { projectService } from "../../servicios/projectService";

export default function Dashboard() {
    // Reutilizamos el mismo hook de la vista pública. 
    const { projects, loading, error } = useProjects();

    const handleDelete = async (id: string, title: string) => {
        // 1. Pedimos confirmación para no borrar por accidente
        const confirmacion = window.confirm(`¿Estás segura de que quieres eliminar el proyecto "${title}"? Esta acción no se puede deshacer.`);

        if (confirmacion) {
            // 2. Llamamos al servicio
            const result = await projectService.delete(id);

            if (result.success) {
                // 3. Recargamos la página para que desaparezca de la tabla
                window.location.reload();
            } else {
                alert("Hubo un error al intentar eliminar el proyecto.");
            }
        }
    };

    return (
        <div className="space-y-6">

            {/* Cabecera del Panel */}
            <header className="flex justify-between items-center border-b border-gray-soft pb-4">
                <div>
                    <h1 className="text-2xl font-bold text-carbon">Panel de Proyectos</h1>
                    <p className="text-sm text-gray-dark mt-1 font-sans">Gestiona el contenido de tu laboratorio.</p>
                </div>

                <Link
                    to="/admin/proyecto/nuevo"
                    className="bg-orange text-white px-4 py-2 rounded text-sm font-bold hover:bg-orange/90 transition-colors shadow-sm inline-block"
                >
                    + Nuevo Proyecto
                </Link>
            </header>

            {/* Manejo de Estados */}
            {loading && <div className="py-8 text-center text-gray-dark animate-pulse">Cargando datos...</div>}
            {error && <div className="py-8 text-center text-red-600">{error}</div>}

            {/* Tabla de Datos */}
            {!loading && !error && (
                <div className="bg-white border border-gray-soft rounded-lg overflow-hidden shadow-sm font-sans">
                    <table className="w-full text-left border-collapse">

                        <thead className="bg-bone border-b border-gray-soft text-sm text-gray-dark">
                            <tr>
                                <th className="p-4 font-bold w-2/5">Título del Proyecto</th>
                                <th className="p-4 font-bold">Estado</th>
                                <th className="p-4 font-bold">Fecha de Creación</th>
                                <th className="p-4 font-bold text-right">Acciones</th>
                            </tr>
                        </thead>

                        <tbody className="text-sm">
                            {projects.map((project) => (
                                <tr key={project.id} className="border-b border-gray-soft last:border-0 hover:bg-bone/30 transition-colors">

                                    <td className="p-4 font-medium text-carbon">
                                        {project.title}
                                        <div className="text-xs text-gray-mid mt-0.5 font-mono">{project.slug}</div>
                                    </td>

                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider inline-block ${project.status === 'En evolución' ? 'bg-orange-subtle text-orange' : 'bg-gray-soft text-gray-dark'
                                            }`}>
                                            {project.status}
                                        </span>
                                    </td>

                                    <td className="p-4 text-gray-dark">
                                        {/* Formateamos la fecha ISO a un formato local de Argentina */}
                                        {new Date(project.createdAt).toLocaleDateString('es-AR', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })}
                                    </td>

                                    <td className="p-4 text-right space-x-4">
                                        <Link
                                            to={`/admin/proyecto/editar/${project.id}`}
                                            className="text-orange hover:text-carbon font-bold font-sans text-sm transition-colors"
                                        >
                                            Editar
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(project.id, project.title)}
                                            className="text-red-500 hover:text-red-700 font-bold font-sans text-sm transition-colors"
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

        </div>
    );
}