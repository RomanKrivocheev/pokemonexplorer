import { useState } from 'react';
import Loader from './Loader';

type Props = {
  src: string;
  alt: string;
};

const PokemonCardImage = ({ src, alt }: Props) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="w-24 h-24 mx-auto flex items-center justify-center">
      {!loaded && (
        <div className="scale-75">
          <Loader />
        </div>
      )}

      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        className={`w-24 h-24 object-contain ${loaded ? 'block' : 'hidden'}`}
      />
    </div>
  );
};

export default PokemonCardImage;
