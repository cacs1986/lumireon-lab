import React from 'react';

interface DialogBoxProps {
  characterImage: string; 
  title: string;          
  children: React.ReactNode; 
}

export default function DialogBox({ characterImage, title, children }: DialogBoxProps) {
  return (

    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 bg-white p-6 rounded-2xl border-2 border-gray-soft shadow-lg shadow-gray-soft/50 my-10">
      
      <div className="flex-shrink-0 w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-orange/20 bg-bone overflow-hidden flex items-center justify-center p-2 shadow-inner">
        <img 
          src={characterImage} 
          alt={`Lumireon narrando ${title}`} 
          className="w-full h-full object-contain" 
        />
      </div>

      <div className="relative flex-grow bg-bone p-6 rounded-xl border-2 border-orange/30 w-full">
        
        <div className="absolute top-10 -left-3 w-0 h-0 border-t-[12px] border-t-transparent border-r-[14px] border-r-orange/30 border-b-[12px] border-b-transparent hidden md:block"></div>
        <div className="absolute top-10 -left-2.5 w-0 h-0 border-t-[12px] border-t-transparent border-r-[14px] border-r-bone border-b-[12px] border-b-transparent hidden md:block"></div>

        <div className="mb-4">
          <span className="inline-block rounded-full bg-orange-subtle px-4 py-1 text-xs font-bold uppercase tracking-widest text-orange border border-orange/20">
            {title}
          </span>
        </div>

        <div className="prose prose-sm prose-carbon max-w-none font-sans leading-relaxed text-gray-dark">
          {children}
        </div>
      </div>
    </div>
  );
}