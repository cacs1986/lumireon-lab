import { Link } from 'react-router-dom';
import { useMotorCPU } from '../../hooks/useMotorCPU';
import type { NivelDificultad } from '../../hooks/useMotorCPU';

export default function SimuladorInterrupciones() {
  const {
    nivel, pc, ir, fase, modo, pila, irqPendiente, mensajeConsola, memoriaActiva, lineaActiva,
    reiniciar, avanzarCiclo, setIrqPendiente
  } = useMotorCPU();

  return (
    <div className="min-h-screen bg-bone p-4 md:p-8 font-sans text-carbon flex flex-col gap-6 relative">

      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-soft -mb-2 gap-3">
        <Link
          to="/laboratorio"
          className="text-sm font-sans text-gray-dark hover:text-orange transition-colors flex items-center gap-1.5 font-medium"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Volver al laboratorio
        </Link>
        <Link
          to="/herramientas/teoria/interrupciones"
          target="_blank"
          className="bg-orange text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-orange/90 transition-all shadow-sm flex items-center gap-2 w-full md:w-auto justify-center md:justify-start active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">menu_book</span>
          Guía Teórica Detallada
        </Link>
      </div>

      <header className="flex flex-col lg:flex-row justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-soft gap-4">
        <div>
          <h1 className="text-3xl font-black text-orange tracking-tight text-center lg:text-left">Simulador de Interrupciones</h1>
          <p className="text-sm text-gray-dark font-mono mt-1 font-bold text-center lg:text-left">Anillo de Privilegio:
            <span className={`ml-2 px-3 py-1 rounded-full text-white shadow-sm ${modo === 'USER' ? 'bg-blue-500' : 'bg-red-500'}`}>
              {modo === 'USER' ? 'Anillo 3 (Usuario)' : 'Anillo 0 (Kernel)'}
            </span>
          </p>
        </div>

        <div className="flex gap-4 items-center flex-wrap justify-center w-full lg:w-auto">
          <select
            value={nivel}
            onChange={(e) => reiniciar(e.target.value as NivelDificultad)}
            className="flex-grow md:flex-grow-0 border border-gray-soft rounded-lg px-4 py-2 font-bold focus:ring-2 focus:ring-orange outline-none bg-gray-50 text-sm h-[38px]"
          >
            <option value="ESTRICTO">Modo: Avanzado</option>
            <option value="DIDACTICO">Modo: Introductorio</option>
          </select>
          <button
            onClick={() => reiniciar()}
            className="flex-grow md:flex-grow-0 bg-carbon text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-carbon/80 shadow-sm transition-colors active:scale-95 h-[38px]"
          >
            ↻ Iniciar
          </button>
        </div>
      </header>

      <div className="bg-gray-900 text-green-400 font-mono text-sm p-4 rounded-xl shadow-inner border border-gray-800 flex items-center gap-3 z-10">
        <span className="material-symbols-outlined text-green-400">terminal</span>
        <p className="font-bold truncate">{mensajeConsola}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10 items-start pb-10">

        <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-6">
          <div className={`p-6 rounded-2xl shadow-lg border-2 transition-colors duration-300 ${modo === 'USER' ? 'bg-blue-900 border-blue-700' : 'bg-red-900 border-red-700'} text-white relative`}>
            <h2 className="font-bold text-white/70 tracking-widest text-xs uppercase mb-6 flex items-center justify-between">
              <span>Unidad de Control (CPU)</span>
              <span className="material-symbols-outlined">memory</span>
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-black/40 p-3 rounded-xl border border-white/10 text-center">
                <span className="block text-[10px] font-bold text-white/50 mb-1">PROGRAM COUNTER</span>
                <span className="text-3xl font-mono font-black">{pc}</span>
              </div>
              <div className="bg-black/40 p-3 rounded-xl border border-white/10 text-center flex flex-col justify-center">
                <span className="block text-[10px] font-bold text-white/50 mb-1">INSTRUCTION REGISTER</span>
                <span className="text-xs font-mono font-bold text-orange-300 truncate">{ir ? ir.inst : "---"}</span>
              </div>
            </div>

            <div className="flex justify-between items-center bg-black/30 p-2 rounded-lg font-mono text-[10px] font-bold mb-6">
              <div className={`px-2 py-1.5 rounded ${fase === 'FETCH' ? 'bg-orange text-white' : 'text-white/30'}`}>FETCH</div>
              <div className="text-white/20">→</div>
              <div className={`px-2 py-1.5 rounded ${fase === 'DECODE' ? 'bg-orange text-white' : 'text-white/30'}`}>DECODE</div>
              <div className="text-white/20">→</div>
              <div className={`px-2 py-1.5 rounded ${fase === 'EXECUTE' ? 'bg-orange text-white' : 'text-white/30'}`}>EXECUTE</div>
            </div>

            <button
              onClick={avanzarCiclo}
              disabled={ir?.tipo === "HALT" || false}
              className="w-full bg-white text-carbon hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-4 rounded-xl font-black text-sm shadow-lg flex justify-center items-center gap-2 active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined">skip_next</span> AVANZAR RELOJ (+1)
            </button>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-red-200 text-center">
            <h3 className="font-bold text-red-500 text-xs uppercase tracking-widest mb-3">Señal de Hardware (IRQ)</h3>
            <button
              onClick={() => setIrqPendiente(true)}
              disabled={modo === 'KERNEL' || irqPendiente || ir?.tipo === "HALT" || false}
              className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold text-sm px-4 py-3 rounded-lg shadow-md active:scale-95 flex items-center justify-center gap-2 transition-colors"
            >
              <span className="material-symbols-outlined">electric_bolt</span>
              Generar Interrupción
            </button>
            {irqPendiente && <p className="text-[10px] text-red-600 font-bold mt-2 animate-pulse">Línea IRQ activa (Esperando fin de instrucción)</p>}
          </div>
        </div>

        <div className="lg:col-span-6 bg-white p-4 rounded-xl border border-gray-soft shadow-sm flex flex-col h-[520px]">
          <h3 className="font-bold text-gray-mid text-sm uppercase tracking-widest mb-4 flex justify-between">
            <span>Memoria Principal (RAM)</span>
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">Vectores habilitados</span>
          </h3>
          <div id="contenedor-ram" className="flex flex-col gap-1 overflow-y-auto pr-2 pb-20 relative">
            {memoriaActiva.map((m) => (
              <div
                key={m.addr}
                id={`mem-${m.addr}`}
                className={`flex items-center p-2 rounded border transition-all duration-300 ${lineaActiva === m.addr ? 'bg-orange-subtle border-orange shadow-sm scale-[1.01]' : 'bg-bone border-transparent'
                  }`}
              >
                <div className={`w-8 font-mono text-xs font-bold ${lineaActiva === m.addr ? 'text-orange' : 'text-gray-400'}`}>{m.addr}</div>
                <div className="flex-1">
                  <div className={`font-mono text-sm font-bold ${lineaActiva === m.addr ? 'text-carbon' : 'text-gray-700'}`}>{m.inst}</div>
                  <div className="text-[10px] text-gray-500 leading-tight mt-0.5">{m.desc}</div>
                </div>
                <div className={`text-[9px] font-bold px-2 py-1 rounded ${m.owner === 'USER' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                  {m.owner}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-carbon p-4 rounded-xl border border-gray-800 shadow-sm flex flex-col h-[300px] lg:sticky lg:top-6">
          <h3 className="font-bold text-gray-400 text-xs uppercase tracking-widest mb-4 text-center">Stack (Pila)</h3>
          <div className="flex-1 flex flex-col justify-end gap-2 bg-black/40 rounded-lg p-2 border-b-4 border-orange overflow-hidden">
            {pila.length === 0 ? (
              <p className="text-gray-600 text-xs text-center font-mono py-4">Vacía</p>
            ) : (
              [...pila].reverse().map((val, i) => (
                <div key={i} className={`bg-orange text-white font-mono text-sm font-bold text-center py-2 rounded shadow-sm ${i === 0 ? 'animate-bounce' : 'opacity-70'}`}>
                  PC: {val}
                </div>
              ))
            )}
          </div>
          <p className="text-[9px] text-gray-500 text-center mt-3 font-mono">LIFO (PUSH/POP)</p>
        </div>

      </div>
    </div>
  );
}