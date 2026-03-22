import { useState, useEffect } from 'react';
import { pokeService } from '../../servicios/pokeService';
import type { Pokemon, EvolutionChain } from '../../types/Pokemon';

const TYPE_COLORS: Record<string, string> = {
  fire: 'bg-orange-600',
  water: 'bg-blue-500',
  grass: 'bg-green-500',
  electric: 'bg-yellow-400',
  ice: 'bg-cyan-300',
  fighting: 'bg-red-700',
  poison: 'bg-purple-500',
  ground: 'bg-amber-700',
  flying: 'bg-indigo-400',
  psychic: 'bg-pink-500',
  bug: 'bg-lime-600',
  rock: 'bg-stone-600',
  ghost: 'bg-violet-700',
  dragon: 'bg-violet-900',
  dark: 'bg-zinc-800',
  steel: 'bg-slate-500',
  fairy: 'bg-rose-400',
  normal: 'bg-gray-400',
};

export default function Pokedex() {
  const [searchTerm, setSearchTerm] = useState('');
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [evolutionChain, setEvolutionChain] = useState<EvolutionChain>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError('');
    setPokemon(null);

    const result = await pokeService.getPokemon(searchTerm);

    if (result) {
      setPokemon(result);
    } else {
      setError(`¡Ups! No encontramos ningún Pokémon llamado "${searchTerm}".`);
    }

    setLoading(false);
  };

  const playCry = (id: number) => {
    // Ruta actualizada al nuevo repositorio de PokeAPI
    const audio = new Audio(`https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${id}.ogg`);
    audio.volume = 0.2; // Bajito para que no asuste a Enzo
    audio.play().catch((error) => console.log("Audio bloqueado por el navegador:", error.message));
  };

  useEffect(() => {
    const fetchEvolutions = async () => {
      if (pokemon) {
        playCry(pokemon.id);
        const chain = await pokeService.getEvolutionChain(pokemon.id);
        setEvolutionChain(chain);
      } else {
        setEvolutionChain([]);
      }
    };

    fetchEvolutions();
  }, [pokemon]); // Se dispara solo cuando el pokemon cambia

  return (
    <div className="min-h-[70vh] flex flex-col items-center py-12 px-4 font-sans animate-in fade-in duration-500">

      {/* Cabecera */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-carbon tracking-tight mb-2">
          La Pokedex de <span className="text-orange">Lumireon</span>
        </h1>
        <p className="text-gray-dark">Buscá por nombre o número de la Pokédex</p>
      </div>

      {/* Buscador */}
      <form onSubmit={handleSearch} className="w-full max-w-md flex gap-2 mb-8">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Ej: pikachu, charizard, 150..."
          className="flex-1 border border-gray-soft rounded-lg px-4 py-3 text-carbon focus:border-orange focus:ring-1 focus:ring-orange outline-none shadow-sm"
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-orange text-white px-6 py-3 rounded-lg font-bold hover:bg-orange/90 transition-colors shadow-sm disabled:opacity-70"
        >
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-lg text-center font-medium w-full max-w-md">
          {error}
        </div>
      )}

      {/* CONTENEDOR MAESTRO */}
      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row gap-12 items-start mt-10 min-h-[550px]">

        {/* BLOQUE 1: LA POKÉDEX (ESTÁTICA) */}
        <div className="relative w-full max-w-[420px] mx-auto md:mx-0 shrink-0 ">
          <img
            src="/pokedex-bg.webp"
            alt="Pokedex"
            className="w-full h-auto block"
            loading="eager"
          />

          <div className="absolute top-[25%] left-[12%] w-[75%] h-[40%] flex justify-center items-center overflow-hidden">
            {pokemon ? (
              <img
                key={pokemon.id}
                src={pokemon.image}
                alt={pokemon.name}
                className="w-[85%] h-[85%] object-contain drop-shadow-md animate-in zoom-in fade-in duration-300"
              />
            ) : (
              <div className="text-green-900/10 font-black text-4xl rotate-12">LUMI</div>
            )}
          </div>
        </div>

        {/* BLOQUE 2: LA INFO */}
        <div className="flex-1 w-full min-h-[300px]">
          {pokemon ? (
            <div key={pokemon.id} className="space-y-6 animate-in slide-in-from-right duration-500">
              <header className="border-b border-gray-soft pb-4">
                <span className="font-mono text-orange font-bold text-xl tracking-tighter">
                  #{pokemon.id.toString().padStart(3, '0')}
                </span>


                <div className="flex items-center gap-4">
                  <h2 className="text-6xl font-black text-carbon capitalize tracking-tighter">
                    {pokemon.name}
                  </h2>
                  <button
                    onClick={() => playCry(pokemon.id)}
                    className="material-symbols-outlined text-gray-soft hover:text-orange transition-colors cursor-pointer"
                  >
                    volume_up
                  </button>
                </div>

                <div className="flex gap-2 mt-4">
                  {pokemon.types.map(type => (
                    <span
                      key={type}
                      className={`px-4 py-1 rounded-md text-white text-[10px] font-bold uppercase tracking-widest shadow-sm ${TYPE_COLORS[type] || 'bg-gray-400'}`}
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </header>

              {/* Árbol de Evolución */}
              <div className="bg-bone p-6 rounded-xl border border-gray-soft">
                <h3 className="text-sm font-bold text-gray-mid uppercase tracking-widest mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">account_tree</span>
                  Línea Evolutiva
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center py-4">
                  {evolutionChain.length > 0 ? (
                    evolutionChain.map((step) => (
                      <div
                        key={step.id}
                        className="flex flex-col items-center group cursor-pointer transition-transform hover:scale-105"
                        onClick={() => pokeService.getPokemon(step.id).then(setPokemon)}
                      >
                        <div className="w-24 h-24 bg-white rounded-full border-2 border-gray-soft flex justify-center items-center p-3 group-hover:border-orange transition-all shadow-sm relative">
                          <img src={step.image} alt={step.name} className="w-full h-full object-contain z-10" />
                          {/* Un efecto de brillo sutil de fondo */}
                          <div className="absolute inset-0 bg-orange/5 rounded-full scale-0 group-hover:scale-100 transition-transform"></div>
                        </div>

                        <span className="text-[10px] font-black uppercase mt-3 text-gray-mid tracking-tighter group-hover:text-orange transition-colors">
                          {step.name}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-10 text-center">
                      <span className="material-symbols-outlined animate-spin text-orange/20 text-4xl">sync</span>
                    </div>
                  )}
                </div>

              </div>

              <p className="text-[10px] text-gray-mid font-sans italic">
                * Implementación de patrón Adapter consumiendo PokeAPI v2.
              </p>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center border-2 border-dashed border-gray-soft rounded-2xl p-12 text-center text-gray-mid">
              <p className="font-sans italic">Ingresá un nombre para activar la Pokédex.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}