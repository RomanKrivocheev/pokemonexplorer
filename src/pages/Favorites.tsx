import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../app/FavoritesProvider';
import { useTheme } from '../app/ThemeProvider';
import { getPokemonDetails, type PokemonDetails } from '../services/pokemonApi';
import Loader from '../components/Loader';

const Favorites = () => {
  const { favorites } = useFavorites();
  const { theme } = useTheme();
  const [pokemon, setPokemon] = useState<PokemonDetails[]>([]);
  const [loading, setLoading] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      if (favorites.length === 0) {
        setPokemon([]);
        return;
      }

      setLoading(true);
      try {
        const data = await Promise.all(
          favorites.map((id) => getPokemonDetails(id))
        );
        setPokemon(data);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [favorites]);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="p-4 relative">
      {pokemon.length === 0 ? (
        <p className="opacity-70">No favorite Pokemons yet</p>
      ) : (
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {pokemon.map((p) => (
            <li
              key={p.id}
              onClick={() => navigate(`/pokemon/${p.id}`)}
              title="Click to see more details"
              className={[
                'group cursor-pointer rounded-lg p-3',
                'transition-all hover:-translate-y-1',
                theme === 'dark'
                  ? 'shadow-md shadow-white/20 hover:shadow-lg hover:shadow-white/30'
                  : 'shadow-md shadow-black/20 hover:shadow-lg hover:shadow-black/30',
              ].join(' ')}
            >
              <img
                src={p.sprites.other?.['official-artwork']?.front_default ?? ''}
                alt={p.name}
                className="w-24 h-24 mx-auto"
              />

              <div className="mt-2 text-center">
                <p className="text3 opacity-70">#{p.id}</p>
                <p className="text1 font-semibold capitalize">{p.name}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll to top"
          title="Scroll to top"
          className="
            fixed bottom-6 right-6 z-50 cursor-pointer
            w-12 h-12 rounded-full
            flex items-center justify-center
            bg-primary text-white
            shadow-lg hover:scale-110
            transition-all
          "
        >
          ↑
        </button>
      )}
    </div>
  );
};

export default Favorites;
