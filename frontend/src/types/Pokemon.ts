export interface Pokemon {
  id: number;
  name: string;
  image: string;
  types: string[];
}

export interface EvolutionStep {
  name: string;
  image: string;
  id: number;
}

export type EvolutionChain = EvolutionStep[];

export interface PokeApiResponse {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  types: Array<{
    type: {
      name: string;
    };
  }>;
}

export interface EvolutionNode {
  species: {
    name: string;
    url: string;
  };
  evolves_to: EvolutionNode[]; // <--- RECURSIVIDAD AQUÍ
}

// La respuesta completa del endpoint
export interface EvolutionChainResponse {
  chain: EvolutionNode;
}