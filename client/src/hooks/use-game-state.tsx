import { useState, useCallback } from 'react';

export interface GameState {
  score: number;
  lives: number;
  timeLeft: number;
  currentQuestion: number;
  totalQuestions: number;
  isGameOver: boolean;
  isPaused: boolean;
}

export interface GameActions {
  increaseScore: (points: number) => void;
  decreaseLives: () => void;
  setTimeLeft: (time: number) => void;
  nextQuestion: () => void;
  resetGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: () => void;
}

const initialGameState: GameState = {
  score: 0,
  lives: 3,
  timeLeft: 90,
  currentQuestion: 1,
  totalQuestions: 5,
  isGameOver: false,
  isPaused: false,
};

export function useGameState(): [GameState, GameActions] {
  const [gameState, setGameState] = useState<GameState>(initialGameState);

  const increaseScore = useCallback((points: number) => {
    setGameState(prev => ({
      ...prev,
      score: prev.score + points,
    }));
  }, []);

  const decreaseLives = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      lives: Math.max(0, prev.lives - 1),
    }));
  }, []);

  const setTimeLeft = useCallback((time: number) => {
    setGameState(prev => ({
      ...prev,
      timeLeft: Math.max(0, time),
    }));
  }, []);

  const nextQuestion = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      currentQuestion: prev.currentQuestion + 1,
      timeLeft: 90, // Reset timer for new question
    }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState(initialGameState);
  }, []);

  const pauseGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isPaused: true,
    }));
  }, []);

  const resumeGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isPaused: false,
    }));
  }, []);

  const endGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isGameOver: true,
    }));
  }, []);

  const actions: GameActions = {
    increaseScore,
    decreaseLives,
    setTimeLeft,
    nextQuestion,
    resetGame,
    pauseGame,
    resumeGame,
    endGame,
  };

  return [gameState, actions];
}
