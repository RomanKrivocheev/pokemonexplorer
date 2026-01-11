import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from './ThemeProvider';
import { useFavorites } from '../app/FavoritesProvider';

const getPageTitle = (pathname: string) => {
  if (pathname === '/') return 'Pokémon List';
  if (pathname === '/favorites') return 'Favorites';
  if (pathname.startsWith('/pokemon/')) return 'Pokémon Details';
  return '';
};

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { favorites } = useFavorites();

  const pageTitle = getPageTitle(location.pathname);

  return (
    <header
      className="
        sticky top-0 z-50
        h-[10vh] min-h-[64px]
        flex items-center justify-between px-6
        border-b
        bg-[rgb(var(--bg))]
      "
    >
      {/* Left: Logo */}
      <div className="flex items-center gap-3 select-none">
        <svg
          onClick={() => navigate('/')}
          width="28"
          height="28"
          viewBox="0 0 100 100"
          className="cursor-pointer transition-transform duration-300 hover:rotate-180"
        >
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="#fff"
            stroke="#000"
            strokeWidth="4"
          />
          <path d="M2 50h96" stroke="#000" strokeWidth="6" />
          <path d="M2 50a48 48 0 0 1 96 0" fill="#ef4444" />
          <circle
            cx="50"
            cy="50"
            r="12"
            fill="#fff"
            stroke="#000"
            strokeWidth="4"
          />
        </svg>

        <span className="h2 hidden sm:block">Pokémon Explorer</span>
      </div>

      <div className="text-center">
        <span className="h1 hidden sm:block font-bold tracking-wide">
          {pageTitle}
        </span>
      </div>

      {/* Right: Nav + Theme */}
      <div className="flex items-center gap-6">
        <nav className="flex gap-6">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `relative group pb-1 transition ${
                isActive ? 'text-primary font-semibold' : 'opacity-70'
              }`
            }
          >
            Pokémon List
            <span
              className="
        absolute left-0 -bottom-0.5 h-[2px] w-full bg-primary
        scale-x-0 origin-left transition-transform duration-300
        group-hover:scale-x-100
      "
            />
          </NavLink>

          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              `relative group pb-1 transition flex items-center gap-1 ${
                isActive ? 'text-primary font-semibold' : 'opacity-70'
              }`
            }
          >
            Favorites
            {favorites.length > 0 && (
              <sup
                className="
          ml-1 px-1.5 py-0.5 rounded-full text-xs
          bg-primary text-on-primary
        "
              >
                {favorites.length}
              </sup>
            )}
            <span
              className="
        absolute left-0 -bottom-0.5 h-[2px] w-full bg-primary
        scale-x-0 origin-left transition-transform duration-300
        group-hover:scale-x-100
      "
            />
          </NavLink>
        </nav>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="btn btn-neutral flex items-center gap-2"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? '🌙' : '☀️'}
        </button>
      </div>
    </header>
  );
};

export default Header;
