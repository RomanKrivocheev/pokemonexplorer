import { useEffect, useState } from 'react';

const Loader = () => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length === 3 ? '' : prev + '.'));
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
      <svg
        width="64"
        height="64"
        viewBox="0 0 100 100"
        className="animate-pokeball mb-4"
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

      <p className="text1 font-semibold">Loading{dots}</p>
    </div>
  );
};

export default Loader;
