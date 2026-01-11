import { useParams, useNavigate } from 'react-router-dom';

const PokemonNotFound = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4">
      <h1 className="text-6xl font-bold flex items-center gap-3">
        4
        <img
          src="/pokeball.png"
          alt="Pokeball"
          className="w-12 h-12 animate-spin"
        />
        4
      </h1>

      <p className="mt-4 text-lg opacity-80">
        Pokémon <span className="font-semibold">{id}</span> does not exist.
      </p>

      <button onClick={() => navigate('/')} className="btn btn-primary mt-6">
        Back to Pokémon list
      </button>
    </div>
  );
};

export default PokemonNotFound;
