import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Heart, Lightbulb, Pause, Star, BookOpen } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import MemoryGame from "@/components/games/memory-game";
import { getDifficultyForLevel } from "@/lib/game-logic";

interface GameState {
  score: number;
  lives: number;
  timeLeft: number;
  currentQuestion: number;
  totalQuestions: number;
}

export default function GamePage() {
  const { gameType } = useParams<{ gameType: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Stable user ID using useMemo to prevent re-renders
  const currentUserId = useMemo(() => {
    const userId = localStorage.getItem('userId');
    return userId || "demo-user-1";
  }, []);

  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    lives: 3,
    timeLeft: 90,
    currentQuestion: 1,
    totalQuestions: 5,
  });

  const [currentLevel] = useState(1);

  // Get user data
  const { data: user } = useQuery<{id: string; selectedReligion?: string}>({
    queryKey: ['/api/user', currentUserId],
  });

  const difficulty = getDifficultyForLevel(currentLevel);

  const handleCustomGameScore = (points: number) => {
    setGameState(prev => ({ ...prev, score: prev.score + points }));
  };

  const handleCustomGameComplete = () => {
    toast({
      title: "遊戲完成！",
      description: `您獲得了 ${gameState.score} 分`,
    });
    setTimeout(() => {
      setLocation('/');
    }, 2000);
  };

  const handleBackToHome = () => {
    setLocation('/');
  };

  if (!gameType) {
    return (
      <div className="min-h-screen bg-warm-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <p>遊戲類型未指定</p>
          <Button onClick={handleBackToHome}>回到首頁</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button
            onClick={handleBackToHome}
            variant="ghost"
            className="text-warm-gray-600 hover:text-warm-brown"
            data-testid="button-back-home"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            返回首頁
          </Button>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-warm-brown">
              <Heart className="w-5 h-5 text-red-500" />
              <span className="font-semibold">{gameState.lives}</span>
            </div>
            <div className="flex items-center space-x-2 text-warm-brown">
              <Star className="w-5 h-5 text-warm-gold" />
              <span className="font-semibold">{gameState.score}</span>
            </div>
          </div>
        </div>

        {/* Game Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {(gameType === 'memory-scripture' || gameType === 'memory-temple') && (
            <MemoryGame 
              onScore={handleCustomGameScore} 
              onComplete={handleCustomGameComplete}
              religion={user?.selectedReligion || 'buddhism'}
              gameType={gameType}
              level={currentLevel}
            />
          )}
          
          {!['memory-scripture', 'memory-temple'].includes(gameType) && (
            <div className="text-center">
              <h2 className="text-elderly-2xl font-bold text-warm-gold mb-4">
                遊戲開發中
              </h2>
              <p className="text-elderly-base text-warm-gray-600 mb-6">
                這個遊戲類型正在開發中，請選擇其他遊戲
              </p>
              <Button onClick={handleBackToHome}>
                返回首頁
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}