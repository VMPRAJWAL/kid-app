
import { useState, useEffect, useCallback } from 'react';
import { GameMode, GameContent, MathQuestion, LanguagePuzzle, Score } from '../types';
import { generateGameContent } from '../services/geminiService';
import { INITIAL_STARS, QUESTIONS_TO_LEVEL_UP, MAX_LEVEL } from '../constants';

export interface GameLogicReturn {
  currentContent: GameContent | null;
  score: Score;
  level: number;
  isLoading: boolean;
  error: string | null;
  feedbackMessage: { title: string; message: string } | null;
  selectedTerm: string | null;
  matchedPairs: Record<string, string>; // For language game: term -> match
  isLevelComplete: boolean;
  isGameOver: boolean;
  initializeGame: (mode: GameMode) => void;
  submitMathAnswer: (answer: string) => void;
  selectLanguageTerm: (term: string) => void;
  selectLanguageMatch: (matchValue: string) => void;
  proceedToNext: () => void;
  resetFeedback: () => void;
}

const useGameLogic = (): GameLogicReturn => {
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [currentContent, setCurrentContent] = useState<GameContent | null>(null);
  const [score, setScore] = useState<Score>({ stars: INITIAL_STARS });
  const [level, setLevel] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ title: string; message: string } | null>(null);
  const [correctAnswersInLevel, setCorrectAnswersInLevel] = useState<number>(0);
  
  // Language game specific state
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Record<string, string>>({}); // Stores term -> match for correctly matched pairs

  const [isLevelComplete, setIsLevelComplete] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);


  const fetchNewContent = useCallback(async (mode: GameMode, currentLevel: number) => {
    if (!mode) return;
    setIsLoading(true);
    setError(null);
    setFeedbackMessage(null);
    setSelectedTerm(null);
    setMatchedPairs({});
    
    try {
      const content = await generateGameContent(mode, currentLevel);
      if (content) {
        setCurrentContent(content);
      } else {
        setError("Oops! We couldn't prepare a new puzzle. Please try again.");
      }
    } catch (err) {
      console.error("Error in fetchNewContent:", err);
      setError("A wild error appeared! Try refreshing the page.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const initializeGame = useCallback((mode: GameMode) => {
    setGameMode(mode);
    setLevel(1);
    setScore({ stars: INITIAL_STARS });
    setCorrectAnswersInLevel(0);
    setIsLevelComplete(false);
    setIsGameOver(false);
    fetchNewContent(mode, 1);
  }, [fetchNewContent]);

  const handleCorrectAnswer = useCallback(() => {
    setScore(prevScore => ({ stars: prevScore.stars + 10 }));
    setCorrectAnswersInLevel(prev => prev + 1);

    if (correctAnswersInLevel + 1 >= QUESTIONS_TO_LEVEL_UP) {
      if (level + 1 > MAX_LEVEL) {
        setFeedbackMessage({ title: "Congratulations!", message: `You've mastered all levels with ${score.stars + 10} stars! Amazing job!` });
        setIsGameOver(true);
      } else {
        setFeedbackMessage({ title: "Level Up!", message: `Awesome! You've reached Level ${level + 1}!` });
        setIsLevelComplete(true);
      }
    } else {
       setFeedbackMessage({ title: "Correct!", message: "Great job! Keep going!" });
    }
  }, [correctAnswersInLevel, level, score.stars]);

  const proceedToNext = useCallback(() => {
    setFeedbackMessage(null);
    if (isGameOver) {
        // Game over, could redirect to menu or show final score screen
        // For now, just clear content. User can restart via header.
        setCurrentContent(null); 
        return;
    }
    if (isLevelComplete) {
      setLevel(prevLevel => prevLevel + 1);
      setCorrectAnswersInLevel(0);
      setIsLevelComplete(false);
      if(gameMode) fetchNewContent(gameMode, level + 1);
    } else {
      if(gameMode) fetchNewContent(gameMode, level);
    }
  }, [isGameOver, isLevelComplete, gameMode, level, fetchNewContent]);


  const submitMathAnswer = (answer: string) => {
    if (!currentContent || currentContent.gameMode !== GameMode.MATH) return;
    const mathQuestion = currentContent as MathQuestion;
    if (answer === mathQuestion.correctAnswer) {
      handleCorrectAnswer();
    } else {
      setFeedbackMessage({ title: "Not Quite!", message: `Good try! The correct answer was ${mathQuestion.correctAnswer}.` });
      // Optionally deduct points or add a strike system here
    }
  };

  const selectLanguageTerm = (term: string) => {
    if (matchedPairs[term]) return; // Already matched
    setSelectedTerm(term);
  };

  const selectLanguageMatch = (matchValue: string) => {
    if (!selectedTerm || !currentContent || currentContent.gameMode !== GameMode.LANGUAGE) return;
    
    const puzzle = currentContent as LanguagePuzzle;
    const correctPair = puzzle.pairs.find(p => p.term === selectedTerm);

    if (correctPair && correctPair.match === matchValue) {
      setMatchedPairs(prev => ({ ...prev, [selectedTerm]: matchValue }));
      setSelectedTerm(null); // Reset selected term

      // Check if all pairs are matched
      if (Object.keys(matchedPairs).length + 1 === puzzle.pairs.length) {
        handleCorrectAnswer(); // All pairs matched, consider it a correct puzzle completion
      } else {
        // Partial correct, maybe a small feedback
        setFeedbackMessage({ title: "Good Match!", message: "You found a pair!" });
        // Auto-clear this minor feedback after a short delay or on next action
        setTimeout(() => resetFeedback(), 1500); 
      }
    } else {
      setFeedbackMessage({ title: "Oops!", message: "That's not the right match. Try again!" });
      setSelectedTerm(null); // Reset selection on wrong match
       setTimeout(() => resetFeedback(), 2000);
    }
  };
  
  const resetFeedback = () => {
    // Only reset feedback if it's not a level up or game over message
    if (feedbackMessage && !isLevelComplete && !isGameOver) {
         if(feedbackMessage.title === "Good Match!" || feedbackMessage.title === "Oops!"){
            setFeedbackMessage(null);
         }
    }
  };

  return {
    currentContent,
    score,
    level,
    isLoading,
    error,
    feedbackMessage,
    selectedTerm,
    matchedPairs,
    isLevelComplete,
    isGameOver,
    initializeGame,
    submitMathAnswer,
    selectLanguageTerm,
    selectLanguageMatch,
    proceedToNext,
    resetFeedback,
  };
};

export default useGameLogic;
