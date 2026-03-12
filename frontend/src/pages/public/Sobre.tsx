import { Link } from 'react-router-dom';

export default function Sobre() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto pb-12">
      
      <header className="border-b border-gray-soft pb-4 text-center md:text-left">
        <h1 className="text-3xl text-carbon tracking-tight">Sobre LumireonLab</h1>
        <p className="mt-2 text-orange font-sans text-lg font-medium">
          El conocimiento se explora, se prueba y se comparte.
        </p>
      </header>
      
      <article className="prose prose-neutral max-w-none prose-p:text-gray-dark prose-p:font-sans prose-p:leading-relaxed prose-strong:text-carbon">
        <p>
          LumireonLab no es un portfolio estático ni una galería de proyectos perfectos. Es un <strong>laboratorio de ideas</strong> en tiempo real.
        </p>
        <p>
          El aprendizaje técnico rara vez es una línea recta. Está lleno de dificultades, bloqueos mentales y muchos errores, pero también momentos de acierto y claridad. 
          Este espacio existe para documentar exactamente eso: el origen de las preguntas, los tropiezos en el desarrollo y las chispas de conocimiento que surgen al final de cada camino.
        </p>
      </article>

      <div className="bg-white border border-gray-soft/60 rounded-xl p-6 md:p-8 relative shadow-sm mt-12">
        <div className="absolute -top-4 left-6 bg-orange text-white text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wide">
          Registro del habitante
        </div>
        <div className="flex flex-col md:flex-row gap-6 items-start mt-2">
          <div className="w-16 h-16 flex-shrink-0 bg-bone rounded-lg border border-gray-soft flex items-center justify-center overflow-hidden">
            <img src="/lumii.JPG" alt="Lumireon" className="w-10 h-10 object-contain opacity-80" />
          </div>
          <div className="space-y-4 text-gray-dark font-sans leading-relaxed">
            <p className="italic text-lg font-medium text-carbon">
              "Soy Lumireon. Nací del fuego y de la luz. Las experiencias del laboratorio me han encaminado al aprendizaje constante, por un camino lleno de curvas y callejones sin salida. Pero siempre resurgiendo  desde las cenizas. 
              En cada dificultad he cambiado, he evolucionado, porque persistir es mi parte de mi naturaleza."
            </p>
            <p>
              Soy un ser en evolución constante.
              En cada nuevo experimento, en cada proyecto, acepto el desafío: me adapto, crezco, aprendo… y entonces evoluciono.
            </p>
            <p>
              Observo las nuevas tecnologías, los marcos teóricos, las —a veces interminables— líneas de código, los errores del sistema. 
              Y cuando todas esas ideas, conocimientos y aprendizajes finalmente logran compilar, nace una nueva versión de nosotros: una más evolucionada.
            </p>
            <p>
              En este laboratorio no escondemos los fracasos; los documentamos. Son la base de la siguiente evolución.
            </p>
            
            <div className="pt-4 mt-4 border-t border-gray-soft/50">
              <Link 
                to="/notas" 
                className="inline-flex items-center gap-2 text-orange hover:text-carbon font-bold transition-colors"
              >
                Acompáñame. Revisemos las notas →
              </Link>
            </div>

          </div>
        </div>
      </div>
      
    </div>
  );
}