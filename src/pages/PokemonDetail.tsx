import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import { getPokemonDetails, type PokemonDetails } from '../services/pokemonApi';
import Loader from '../components/Loader';

import { useFavorites } from '../app/FavoritesProvider';

const MAX_STAT = 255;

const PokemonDetail = () => {
  const { id } = useParams();

  const { favorites, toggleFavorite } = useFavorites();

  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [animateStats, setAnimateStats] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await getPokemonDetails(id);
        setPokemon(data);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  useEffect(() => {
    if (pokemon) {
      setAnimateStats(false);
      const t = setTimeout(() => setAnimateStats(true), 100);
      return () => clearTimeout(t);
    }
  }, [pokemon]);

  if (loading) return <Loader />;
  if (!pokemon) return null;

  const isFavorite = favorites.includes(pokemon.id);
  const emptyHeart = '♡';
  const filledHeart = '♥';

  const onToggleFavorite = () => {
    const added = toggleFavorite(pokemon.id);
    toast.success(
      added ? 'Added to favorites ❤️' : 'Removed from favorites 💔'
    );
  };

  return (
    <div className="relative px-4 py-2">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* LEFT — Image + Name */}
        <div className="lg:col-span-2 flex flex-col items-center">
          <img
            src={
              pokemon.sprites.other?.['official-artwork']?.front_default ?? ''
            }
            alt={pokemon.name}
            className="w-full max-w-[520px] h-auto"
          />

          <div className="flex items-center gap-4 mt-2">
            <h1 className="h1 capitalize">
              #{pokemon.id} {pokemon.name}
            </h1>

            {/* Favorite */}
            <div className="relative group">
              <button
                onClick={onToggleFavorite}
                className="text-4xl cursor-pointer select-none text-primary"
              >
                {isFavorite ? filledHeart : emptyHeart}
              </button>

              <span
                className="
                  absolute -top-16 left-1/2 -translate-x-1/2
                  text-xs px-2 py-1 rounded
                  bg-black text-white
                  opacity-0 group-hover:opacity-100 transition
                "
              >
                {isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              </span>
            </div>
          </div>

          <div className="flex gap-2 mt-3">
            {pokemon.types.map((t) => (
              <span
                key={t.type.name}
                className="px-3 py-1 rounded bg-secondary text-on-secondary capitalize text-sm"
              >
                {t.type.name}
              </span>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <h2 className="h2 mb-2">Stats</h2>

          <div className="space-y-3">
            {pokemon.stats.map((s) => {
              const value = s.base_stat;
              const percent = Math.min((value / MAX_STAT) * 100, 100);

              return (
                <div key={s.stat.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize">
                      {s.stat.name.replace('-', ' ')}
                    </span>
                    <span className="font-semibold">{value}</span>
                  </div>

                  <div className="w-full h-2 rounded bg-black/10 dark:bg-white/20">
                    <div
                      className="h-2 rounded bg-primary transition-all duration-[3000ms] ease-out"
                      style={{
                        width: animateStats ? `${percent}%` : '0%',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <h2 className="h2 mt-4 mb-2">Moves</h2>

          <ul className="flex flex-wrap gap-2 max-h-64 overflow-y-auto">
            {pokemon.moves.map((m) => (
              <li
                key={m.move.name}
                className="px-2 py-1 text-sm rounded bg-primary/10 capitalize"
              >
                {m.move.name.replace('-', ' ')}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PokemonDetail;
