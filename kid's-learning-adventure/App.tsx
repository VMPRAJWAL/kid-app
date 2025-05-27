
import React, { useState, useEffect } from 'react';
import { GameMode, GameView } from './types';
import useGameLogic from './hooks/useGameLogic';
import Header from './components/Header';
import MainMenuScreen from './components/MainMenuScreen';
import GameScreen from './components/GameScreen';
import Background from './components/Background';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<GameView>(GameView.MENU);
  const [activeGameMode, setActiveGameMode] = useState<GameMode | null>(null);
  
  const gameLogic = useGameLogic();
  const { score, level, initializeGame, isGameOver } = gameLogic;

  const handleSelectMode = (mode: GameMode) => {
    setActiveGameMode(mode);
    initializeGame(mode); // Initialize game with selected mode
    setCurrentView(GameView.GAME);
  };

  const handleQuitGame = () => {
    setCurrentView(GameView.MENU);
    setActiveGameMode(null);
    // Game logic reset is handled by initializeGame when a new mode is selected
  };
  
  useEffect(() => {
    if (isGameOver && currentView === GameView.GAME) {
      // If game is over, header's quit button or modal might navigate away
      // For now, we allow user to click quit or modal button
    }
  }, [isGameOver, currentView]);


  return (
    <div className="relative flex flex-col min-h-screen bg-sky-100">
      <Background />
      <Header 
        stars={score.stars} 
        level={level} 
        gameMode={activeGameMode} 
        onQuit={handleQuitGame} 
      />
      <main className="flex-grow flex flex-col">
        {currentView === GameView.MENU && <MainMenuScreen onSelectMode={handleSelectMode} />}
        {currentView === GameView.GAME && activeGameMode && (
          <GameScreen gameMode={activeGameMode} gameLogic={gameLogic} />
        )}
      </main>
      <footer className="text-center p-4 text-sm text-purple-700/70 relative z-10">
        &copy; {new Date().getFullYear()} Kid's Learning Adventure. Happy Learning!
      </footer>
    </div>
  );
};

export default App;
