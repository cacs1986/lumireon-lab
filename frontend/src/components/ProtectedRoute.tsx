import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {

  const token = localStorage.getItem('lumireon_token');

  if (!token) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}