import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Layout from "./components/layout/Layout";
import AdminLayout from "./components/layout/AdminLayout";
import Inicio from "./pages/public/Inicio";
import Laboratorio from "./pages/public/Laboratorio";
import ProyectoDetalle from "./pages/public/ProyectoDetalle";
import Notas from "./pages/public/Notas";
import Materiales from "./pages/public/Materiales";
import Sobre from "./pages/public/Sobre";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import AdminProyecto from "./pages/admin/AdminProyecto";
import AdminNotas from "./pages/admin/AdminNotas";
import AdminMateriales from "./pages/admin/AdminMateriales";
import ProtectedRoute from "./components/ProtectedRoute";
import Pokedex from './pages/public/Pokedex'; 

export default function App() {
  return (
    <BrowserRouter>

    <Toaster 
        position="bottom-right" 
        toastOptions={{
          style: {
            background: '#1A1A1A', 
            color: '#F5F2ED',      
            fontFamily: 'sans-serif',
          },
          success: {
            iconTheme: {
              primary: '#e17b48', 
              secondary: '#F4F4F4',
            },
          },
        }} 
      />

      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Inicio />} />
          <Route path="laboratorio" element={<Laboratorio />} />
          <Route path="laboratorio/:slug" element={<ProyectoDetalle />} />
          <Route path="notas" element={<Notas />} />
          <Route path="materiales" element={<Materiales />} />
          <Route path="sobre" element={<Sobre />} />
          <Route path="pokedex" element={<Pokedex />} />
        </Route>

       <Route path="/admin">
       
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
        </Route>

      </Routes>
    </BrowserRouter>
  );
}