import { useState, useEffect } from 'react';

export type TipoInstruccion = 'NORMAL' | 'SYSCALL' | 'EXCEPTION' | 'JUMP' | 'IRET' | 'HALT' | 'ISR';

export interface Instruccion {
    addr: number;
    inst: string;
    owner: 'USER' | 'KERNEL';
    desc: string;
    tipo: TipoInstruccion;
}

export const MEMORIA_ESTRICTA: Instruccion[] = [
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

export const MEMORIA_DIDACTICA: Instruccion[] = [
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

export type FaseCPU = 'FETCH' | 'DECODE' | 'EXECUTE';
export type ModoCPU = 'USER' | 'KERNEL';
export type NivelDificultad = 'ESTRICTO' | 'DIDACTICO';

export function useMotorCPU() {
    const [nivel, setNivel] = useState<NivelDificultad>('ESTRICTO');
    const memoriaActiva = nivel === 'ESTRICTO' ? MEMORIA_ESTRICTA : MEMORIA_DIDACTICA;

    const [pc, setPc] = useState(0);
    const [ir, setIr] = useState<Instruccion | null>(null);
    const [fase, setFase] = useState<FaseCPU>('FETCH');
    const [modo, setModo] = useState<ModoCPU>('USER');
    const [pila, setPila] = useState<number[]>([]);
    const [irqPendiente, setIrqPendiente] = useState(false);
    const [mensajeConsola, setMensajeConsola] = useState("Sistema iniciado. Ejecutando espacio de usuario.");

    const lineaActiva = fase === 'FETCH' ? pc : (ir?.addr ?? pc);

    useEffect(() => {
        const contenedor = document.getElementById('contenedor-ram');
        const elementoActivo = document.getElementById(`mem-${lineaActiva}`);

        if (contenedor && elementoActivo) {
            // Calculamos matemáticamente dónde está el centro del recuadro de la RAM
            const mitadDelContenedor = contenedor.clientHeight / 2;
            const mitadDelElemento = elementoActivo.clientHeight / 2;

            // Le decimos SOLO al contenedor de la RAM que haga scroll internamente
            contenedor.scrollTo({
                top: elementoActivo.offsetTop - mitadDelContenedor + mitadDelElemento,
                behavior: 'smooth'
            });
        }
    }, [lineaActiva]);

    const reiniciar = (nuevoNivel?: NivelDificultad) => {
        if (nuevoNivel) setNivel(nuevoNivel);
        setPc(0);
        setIr(null);
        setFase('FETCH');
        setModo('USER');
        setPila([]);
        setIrqPendiente(false);
        setMensajeConsola("Sistema reiniciado.");
    };

    const avanzarCiclo = () => {
        if (fase === 'FETCH') {
            const instruccionSiguiente = memoriaActiva.find(m => m.addr === pc);
            if (!instruccionSiguiente || instruccionSiguiente.tipo === "HALT") return;

            setIr(instruccionSiguiente);
            setPc(pc + 1);
            setFase('DECODE');
        }
        else if (fase === 'DECODE') {
            setFase('EXECUTE');
        }
        else if (fase === 'EXECUTE' && ir) {
            let proximoPc = pc;
            let saltoInterrupcion: number | null = null;

            if (ir.tipo === "JUMP") {
                proximoPc = 0;
            }
            else if (ir.tipo === "SYSCALL") {
                setMensajeConsola("TRAP Sincrónico: El programa invocó una System Call.");
                saltoInterrupcion = 20;
            }
            else if (ir.tipo === "EXCEPTION") {
                setMensajeConsola("EXCEPTION Sincrónica: ¡Error crítico detectado en tiempo de ejecución!");
                saltoInterrupcion = 30;
            }
            else if (ir.tipo === "IRET") {
                const pcRecuperado = pila[pila.length - 1];
                proximoPc = pcRecuperado !== undefined ? pcRecuperado : 0;
                setPila(pila.slice(0, -1));
                setModo('USER');
                setMensajeConsola("IRET: Contexto restaurado. PC recuperado de la Pila.");
            }

            if (!saltoInterrupcion && irqPendiente && modo === 'USER') {
                setMensajeConsola("IRQ Asincrónica: Atendiendo interrupción de Hardware.");
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

    return {
        nivel, pc, ir, fase, modo, pila, irqPendiente, mensajeConsola, memoriaActiva, lineaActiva,
        reiniciar, avanzarCiclo, setIrqPendiente
    };
}