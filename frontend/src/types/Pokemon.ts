export interface Pokemon {
  id: number;
  name: string;
  image: string;
  types: string[];
}

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