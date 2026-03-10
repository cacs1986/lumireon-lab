import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layouts
import Layout from "./components/layout/Layout";
import AdminLayout from "./components/layout/AdminLayout";

// Páginas Públicas
import Inicio from "./pages/public/Inicio";
import Laboratorio from "./pages/public/Laboratorio";
import ProyectoDetalle from "./pages/public/ProyectoDetalle";
import Notas from "./pages/public/Notas";
import Materiales from "./pages/public/Materiales";
import Sobre from "./pages/public/Sobre";

// Páginas Admin
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import ProyectoForm from "./pages/admin/ProyectoForm";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* === RAMA PÚBLICA === */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Inicio />} />
          <Route path="laboratorio" element={<Laboratorio />} />
          <Route path="laboratorio/:slug" element={<ProyectoDetalle />} />
          <Route path="notas" element={<Notas />} />
          <Route path="materiales" element={<Materiales />} />
          <Route path="sobre" element={<Sobre />} />
        </Route>

        {/* === RAMA ADMIN === */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Login />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="dashboard" element={<Dashboard />} /> 
            <Route path="proyecto/nuevo" element={<ProyectoForm />} />
            <Route path="proyecto/editar/:id" element={<ProyectoForm />} />
          </Route>
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}