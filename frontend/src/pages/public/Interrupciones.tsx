import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// --- BASE DE DATOS UNIFICADA ---
type TipoInstruccion = 'NORMAL' | 'SYSCALL' | 'EXCEPTION' | 'JUMP' | 'IRET' | 'HALT' | 'ISR';

interface Instruccion {
  addr: number;
  inst: string;
  owner: 'USER' | 'KERNEL';
  desc: string;
  tipo: TipoInstruccion;
}

const MEMORIA_ESTRICTA: Instruccion[] = [
  { addr: 0, inst: "MOV R1, 5", owner: "USER", desc: "Carga 5 en el Registro 1", tipo: "NORMAL" },
  { addr: 1, inst: "INT 80h", owner: "USER", desc: "TRAP/SYSCALL: Pide permiso al SO", tipo: "SYSCALL" },
  { addr: 2, inst: "MOV R2, 0", owner: "USER", desc: "Carga 0 en el Registro 2", tipo: "NORMAL" },
  { addr: 3, inst: "DIV R1, R2", owner: "USER", desc: "EXCEPTION: ¡División por cero!", tipo: "EXCEPTION" },
  { addr: 4, inst: "JMP 0", owner: "USER", desc: "Bucle infinito", tipo: "JUMP" },
  { addr: 10, inst: "PUSH REGISTROS", owner: "KERNEL", desc: "Guarda contexto", tipo: "ISR" },
  { addr: 11, inst: "ATENDER_HW", owner: "KERNEL", desc: "Lee puerto I/O", tipo: "ISR" },
  { addr: 12, inst: "POP REGISTROS", owner: "KERNEL", desc: "Restaura contexto", tipo: "ISR" },
  { addr: 13, inst: "IRET", owner: "KERNEL", desc: "Retorno de Interrupción", tipo: "IRET" },
  { addr: 20, inst: "CHECK_PERMISOS", owner: "KERNEL", desc: "Verifica qué pide el usuario", tipo: "ISR" },
  { addr: 21, inst: "SYS_WRITE", owner: "KERNEL", desc: "Escribe en disco/pantalla", tipo: "ISR" },
  { addr: 22, inst: "IRET", owner: "KERNEL", desc: "Retorno al programa", tipo: "IRET" },
  { addr: 30, inst: "DUMP_CORE", owner: "KERNEL", desc: "Guarda estado del error", tipo: "ISR" },
  { addr: 31, inst: "KILL_PROCESS", owner: "KERNEL", desc: "Mata al proceso infractor", tipo: "ISR" },
  { addr: 32, inst: "HALT", owner: "KERNEL", desc: "Detiene el sistema (Fin)", tipo: "HALT" }
];

const MEMORIA_DIDACTICA: Instruccion[] = [
  { addr: 0, inst: "Cargar texturas 3D", owner: "USER", desc: "El juego carga gráficos en RAM", tipo: "NORMAL" },
  { addr: 1, inst: "Syscall: Guardar Partida", owner: "USER", desc: "El juego le pide al SO guardar el progreso", tipo: "SYSCALL" },
  { addr: 2, inst: "Reproducir música", owner: "USER", desc: "Manda audio a la placa", tipo: "NORMAL" },
  { addr: 3, inst: "Bug: Dividir por cero", owner: "USER", desc: "Un error matemático en el código del juego", tipo: "EXCEPTION" },
  { addr: 4, inst: "Bucle Principal", owner: "USER", desc: "El juego sigue corriendo", tipo: "JUMP" },
  { addr: 10, inst: "SO: Leer Mouse", owner: "KERNEL", desc: "El usuario movió el mouse", tipo: "ISR" },
  { addr: 11, inst: "SO: Mover Flecha", owner: "KERNEL", desc: "Actualiza la pantalla", tipo: "ISR" },
  { addr: 12, inst: "SO: Retomar Juego", owner: "KERNEL", desc: "Saca el papelito de la Pila y vuelve", tipo: "ISR" },
  { addr: 13, inst: "IRET", owner: "KERNEL", desc: "Retorno de Interrupción", tipo: "IRET" },
  { addr: 20, inst: "SO: Abrir Disco Rígido", owner: "KERNEL", desc: "Acceso a hardware protegido", tipo: "ISR" },
  { addr: 21, inst: "SO: Escribir Archivo", owner: "KERNEL", desc: "Guarda el .sav", tipo: "ISR" },
  { addr: 22, inst: "IRET", owner: "KERNEL", desc: "Retorno al programa", tipo: "IRET" },
  { addr: 30, inst: "SO: Pantalla Azul", owner: "KERNEL", desc: "Avisa que todo se rompió", tipo: "ISR" },
  { addr: 31, inst: "SO: Cerrar Juego", owner: "KERNEL", desc: "Libera la memoria", tipo: "ISR" },
  { addr: 32, inst: "HALT", owner: "KERNEL", desc: "Fin de la simulación", tipo: "HALT" }
];

