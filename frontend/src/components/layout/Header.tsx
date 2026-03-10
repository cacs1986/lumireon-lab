import { useState } from "react";
import { NavLink, Link } from "react-router-dom";

const links = [
  { to: "/laboratorio", label: "Laboratorio" },
  { to: "/notas", label: "Notas" },
  { to: "/materiales", label: "Materiales" },
  { to: "/sobre", label: "Sobre" },
];

export default function Header() {
  // Estado para controlar si el menú móvil está abierto
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-soft bg-bone/95 backdrop-blur-sm">
      {/* En móvil h-16 (más fino), en PC h-20 (más aire) */}
      <div className="mx-auto flex h-16 md:h-20 max-w-5xl items-center justify-between px-6">
        
        <Link to="/" className="flex items-center gap-3">
          <img src="/logoFondoBlancoSimple.png" alt="Logo LumireonLab" className="h-10 md:h-12 w-auto object-contain" />
        </Link>

        {/* Navegación de ESCRITORIO (Oculta en móvil con 'hidden md:flex') */}
        <nav className="hidden md:flex gap-6">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-base font-medium transition-all pb-1 border-b-[3px] ${
                  isActive 
                    ? "border-orange text-orange" 
                    : "border-transparent text-gray-dark hover:text-orange hover:border-orange/40"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Botón HAMBURGUESA para MÓVIL (Oculto en PC con 'md:hidden') */}
        <button 
          className="md:hidden p-2 text-carbon hover:text-orange transition-colors"
          onClick={() => setMenuAbierto(!menuAbierto)}
          aria-label="Alternar menú"
        >
          {menuAbierto ? (
            // Ícono de X (Cerrar)
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            // Ícono de Hamburguesa (Abrir)
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Menú Desplegable MÓVIL */}
      {menuAbierto && (
        <div className="md:hidden border-t border-gray-soft bg-bone px-6 py-4 absolute w-full shadow-lg">
          <nav className="flex flex-col gap-4">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMenuAbierto(false)} // Cierra el menú al hacer clic
                className={({ isActive }) =>
                  `text-lg font-medium transition-all block ${
                    isActive ? "text-orange" : "text-gray-dark"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}