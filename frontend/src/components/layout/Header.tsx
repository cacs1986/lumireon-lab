import { useState } from "react";
import { NavLink, Link } from "react-router-dom";

const links = [
  { to: "/laboratorio", label: "Laboratorio" },
  { to: "/notas", label: "Notas" },
  { to: "/materiales", label: "Materiales" },
  { to: "/sobre", label: "Sobre" },
];

export default function Header() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const isAuthenticated = !!localStorage.getItem('lumireon_token');

  const cerrarSesion = () => {
    localStorage.removeItem('lumireon_token');
    window.location.href = "/"; 
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-soft bg-bone/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 md:h-20 max-w-5xl items-center justify-between px-6">
        
        <Link to="/" className="flex items-center gap-3">
          <img src="/logoFondoBlancoSimple.png" alt="Logo LumireonLab" className="h-10 md:h-12 w-auto object-contain" />
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <nav className="flex gap-6">
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

          {isAuthenticated && (
            <div className="flex items-center gap-4 border-l-2 border-orange pl-6 ml-2">
              <Link to="/admin/dashboard" className="text-orange font-bold font-sans hover:underline underline-offset-4 flex items-center gap-1">
                ⚙️ Admin
              </Link>
              <button 
                onClick={cerrarSesion}
                className="text-xs text-gray-dark bg-white px-3 py-1.5 rounded border border-gray-soft hover:bg-gray-soft transition-colors font-sans"
              >
                Salir
              </button>
            </div>
          )}
        </div>

        <button 
          className="md:hidden p-2 text-carbon hover:text-orange transition-colors"
          onClick={() => setMenuAbierto(!menuAbierto)}
        >
          {menuAbierto ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          )}
        </button>
      </div>

      {menuAbierto && (
        <div className="md:hidden border-t border-gray-soft bg-bone px-6 py-4 absolute w-full shadow-lg">
          <nav className="flex flex-col gap-4">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMenuAbierto(false)}
                className={({ isActive }) =>
                  `text-lg font-medium transition-all block ${isActive ? "text-orange" : "text-gray-dark"}`
                }
              >
                {link.label}
              </NavLink>
            ))}
            
            {isAuthenticated && (
              <div className="mt-4 pt-4 border-t border-gray-soft flex flex-col gap-4">
                <Link 
                  to="/admin/dashboard" 
                  onClick={() => setMenuAbierto(false)}
                  className="text-orange font-bold font-sans text-lg"
                >
                  ⚙️ Panel Administrador
                </Link>
                <button 
                  onClick={cerrarSesion}
                  className="text-left text-gray-dark font-sans text-lg"
                >
                  Cerrar Sesión
                </button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}