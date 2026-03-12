import Hero from "../../components/public/Hero";
import ExperimentosRecientes from "../../components/public/ExperimentosRecientes";

export default function Inicio() {
  return (
    <div className="space-y-24 pb-16">
      
      <Hero />
      
      <section className="max-w-4xl mx-auto px-6 text-center md:text-left">
        <div className="border-l-0 md:border-l-[3px] md:border-orange/80 md:pl-6 py-2">
          <h2 className="text-2xl md:text-3xl font-bold text-carbon mb-4 tracking-tight">
            Bitácora Abierta
          </h2>
          <p className="text-lg md:text-xl text-gray-dark leading-relaxed font-sans mb-4">
            "Cada experimento aquí es una chispa de luz en la oscuridad. No buscamos la perfección en la primera línea de código, sino entender por qué funciona la última. Explora sin miedo."
          </p>
          <p className="text-sm text-gray-mid font-sans font-bold uppercase tracking-widest">
            — Lumireon
          </p>
        </div>
      </section>

      <ExperimentosRecientes />
      
    </div>
  );
}