import { Link } from 'react-router-dom';

export default function TeoriaInterrupciones() {
  return (
    <div className="min-h-screen bg-bone p-4 md:p-8 font-sans text-carbon">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <header className="flex items-center justify-between border-b border-gray-soft pb-4">
          <div>
            <h1 className="text-3xl font-black text-orange tracking-tight">El Cambio de Contexto</h1>
            <p className="text-gray-dark font-bold mt-1">Guía Teórica de Interrupciones y Privilegios</p>
          </div>
          <Link 
            to="/herramientas/interrupciones" 
            className="text-sm font-bold text-gray-dark hover:text-orange transition-colors flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Volver al Simulador
          </Link>
        </header>

        <article className="prose prose-neutral max-w-none text-carbon leading-relaxed space-y-10">
          
          <section>
            <h2 className="text-2xl font-black text-carbon flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-orange">admin_panel_settings</span>
              Niveles de Ejecución: Los Anillos de Privilegio
            </h2>
            <p>
              La arquitectura de los procesadores modernos (como x86) divide la ejecución en niveles lógicos de seguridad llamados "Anillos". Esto garantiza la estabilidad del sistema al restringir qué procesos pueden interactuar directamente con el hardware.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 not-prose">
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl">
                <h3 className="font-bold text-blue-700 flex items-center gap-2">
                  <span className="material-symbols-outlined">person</span> Anillo 3 (Modo Usuario)
                </h3>
                <p className="text-sm text-gray-dark mt-2">Nivel de ejecución sin privilegios directos. Acá residen las aplicaciones comunes (navegadores, juegos, editores). Si un proceso en este anillo requiere acceso a hardware (como leer el disco), debe solicitarlo obligatoriamente al Kernel mediante una llamada al sistema.</p>
              </div>
              <div className="bg-red-50 border border-red-200 p-4 rounded-xl">
                <h3 className="font-bold text-red-700 flex items-center gap-2">
                  <span className="material-symbols-outlined">shield</span> Anillo 0 (Modo Kernel)
                </h3>
                <p className="text-sm text-gray-dark mt-2">Nivel de máximo privilegio. Exclusivo para el núcleo del Sistema Operativo. Posee control total sobre la memoria, el procesador y las operaciones de entrada/salida (I/O). Es el único entorno capaz de ejecutar instrucciones críticas de hardware.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black text-carbon flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-orange">swap_horiz</span>
              El Context Switch (Cambio de Contexto)
            </h2>
            <p>
              Es el procedimiento mediante el cual la CPU detiene la ejecución del proceso actual, guarda su estado exacto para poder reanudarlo más tarde, y transfiere el control a una Rutina de Servicio del Sistema Operativo (ISR).
            </p>
            <div className="bg-orange-subtle/30 border-l-4 border-orange p-4 rounded-r-xl my-4 flex gap-3 items-start">
              <span className="material-symbols-outlined text-orange">lightbulb</span>
              <p className="text-sm font-bold text-gray-800 m-0">
                Lógica fundamental: La CPU nunca abandona un proceso sin antes "guardar la partida". El estado del procesador en ese milisegundo exacto debe preservarse en memoria.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black text-carbon flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-orange">layers</span>
              El Stack: Instrucciones PUSH y POP
            </h2>
            <p>
              Para almacenar el estado del proceso interrumpido, la arquitectura utiliza una estructura de datos tipo LIFO (Last In, First Out) llamada <strong>Pila o Stack</strong>.
            </p>
            <ul className="space-y-2">
              <li><strong>PUSH:</strong> Operación de escritura. Al ser interrumpida, la CPU realiza un PUSH automático del <code>Program Counter (PC)</code> y los registros de estado hacia el tope de la Pila.</li>
              <li><strong>ISR (Interrupt Service Routine):</strong> Una vez guardado el contexto, la CPU carga en el <code>PC</code> la dirección del bloque de código del Kernel responsable de manejar el evento.</li>
              <li><strong>IRET / POP:</strong> Al finalizar, el Kernel ejecuta un retorno de interrupción. Esto fuerza un POP (operación de lectura y extracción) de la Pila, restaurando el <code>PC</code> original y devolviendo el sistema al Anillo 3.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-carbon flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-orange">bolt</span>
              Clasificación de las Interrupciones
            </h2>
            <p>El Cambio de Contexto puede ser provocado por tres tipos principales de eventos:</p>
            
            <div className="space-y-4 not-prose mt-4">
              <div className="bg-white border border-gray-soft p-5 rounded-xl shadow-sm">
                <h3 className="font-black text-carbon text-lg flex items-center gap-2">
                  <span className="material-symbols-outlined text-purple-700">settings_input_component</span>
                  Hardware Interrupt (IRQ)
                </h3>
                <span className="inline-block bg-purple-100 text-purple-700 text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider mb-2 mt-2">Evento Asincrónico</span>
                <p className="text-sm text-gray-dark">Señales eléctricas originadas por dispositivos externos (temporizadores, teclado, disco duro). Son impredecibles respecto al flujo del programa. El hardware de la CPU espera a finalizar la fase <em>Execute</em> de la instrucción en curso antes de atender la señal.</p>
              </div>

              <div className="bg-white border border-gray-soft p-5 rounded-xl shadow-sm">
                <h3 className="font-black text-carbon text-lg flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-700">pan_tool</span>
                  Trap / System Call (Llamada al Sistema)
                </h3>
                <span className="inline-block bg-green-100 text-green-700 text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider mb-2 mt-2">Evento Sincrónico Voluntario</span>
                <p className="text-sm text-gray-dark">Interrupción por software solicitada deliberadamente por un proceso. Utiliza instrucciones especiales (como <code>INT 80h</code>) para invocar de manera controlada una transición al Anillo 0 y requerir servicios autorizados del Kernel (ej. escribir un archivo).</p>
              </div>

              <div className="bg-white border border-gray-soft p-5 rounded-xl shadow-sm">
                <h3 className="font-black text-carbon text-lg flex items-center gap-2">
                  <span className="material-symbols-outlined text-red-700">error</span>
                  Exception (Excepción de Software)
                </h3>
                <span className="inline-block bg-red-100 text-red-700 text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider mb-2 mt-2">Evento Sincrónico Involuntario</span>
                <p className="text-sm text-gray-dark">Condición anómala detectada por la CPU al intentar ejecutar una instrucción (ej. división por cero, o intento de acceso a memoria no asignada / Segmentation Fault). La CPU aborta la instrucción y transfiere el control al SO, el cual habitualmente finaliza el proceso problemático.</p>
              </div>
            </div>
          </section>

          <hr className="border-gray-soft" />

          <section>
            <h2 className="text-2xl font-black text-carbon flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-orange">memory</span>
              Anatomía del Simulador (Hardware Interno)
            </h2>
            <p>
              El modo "Avanzado" expone los registros internos del procesador y las fases de su reloj:
            </p>
            <ul className="space-y-4 mt-4">
              <li>
                <strong>PC (Program Counter):</strong> Registro fundamental que almacena la dirección de memoria de la <em>próxima</em> instrucción a ejecutar. Es el puntero de control de flujo.
              </li>
              <li>
                <strong>IR (Instruction Register):</strong> Registro temporal donde se copia la instrucción recién obtenida de la memoria RAM, manteniéndola estable para su decodificación.
              </li>
              <li>
                <strong>Registros Generales (R1, R2, etc.):</strong> Memorias estáticas de ultra-alta velocidad integradas en la CPU. Dado que operar directamente sobre la RAM es ineficiente, los datos se cargan en estos registros para procesarlos en la ALU (Unidad Aritmético Lógica).
              </li>
              <li>
                <strong>Ciclo de Instrucción:</strong> El proceso iterativo básico de la CPU.
                <br/>1. <strong>FETCH:</strong> Accede a la RAM en la dirección indicada por el PC y copia el dato al IR.
                <br/>2. <strong>DECODE:</strong> La Unidad de Control interpreta el código binario de la instrucción.
                <br/>3. <strong>EXECUTE:</strong> Se realiza la operación física y se actualiza el PC para el siguiente ciclo.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-carbon flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-orange">code</span>
              Diccionario de Ensamblador
            </h2>
            <p>
              Nomenclatura básica utilizada en la RAM del simulador (Lenguaje de Bajo Nivel):
            </p>
            
            <div className="overflow-x-auto not-prose mt-4">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b-2 border-carbon text-carbon bg-bone">
                    <th className="p-3 font-black">Mnemónico</th>
                    <th className="p-3 font-black">Descripción Técnica</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-soft">
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="p-3 font-mono font-bold text-blue-700">MOV</td>
                    <td className="p-3 text-gray-dark">Transferencia de datos. Asigna el valor del operando de origen al operando de destino (ej. de RAM a Registro).</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="p-3 font-mono font-bold text-green-700">INT</td>
                    <td className="p-3 text-gray-dark">Dispara una interrupción por software invocando a un vector específico (ej. <code>80h</code> en arquitectura Unix/Linux para syscalls).</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="p-3 font-mono font-bold text-red-700">DIV</td>
                    <td className="p-3 text-gray-dark">Operación aritmética de división. Si el divisor es 0, el hardware genera un trap automático.</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="p-3 font-mono font-bold text-purple-700">JMP</td>
                    <td className="p-3 text-gray-dark">Salto incondicional. Modifica directamente el valor del <code>PC</code>, alterando el flujo secuencial del programa.</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="p-3 font-mono font-bold text-orange-dark">PUSH / POP</td>
                    <td className="p-3 text-gray-dark">Instrucciones de manejo del Stack Pointer (SP). Manipulan la memoria reservada para la pila.</td>
                  </tr>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="p-3 font-mono font-bold text-carbon">HALT</td>
                    <td className="p-3 text-gray-dark">Detiene el ciclo de reloj del procesador y lo pone en estado de inactividad.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

        </article>
      </div>
    </div>
  );
}