import { useTheme } from './ThemeProvider';

const App = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-surface text-base flex flex-col items-center justify-center gap-6">
      <h1 className="h1">Pokémon Explorer</h1>
      <div className="flex gap-4">
        <button className="btn btn-primary">Primary</button>
        <button className="btn btn-secondary">Secondary</button>
        <button className="btn btn-neutral">Neutral</button>
      </div>

      <button onClick={toggleTheme} className="btn btn-neutral">
        Toggle theme (currently {theme})
      </button>

      <p className="text1">
        Explore Pokémon, mark your favorites, and view details.
      </p>

      <p className="text2">Data provided by the PokéAPI.</p>

      <p className="text3">© Pokémon Explorer</p>
    </div>
  );
};

export default App;
