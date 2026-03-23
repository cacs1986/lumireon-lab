import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Layout from "./components/layout/Layout";
import Inicio from "./pages/public/Inicio";
import Notas from "./pages/public/Notas";
import Materiales from "./pages/public/Materiales";
import Sobre from "./pages/public/Sobre";

import AdminRoutes from "./routes/AdminRoutes";
import LabRoutes from "./routes/LabRoutes";
import HerramientasRoutes from "./routes/HerramientasRoutes";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster 
        position="bottom-right" 
        toastOptions={{
          style: { background: '#1A1A1A', color: '#F5F2ED', fontFamily: 'sans-serif' },
          success: { iconTheme: { primary: '#e17b48', secondary: '#F4F4F4' } },
        }} 
      />

      <Routes>
        {/* --- 1. ZONA PÚBLICA --- */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Inicio />} />
          <Route path="notas" element={<Notas />} />
          <Route path="materiales" element={<Materiales />} />
          <Route path="sobre" element={<Sobre />} />
          
          {/* Sub-Rutas delegadas */}
          <Route path="laboratorio/*" element={<LabRoutes />} />
          <Route path="herramientas/*" element={<HerramientasRoutes />} />
        </Route>

        {/* --- 2. ZONA PRIVADA --- */}
        <Route path="/admin/*" element={<AdminRoutes />} />

      </Routes>
    </BrowserRouter>
  );
}