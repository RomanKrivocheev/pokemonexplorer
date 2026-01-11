import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-full py-24 text-center">
      <div className="flex items-center text-6xl font-bold mb-6">
        <span>4</span>

        <img
          src="/pokeball.png"
          alt="Pokeball"
          className="w-16 h-16 mx-3 animate-spin-slow"
        />

        <span>4</span>
      </div>

      <p className="text-lg opacity-70 mb-6">Oops! This page does not exist</p>

      <button onClick={() => navigate('/')} className="btn btn-primary">
        Go back to Pokémon list
      </button>
    </div>
  );
};

export default NotFound;
