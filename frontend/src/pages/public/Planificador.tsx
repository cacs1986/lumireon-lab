import { useState } from 'react';
import type { OSProcess, AlgoritmoPlanificacion, ConfiguracionSimulador } from '../../types/Procesos';

const PROCESOS_POR_DEFECTO: OSProcess[] = [
    { pid: 1, nombre: "Chrome", estado: 'NUEVO', tiempoLlegada: 0, rafagaCPU: 5, tiempoRestante: 5, prioridad: 3, necesitaIO: false },
    { pid: 2, nombre: "Spotify", estado: 'NUEVO', tiempoLlegada: 1, rafagaCPU: 3, tiempoRestante: 3, prioridad: 1, necesitaIO: false },
    { pid: 3, nombre: "Word", estado: 'NUEVO', tiempoLlegada: 3, rafagaCPU: 6, tiempoRestante: 6, prioridad: 5, necesitaIO: false },
    { pid: 4, nombre: "Antivirus", estado: 'NUEVO', tiempoLlegada: 4, rafagaCPU: 2, tiempoRestante: 2, prioridad: 0, necesitaIO: false },
];

const getColorPorPid = (pid: number | null) => {
    if (!pid) return 'bg-gray-200 border-gray-300 border-dashed border-2';
    const colores = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 'bg-yellow-500', 'bg-cyan-500', 'bg-pink-500'];
    return colores[(pid - 1) % colores.length];
};

interface RegistroGantt {
    tiempo: number;
    pid: number | null;
    nombre: string;
}

