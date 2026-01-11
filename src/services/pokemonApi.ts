const API_BASE = 'https://pokeapi.co/api/v2';

export type NamedAPIResource = {
  name: string;
  url: string;
};

export type PokemonListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: NamedAPIResource[];
};

export type PokemonType = {
  slot: number;
  type: {
    name: string;
  };
};

export type PokemonStat = {
  base_stat: number;
  stat: {
    name: string;
  };
};

export type PokemonDetails = {
  id: number;
  name: string;
  sprites: {
    other?: {
      'official-artwork'?: {
        front_default: string | null;
      };
    };
  };
  types: {
    type: {
      name: string;
    };
  }[];
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
  moves: {
    move: {
      name: string;
    };
  }[];
};

export const getPokemonPage = async (
  offset: number,
  limit: number
): Promise<PokemonListResponse> => {
  try {
    const res = await fetch(
      `${API_BASE}/pokemon?limit=${limit}&offset=${offset}`
    );

    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error('Failed to fetch Pokémon page', error);
    throw error;
  }
};

export const getPokemonByType = async (type: string) => {
  try {
    const res = await fetch(`${API_BASE}/type/${type}`);
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

    const data = await res.json();
    return data.pokemon.map((p: any) => p.pokemon);
  } catch (error) {
    console.error('Failed to fetch Pokémon by type', error);
    throw error;
  }
};

export async function getPokemonByHabitat(habitat: string) {
  const res = await fetch(
    `https://pokeapi.co/api/v2/pokemon-habitat/${habitat}`
  );

  if (!res.ok) throw new Error('Failed to fetch habitat');

  const data = await res.json();

  return data.pokemon_species.map((s: any) => ({
    name: s.name,
  }));
}

export const getPokemonDetails = async (
  nameOrId: string | number
): Promise<PokemonDetails> => {
  try {
    const res = await fetch(`${API_BASE}/pokemon/${nameOrId}`);

    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error('Failed to fetch Pokémon details', error);
    throw error;
  }
};
