import type { Pokemon, PokeApiResponse } from '../types/Pokemon';

const adaptPokemon = (apiData: PokeApiResponse): Pokemon => {
  return {
    id: apiData.id,
    name: apiData.name,
    // TypeScript ahora nos autocompleta toda esta ruta infernal sin quejarse
    image: apiData.sprites.other['official-artwork'].front_default || apiData.sprites.front_default,
    // TS infiere automáticamente que 'item' tiene la forma { type: { name: string } }
    types: apiData.types.map((item) => item.type.name),
  };
};

export const pokeService = {
  getPokemon: async (nameOrId: string | number): Promise<Pokemon | null> => {
    try {
      const query = typeof nameOrId === 'string' ? nameOrId.toLowerCase() : nameOrId;
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${query}`);
      
      if (!res.ok) return null; 
      
      // Casteamos la respuesta cruda al contrato que definimos arriba
      const rawData = (await res.json()) as PokeApiResponse;
      
      return adaptPokemon(rawData); 
      
    } catch (error) {
      console.error("Error crítico conectando con la PokeAPI:", error);
      return null;
    }
  }
};