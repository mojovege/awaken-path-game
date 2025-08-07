import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Lightbulb, Music, Clock, Volume2 } from 'lucide-react';
import GameRulesModal from '../game-rules-modal';
import { getDifficultyForLevel } from '@/lib/game-logic';

interface RhythmGameProps {
  onScore: (points: number) => void;
  onComplete: () => void;
  religion: string;
  level?: number;
}

interface Beat {
  id: number;
  timing: number;
  hit: boolean;
}

const RhythmGame: React.FC<RhythmGameProps> = ({ onScore, onComplete, religion, level = 1 }) => {
  const difficulty = getDifficultyForLevel(level);
  
  const [beats, setBeats] = useState<Beat[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameLength] = useState(difficulty.timeLimit * 1000); // 根據等級調整遊戲時間
  const [combo, setCombo] = useState(0);
  const [showRules, setShowRules] = useState(false);

  // Generate rhythm pattern - 根據遊戲時間動態生成
  useEffect(() => {
    if (!gameStarted) return;
    
    const pattern: Beat[] = [];
    // 根據遊戲時間長度生成節拍，節拍間隔根據等級調整
    const beatInterval = Math.max(1500, 3000 - (level * 100)); // 等級越高節拍越快
    const totalBeats = Math.floor(gameLength / beatInterval);
    
    for (let i = 0; i < totalBeats; i++) {
      const timing = (i + 1) * beatInterval + 1000; // 開始前1秒準備時間
      if (timing < gameLength - 1000) { // 結束前1秒停止生成
        pattern.push({
          id: i,
          timing,
          hit: false
        });
      }
    }
    
    setBeats(pattern);
  }, [gameStarted, gameLength, level]);

  // Game timer - 標準計時器模式
  useEffect(() => {
    if (!gameStarted) return;
    
    const timer = setInterval(() => {
      setCurrentTime(prev => {
        if (prev >= gameLength - 100) {
          return gameLength;
        }
        return prev + 100;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [gameStarted]);

  // Game end check - 分離時間檢查邏輯
  useEffect(() => {
    if (gameStarted && currentTime >= gameLength) {
      setTimeout(() => endGame(), 100);
    }
  }, [gameStarted, currentTime]);

  const startGame = () => {
    setGameStarted(true);
    setCurrentTime(0);
    setScore(0);
    setCombo(0);
  };

  const endGame = () => {
    if (!gameStarted) return; // 防止重複調用
    
    setGameStarted(false);
    const finalScore = Math.floor(score * (combo / 10 + 1));
    onScore(finalScore);
    setTimeout(() => onComplete(), 500);
  };

  const hitBeat = () => {
    const tolerance = difficulty.reactionWindow; // 根據等級調整容錯時間
    const nearbyBeat = beats.find(beat => 
      !beat.hit && 
      Math.abs(beat.timing - currentTime) <= tolerance
    );

    if (nearbyBeat) {
      const timing = Math.abs(nearbyBeat.timing - currentTime);
      const accuracy = 1 - (timing / tolerance);
      const points = Math.floor(50 * accuracy) + (combo * 5);
      
      setScore(prev => prev + points);
      setCombo(prev => prev + 1);
      
      setBeats(prev => prev.map(beat => 
        beat.id === nearbyBeat.id ? { ...beat, hit: true } : beat
      ));

      onScore(points);
    } else {
      setCombo(0);
    }
  };

  const getInstrumentName = () => {
    switch (religion) {
      case 'buddhism': return '木魚';
      case 'taoism': return '鐘聲';
      case 'mazu': return '鑼聲';
      default: return '木魚';
    }
  };

  const getInstrumentEmoji = () => {
    switch (religion) {
      case 'buddhism': return '🥢'; // 木魚棒
      case 'taoism': return '🔔';
      case 'mazu': return '🪘';
      default: return '🥢';
    }
  };

  if (!gameStarted) {
    return (
      <>
        <div className="text-center space-y-6">
          <div className="text-8xl mb-4">{getInstrumentEmoji()}</div>
          <h3 className="text-elderly-xl font-semibold text-gray-800">
            {getInstrumentName()}節奏訓練
          </h3>
          <p className="text-elderly-base text-warm-gray-600">
            跟隨節拍敲打{getInstrumentName()}，訓練反應速度和節奏感
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={() => setShowRules(true)}
              variant="outline"
              className="text-elderly-base px-8 py-3"
              data-testid="button-show-rules"
            >
              <Lightbulb className="w-5 h-5 mr-2" />
              遊戲說明
            </Button>
            <Button 
              onClick={startGame}
              className="btn-primary text-elderly-base px-8 py-3"
              data-testid="button-start-rhythm"
            >
              <Music className="w-5 h-5 mr-2" />
              開始修行
            </Button>
          </div>
        </div>

        {showRules && (
          <GameRulesModal
            gameType="reaction-rhythm"
            level={level}
            religion={religion}
            difficulty={{
              memoryTime: difficulty.memoryTime,
              reactionWindow: difficulty.reactionWindow,
              gridSize: difficulty.gridSize,
              sequenceLength: difficulty.sequenceLength,
              hintsAvailable: difficulty.hintsAvailable,
            }}
            onStart={() => {
              setShowRules(false);
              startGame();
            }}
            onClose={() => setShowRules(false)}
          />
        )}
      </>
    );
  }

  const timeRemaining = Math.max(0, gameLength - currentTime);
  const seconds = Math.ceil(timeRemaining / 1000);
  const progressPercent = (currentTime / gameLength) * 100;

  return (
    <div className="space-y-6">
      {/* 計時器顯示 */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Clock className="w-5 h-5 text-warm-gold" />
          <span className={`text-elderly-lg font-bold ${seconds <= 10 ? 'text-red-500 animate-pulse' : 'text-warm-gray-700'}`}>
            {seconds} 秒
          </span>
        </div>
        <div className="w-full bg-warm-gray-200 rounded-full h-4">
          <div 
            className={`rounded-full h-4 transition-all duration-100 ${
              seconds <= 10 ? 'bg-red-500' : 'bg-warm-gold'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Score and combo */}
      <div className="flex justify-between items-center">
        <div className="text-center">
          <p className="text-elderly-sm text-warm-gray-600">得分</p>
          <p className="text-elderly-xl font-bold text-warm-gold">{score}</p>
        </div>
        <div className="text-center">
          <p className="text-elderly-sm text-warm-gray-600">連擊</p>
          <p className="text-elderly-xl font-bold text-sage-green">{combo}</p>
        </div>
      </div>

      {/* Rhythm track */}
      <div className="relative h-32 bg-warm-gray-50 rounded-xl border-2 border-warm-gray-200 overflow-hidden">
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-warm-gold transform -translate-x-1/2" />
        
        {beats.map((beat) => {
          const position = ((currentTime - beat.timing + 2000) / 4000) * 100;
          const isVisible = position >= -10 && position <= 110;
          const isActive = Math.abs(beat.timing - currentTime) <= 300;
          
          return isVisible ? (
            <div
              key={beat.id}
              className={`absolute w-8 h-8 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all duration-100 ${
                beat.hit 
                  ? 'bg-green-500 scale-125' 
                  : isActive 
                  ? 'bg-warm-gold animate-pulse scale-110 border-2 border-white' 
                  : 'bg-warm-gold'
              }`}
              style={{
                left: '50%',
                top: '50%',
                transform: `translateX(-50%) translateY(-50%) translateX(${(position - 50) * 3}px)`,
              }}
            />
          ) : null;
        })}
      </div>

      {/* Hit button */}
      <div className="text-center">
        <Button
          onClick={hitBeat}
          className="w-32 h-32 rounded-full btn-primary text-elderly-xl shadow-lg transform active:scale-95 transition-transform"
          data-testid="button-hit-beat"
        >
          <div className="text-center">
            <div className="text-4xl mb-1">{getInstrumentEmoji()}</div>
            <div className="text-elderly-sm">敲擊</div>
          </div>
        </Button>
      </div>

      {/* Instructions */}
      <p className="text-center text-elderly-sm text-warm-gray-600">
        當圓點接近中央線時點擊敲擊按鈕
      </p>
    </div>
  );
};

export default RhythmGame;