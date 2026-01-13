import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../app/ThemeProvider';
import Loader from '../components/Loader';

import {
  getPokemonPage,
  getPokemonDetails,
  getPokemonByType,
  getPokemonByHabitat,
  type PokemonDetails,
} from '../services/pokemonApi';
import PokemonCardImage from '../components/PokemonCardImage';

const LIMIT = 20;

type FilterType = 'all' | 'type' | 'habitat';

const FILTER_OPTIONS = {
  type: [
    'normal',
    'fire',
    'water',
    'electric',
    'grass',
    'ice',
    'fighting',
    'poison',
    'ground',
    'flying',
    'psychic',
    'bug',
    'rock',
    'ghost',
    'dragon',
    'dark',
    'steel',
    'fairy',
  ],
  habitat: [
    'grassland',
    'forest',
    'waters-edge',
    'cave',
    'mountain',
    'rough-terrain',
    'urban',
    'rare',
  ],
};

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
  const [searchValue, setSearchValue] = useState('');

  const [filterType, setFilterType] = useState<FilterType>('all');

  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const [draftFilterType, setDraftFilterType] = useState<FilterType>('all');
  const [draftFilterValue, setDraftFilterValue] = useState('');

  const [showFilters, setShowFilters] = useState(false);

  const filterBoxRef = useRef<HTMLDivElement | null>(null);
  const filterButtonRef = useRef<HTMLButtonElement | null>(null);

  const loaderRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const { theme } = useTheme();

  const hasActiveFilter = filterType !== 'all';

  useEffect(() => {
    if (filterType !== 'all') return;

    const load = async () => {
      setLoading(true);
      try {
        const page = await getPokemonPage(offset, LIMIT);
        const details = await Promise.all(
          page.results.map((p) => getPokemonDetails(p.name))
        );
        setPokemon((prev) => (offset === 0 ? details : [...prev, ...details]));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [offset, filterType]);

  useEffect(() => {
    if (!showFilters) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        filterBoxRef.current?.contains(target) ||
        filterButtonRef.current?.contains(target)
      ) {
        return;
      }

      setShowFilters(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showFilters]);

  useEffect(() => {
    if (!loaderRef.current || filterType !== 'all') return;

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
  }, [loading, filterType]);

  const applyFilter = async () => {
    setShowFilters(false);
    setLoading(true);

    setFilterType(draftFilterType);

    setPokemon([]);
    setOffset(0);

    try {
      if (draftFilterType === 'all') {
        return;
      }

      let list: { name: string }[] = [];

      if (draftFilterType === 'type')
        list = await getPokemonByType(draftFilterValue);

      if (draftFilterType === 'habitat')
        list = await getPokemonByHabitat(draftFilterValue);

      const results = await Promise.allSettled(
        list.map((p) => getPokemonDetails(p.name))
      );

      const successful = results
        .filter(
          (r): r is PromiseFulfilledResult<PokemonDetails> =>
            r.status === 'fulfilled'
        )
        .map((r) => r.value);

      setPokemon(successful);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const value = searchValue.trim().toLowerCase();
    if (!value) return;

    navigate(`/pokemon/${value}`);
    setSearchValue('');
  };

  return (
    <div className="p-4">
      <div className="mb-4 relative w-full pb-4">
        <form
          onSubmit={handleSearch}
          className="flex items-center gap-2 w-full relative"
        >
          <input
            type="text"
            placeholder="Name or number"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="input h-10 text-lg flex-1 min-w-0 border p-2 rounded-full border-gray-300"
          />

          <button
            type="submit"
            className="btn btn-primary h-10 shrink-0"
            disabled={!searchValue.trim()}
          >
            Search
          </button>

          <button
            type="button"
            ref={filterButtonRef}
            onClick={() => setShowFilters((v) => !v)}
            className="btn btn-neutral h-10 shrink-0 relative"
          >
            Filters
            {hasActiveFilter && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
            )}
          </button>

          {showFilters && (
            <div
              ref={filterBoxRef}
              className="absolute right-0 top-12 w-64 rounded-lg p-4 bg-surface shadow-lg z-20"
            >
              {(['all', 'type', 'habitat'] as FilterType[]).map((f) => (
                <label key={f} className="flex flex-col gap-2 mb-3 text-sm">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      checked={draftFilterType === f}
                      onChange={() => {
                        setDraftFilterType(f);
                        setDraftFilterValue('');
                      }}
                    />
                    <span className="capitalize">
                      {f === 'all' ? 'All Pokémon' : f}
                    </span>
                  </div>

                  {draftFilterType === f && f !== 'all' && (
                    <select
                      value={draftFilterValue}
                      onChange={(e) => setDraftFilterValue(e.target.value)}
                      className="mt-1 rounded px-2 py-1 border"
                    >
                      <option value="">Select {f}</option>
                      {FILTER_OPTIONS[f].map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  )}
                </label>
              ))}

              <button
                disabled={draftFilterType !== 'all' && !draftFilterValue}
                onClick={applyFilter}
                className="btn btn-primary w-full mt-2"
              >
                Apply filter
              </button>
            </div>
          )}
        </form>
      </div>

      <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {pokemon.map((p) => (
          <li
            key={p.id}
            onClick={() => navigate(`/pokemon/${p.id}`)}
            title="Click to see more details"
            className={[
              'cursor-pointer rounded-lg p-3 transition-all hover:-translate-y-1',
              theme === 'dark'
                ? 'shadow-md shadow-white/20 hover:shadow-lg hover:shadow-white/30'
                : 'shadow-md shadow-black/20 hover:shadow-lg hover:shadow-black/30',
            ].join(' ')}
          >
            <PokemonCardImage
              src={p.sprites.other?.['official-artwork']?.front_default ?? ''}
              alt={p.name}
            />
            {/* <img
              src={p.sprites.other?.['official-artwork']?.front_default ?? ''}
              alt={p.name}
              className="w-24 h-24 mx-auto"
            /> */}

            <div className="mt-2 text-center">
              <p className="text3 opacity-70">#{p.id}</p>
              <p className="text1 font-semibold capitalize">{p.name}</p>

              <div className="flex justify-center gap-2 mt-1">
                {p.types.map((t) => (
                  <span
                    key={t.type.name}
                    className={`text3 px-2 py-0.5 rounded capitalize ${
                      TYPE_COLORS[t.type.name]
                    }`}
                  >
                    {t.type.name}
                  </span>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ul>

      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll to top"
          title="Scroll to top"
          className={[
            'fixed bottom-6 right-6 z-50 cursor-pointer',
            'w-12 h-12 rounded-full',
            'flex items-center justify-center',
            'transition-all duration-300',
            'shadow-lg hover:scale-110',
            'bg-primary text-white',
          ].join(' ')}
        >
          ↑
        </button>
      )}

      {filterType === 'all' && <div ref={loaderRef} className="h-12" />}
      {loading && <Loader />}
    </div>
  );
};

export default PokemonList;
