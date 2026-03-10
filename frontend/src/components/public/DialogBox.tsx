import React from 'react';

// Definimos qué datos necesita este componente para funcionar
interface DialogBoxProps {
  characterImage: string; // Ruta a la ilustración (ej: /img/lumi-welcome.png)
  title: string;          // Título de la sección (ej: "CONTEXTO")
  children: React.ReactNode; // El texto narrativo irá aquí adentro
}

export default function DialogBox({ characterImage, title, children }: DialogBoxProps) {
  return (
    // 1. CONTENEDOR PRINCIPAL: Flex para alinear imagen y texto
    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 bg-white p-6 rounded-2xl border-2 border-gray-soft shadow-lg shadow-gray-soft/50 my-10">
      
      {/* 2. AREA DEL AVATAR (Imagen de tu hija) */}
      <div className="flex-shrink-0 w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-orange/20 bg-bone overflow-hidden flex items-center justify-center p-2 shadow-inner">
        <img 
          src={characterImage} 
          alt={`Lumireon narrando ${title}`} 
          // object-contain para que el dibujo no se corte
          className="w-full h-full object-contain" 
        />
      </div>

      {/* 3. AREA DEL GLOBO DE TEXTO (RPG Style) */}
      <div className="relative flex-grow bg-bone p-6 rounded-xl border-2 border-orange/30 w-full">
        
        {/* Triangulito del globo de diálogo (Opcional, estética RPG) */}
        <div className="absolute top-10 -left-3 w-0 h-0 border-t-[12px] border-t-transparent border-r-[14px] border-r-orange/30 border-b-[12px] border-b-transparent hidden md:block"></div>
        <div className="absolute top-10 -left-2.5 w-0 h-0 border-t-[12px] border-t-transparent border-r-[14px] border-r-bone border-b-[12px] border-b-transparent hidden md:block"></div>

        {/* Título de la sección (ej: CONTEXTO) */}
        <div className="mb-4">
          <span className="inline-block rounded-full bg-orange-subtle px-4 py-1 text-xs font-bold uppercase tracking-widest text-orange border border-orange/20">
            {title}
          </span>
        </div>

        {/* 4. EL TEXTO NARRATIVO (Se formatea automáticamente) */}
        <div className="prose prose-sm prose-carbon max-w-none font-sans leading-relaxed text-gray-dark">
          {children}
        </div>
      </div>
    </div>
  );
}