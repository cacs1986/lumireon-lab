import Hero from "../../components/public/Hero";
import ExperimentosRecientes from "../../components/public/ExperimentosRecientes";

export default function Inicio() {
  return (
    <div className="space-y-16">
      <Hero />
      <ExperimentosRecientes />
      {/* <NotasDelLaboratorio /> */}
    </div>
  );
}