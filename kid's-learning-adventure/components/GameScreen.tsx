
import React from 'react';
import { GameMode, GameContent, MathQuestion, LanguagePuzzle } from '../types';
import { BUTTON_COLORS, TERM_BUTTON_COLOR, MATCH_BUTTON_COLOR, LEVEL_DESCRIPTIONS } from '../constants';
import LoadingSpinner from './LoadingSpinner';
import Modal from './Modal';
import { GameLogicReturn } from '../hooks/useGameLogic';

interface GameScreenProps {
  gameMode: GameMode;
  gameLogic: GameLogicReturn;
}

const GameScreen: React.FC<GameScreenProps> = ({ gameMode, gameLogic }) => {
  const {
    currentContent,
    isLoading,
    error,
    feedbackMessage,
    selectedTerm,
    matchedPairs,
    level,
    submitMathAnswer,
    selectLanguageTerm,
    selectLanguageMatch,
    proceedToNext,
    resetFeedback,
    isLevelComplete,
    isGameOver,
  } = gameLogic;

  if (isLoading) return <div className="flex-grow flex items-center justify-center"><LoadingSpinner /></div>;
  if (error) return <div className="flex-grow flex items-center justify-center p-4 text-red-500 text-xl bg-red-100 rounded-lg shadow-md">{error}</div>;
  if (!currentContent && !isGameOver) return <div className="flex-grow flex items-center justify-center p-4 text-gray-500 text-xl">Starting your adventure...</div>;
  if (isGameOver && feedbackMessage) { // Show game over message if game is over
     return (
      <Modal
        isOpen={true}
        title={feedbackMessage.title}
        message={feedbackMessage.message}
        onClose={proceedToNext} // This might lead to main menu or restart
        buttonText="Back to Menu"
      />
    );
  }
  
  const levelDescription = LEVEL_DESCRIPTIONS[gameMode]?.[level] || `Level ${level}`;

  const renderMathQuestion = (content: MathQuestion) => (
    <div className="text-center">
      <p className="text-3xl md:text-5xl font-bold text-gray-800 mb-8 md:mb-12">{content.questionText}</p>
      <div className="grid grid-cols-2 gap-4 md:gap-6 max-w-md mx-auto">
        {content.options.map((option, index) => (
          <button
            key={index}
            onClick={() => submitMathAnswer(option)}
            disabled={!!feedbackMessage}
            className={`p-4 md:p-6 text-2xl md:text-3xl font-bold text-white rounded-xl shadow-lg transform transition-all hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-50 disabled:opacity-70 disabled:transform-none ${
              BUTTON_COLORS[index % BUTTON_COLORS.length]
            } ${feedbackMessage ? 'cursor-not-allowed' : ''}`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );

  const renderLanguagePuzzle = (content: LanguagePuzzle) => {
    const allPairsMatched = Object.keys(matchedPairs).length === content.pairs.length;
    return (
    <div className="text-center">
      <p className="text-2xl md:text-3xl font-semibold text-gray-700 mb-6 md:mb-8">{content.promptText}</p>
      <div className="flex flex-col md:flex-row justify-around items-start gap-4 md:gap-8">
        {/* Terms Column */}
        <div className="w-full md:w-2/5 space-y-3">
          {content.terms.map((term, index) => {
            const isMatched = !!matchedPairs[term];
            const isSelected = selectedTerm === term;
            return (
              <button
                key={`term-${index}`}
                onClick={() => !isMatched && selectLanguageTerm(term)}
                disabled={isMatched || !!(feedbackMessage && !feedbackMessage.title.includes("Good Match"))}
                className={`w-full p-3 md:p-4 text-xl md:text-2xl font-semibold text-white rounded-lg shadow-md transition-all ${TERM_BUTTON_COLOR}
                  ${isSelected ? 'ring-4 ring-yellow-300 scale-105' : ''}
                  ${isMatched ? 'opacity-50 bg-gray-400 hover:bg-gray-400 cursor-default' : 'hover:scale-105'}
                  ${(feedbackMessage && !feedbackMessage.title.includes("Good Match")) ? 'cursor-not-allowed' : ''}`}
              >
                {term}
                {isMatched && <span className="ml-2">짝꿍!</span>}
              </button>
            );
          })}
        </div>
        {/* Matches Column */}
        <div className="w-full md:w-2/5 space-y-3">
          {content.matches.map((match, index) => {
            const isMatchedElsewhere = Object.values(matchedPairs).includes(match);
             return (
              <button
                key={`match-${index}`}
                onClick={() => !isMatchedElsewhere && selectedTerm && selectLanguageMatch(match)}
                disabled={!selectedTerm || isMatchedElsewhere || !!(feedbackMessage && !feedbackMessage.title.includes("Good Match")) || allPairsMatched}
                className={`w-full p-3 md:p-4 text-xl md:text-2xl font-semibold text-white rounded-lg shadow-md transition-all ${MATCH_BUTTON_COLOR}
                  ${!selectedTerm || isMatchedElsewhere || allPairsMatched ? 'opacity-60 cursor-not-allowed' : 'hover:scale-105'}
                  ${isMatchedElsewhere ? 'bg-gray-400 hover:bg-gray-400' : ''}
                  ${(feedbackMessage && !feedbackMessage.title.includes("Good Match")) ? 'cursor-not-allowed' : ''}`}
              >
                {match}
                 {isMatchedElsewhere && <span className="ml-2">✓</span>}
              </button>
            );
            })}
        </div>
      </div>
    </div>
  )};

  return (
    <div className="flex-grow flex flex-col items-center justify-center p-4 md:p-8">
      <div className="bg-white/80 backdrop-blur-sm p-6 md:p-10 rounded-2xl shadow-xl w-full max-w-2xl md:max-w-3xl border-4 border-orange-300">
        <h2 className="text-xl md:text-2xl font-bold text-purple-700 mb-4 text-center">{levelDescription}</h2>
        {currentContent && currentContent.gameMode === GameMode.MATH && renderMathQuestion(currentContent as MathQuestion)}
        {currentContent && currentContent.gameMode === GameMode.LANGUAGE && renderLanguagePuzzle(currentContent as LanguagePuzzle)}
      </div>
      {feedbackMessage && (
        <Modal
          isOpen={true}
          title={feedbackMessage.title}
          message={feedbackMessage.message}
          onClose={ (isLevelComplete || isGameOver) ? proceedToNext : () => { proceedToNext(); resetFeedback(); }}
          buttonText={isLevelComplete ? "Next Level!" : isGameOver ? "View Score" : "Continue"}
        />
      )}
    </div>
  );
};

export default GameScreen;
