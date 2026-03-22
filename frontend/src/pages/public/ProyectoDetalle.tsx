import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { useProject } from "../../hooks/useProject";
import DialogBox from "../../components/public/DialogBox";

export default function ProyectoDetalle() {
  const { slug } = useParams();
  const { project, loading, error } = useProject(slug);
  const isAuthenticated = !!localStorage.getItem('lumireon_token');

  if (loading) return <div className="py-12 text-center text-gray-dark font-sans animate-pulse">Cargando proyecto...</div>;
  if (error || !project) return (
    <div className="py-12 text-center">
      <h2 className="text-2xl text-carbon">{error || 'Proyecto no encontrado'}</h2>
      <Link to="/laboratorio" className="mt-4 inline-block text-orange hover:underline underline-offset-4 font-sans">← Volver al laboratorio</Link>
    </div>
  );

  const proseStyles = "prose prose-neutral max-w-none prose-a:text-orange prose-a:no-underline hover:prose-a:underline prose-strong:text-carbon prose-strong:font-bold prose-code:text-carbon prose-code:bg-gray-soft/50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded font-sans text-carbon leading-relaxed";

  return (
    <article className="max-w-3xl mx-auto px-6 space-y-8 pb-12 mt-10">

      <div className="flex justify-between items-center">
        <Link to="/laboratorio" className="text-sm font-sans text-gray-dark hover:text-orange transition-colors">
          ← Volver al laboratorio
        </Link>

        {isAuthenticated && (
          <Link
            to={`/admin/proyecto/editar/${project.id}`}
            className="text-xs font-bold text-orange border border-orange/50 px-3 py-1.5 rounded hover:bg-orange hover:text-white transition-colors flex items-center gap-2 shadow-sm"
          >
            ⚙️ Editar Proyecto
          </Link>
        )}
      </div>

      <header className="space-y-4 border-b border-gray-soft pb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
          <h1 className="text-4xl font-bold text-carbon tracking-tight">{project.title}</h1>
          <span className={`inline-block self-start rounded px-2.5 py-1 text-xs font-bold uppercase tracking-wider font-sans ${project.status === 'En evolución' ? 'bg-orange-subtle text-orange' : 'bg-gray-soft text-gray-dark'
            }`}>
            {project.status}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {project.tags.map(tag => (
            <span key={tag} className="font-mono text-xs text-gray-mid bg-bone border border-gray-soft px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>
      </header>

      {project.imagen_url && (
        <div className="w-full aspect-video md:aspect-[21/9] rounded-xl overflow-hidden border-2 border-gray-soft bg-bone shadow-sm my-8">
          <img
            src={project.imagen_url}
            alt={`Portada de ${project.title}`}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {project.repositorio_url && (
        <div className="mb-8">
          <a
            href={project.repositorio_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-carbon text-white px-5 py-2.5 rounded-lg font-bold font-sans hover:bg-orange transition-colors shadow-sm"
          >
            Ver Código en GitHub →
          </a>
        </div>
      )}

      {/* PORTAL EXCLUSIVO PARA LA POKÉDEX */}
      {project.slug === 'pokedex-lumireon' && (
        <div className="mb-8 md:mb-12 p-5 md:p-10 bg-orange-subtle border-2 border-orange/50 rounded-2xl text-center shadow-sm relative overflow-hidden">

          {/* Ícono de fondo: Mucho más chico en mobile para que no ensucie */}
          <div className="absolute -right-4 -bottom-4 text-[80px] md:text-[150px] text-orange/10 pointer-events-none select-none transition-all">
            <span className="material-symbols-outlined text-[inherit]">
              sports_esports
            </span>
          </div>

          {/* Título: Salto drástico de 20px (xl) a 36px (4xl) */}
          <h3 className="text-xl md:text-4xl font-bold text-carbon mb-2 md:mb-4 relative z-10 transition-all leading-tight px-2">
            ¡El proyecto está vivo!
          </h3>

          {/* Párrafo: De 14px (sm) a 16px (base) pero restringiendo el ancho en mobile al 90% */}
          <p className="text-sm md:text-base text-gray-dark mb-6 md:mb-8 font-sans relative z-10 w-[90%] md:max-w-2xl mx-auto transition-all">
            No te quedes solo en la teoría. Entrá a probar la aplicación interactiva real consumiendo la API.
          </p>

          {/* Botón: Texto más chico en mobile (sm) y ocupa el 100% del ancho (w-full) */}
          <Link
            to="/pokedex"
            className="relative z-10 flex md:inline-flex justify-center items-center gap-2 bg-orange text-white px-5 py-3 md:px-8 md:py-4 rounded-xl font-bold font-sans hover:bg-orange/90 transition-all hover:-translate-y-1 hover:shadow-lg text-xs md:text-lg w-full md:w-auto"
          >
            {/* El ícono también lo bajamos a base en móvil */}
            <span className="material-symbols-outlined text-base md:text-xl">
              catching_pokemon
            </span>
            <span className="whitespace-nowrap">Abrir Pokédex Interactiva</span>
          </Link>
        </div>
      )}

      <div className="space-y-12">

        <DialogBox
          characterImage="/lumi-welcome.webp"
          title="Contexto"
        >
          <ReactMarkdown>{project.context}</ReactMarkdown>
        </DialogBox>

        <section className={proseStyles}>
          <h3 className="text-lg font-bold font-sans mb-3 text-orange not-prose">El Problema</h3>
          <div className="border-l-4 border-orange/30 pl-4 italic text-gray-dark bg-orange-subtle/30 py-2 rounded-r">
            <ReactMarkdown>{project.problem}</ReactMarkdown>
          </div>
        </section>

        <section className={proseStyles}>
          <h3 className="text-lg font-bold font-sans mb-3 text-orange not-prose">Proceso de Desarrollo</h3>
          <ReactMarkdown>{project.process}</ReactMarkdown>
        </section>

        {project.codigo_snippet && (
          <section className="w-full overflow-hidden rounded-xl border border-gray-soft bg-carbon">
            <div className="bg-gray-dark px-4 py-2 text-xs font-bold text-gray-soft font-mono flex justify-between">
              <span>CÓDIGO FUENTE (C++)</span>
            </div>

            <div className="p-4 overflow-auto max-h-[400px] text-sm text-white font-mono prose prose-invert max-w-none">
              <ReactMarkdown>{`\`\`\`cpp\n${project.codigo_snippet}\n\`\`\``}</ReactMarkdown>
            </div>

          </section>
        )}

        <section className={proseStyles}>
          <h3 className="text-lg font-bold font-sans mb-3 text-orange not-prose">Dificultades</h3>
          <ReactMarkdown>{project.difficulties}</ReactMarkdown>
        </section>

        <DialogBox
          characterImage="/lumi-success.webp"
          title="Aprendizajes Clave"
        >
          <ReactMarkdown>{project.learnings}</ReactMarkdown>
        </DialogBox>

      </div>
    </article>
  );
}