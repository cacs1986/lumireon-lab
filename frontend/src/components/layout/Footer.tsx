export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-gray-soft/60 bg-bone mt-auto">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-6 py-8 md:flex-row">
        
        <div className="flex flex-col items-center md:items-start gap-1">
          <div className="flex items-center gap-2">
            <span className="font-sans font-bold text-carbon text-lg tracking-tight">
              Lumireon<span className="text-orange">Lab</span>
            </span>
            <span className="text-gray-soft">|</span>
            <span className="font-sans text-sm font-medium text-gray-dark italic">
              Registrando el proceso.
            </span>
          </div>
          <p className="text-xs text-gray-mid font-sans">
            © {currentYear} — Construido con React, Node.js & SQLite.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div 
            className="flex items-center gap-2 rounded-full border border-gray-soft bg-white px-3 py-1.5 text-xs font-bold font-mono text-carbon shadow-sm"
            title="Versión de producción"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange"></span>
            </span>
            v2.0.0
          </div>
        </div>

      </div>
    </footer>
  );
}