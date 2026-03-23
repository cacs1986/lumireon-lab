import { Routes, Route } from "react-router-dom";
import AdminLayout from "../components/layout/AdminLayout";
import ProtectedRoute from "./ProtectedRoute"; 
import Login from "../pages/admin/Login";
import Dashboard from "../pages/admin/Dashboard";
import AdminProyecto from "../pages/admin/AdminProyecto";
import AdminNotas from "../pages/admin/AdminNotas";
import AdminMateriales from "../pages/admin/AdminMateriales";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route index element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} /> 
          <Route path="proyecto/nuevo" element={<AdminProyecto />} />
          <Route path="proyecto/editar/:id" element={<AdminProyecto />} />
          <Route path="notas" element={<AdminNotas />} />
          <Route path="materiales" element={<AdminMateriales />} />
        </Route>
      </Route>
    </Routes>
  );
}