export default function Planificador() {
    // --- ESTADO DEL LABORATORIO ---
    const [procesosBase, setProcesosBase] = useState<OSProcess[]>(PROCESOS_POR_DEFECTO);
    const [nuevoForm, setNuevoForm] = useState({ nombre: '', llegada: 0, rafaga: 1, prioridad: 1 });

    // --- CONFIGURACIÓN ---
    const [simulacionIniciada, setSimulacionIniciada] = useState(false);
    const [config, setConfig] = useState<ConfiguracionSimulador>({
        algoritmoActual: 'FIFO',
        esApropiativo: false,
        quantum: 3
    });

    // --- ESTADO DEL SISTEMA ---
    const [relojGlobal, setRelojGlobal] = useState(0);
    const [quantumRestante, setQuantumRestante] = useState(0); 
    const [colaNuevos, setColaNuevos] = useState<OSProcess[]>(procesosBase.map(p => ({ ...p })));
    const [colaListos, setColaListos] = useState<OSProcess[]>([]);
    const [enEjecucion, setEnEjecucion] = useState<OSProcess | null>(null);
    const [procesosTerminados, setProcesosTerminados] = useState<OSProcess[]>([]);
    const [historialGantt, setHistorialGantt] = useState<RegistroGantt[]>([]);
    
    // --- GESTIÓN DE EJERCICIOS (CRUD) ---
    const reiniciarTodo = (baseActualizada: OSProcess[]) => {
        setSimulacionIniciada(false);
        setRelojGlobal(0);
        setQuantumRestante(0);
        setColaNuevos(baseActualizada.map(p => ({ ...p })));
        setColaListos([]);
        setEnEjecucion(null);
        setProcesosTerminados([]);
        setHistorialGantt([]);
    };

    const agregarProceso = (e: React.FormEvent) => {
        e.preventDefault();
        const nuevoId = procesosBase.length > 0 ? Math.max(...procesosBase.map(p => p.pid)) + 1 : 1;
        const nuevoProc: OSProcess = {
            pid: nuevoId,
            nombre: nuevoForm.nombre || `P${nuevoId}`,
            estado: 'NUEVO',
            tiempoLlegada: nuevoForm.llegada,
            rafagaCPU: nuevoForm.rafaga,
            tiempoRestante: nuevoForm.rafaga,
            prioridad: nuevoForm.prioridad,
            necesitaIO: false
        };
        const nuevaBase = [...procesosBase, nuevoProc];
        setProcesosBase(nuevaBase);
        reiniciarTodo(nuevaBase);
        setNuevoForm({ nombre: '', llegada: 0, rafaga: 1, prioridad: 1 });
    };

    const eliminarProceso = (pid: number) => {
        const nuevaBase = procesosBase.filter(p => p.pid !== pid);
        setProcesosBase(nuevaBase);
        reiniciarTodo(nuevaBase);
    };

    // --- CONTROLES DE SIMULACIÓN ---
    const iniciarSimulacion = () => {
        setSimulacionIniciada(true);
        const iniciales = procesosBase.map(p => ({ ...p }));
        const lleganCero = iniciales.filter(p => p.tiempoLlegada === 0);
        const resto = iniciales.filter(p => p.tiempoLlegada > 0);
        
        lleganCero.forEach(p => p.estado = 'LISTO');
        
        let nuevaCpu: OSProcess | null = null;
        if (lleganCero.length > 0) {
            nuevaCpu = lleganCero.shift() || null;
            if (nuevaCpu) nuevaCpu.estado = 'EJECUCION';
        }

        setColaNuevos(resto);
        setColaListos(lleganCero);
        setEnEjecucion(nuevaCpu);
        setQuantumRestante(config.quantum); 
        setHistorialGantt([]); 
    };

 const avanzarReloj = () => {
        let cpu = enEjecucion ? { ...enEjecucion } : null;
        const listos = [...colaListos];
        let nuevos = [...colaNuevos];
        const terminados = [...procesosTerminados];
        
        let proxQuantum = quantumRestante;
        const tiempoActual = relojGlobal;
        const proximoTiempo = relojGlobal + 1; 

        // FOTO GANTT
        const nuevoRegistroGantt: RegistroGantt = {
            tiempo: tiempoActual,
            pid: cpu ? cpu.pid : null,
            nombre: cpu ? cpu.nombre : 'LIBRE'
        };

        // FASE 1: EJECUCIÓN 
        if (cpu) {
            cpu.tiempoRestante -= 1;
            proxQuantum -= 1; 
            
            if (cpu.tiempoRestante <= 0) {
                cpu.estado = 'TERMINADO';
                terminados.push(cpu);
                cpu = null; 
            }
        }

        // FASE 2: ADMISIÓN 
        const lleganAhora = nuevos.filter(p => p.tiempoLlegada === proximoTiempo);
        nuevos = nuevos.filter(p => p.tiempoLlegada > proximoTiempo);

        if (lleganAhora.length > 0) {
            lleganAhora.forEach(p => p.estado = 'LISTO');
            listos.push(...lleganAhora);
        }

        // FASE 3: PLANIFICACIÓN Y EXPROPIACIÓN (Con desempatador estricto)
        
        const ordenarCola = (cola: OSProcess[]) => {
            cola.sort((a, b) => {
                if (config.algoritmoActual === 'SJF') {
                    // 1. Ráfaga más corta (Tiempo restante)
                    if (a.tiempoRestante !== b.tiempoRestante) return a.tiempoRestante - b.tiempoRestante;
                    // 2. Desempate 1: FIFO (El que llegó antes)
                    if (a.tiempoLlegada !== b.tiempoLlegada) return a.tiempoLlegada - b.tiempoLlegada;
                    // 3. Desempate 2: Prioridad (0 es máxima)
                    return a.prioridad - b.prioridad;
                } 
                else if (config.algoritmoActual === 'PRIORIDAD') {
                    // 1. Mayor prioridad
                    if (a.prioridad !== b.prioridad) return a.prioridad - b.prioridad;
                    // 2. Desempate 1: FIFO (El que llegó antes)
                    if (a.tiempoLlegada !== b.tiempoLlegada) return a.tiempoLlegada - b.tiempoLlegada;
                    // 3. Desempate 2: SJF (Ráfaga más corta)
                    return a.tiempoRestante - b.tiempoRestante; 
                }
                return 0; // FIFO y RR mantienen el orden natural de llegada al arreglo
            });
        };

        ordenarCola(listos);

        // B. Evaluamos la expropiación con las mismas reglas estrictas
        if (cpu) {
            let debeExpropiar = false;

            if (config.algoritmoActual === 'RR' && proxQuantum <= 0) {
                debeExpropiar = true; 
            } else if (config.esApropiativo && listos.length > 0) {
                const mejor = listos[0];
                
                if (config.algoritmoActual === 'SJF') {
                    if (mejor.tiempoRestante < cpu.tiempoRestante) debeExpropiar = true;
                    else if (mejor.tiempoRestante === cpu.tiempoRestante) {
                        if (mejor.tiempoLlegada < cpu.tiempoLlegada) debeExpropiar = true;
                        else if (mejor.tiempoLlegada === cpu.tiempoLlegada && mejor.prioridad < cpu.prioridad) debeExpropiar = true;
                    }
                } else if (config.algoritmoActual === 'PRIORIDAD') {
                    if (mejor.prioridad < cpu.prioridad) debeExpropiar = true;
                    else if (mejor.prioridad === cpu.prioridad) {
                        if (mejor.tiempoLlegada < cpu.tiempoLlegada) debeExpropiar = true;
                        else if (mejor.tiempoLlegada === cpu.tiempoLlegada && mejor.tiempoRestante < cpu.tiempoRestante) debeExpropiar = true;
                    }
                }
            }

            if (debeExpropiar) {
                cpu.estado = 'LISTO';
                listos.push(cpu); 
                ordenarCola(listos); 
                cpu = null; 
            }
        }

        if (!cpu && listos.length > 0) {
            cpu = listos.shift() || null;
            if (cpu) {
                cpu.estado = 'EJECUCION';
                proxQuantum = config.quantum; 
            }
        }

        setRelojGlobal(proximoTiempo);
        setQuantumRestante(proxQuantum);
        setColaNuevos(nuevos);
        setColaListos(listos);
        setEnEjecucion(cpu);
        setProcesosTerminados(terminados);
        setHistorialGantt([...historialGantt, nuevoRegistroGantt]); 
    };

    const TarjetaProceso = ({ p }: { p: OSProcess }) => (
        <div className="bg-bone px-3 py-2 rounded border border-gray-soft flex items-center justify-between text-xs shadow-sm">
            <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getColorPorPid(p.pid)}`}></div>
                <span className="font-bold font-mono text-carbon">P{p.pid}</span>
                <span className="text-gray-dark truncate max-w-[100px]">{p.nombre}</span>
            </div>
            {p.estado === 'LISTO' && <span className="text-[10px] font-bold text-orange">{p.tiempoRestante}t</span>}
        </div>
    );

    return (
        <div className="min-h-screen bg-bone p-4 md:p-8 font-sans text-carbon flex flex-col gap-6">
            
            <header className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-soft">
                <div className="text-center md:text-left mb-4 md:mb-0">
                    <h1 className="text-3xl font-black text-orange tracking-tight">Simulador de Procesos</h1>
                    <p className="text-gray-dark text-sm">Reloj Global: <span className="font-mono font-bold text-lg text-carbon">{relojGlobal}</span></p>
                </div>

                <div className="flex gap-4 items-center flex-wrap justify-center">
                    <select
                        className="border border-gray-soft rounded-lg px-4 py-2 font-bold focus:ring-2 focus:ring-orange outline-none disabled:opacity-50"
                        value={config.algoritmoActual}
                        onChange={(e) => {
                            setConfig({ ...config, algoritmoActual: e.target.value as AlgoritmoPlanificacion });
                            reiniciarTodo(procesosBase);
                        }}
                        disabled={simulacionIniciada}
                    >
                        <option value="FIFO">FIFO (FCFS)</option>
                        <option value="RR">Round Robin</option>
                        <option value="SJF">SJF</option>
                        <option value="PRIORIDAD">Por Prioridad</option>
                    </select>

                    {config.algoritmoActual === 'RR' && (
                        <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-soft">
                            <label className="text-sm font-bold text-gray-dark">Q:</label>
                            <input
                                type="number" min="1" max="10"
                                value={config.quantum}
                                onChange={(e) => setConfig({ ...config, quantum: parseInt(e.target.value) || 1 })}
                                disabled={simulacionIniciada}
                                className="w-10 text-center font-mono font-bold bg-transparent disabled:opacity-50 outline-none"
                            />
                        </div>
                    )}

                    <label className={`flex items-center gap-2 text-sm font-bold cursor-pointer ${simulacionIniciada ? 'opacity-50' : 'text-gray-dark'}`}>
                        <input
                            type="checkbox"
                            checked={config.esApropiativo}
                            onChange={(e) => {
                                setConfig({ ...config, esApropiativo: e.target.checked });
                                reiniciarTodo(procesosBase);
                            }}
                            className="accent-orange w-4 h-4"
                            disabled={config.algoritmoActual === 'FIFO' || config.algoritmoActual === 'RR' || simulacionIniciada}
                        />
                        Expropiativo
                    </label>
                </div>
            </header>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-soft w-full">
                <h3 className="font-bold text-carbon text-lg tracking-tight mb-4 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-orange">database</span>
                        Tabla de Procesos (Referencia)
                    </span>
                    {simulacionIniciada && <span className="text-xs bg-orange/20 text-orange px-2 py-1 rounded">Simulación en curso - Edición bloqueada</span>}
                </h3>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                        <thead>
                            <tr className="border-b-2 border-gray-200 text-gray-dark">
                                <th className="p-2">Color</th>
                                <th className="p-2">PID</th>
                                <th className="p-2">Nombre</th>
                                <th className="p-2">Llegada (t)</th>
                                <th className="p-2">Ráfaga CPU</th>
                                <th className="p-2">Prioridad</th>
                                {!simulacionIniciada && <th className="p-2 text-center">Acción</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {procesosBase.map(p => (
                                <tr key={p.pid} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                    <td className="p-2"><div className={`w-4 h-4 rounded ${getColorPorPid(p.pid)}`}></div></td>
                                    <td className="p-2 font-mono font-bold">P{p.pid}</td>
                                    <td className="p-2">{p.nombre}</td>
                                    <td className="p-2 font-mono">{p.tiempoLlegada}</td>
                                    <td className="p-2 font-mono">{p.rafagaCPU}</td>
                                    <td className="p-2 font-mono">{p.prioridad}</td>
                                    {!simulacionIniciada && (
                                        <td className="p-2 text-center">
                                            <button onClick={() => eliminarProceso(p.pid)} className="text-red-500 hover:text-red-700 font-bold text-xs bg-red-50 px-2 py-1 rounded">Eliminar</button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {!simulacionIniciada && (
                    <form onSubmit={agregarProceso} className="mt-4 flex flex-wrap gap-4 items-end bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-gray-dark">Nombre</label>
                            <input type="text" required value={nuevoForm.nombre} onChange={e => setNuevoForm({...nuevoForm, nombre: e.target.value})} className="border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:border-orange w-32" placeholder="Ej: Excel" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-gray-dark">Llegada</label>
                            <input type="number" min="0" required value={nuevoForm.llegada} onChange={e => setNuevoForm({...nuevoForm, llegada: parseInt(e.target.value) || 0})} className="border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:border-orange w-20" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-gray-dark">Ráfaga</label>
                            <input type="number" min="1" required value={nuevoForm.rafaga} onChange={e => setNuevoForm({...nuevoForm, rafaga: parseInt(e.target.value) || 1})} className="border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:border-orange w-20" />
                        </div>
                        <div className="flex flex-col gap-1">
                            <label className="text-xs font-bold text-gray-dark">Prioridad (0=Max)</label>
                            <input type="number" min="0" required value={nuevoForm.prioridad} onChange={e => setNuevoForm({...nuevoForm, prioridad: parseInt(e.target.value) || 0})} className="border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:border-orange w-24" />
                        </div>
                        <button type="submit" className="bg-carbon text-white px-4 py-1.5 rounded font-bold text-sm hover:bg-carbon/80 transition-colors">
                            + Agregar Proceso
                        </button>
                    </form>
                )}
            </div>

            {/* TABLERO DE COLAS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="bg-white p-4 rounded-xl border border-gray-soft shadow-sm h-full flex flex-col">
                    <h3 className="font-bold text-gray-mid text-sm uppercase tracking-widest mb-4">Cola de Nuevos</h3>
                    <div className="flex flex-col gap-2 overflow-y-auto pr-1 flex-grow">
                        {colaNuevos.map(p => <TarjetaProceso key={p.pid} p={p} />)}
                        {colaNuevos.length === 0 && <p className="text-xs text-gray-mid italic text-center mt-4">Vacía</p>}
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    {/* CPU Y CONTROLES */}
                    <div className="bg-carbon p-5 rounded-2xl shadow-lg border border-gray-800 text-center relative flex flex-col justify-between min-h-[180px]">
                        <div>
                            <h3 className="font-bold text-gray-400 text-xs uppercase tracking-widest mb-3">En Ejecución (CPU)</h3>
                            <div className="h-16 flex items-center justify-center relative">
                                {enEjecucion ? (
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full shadow-inner flex items-center justify-center text-white font-bold text-sm ${getColorPorPid(enEjecucion.pid)}`}>
                                            P{enEjecucion.pid}
                                        </div>
                                        <div className="text-left">
                                            <div className="text-white font-black text-lg font-mono leading-none">{enEjecucion.nombre}</div>
                                            <div className="text-orange text-xs font-bold mt-1">Resta: {enEjecucion.tiempoRestante}t</div>
                                        </div>
                                        {config.algoritmoActual === 'RR' && (
                                            <div className="absolute top-0 right-0 bg-orange/20 border border-orange text-orange text-[10px] px-2 py-1 rounded font-bold">
                                                Q: {quantumRestante}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <span className="text-gray-500 font-mono text-sm border border-dashed border-gray-600 px-6 py-2 rounded-lg">INACTIVA</span>
                                )}
                            </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-gray-700/50 flex flex-wrap justify-center gap-2">
                            {!simulacionIniciada ? (
                                <button onClick={iniciarSimulacion} className="w-full bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 transition-colors text-sm">
                                    ▶ Iniciar Motor
                                </button>
                            ) : (
                                <>
                                    <button onClick={() => reiniciarTodo(procesosBase)} className="flex-1 bg-red-500/10 text-red-400 border border-red-500/30 px-3 py-2 rounded-lg font-bold hover:bg-red-500 hover:text-white transition-all text-sm">
                                        ⏹ Detener
                                    </button>
                                    <button onClick={avanzarReloj} className="flex-1 bg-orange text-white px-3 py-2 rounded-lg font-bold hover:bg-orange/80 transition-all shadow-lg hover:-translate-y-0.5 text-sm">
                                        ⏭ Tick (+1)
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="bg-orange-50 p-4 rounded-xl border border-orange/20 shadow-sm flex-grow flex flex-col">
                        <h3 className="font-bold text-orange text-sm uppercase tracking-widest mb-4 flex justify-between items-center">
                            <span>Cola de Listos (RAM)</span>
                            <span className="bg-orange/20 text-orange-dark px-2 py-0.5 rounded text-xs">{colaListos.length}</span>
                        </h3>
                        <div className="flex flex-col gap-2 overflow-y-auto pr-1">
                            {colaListos.map(p => <TarjetaProceso key={p.pid} p={p} />)}
                            {colaListos.length === 0 && <p className="text-xs text-orange/60 italic text-center mt-4">Vacía</p>}
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-soft shadow-sm h-full flex flex-col">
                    <h3 className="font-bold text-green-600 text-sm uppercase tracking-widest mb-4">Terminados</h3>
                    <div className="flex flex-col gap-2 overflow-y-auto pr-1 flex-grow">
                        {procesosTerminados.map(p => (
                            <div key={p.pid} className="bg-green-50 px-3 py-2 rounded border border-green-100 flex items-center gap-2 text-xs shadow-sm opacity-60">
                                <div className={`w-3 h-3 rounded-full ${getColorPorPid(p.pid)}`}></div>
                                <span className="font-mono line-through text-gray-dark">{p.nombre}</span>
                            </div>
                        ))}
                        {procesosTerminados.length === 0 && <p className="text-xs text-gray-mid italic text-center mt-4">Sin finalizar</p>}
                    </div>
                </div>

            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-soft w-full overflow-hidden mt-2">
                <h3 className="font-bold text-carbon text-lg tracking-tight mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-orange">timeline</span>
                    Diagrama de Gantt
                </h3>
                
                {historialGantt.length === 0 ? (
                    <div className="h-20 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                        <p className="text-sm text-gray-mid font-mono">Iniciá la simulación para trazar la ejecución</p>
                    </div>
                ) : (
                    <div className="flex overflow-x-auto pb-4 custom-scrollbar gap-0.5 items-end min-h-[60px]">
                        {historialGantt.map((registro, indice) => (
                            <div key={indice} className="flex flex-col items-center group w-8">
                                <div 
                                    className={`w-full h-10 flex items-center justify-center font-bold text-xs transition-transform group-hover:-translate-y-1 rounded-sm border border-black/10 text-white ${getColorPorPid(registro.pid)}`}
                                    title={`Tick ${registro.tiempo}: ${registro.nombre}`}
                                >
                                    {registro.pid ? `P${registro.pid}` : '-'}
                                </div>
                                <span className="text-[9px] text-gray-dark font-mono mt-1 font-bold">{registro.tiempo}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}