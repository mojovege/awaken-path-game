import { useParams, useLocation } from "wouter";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Heart, Lightbulb, Pause } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

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

const DEMO_USER_ID = "demo-user-1";

export default function GamePage() {
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

  // Get user data to determine religion
  const { data: user } = useQuery<{id: string; selectedReligion?: string}>({
    queryKey: ['/api/user', DEMO_USER_ID],
  });

  // Get game question
  const { data: question, refetch: refetchQuestion } = useQuery<GameQuestion>({
    queryKey: ['/api/game/question', gameType, user?.selectedReligion],
    enabled: !!user?.selectedReligion,
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
        userId: DEMO_USER_ID,
        ...data,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user', DEMO_USER_ID, 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user', DEMO_USER_ID, 'game-progress'] });
    },
  });

  // Timer effect
  useEffect(() => {
    if (gameState.timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => {
        setGameState(prev => ({ ...prev, timeLeft: prev.timeLeft - 1 }));
      }, 1000);
      return () => clearTimeout(timer);
    } else if (gameState.timeLeft === 0) {
      handleTimeUp();
    }
  }, [gameState.timeLeft, showResult]);

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
    refetchQuestion();
  };

  const endGame = () => {
    setShowResult(true);
    saveProgressMutation.mutate({
      gameType: gameType!,
      score: gameState.score,
      level: gameState.currentQuestion,
    });
  };

  const exitGame = () => {
    setLocation('/');
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

  if (!question) {
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
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
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
                <div>
                  <h3 className="text-elderly-xl font-semibold text-white mb-1">
                    {getGameTitle(gameType!)}
                  </h3>
                  <p className="text-white text-opacity-90 text-elderly-sm">
                    第{gameState.currentQuestion}關・{question.question.slice(0, 20)}...
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white text-opacity-90 text-elderly-sm mb-1">得分</div>
                <div className="text-elderly-2xl font-bold text-white" data-testid="text-current-score">
                  {gameState.score}
                </div>
              </div>
            </div>
          </div>
          
          {/* Game Content */}
          <div className="p-8">
            <div className="text-center mb-8">
              <h4 className="text-elderly-xl font-semibold text-gray-800 mb-6">
                {question.question}
              </h4>
            </div>
            
            {/* Answer Options */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {question.options.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={selectedAnswer !== null}
                  variant="outline"
                  className={`p-6 text-left h-auto min-h-[80px] text-elderly-base border-2 transition-all duration-300 ${
                    selectedAnswer === index
                      ? selectedAnswer === question.correctAnswer
                        ? 'border-green-500 bg-green-50'
                        : 'border-red-500 bg-red-50'
                      : selectedAnswer === question.correctAnswer && index === question.correctAnswer
                      ? 'border-green-500 bg-green-50'
                      : 'border-warm-gray-100 hover:border-warm-gold hover:bg-warm-gold hover:bg-opacity-10'
                  }`}
                  data-testid={`button-answer-${index}`}
                >
                  <span className="block text-wrap">{option}</span>
                </Button>
              ))}
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
                  variant="outline"
                  size="sm"
                  className="text-elderly-base"
                  data-testid="button-pause-game"
                >
                  <Pause className="w-4 h-4 mr-2" />
                  暫停
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-elderly-base"
                  data-testid="button-hint"
                >
                  <Lightbulb className="w-4 h-4 mr-2" />
                  提示
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
