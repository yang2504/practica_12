import { createContext, useContext, useState } from 'react';

const GameContext = createContext();

export function GameProvider({ children }) {
  const [collisionCount, setCollisionCount] = useState(0);

  const incrementCollision = () => {
    setCollisionCount((prev) => prev + 1);
  };

  return (
    <GameContext.Provider value={{ collisionCount, incrementCollision }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame debe usarse dentro de GameProvider');
  return context;
}