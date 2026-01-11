import { Routes, Route } from 'react-router-dom';
import Header from './Header';
import { FavoritesProvider } from './FavoritesProvider';
import PokemonList from '../pages/PokemonList';
import PokemonDetail from '../pages/PokemonDetail';
import Favorites from '../pages/Favorites';

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
          </Routes>
        </main>
      </div>
    </FavoritesProvider>
  );
};

export default App;
