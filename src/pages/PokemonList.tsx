import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../app/ThemeProvider';

import {
  getPokemonPage,
  getPokemonDetails,
  type PokemonDetails,
} from '../services/pokemonApi';
import Loader from '../components/Loader';

const LIMIT = 20;

const TYPE_COLORS: Record<string, string> = {
  normal: 'bg-gray-400 text-white',
  fire: 'bg-red-500 text-white',
  water: 'bg-blue-500 text-white',
  electric: 'bg-yellow-400 text-white',
  grass: 'bg-green-500 text-white',
  ice: 'bg-cyan-400 text-white',
  fighting: 'bg-orange-700 text-white',
  poison: 'bg-purple-500 text-white',
  ground: 'bg-amber-600 text-white',
  flying: 'bg-indigo-400 text-white',
  psychic: 'bg-pink-500 text-white',
  bug: 'bg-lime-600 text-white',
  rock: 'bg-stone-500 text-white',
  ghost: 'bg-indigo-700 text-white',
  dragon: 'bg-indigo-900 text-white',
  dark: 'bg-neutral-800 text-white',
  steel: 'bg-slate-500 text-white',
  fairy: 'bg-pink-400 text-white',
};

const PokemonList = () => {
  const [pokemon, setPokemon] = useState<PokemonDetails[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);

  const loaderRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const { theme } = useTheme();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const page = await getPokemonPage(offset, LIMIT);
        const details = await Promise.all(
          page.results.map((p) => getPokemonDetails(p.name))
        );
        setPokemon((prev) => [...prev, ...details]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [offset]);

  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loading) {
          setOffset((prev) => prev + LIMIT);
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loading]);

  return (
    <div className="p-4">
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

              <div className="flex justify-center gap-2 mt-1">
                {p.types.map((t) => (
                  <span
                    key={t.type.name}
                    className={`
                    text3 capitalize px-2 py-0.5 rounded
                    ${TYPE_COLORS[t.type.name] ?? 'bg-gray-300 text-black'}
                  `}
                  >
                    {t.type.name}
                  </span>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Infinite scroll trigger */}
      <div ref={loaderRef} className="h-12" />

      {loading && <Loader />}
    </div>
  );
};

export default PokemonList;