type FaseCPU = 'FETCH' | 'DECODE' | 'EXECUTE';
type ModoCPU = 'USER' | 'KERNEL';
type NivelDificultad = 'ESTRICTO' | 'DIDACTICO';

export default function SimuladorInterrupciones() {
  const [nivel, setNivel] = useState<NivelDificultad>('ESTRICTO');
  const memoriaActiva = nivel === 'ESTRICTO' ? MEMORIA_ESTRICTA : MEMORIA_DIDACTICA;

  const [pc, setPc] = useState(0);
  const [ir, setIr] = useState("---");
  const [fase, setFase] = useState<FaseCPU>('FETCH');
  const [modo, setModo] = useState<ModoCPU>('USER');
  const [pila, setPila] = useState<number[]>([]);
  const [irqPendiente, setIrqPendiente] = useState(false);
  const [mensajeConsola, setMensajeConsola] = useState("Sistema iniciado. Ejecutando espacio de usuario.");

  useEffect(() => {
    const elementoActivo = document.getElementById(`mem-${pc}`);
    if (elementoActivo) {
      elementoActivo.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [pc, fase]); 

  // --- LOGICA DEL MOTOR  ---
  const reiniciar = (nuevoNivel?: NivelDificultad) => {
    if (nuevoNivel) setNivel(nuevoNivel);
    setPc(0);
    setIr("---");
    setFase('FETCH');
    setModo('USER');
    setPila([]);
    setIrqPendiente(false);
    setMensajeConsola("Sistema reiniciado.");
  };

  const avanzarCiclo = () => {
    const instruccionActual = memoriaActiva.find(m => m.addr === pc);
    if (!instruccionActual || instruccionActual.tipo === "HALT") return; 

    if (fase === 'FETCH') {
      setIr(instruccionActual.inst);
      setFase('DECODE');
    } 
    else if (fase === 'DECODE') {
      setFase('EXECUTE');
    } 
    else if (fase === 'EXECUTE') {
      let proximoPc = pc + 1;
      let saltoInterrupcion: number | null = null;

      if (instruccionActual.tipo === "JUMP") {
        proximoPc = 0;
      } 
      else if (instruccionActual.tipo === "SYSCALL") {
        setMensajeConsola("TRAP Sincrónico: El programa invocó una System Call.");
        saltoInterrupcion = 20; 
      }
      else if (instruccionActual.tipo === "EXCEPTION") {
        setMensajeConsola("EXCEPTION Sincrónica: ¡Error crítico detectado en tiempo de ejecución!");
        saltoInterrupcion = 30; 
      }
      else if (instruccionActual.tipo === "IRET") {
        const pcRecuperado = pila[pila.length - 1];
        proximoPc = pcRecuperado !== undefined ? pcRecuperado : 0;
        setPila(pila.slice(0, -1)); 
        setModo('USER');
        setMensajeConsola("IRET: Contexto restaurado desde el Stack. Volviendo al proceso original.");
      }

      if (!saltoInterrupcion && irqPendiente && modo === 'USER') {
        setMensajeConsola("IRQ Asincrónica: Atendiendo interrupción de Hardware externa (Vector 10).");
        saltoInterrupcion = 10; 
        setIrqPendiente(false);
      }

      if (saltoInterrupcion !== null) {
        setPila([...pila, proximoPc]); 
        proximoPc = saltoInterrupcion; 
        setModo('KERNEL');
      }

      setPc(proximoPc);
      setFase('FETCH');
    }
  };

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

      {/* --- HEADER DE CONTROL  --- */}
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
                <span className="text-xs font-mono font-bold text-orange-300 truncate">{ir}</span>
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
              disabled={ir === "HALT"}
              className="w-full bg-white text-carbon hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-4 rounded-xl font-black text-sm shadow-lg flex justify-center items-center gap-2 active:scale-95 transition-transform"
            >
              <span className="material-symbols-outlined">skip_next</span> AVANZAR RELOJ (+1)
            </button>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-red-200 text-center">
             <h3 className="font-bold text-red-500 text-xs uppercase tracking-widest mb-3">Señal de Hardware (IRQ)</h3>
             <button 
                onClick={() => setIrqPendiente(true)}
                disabled={modo === 'KERNEL' || irqPendiente || ir === "HALT"}
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
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">Vectores de Int. habilitados</span>
          </h3>
          <div className="flex flex-col gap-1 overflow-y-auto pr-2 custom-scrollbar pb-20">
            {memoriaActiva.map((m) => (
              <div 
                key={m.addr} 
                id={`mem-${m.addr}`} 
                className={`flex items-center p-2 rounded border transition-all duration-300 ${
                  pc === m.addr ? 'bg-orange-subtle border-orange shadow-sm scale-[1.01]' : 'bg-bone border-transparent'
                }`}
              >
                <div className={`w-8 font-mono text-xs font-bold ${pc === m.addr ? 'text-orange' : 'text-gray-400'}`}>{m.addr}</div>
                <div className="flex-1">
                  <div className={`font-mono text-sm font-bold ${pc === m.addr ? 'text-carbon' : 'text-gray-700'}`}>{m.inst}</div>
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