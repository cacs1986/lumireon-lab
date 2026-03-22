import type { Pokemon, PokeApiResponse, EvolutionChain, EvolutionNode, EvolutionChainResponse } from '../types/Pokemon';

const getPokemonImage = (id: number) => 
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

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
  },

  getEvolutionChain: async (pokemonId: number): Promise<EvolutionChain> => {
  try {
    const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
    const speciesData = await speciesRes.json();
    
    const chainRes = await fetch(speciesData.evolution_chain.url);
    const chainData: EvolutionChainResponse = await chainRes.json();

    const chain: EvolutionChain = [];

    // Ahora 'node' tiene tipo estricto, no más anarquías
    const traverse = (node: EvolutionNode) => {
      const id = parseInt(node.species.url.split('/').slice(-2, -1)[0]);
      
      chain.push({
        name: node.species.name,
        id: id,
        image: getPokemonImage(id)
      });

      // TypeScript ahora nos ayuda con el autocompletado aquí
      if (node.evolves_to && node.evolves_to.length > 0) {
        node.evolves_to.forEach((evolution) => traverse(evolution));
      }
    };

    traverse(chainData.chain);
    return chain;
  } catch (error) {
    console.error("Error en la cadena de evolución:", error);
    return [];
  }
}

};