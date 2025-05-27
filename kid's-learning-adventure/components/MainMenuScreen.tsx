
import React from 'react';
import { GameMode } from '../types';
import { APP_NAME } from '../constants';

interface MainMenuScreenProps {
  onSelectMode: (mode: GameMode) => void;
}

const MainMenuScreen: React.FC<MainMenuScreenProps> = ({ onSelectMode }) => {
  return (
    <div className="flex-grow flex flex-col items-center justify-center p-4 text-center">
      <div className="bg-white/80 backdrop-blur-sm p-8 md:p-12 rounded-2xl shadow-xl border-4 border-purple-300">
        <h1 className="text-4xl md:text-5xl font-bold text-purple-700 mb-2">{APP_NAME}</h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 md:mb-12">Choose your adventure!</p>
        <div className="space-y-6 md:space-y-0 md:space-x-8 flex flex-col md:flex-row">
          <button
            onClick={() => onSelectMode(GameMode.MATH)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg text-2xl md:text-3xl transition-transform transform hover:scale-105"
          >
            🧮 Math Puzzles
          </button>
          <button
            onClick={() => onSelectMode(GameMode.LANGUAGE)}
            className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 px-8 rounded-xl shadow-lg text-2xl md:text-3xl transition-transform transform hover:scale-105"
          >
            🗣️ Word Games
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainMenuScreen;
