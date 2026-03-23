import { Routes, Route } from "react-router-dom";
import Pokedex from '../pages/public/Pokedex'; 
import Planificador from "../pages/public/Planificador";
import SimuladorInterrupciones from "../pages/public/Interrupciones";
import TeoriaInterrupciones from "../pages/public/teoria/TeoriaInterrupciones";

export default function HerramientasRoutes() {
  return (
    <Routes>
      <Route path="pokedex" element={<Pokedex />} />
      <Route path="planificador" element={<Planificador />} />
      <Route path="interrupciones" element={<SimuladorInterrupciones />} />
      <Route path="teoria/interrupciones" element={<TeoriaInterrupciones />} />
    </Routes>
  );
}