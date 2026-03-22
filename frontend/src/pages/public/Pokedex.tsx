import { useState } from 'react';
import { pokeService } from '../../servicios/pokeService';
import type { Pokemon } from '../../types/Pokemon';

export default function Pokedex() {
  const [searchTerm, setSearchTerm] = useState('');
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError('');
    setPokemon(null);

    // Llamamos a nuestro servicio tipado que conecta con la API
    const result = await pokeService.getPokemon(searchTerm);

    if (result) {
      setPokemon(result);
    } else {
      setError(`¡Ups! No encontramos ningún Pokémon llamado "${searchTerm}".`);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center py-12 px-4 font-sans animate-in fade-in duration-500">
      
      {/* Cabecera de la Pokédex */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-carbon tracking-tight mb-2">
          Pokedex <span className="text-orange">Lumireon</span>
        </h1>
        <p className="text-gray-dark">Buscá por nombre o número de la Pokédex Nacional</p>
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

      {/* Mensaje de Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-lg text-center font-medium w-full max-w-md">
          {error}
        </div>
      )}

      {/* Tarjeta del Pokémon */}
      {pokemon && (
        <div className="w-full max-w-md bg-white rounded-2xl border border-gray-soft shadow-md overflow-hidden transform transition-all hover:-translate-y-1 hover:shadow-lg">
          
          <div className="bg-bone relative h-48 flex justify-center items-center border-b border-gray-soft">
            {/* El número de la Pokedex de fondo */}
            <span className="absolute top-4 right-4 text-4xl font-black text-gray-soft/50">
              #{pokemon.id.toString().padStart(3, '0')}
            </span>
            <img 
              src={pokemon.image} 
              alt={pokemon.name} 
              className="h-40 w-40 object-contain drop-shadow-lg z-10"
            />
          </div>

          <div className="p-6 text-center">
            <h2 className="text-3xl font-bold text-carbon capitalize mb-4">
              {pokemon.name}
            </h2>
            
            <div className="flex justify-center gap-2">
              {pokemon.types.map((type) => (
                <span 
                  key={type} 
                  className="px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gray-soft text-carbon border border-gray-300"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
}