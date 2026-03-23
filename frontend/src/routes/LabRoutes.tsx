import { Routes, Route } from "react-router-dom";
import Laboratorio from "../pages/public/Laboratorio";
import ProyectoDetalle from "../pages/public/ProyectoDetalle";

export default function LabRoutes() {
  return (
    <Routes>
      <Route index element={<Laboratorio />} />
      <Route path=":slug" element={<ProyectoDetalle />} />
    </Routes>
  );
}