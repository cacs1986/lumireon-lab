export type ProcessState = 
  | 'NUEVO'           
  | 'LISTO'           
  | 'EJECUCION'       
  | 'BLOQUEADO'       
  | 'TERMINADO'       
  | 'LISTO_SUSPENDIDO'    
  | 'BLOQUEADO_SUSPENDIDO'; 

  export interface OSProcess {
  pid: number;                 
  nombre: string;              
  estado: ProcessState;        
  tiempoLlegada: number;       
  rafagaCPU: number;           
  tiempoRestante: number;      
  prioridad: number;        
  necesitaIO: boolean;         
  tiempoBloqueado?: number;   
}

export interface SimulatorState {
  relojGlobal: number;                
  algoritmoActual: 'FIFO' | 'RR' | 'SJF' | 'PRIORIDAD';
  quantum: number;                     
  
  colaNuevos: OSProcess[];            
  colaListos: OSProcess[];             
  enEjecucion: OSProcess | null;       
  colaBloqueados: OSProcess[];         
  
  colaListosSuspendidos: OSProcess[];  
  colaBloqueadosSuspendidos: OSProcess[]; 
  
  procesosTerminados: OSProcess[];     
}

export type AlgoritmoPlanificacion = 'FIFO' | 'RR' | 'SJF' | 'PRIORIDAD';

export interface ConfiguracionSimulador {
  algoritmoActual: AlgoritmoPlanificacion;
  esApropiativo: boolean; // <-- ESTA ES LA LLAVE MAESTRA
  quantum: number;        // Solo importa si es RR
}