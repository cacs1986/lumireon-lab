import { Outlet, Link, useLocation } from "react-router-dom";
import { useState } from "react";

export default function AdminLayout() {
  const location = useLocation();
  const [menuAbierto, setMenuAbierto] = useState(false);
  
  const isActive = (path: string) => location.pathname.includes(path);
  const toggleMenu = () => setMenuAbierto(!menuAbierto);
  const cerrarMenu = () => setMenuAbierto(false);

  const cerrarSesion = () => {
    localStorage.removeItem('lumireon_token');
    window.location.href = "/"; 
  };

  return (
    <div className="flex h-screen overflow-hidden bg-bone font-sans text-carbon">
      
      {menuAbierto && (
        <div 
          className="fixed inset-0 bg-carbon/50 z-40 md:hidden transition-opacity"
          onClick={cerrarMenu}
        ></div>
      )}

      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-carbon text-bone flex flex-col shadow-xl transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          menuAbierto ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-gray-soft/20 flex justify-between items-center">
          <div className="font-bold tracking-widest text-sm uppercase">
            LumireonLab <span className="text-orange">Admin</span>
          </div>
          <button onClick={cerrarMenu} className="md:hidden text-gray-soft hover:text-white">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <Link
            to="/admin/dashboard"
            onClick={cerrarMenu}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-colors ${
              isActive("/admin/dashboard") || isActive("/admin/proyecto")
                ? "bg-orange text-white"
                : "text-gray-soft hover:bg-white/10 hover:text-white"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">folder_open</span>
            Proyectos
          </Link>
          
          <Link
            to="/admin/notas"
            onClick={cerrarMenu}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-colors ${
              isActive("/admin/notas")
                ? "bg-orange text-white"
                : "text-gray-soft hover:bg-white/10 hover:text-white"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">local_fire_department</span>
            Notas
          </Link>
          
          <Link
            to="/admin/materiales"
            onClick={cerrarMenu}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-colors ${
              isActive("/admin/materiales")
                ? "bg-orange text-white"
                : "text-gray-soft hover:bg-white/10 hover:text-white"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">library_books</span>
            Materiales
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-soft/20 space-y-1">
          <Link 
            to="/laboratorio" 
            target="_blank"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold text-orange hover:bg-orange/10 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">open_in_new</span>
            Ver Laboratorio 
          </Link>
          
          <Link 
            to="/" 
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-bold text-gray-soft hover:bg-white/10 hover:text-white transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">home</span>
            Inicio público
          </Link>

          <div className="pt-1 mt-1 border-t border-gray-soft/20">
            <button 
              onClick={cerrarSesion}
              className="flex items-center w-full gap-3 px-4 py-2.5 rounded-lg text-sm font-bold text-red-400 hover:bg-red-400/10 hover:text-red-300 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
              Cerrar Sesión
            </button>
          </div>
        </div>

      </aside>

      <div className="flex-1 flex flex-col overflow-hidden w-full">
        
        <header className="md:hidden bg-carbon text-bone p-4 flex justify-between items-center shadow-md">
          <div className="font-bold tracking-widest text-sm uppercase">
            LumireonLab <span className="text-orange">Admin</span>
          </div>
          <button onClick={toggleMenu} className="p-1 focus:outline-none text-gray-soft hover:text-white">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-5xl mx-auto w-full pb-12">
            <Outlet />
          </div>
        </main>

      </div>
      
    </div>
  );
}