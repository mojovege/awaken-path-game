import { useParams, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Heart, Lightbulb, Pause, Star, BookOpen } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import RhythmGame from "@/components/games/rhythm-game";
import MemoryGame from "@/components/games/memory-game";
import LogicGame from "@/components/games/logic-game";
import LightingGame from "@/components/games/lighting-game";
import ChapterSelector from "@/components/chapter-selector";
import { getDifficultyForLevel, getChapterForLevel } from "@/lib/game-logic";

interface GameQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface GameState {
  score: number;
  lives: number;
  timeLeft: number;
  currentQuestion: number;
  totalQuestions: number;
}

export default function GamePage() {
  // Use localStorage to get current user ID with fallback
  const getCurrentUserId = () => {
    const userId = localStorage.getItem('userId');
    console.log(`getCurrentUserId: Found userId=${userId} in localStorage`);
    // Return userId or create a temporary demo user for testing
    return userId || "demo-user-1";
  };
  const { gameType } = useParams<{ gameType: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    lives: 3,
    timeLeft: 90,
    currentQuestion: 1,
    totalQuestions: 5,
  });

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [useCustomGame, setUseCustomGame] = useState(false);
  const [showChapterSelector, setShowChapterSelector] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [userStars, setUserStars] = useState(0);
  
  // Game type to level mapping - each game type represents levels within chapters
  const getGameLevel = (gameType: string) => {
    const gameTypeMap: Record<string, number> = {
      'memory-scripture': 1,    // Level 1 in current chapter
      'memory-temple': 2,       // Level 2 in current chapter  
      'reaction-rhythm': 3,     // Level 3 in current chapter
      'reaction-lighting': 4,   // Level 4 in current chapter
      'logic-scripture': 5,     // Level 5 in current chapter
      'logic-sequence': 6,      // Level 6 in current chapter
    };
    return gameTypeMap[gameType] || 1;
  };
  
  // Convert game type and chapter to actual level (1-15)
  const getActualLevel = (gameType: string, chapterOffset = 0) => {
    const gameLevel = getGameLevel(gameType);
    return gameLevel + (chapterOffset * 6); // 6 games per chapter
  };

  // Get user data to determine religion - reactive to localStorage changes
  const [currentUserId, setCurrentUserId] = useState(() => getCurrentUserId());
  
  // Update user ID when component mounts and localStorage changes
  useEffect(() => {
    const userId = getCurrentUserId();
    setCurrentUserId(userId);
    console.log(`Game Page: Updated userId to ${userId}`);
    
    // Listen for storage changes
    const handleStorageChange = () => {
      const newUserId = getCurrentUserId();
      setCurrentUserId(newUserId);
      console.log(`Game Page: Storage changed, updated userId to ${newUserId}`);
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  console.log(`🎮 Game Page: Using userId="${currentUserId}"`);
  
  const { data: user } = useQuery<{id: string; selectedReligion?: string}>({
    queryKey: ['/api/user', currentUserId],
  });
  
  console.log(`👤 Game Page: User data loaded:`, user);

  // Load user stats to get current stars
  const { data: userStats } = useQuery({
    queryKey: [`/api/user/${currentUserId}/stats`],
    enabled: !!user?.selectedReligion,
  });
  
  useEffect(() => {
    if (userStats && typeof userStats === 'object' && 'totalStars' in userStats) {
      setUserStars((userStats as any).totalStars || 0);
    }
  }, [userStats]);

  // Initialize game level based on game type
  useEffect(() => {
    if (gameType) {
      const level = getActualLevel(gameType);
      setCurrentLevel(level);
    }
  }, [gameType]);

  // Check if this game type should use custom game component
  useEffect(() => {
    const customGameTypes = ['reaction-rhythm', 'reaction-lighting', 'memory-scripture', 'memory-temple', 'logic-scripture', 'logic-sequence'];
    setUseCustomGame(customGameTypes.includes(gameType || ''));
  }, [gameType]);

  // Get game question (only for traditional Q&A games)  
  const { data: question, refetch: refetchQuestion } = useQuery<GameQuestion>({
    queryKey: ['/api/game/question', gameType, user?.selectedReligion],
    enabled: !!user?.selectedReligion && !useCustomGame,
    queryFn: async () => {
      const response = await apiRequest('POST', '/api/game/question', {
        gameType,
        religion: user?.selectedReligion,
        difficulty: Math.min(5, Math.floor(gameState.currentQuestion / 2) + 1),
      });
      return response.json();
    },
  });

  // Save game progress mutation
  const saveProgressMutation = useMutation({
    mutationFn: async (data: { gameType: string; score: number; level: number }) => {
      const response = await apiRequest('POST', '/api/game/progress', {
        userId: currentUserId,
        ...data,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user', currentUserId, 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user', currentUserId, 'game-progress'] });
    },
  });

  // Timer effect
  useEffect(() => {
    if (gameState.timeLeft > 0 && !showResult && !isPaused) {
      const timer = setTimeout(() => {
        setGameState(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
      return () => clearTimeout(timer);
    } else if (gameState.timeLeft === 0) {
      handleTimeUp();
    }
  }, [gameState.timeLeft, showResult, isPaused]);

  const handleTimeUp = () => {
    setGameState(prev => ({ ...prev, lives: prev.lives - 1 }));
    if (gameState.lives <= 1) {
      endGame();
    } else {
      nextQuestion();
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    
    const isCorrect = answerIndex === question?.correctAnswer;
    if (isCorrect) {
      const points = Math.max(10, Math.floor((gameState.timeLeft / 90) * 100));
      setGameState(prev => ({ ...prev, score: prev.score + points }));
      toast({
        title: "答對了！",
        description: `獲得 ${points} 分`,
        variant: "default",
      });
    } else {
      setGameState(prev => ({ ...prev, lives: prev.lives - 1 }));
      toast({
        title: "答錯了",
        description: "繼續加油！",
        variant: "destructive",
      });
    }

    setTimeout(() => {
      if (gameState.lives <= 1 && !isCorrect) {
        endGame();
      } else if (gameState.currentQuestion >= gameState.totalQuestions) {
        endGame();
      } else {
        nextQuestion();
      }
    }, 1500);
  };

  const nextQuestion = () => {
    setGameState(prev => ({
      ...prev,
      currentQuestion: prev.currentQuestion + 1,
      timeLeft: 90,
    }));
    setSelectedAnswer(null);
    setShowHint(false);
    refetchQuestion();
  };

  const endGame = () => {
    setShowResult(true);
    console.log(`🎯 Saving game progress for userId: ${currentUserId}`);
    saveProgressMutation.mutate({
      gameType: gameType!,
      score: gameState.score,
      level: gameState.currentQuestion,
    });
  };

  const exitGame = () => {
    setLocation('/');
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const useHint = () => {
    if (hintsUsed < 2 && !showHint) {
      setShowHint(true);
      setHintsUsed(prev => prev + 1);
      toast({
        title: "提示",
        description: "排除2個錯誤選項",
        variant: "default",
      });
    }
  };

  const isOptionEliminated = (index: number) => {
    if (!showHint) return false;
    // Eliminate 2 wrong answers but keep the correct one
    const wrongOptions = question?.options.map((_, i) => i).filter(i => i !== question.correctAnswer) || [];
    return wrongOptions.includes(index) && wrongOptions.indexOf(index) < 2;
  };

  const handleCustomGameScore = (points: number) => {
    setGameState(prev => ({ ...prev, score: prev.score + points }));
  };

  const handleCustomGameComplete = () => {
    console.log(`🏁 Custom game complete for userId: ${currentUserId}`);
    endGame();
  };

  const getGameTitle = (type: string) => {
    const titles: Record<string, string> = {
      'memory-scripture': '經文記憶配對',
      'memory-temple': '寺廟導覽記憶',
      'reaction-rhythm': '敲木魚節奏',
      'reaction-lighting': '祈福點燈',
      'logic-scripture': '佛偈解讀',
      'logic-sequence': '智慧排序',
    };
    return titles[type] || '認知訓練';
  };

  if (showResult) {
    return (
      <div className="min-h-screen bg-warm-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8 text-center fade-in">
          <div className="w-20 h-20 bg-warm-gold rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"/>
            </svg>
          </div>
          
          <h2 className="text-elderly-2xl font-semibold text-gray-800 mb-4" data-testid="text-game-complete">
            遊戲完成！
          </h2>
          
          <div className="space-y-4 mb-8">
            <div className="bg-warm-gray-50 rounded-xl p-4">
              <p className="text-elderly-sm text-warm-gray-600 mb-2">最終得分</p>
              <p className="text-elderly-3xl font-bold text-warm-gold" data-testid="text-final-score">
                {gameState.score}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-warm-gray-50 rounded-xl p-4">
                <p className="text-elderly-sm text-warm-gray-600 mb-1">完成題數</p>
                <p className="text-elderly-lg font-semibold text-gray-800" data-testid="text-questions-completed">
                  {gameState.currentQuestion - 1}/{gameState.totalQuestions}
                </p>
              </div>
              
              <div className="bg-warm-gray-50 rounded-xl p-4">
                <p className="text-elderly-sm text-warm-gray-600 mb-1">剩餘生命</p>
                <p className="text-elderly-lg font-semibold text-gray-800" data-testid="text-lives-remaining">
                  {Math.max(0, gameState.lives)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <Button
              onClick={exitGame}
              className="w-full btn-primary text-elderly-base"
              data-testid="button-return-home"
            >
              返回首頁
            </Button>
            
            <Button
              onClick={() => {
                setShowResult(false);
                setGameState({
                  score: 0,
                  lives: 3,
                  timeLeft: 90,
                  currentQuestion: 1,
                  totalQuestions: 5,
                });
                setSelectedAnswer(null);
                setShowHint(false);
                setHintsUsed(0);
                setIsPaused(false);
                refetchQuestion();
              }}
              variant="outline"
              className="w-full text-elderly-base"
              data-testid="button-play-again"
            >
              再玩一次
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!useCustomGame && !question) {
    return (
      <div className="min-h-screen bg-warm-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-warm-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-elderly-lg text-warm-gray-600">載入題目中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-gray-50">
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden relative">
          {/* Pause Overlay */}
          {isPaused && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 rounded-2xl">
              <div className="bg-white rounded-xl p-8 text-center">
                <Pause className="w-16 h-16 text-warm-gold mx-auto mb-4" />
                <h3 className="text-elderly-xl font-semibold text-gray-800 mb-4">遊戲暫停</h3>
                <p className="text-elderly-base text-warm-gray-600 mb-6">點擊繼續按鈕恢復遊戲</p>
                <Button 
                  onClick={togglePause}
                  className="btn-primary text-elderly-base px-8"
                >
                  繼續遊戲
                </Button>
              </div>
            </div>
          )}
          {/* Game Header */}
          <div className="bg-gradient-to-r from-warm-gold to-yellow-500 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Button
                  onClick={exitGame}
                  variant="ghost"
                  size="sm"
                  className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-4 hover:bg-opacity-30"
                  data-testid="button-exit-game"
                >
                  <ArrowLeft className="w-5 h-5 text-white" />
                </Button>
                <div 
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={exitGame}
                  data-testid="header-title-clickable"
                >
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"/>
                      </svg>
                    </div>
                    <h3 className="text-elderly-lg font-semibold text-white">
                      覺悟之路
                    </h3>
                  </div>
                  <h4 className="text-elderly-xl font-semibold text-white mb-1">
                    {getGameTitle(gameType!)}
                  </h4>
                  <p className="text-white text-opacity-90 text-elderly-sm">
                    {useCustomGame ? `第 ${currentLevel} 關 - ${getChapterForLevel(currentLevel).name}` : `第${gameState.currentQuestion}關・${question?.question?.slice(0, 20) || ''}...`}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  onClick={() => setShowChapterSelector(true)}
                  variant="ghost"
                  size="sm"
                  className="bg-white bg-opacity-20 rounded-lg px-3 py-2 hover:bg-opacity-30 text-white"
                  data-testid="button-chapter-select"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  選關
                </Button>
                <div className="text-right">
                  <div className="text-white text-opacity-90 text-elderly-sm mb-1">得分</div>
                  <div className="text-elderly-2xl font-bold text-white" data-testid="text-current-score">
                    {gameState.score}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Game Content */}
          <div className="p-8">
            {useCustomGame ? (
              <div>
                {gameType === 'reaction-rhythm' && (
                  <RhythmGame 
                    onScore={handleCustomGameScore} 
                    onComplete={handleCustomGameComplete}
                    religion={user?.selectedReligion || 'buddhism'}
                    level={currentLevel}
                  />
                )}
                {(gameType === 'memory-scripture' || gameType === 'memory-temple') && (
                  <MemoryGame 
                    onScore={handleCustomGameScore} 
                    onComplete={handleCustomGameComplete}
                    religion={user?.selectedReligion || 'buddhism'}
                    gameType={gameType}
                    level={currentLevel}
                  />
                )}
                {(gameType === 'logic-scripture' || gameType === 'logic-sequence') && (
                  <LogicGame 
                    onScore={handleCustomGameScore} 
                    onComplete={handleCustomGameComplete}
                    religion={user?.selectedReligion || 'buddhism'}
                    gameType={gameType}
                    level={currentLevel}
                  />
                )}
                {gameType === 'reaction-lighting' && (
                  <LightingGame 
                    onScore={handleCustomGameScore} 
                    onComplete={handleCustomGameComplete}
                    religion={user?.selectedReligion || 'buddhism'}
                    level={currentLevel}
                  />
                )}
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <h4 className="text-elderly-xl font-semibold text-gray-800 mb-6">
                    {question?.question}
                  </h4>
                </div>
            
                {/* Answer Options */}
                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  {question?.options.map((option, index) => (
                    <Button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={selectedAnswer !== null || isOptionEliminated(index)}
                      variant="outline"
                      className={`p-6 text-left h-auto min-h-[80px] text-elderly-base border-2 transition-all duration-300 ${
                        isOptionEliminated(index)
                          ? 'border-gray-300 bg-gray-100 opacity-50 cursor-not-allowed'
                          : selectedAnswer === index
                          ? selectedAnswer === question.correctAnswer
                            ? 'border-green-500 bg-green-50'
                            : 'border-red-500 bg-red-50'
                          : selectedAnswer === question.correctAnswer && index === question.correctAnswer
                          ? 'border-green-500 bg-green-50'
                          : 'border-warm-gray-100 hover:border-warm-gold hover:bg-warm-gold hover:bg-opacity-10'
                      }`}
                      data-testid={`button-answer-${index}`}
                    >
                      <span className={`block text-wrap ${isOptionEliminated(index) ? 'line-through' : ''}`}>
                        {option}
                      </span>
                    </Button>
                  )) || []}
                </div>
            
                {/* Game Controls */}
                <div className="flex items-center justify-between bg-warm-gray-50 rounded-xl p-4">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center text-warm-gray-600" data-testid="game-timer">
                      <Clock className="w-5 h-5 mr-2" />
                      <span className="text-elderly-base font-medium">
                        {Math.floor(gameState.timeLeft / 60)}:{(gameState.timeLeft % 60).toString().padStart(2, '0')}
                      </span>
                    </div>
                    <div className="flex items-center text-warm-gray-600" data-testid="game-lives">
                      <Heart className="w-5 h-5 mr-2" />
                      <span className="text-elderly-base font-medium">
                        {gameState.lives}/3
                      </span>
                    </div>
                    <div className="text-warm-gray-600" data-testid="game-progress">
                      <span className="text-elderly-base font-medium">
                        {gameState.currentQuestion}/{gameState.totalQuestions}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button
                      onClick={togglePause}
                      variant="outline"
                      size="sm"
                      className="text-elderly-base"
                      data-testid="button-pause-game"
                    >
                      <Pause className="w-4 h-4 mr-2" />
                      {isPaused ? '繼續' : '暫停'}
                    </Button>
                    <Button
                      onClick={useHint}
                      variant="outline"
                      size="sm"
                      className="text-elderly-base"
                      disabled={hintsUsed >= 2 || selectedAnswer !== null}
                      data-testid="button-hint"
                    >
                      <Lightbulb className="w-4 h-4 mr-2" />
                      提示 ({2 - hintsUsed})
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Chapter Selector Modal */}
      {showChapterSelector && (
        <ChapterSelector
          religion={user?.selectedReligion || 'buddhism'}
          userStars={userStars}
          currentLevel={currentLevel}
          onLevelSelect={(level) => {
            setCurrentLevel(level);
            setShowChapterSelector(false);
            // Reset game state for new level
            setGameState({
              score: 0,
              lives: 3,
              timeLeft: 90,
              currentQuestion: 1,
              totalQuestions: 5,
            });
          }}
          onClose={() => setShowChapterSelector(false)}
        />
      )}
    </div>
  );
}
