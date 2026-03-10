import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative w-full bg-bone overflow-hidden flex flex-col md:flex-row md:items-center md:min-h-[85vh]">
      
      {/* 1. IMAGEN ESCRITORIO (Fondo de pantalla absoluto, solo en PC) */}
      <div className="hidden md:block absolute inset-0 z-0">
        <img 
          src="/hero-desktop.jpg" 
          alt="Fondo de LumireonLab" 
          className="h-full w-full object-cover object-right" 
        />
      </div>

      {/* 2. CONTENEDOR DE TEXTO (Arriba en móvil, a la izquierda en PC) */}
      {/* pt-8 y pb-4 reducen el abismo vertical en el celular */}
      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 pt-8 pb-4 md:py-0">
        
        {/* space-y-4 en móvil para que esté más compacto, space-y-6 en PC */}
        <div className="flex flex-col items-start text-left max-w-[500px] space-y-4 md:space-y-6">
          
          {/* Título más chico en móvil (text-4xl) */}
          <h1 className="font-sans text-4xl font-bold tracking-tight text-carbon md:text-5xl lg:text-7xl">
            Lumireon<span className="text-orange">Lab</span>
          </h1>
          
          {/* Subtítulo más sutil en móvil (text-lg) */}
          <h2 className="text-lg font-medium leading-relaxed text-gray-dark md:text-2xl">
            El proceso de experimentación es tan valioso como el resultado.
          </h2>
          
          <div className="border-l-[3px] border-orange/60 pl-3 md:pl-4">
            <p className="font-sans text-sm md:text-base text-gray-dark leading-relaxed">
              "¡Saludos! Soy Lumireon. Este es nuestro laboratorio, nos enfocamos en documentar el camino. Observamos, experimentamos y registramos cada chispa de conocimiento."
            </p>
          </div>

          <Link 
            to="/laboratorio" 
            className="mt-2 md:mt-4 inline-block rounded-md bg-orange px-6 py-2 md:px-8 md:py-3 text-sm md:text-base font-bold text-white shadow-sm transition-all hover:bg-orange/90 hover:shadow-md hover:-translate-y-0.5"
          >
            Comenzar a explorar
          </Link>
          
        </div>
      </div>

      {/* 3. IMAGEN MÓVIL (Abajo del texto, más pequeña, solo en celular) */}
      <div className="w-full pb-8 px-6 flex justify-center md:hidden relative z-10">
        <img 
          src="/hero-mobile.jpg" 
          alt="Lumireon" 
          // Reduje el tamaño máximo a 220px para que no sea un bloque masivo
          className="w-[60%] max-w-[220px] object-contain" 
        />
      </div>
      
    </section>
  );
}           