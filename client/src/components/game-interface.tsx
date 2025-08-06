import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Clock, Heart, Lightbulb, Pause, Play } from "lucide-react";

interface GameQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface GameInterfaceProps {
  gameType: string;
  question: GameQuestion;
  onAnswerSelect: (index: number) => void;
  onExit: () => void;
  onPause: () => void;
  onHint: () => void;
  gameState: {
    score: number;
    lives: number;
    timeLeft: number;
    currentQuestion: number;
    totalQuestions: number;
  };
  selectedAnswer: number | null;
  isPaused: boolean;
}

export default function GameInterface({
  gameType,
  question,
  onAnswerSelect,
  onExit,
  onPause,
  onHint,
  gameState,
  selectedAnswer,
  isPaused,
}: GameInterfaceProps) {
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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-4" data-testid="game-interface">
      <Card className="shadow-lg overflow-hidden">
        {/* Game Header */}
        <div className="bg-gradient-to-r from-warm-gold to-yellow-500 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button
                onClick={onExit}
                variant="ghost"
                size="sm"
                className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center mr-4 hover:bg-opacity-30"
                data-testid="button-exit"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </Button>
              <div>
                <h3 className="text-elderly-xl font-semibold text-white mb-1">
                  {getGameTitle(gameType)}
                </h3>
                <p className="text-white text-opacity-90 text-elderly-sm">
                  第{gameState.currentQuestion}關・找出正確答案
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white text-opacity-90 text-elderly-sm mb-1">得分</div>
              <div className="text-elderly-2xl font-bold text-white" data-testid="text-score">
                {gameState.score}
              </div>
            </div>
          </div>
        </div>
        
        {/* Game Content */}
        <CardContent className="p-8">
          {isPaused && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-warm-gold bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Pause className="w-8 h-8 text-warm-gold" />
              </div>
              <h4 className="text-elderly-xl font-semibold text-gray-800 mb-4">遊戲已暫停</h4>
              <Button onClick={onPause} className="btn-primary">
                <Play className="w-4 h-4 mr-2" />
                繼續遊戲
              </Button>
            </div>
          )}
          
          {!isPaused && (
            <>
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
                    onClick={() => onAnswerSelect(index)}
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
                    data-testid={`button-option-${index}`}
                  >
                    <span className="block text-wrap">{option}</span>
                  </Button>
                ))}
              </div>
            </>
          )}
          
          {/* Game Controls */}
          <div className="flex items-center justify-between bg-warm-gray-50 rounded-xl p-4">
            <div className="flex items-center space-x-6">
              <div className="flex items-center text-warm-gray-600" data-testid="game-time">
                <Clock className="w-5 h-5 mr-2" />
                <span className="text-elderly-base font-medium">
                  {formatTime(gameState.timeLeft)}
                </span>
              </div>
              <div className="flex items-center text-warm-gray-600" data-testid="game-lives">
                <Heart className="w-5 h-5 mr-2" />
                <span className="text-elderly-base font-medium">
                  {gameState.lives}/3
                </span>
              </div>
              <div className="text-warm-gray-600" data-testid="game-question-count">
                <span className="text-elderly-base font-medium">
                  {gameState.currentQuestion}/{gameState.totalQuestions}
                </span>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button
                onClick={onPause}
                variant="outline"
                size="sm"
                className="text-elderly-base"
                data-testid="button-pause"
              >
                <Pause className="w-4 h-4 mr-2" />
                {isPaused ? '繼續' : '暫停'}
              </Button>
              <Button
                onClick={onHint}
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
        </CardContent>
      </Card>
    </div>
  );
}
