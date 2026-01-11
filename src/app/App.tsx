import { Routes, Route } from 'react-router-dom';
import Header from './Header';
import { FavoritesProvider } from './FavoritesProvider';
import PokemonList from '../pages/PokemonList';
import PokemonDetail from '../pages/PokemonDetail';
import Favorites from '../pages/Favorites';
import NotFound from '../pages/NotFound';
import PokemonNotFound from '../pages/PokemonNotFound';

const App = () => {
  return (
    <FavoritesProvider>
      <div className="min-h-screen flex flex-col bg-surface text-base">
        <Header />

        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<PokemonList />} />
            <Route path="/pokemon/:id" element={<PokemonDetail />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="*" element={<NotFound />} />
            <Route
              path="/pokemon-not-found/:id"
              element={<PokemonNotFound />}
            />
          </Routes>
        </main>
      </div>
    </FavoritesProvider>
  );
};

export default App;
