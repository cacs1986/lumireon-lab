import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="flex flex-col w-full relative">
      
      <div className="w-full flex-shrink-0 relative z-10">
        <div className="max-w-[480px] md:max-w-[550px] space-y-4 md:space-y-6">
          
          <h1 className="font-sans text-4xl font-bold tracking-tight text-carbon md:text-5xl lg:text-7xl">
            Lumireon<span className="text-orange">Lab</span>
          </h1>
          
          <h2 className="text-lg font-medium leading-relaxed text-gray-dark md:text-2xl">
            El proceso de experimentación es tan valioso como el resultado.
          </h2>
          
          <div className="border-l-[3px] border-orange/80 pl-3 md:pl-4">
            <p className="font-sans text-sm md:text-base text-gray-dark leading-relaxed font-medium">
              "¡Saludos! Soy Lumireon. Este es nuestro laboratorio, nos enfocamos en documentar los procesos. Observamos, experimentamos y registramos cada chispa de conocimiento."
            </p>
          </div>

          <Link 
            to="/laboratorio" 
            className="mt-2 inline-block rounded-md bg-orange px-6 py-2 md:px-8 md:py-3 text-sm md:text-base font-bold text-white shadow-sm transition-all hover:bg-orange/90 hover:shadow-md hover:-translate-y-0.5"
          >
            Comenzar a explorar
          </Link>
          
        </div>
      </div>

      <div className="w-full -mt-24 md:-mt-64 relative z-0 flex justify-end pointer-events-none">
        <img 
          src="/hero-desktop.webp" 
          alt="Lumireon explorando el laboratorio" 
          className="w-full h-auto max-h-[350px] md:max-h-[500px] object-contain object-right-bottom pointer-events-auto" 
        />
      </div>
      
    </section>
  );
}