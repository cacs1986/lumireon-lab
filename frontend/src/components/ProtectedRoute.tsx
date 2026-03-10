import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  // Buscamos la pulsera en la caja fuerte del navegador
  const token = localStorage.getItem('lumireon_token');

  // Si no hay token, lo mandamos a la fuerza a la ruta de login ("/admin")
  if (!token) {
    return <Navigate to="/admin" replace />;
  }

  // Si hay token, lo dejamos pasar a la ruta hija que estaba intentando ver
  return <Outlet />;
}