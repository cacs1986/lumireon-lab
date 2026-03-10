import { Outlet, Link } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-bone font-sans text-carbon">
      
      {/* Barra de navegación privada */}
      <header className="bg-carbon text-bone py-3 px-6 flex justify-between items-center shadow-md">
        <div className="font-bold tracking-widest text-sm uppercase">
          LumireonLab <span className="text-orange">Admin</span>
        </div>
        <nav>
          {/* A futuro, este botón cerrará la sesión de Firebase */}
          <Link to="/" className="text-xs font-bold text-gray-soft hover:text-white transition-colors">
            Salir al sitio público →
          </Link>
        </nav>
      </header>

      {/* Contenedor del panel */}
      <main className="flex-1 w-full max-w-6xl mx-auto p-6">
        <Outlet />
      </main>
      
    </div>
  );
}