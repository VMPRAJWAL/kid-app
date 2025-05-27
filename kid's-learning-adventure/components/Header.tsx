import React from 'react';
import StarIcon from './StarIcon';
import { GameMode } from '../types';

interface HeaderProps {
  stars: number;
  level: number;
  gameMode: GameMode | null;
  onQuit: () => void;
}

const Header: React.FC<HeaderProps> = ({ stars, level, gameMode, onQuit }) => {
  const gameModeText = gameMode === GameMode.MATH ? "Math Puzzles" : gameMode === GameMode.LANGUAGE ? "Word Games" : "PUZZLE";
  return (
    <header className="w-full p-4 flex justify-between items-center relative z-10">
      <button 
        onClick={onQuit}
        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg shadow-md text-xl md:text-2xl transition-colors"
      >
        {gameModeText}
      </button>
      <div className="flex items-center space-x-4">
         {gameMode && <span className="text-lg md:text-xl font-semibold text-purple-700 bg-white/70 px-3 py-1 rounded-md">Level: {level}</span>}
        <div className="bg-yellow-400 hover:bg-yellow-500 p-2 rounded-full shadow-md flex items-center space-x-2 transition-colors">
          <StarIcon className="text-yellow-700 w-6 h-6 md:w-8 md:h-8" />
          <span className="text-yellow-800 font-bold text-xl md:text-2xl">{stars}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;