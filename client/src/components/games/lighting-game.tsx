import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Flame, Zap, Lightbulb, Clock } from 'lucide-react';
import GameRulesModal from '../game-rules-modal';
import { getDifficultyForLevel } from '@/lib/game-logic';

interface LightingGameProps {
  onScore: (points: number) => void;
  onComplete: () => void;
  religion: string;
  level?: number;
}

interface Lamp {
  id: number;
  x: number;
  y: number;
  lit: boolean;
  target: boolean;
  delay: number;
}

const LightingGame: React.FC<LightingGameProps> = ({ onScore, onComplete, religion, level = 1 }) => {
  const difficulty = getDifficultyForLevel(level);
  
  const [lamps, setLamps] = useState<Lamp[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gamePhase, setGamePhase] = useState<'watch' | 'play' | 'complete'>('watch');
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [score, setScore] = useState(0);
  const [showingSequence, setShowingSequence] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [gameLength] = useState(difficulty.timeLimit * 1000);
  const [maxRounds, setMaxRounds] = useState(1);
  const [playTime, setPlayTime] = useState(0);
  const [playTimeLimit, setPlayTimeLimit] = useState(0);
  const [isPlayPhaseActive, setIsPlayPhaseActive] = useState(false);

  // Initialize lamps and game parameters
  useEffect(() => {
    if (gameStarted) {
      // 根據等級設定回合數：簡單關卡少回合，困難關卡多回合
      const rounds = level <= 3 ? 3 : level <= 6 ? 4 : level <= 9 ? 5 : level <= 12 ? 6 : 7;
      setMaxRounds(rounds);
      
      const initialLamps: Lamp[] = [];
      for (let i = 0; i < 9; i++) {
        const row = Math.floor(i / 3);
        const col = i % 3;
        initialLamps.push({
          id: i,
          x: col,
          y: row,
          lit: false,
          target: false,
          delay: 0,
        });
      }
      setLamps(initialLamps);
      generateSequence();
    }
  }, [gameStarted, level]);

  // Play phase timer - 只在用戶可以操作時計時
  useEffect(() => {
    if (!isPlayPhaseActive || gamePhase !== 'play') return;
    
    const timer = setInterval(() => {
      setPlayTime(prev => {
        if (prev >= playTimeLimit - 100) {
          return playTimeLimit;
        }
        return prev + 100;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [isPlayPhaseActive, gamePhase]);

  // Play phase end check - 只檢查用戶操作時間
  useEffect(() => {
    if (isPlayPhaseActive && gamePhase === 'play' && playTime >= playTimeLimit) {
      console.log('Play time up! Ending game...');
      setTimeout(() => endGame(), 100);
    }
  }, [isPlayPhaseActive, gamePhase, playTime, playTimeLimit]);

  const generateSequence = () => {
    const newSequence: number[] = [];
    // 根據等級和回合動態調整序列長度，但要考慮時間限制
    const baseLength = Math.min(currentRound + 1, Math.floor(level / 3) + 2);
    const sequenceLength = Math.min(baseLength, 4); // 限制最大長度避免時間不夠
    
    for (let i = 0; i < sequenceLength; i++) {
      newSequence.push(Math.floor(Math.random() * 9));
    }
    
    console.log('Generated sequence:', { currentRound, level, sequenceLength, sequence: newSequence });
    setSequence(newSequence);
    setPlayerSequence([]);
    setGamePhase('watch');
    setTimeout(() => showSequence(newSequence), 1000);
  };

  const showSequence = async (seq: number[]) => {
    setShowingSequence(true);
    setIsPlayPhaseActive(false);
    
    // 固定顯示時間：每個燈顯示memoryTime，不受總遊戲時間限制
    const timePerLamp = difficulty.memoryTime * 1000;
    
    console.log('Showing sequence:', { sequenceLength: seq.length, timePerLamp, totalShowTime: seq.length * (timePerLamp + 500) });
    
    for (let i = 0; i < seq.length; i++) {
      const lampId = seq[i];
      
      // 等待時間讓用戶準備
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Light up the lamp
      setLamps(prev => prev.map(lamp => 
        lamp.id === lampId ? { ...lamp, lit: true } : lamp
      ));
      
      await new Promise(resolve => setTimeout(resolve, timePerLamp));
      
      // Turn off the lamp
      setLamps(prev => prev.map(lamp => 
        lamp.id === lampId ? { ...lamp, lit: false } : lamp
      ));
      
      await new Promise(resolve => setTimeout(resolve, 200)); // 短間隔時間
    }
    
    setShowingSequence(false);
    setGamePhase('play');
    
    // 設定用戶操作時間限制並開始計時
    setPlayTimeLimit(gameLength);
    setPlayTime(0);
    setIsPlayPhaseActive(true);
    console.log('Starting play phase with time limit:', gameLength);
  };

  const lightLamp = (lampId: number) => {
    if (gamePhase !== 'play' || showingSequence) return;
    
    const newPlayerSequence = [...playerSequence, lampId];
    setPlayerSequence(newPlayerSequence);
    
    // Visual feedback
    setLamps(prev => prev.map(lamp => 
      lamp.id === lampId ? { ...lamp, lit: true } : lamp
    ));
    
    setTimeout(() => {
      setLamps(prev => prev.map(lamp => 
        lamp.id === lampId ? { ...lamp, lit: false } : lamp
      ));
    }, 300);
    
    // Check if the sequence matches
    const currentIndex = newPlayerSequence.length - 1;
    if (newPlayerSequence[currentIndex] !== sequence[currentIndex]) {
      // Wrong! Give feedback and retry or end
      setLamps(prev => prev.map(lamp => 
        lamp.id === lampId ? { ...lamp, lit: true } : lamp
      ));
      
      setTimeout(() => {
        setLamps(prev => prev.map(lamp => ({ ...lamp, lit: false })));
        
        if (currentRound > 1) {
          setCurrentRound(prev => prev - 1);
          setTimeout(generateSequence, 1500); // 給用戶更多時間理解
        } else {
          endGame();
        }
      }, 1000);
      return;
    }
    
    // Check if sequence is complete
    if (newPlayerSequence.length === sequence.length) {
      // Correct sequence completed!
      const points = sequence.length * 25 + (currentRound * 10);
      setScore(prev => prev + points);
      onScore(points);
      
      if (currentRound >= maxRounds) { // 使用動態計算的回合數
        // Game complete
        setGamePhase('complete');
        setTimeout(onComplete, 2000); // 給更多時間看結果
      } else {
        // Next round - 給用戶休息時間
        setTimeout(() => {
          setCurrentRound(prev => prev + 1);
          setTimeout(generateSequence, 1000);
        }, 1500);
      }
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setCurrentRound(1);
    setScore(0);
    setPlayerSequence([]);
    setPlayTime(0);
    setIsPlayPhaseActive(false);
  };

  const endGame = () => {
    if (gamePhase === 'complete') return; // 防止重複調用
    
    console.log('Game ending...', { gamePhase, currentRound, maxRounds });
    setGamePhase('complete');
    setGameStarted(false);
    setTimeout(onComplete, 2000); // 給用戶更多時間看結果
  };

  const getLampEmoji = () => {
    switch (religion) {
      case 'buddhism': return '🏮';
      case 'taoism': return '🕯️';
      case 'mazu': return '🧿';
      default: return '🏮';
    }
  };

  const getGameTitle = () => {
    switch (religion) {
      case 'buddhism': return '點亮佛燈';
      case 'taoism': return '點燃心燈';
      case 'mazu': return '祈福明燈';
      default: return '祈福點燈';
    }
  };

  const getInstructionText = () => {
    switch (gamePhase) {
      case 'watch':
        return showingSequence ? '記住點燈順序...' : '準備觀看點燈順序';
      case 'play':
        return `按照剛才的順序點燈 (${playerSequence.length + 1}/${sequence.length})`;
      case 'complete':
        return '恭喜完成！';
      default:
        return '';
    }
  };

  if (!gameStarted) {
    return (
      <>
        <div className="text-center space-y-6">
          <div className="text-8xl mb-4">{getLampEmoji()}</div>
          <h3 className="text-elderly-xl font-semibold text-gray-800">
            {getGameTitle()}
          </h3>
          <p className="text-elderly-base text-warm-gray-600">
            記住點燈順序，訓練記憶力和反應速度
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
              data-testid="button-start-lighting"
            >
              <Flame className="w-5 h-5 mr-2" />
              開始點燈
            </Button>
          </div>
        </div>

        {showRules && (
          <GameRulesModal
            gameType="memory-lighting"
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

  if (gamePhase === 'complete') {
    return (
      <div className="text-center space-y-6">
        <div className="text-8xl mb-4">✨</div>
        <h3 className="text-elderly-xl font-semibold text-warm-gold">
          功德圓滿！
        </h3>
        <div className="space-y-2">
          <p className="text-elderly-base text-warm-gray-600">
            總得分: {score}
          </p>
          <p className="text-elderly-base text-warm-gray-600">
            完成回合: {currentRound}/{maxRounds}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
          {lamps.map((lamp) => (
            <div
              key={lamp.id}
              className="aspect-square bg-warm-gold rounded-full flex items-center justify-center text-2xl"
            >
              {getLampEmoji()}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 根據遊戲階段顯示不同的時間資訊
  const getTimeInfo = () => {
    if (gamePhase === 'play' && isPlayPhaseActive) {
      const timeRemaining = Math.max(0, playTimeLimit - playTime);
      const seconds = Math.ceil(timeRemaining / 1000);
      const progressPercent = (playTime / playTimeLimit) * 100;
      return { seconds, progressPercent, isActive: true, label: '回答時間' };
    } else if (gamePhase === 'watch') {
      return { seconds: '觀看中', progressPercent: 0, isActive: false, label: '記憶階段' };
    }
    return { seconds: 0, progressPercent: 0, isActive: false, label: '準備中' };
  };

  const timeInfo = getTimeInfo();

  return (
    <div className="space-y-6">
      {/* 計時器顯示 */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Clock className="w-5 h-5 text-warm-gold" />
          <span className="text-elderly-sm text-warm-gray-600">{timeInfo.label}</span>
        </div>
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className={`text-elderly-lg font-bold ${
            timeInfo.isActive && typeof timeInfo.seconds === 'number' && timeInfo.seconds <= 10 
              ? 'text-red-500 animate-pulse' 
              : 'text-warm-gray-700'
          }`}>
            {typeof timeInfo.seconds === 'number' ? `${timeInfo.seconds} 秒` : timeInfo.seconds}
          </span>
        </div>
        {timeInfo.isActive && (
          <div className="w-full bg-warm-gray-200 rounded-full h-4">
            <div 
              className={`rounded-full h-4 transition-all duration-100 ${
                typeof timeInfo.seconds === 'number' && timeInfo.seconds <= 10 ? 'bg-red-500' : 'bg-warm-gold'
              }`}
              style={{ width: `${timeInfo.progressPercent}%` }}
            />
          </div>
        )}
      </div>

      {/* Game status */}
      <div className="text-center space-y-2">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-elderly-sm text-warm-gray-600">回合</p>
            <p className="text-elderly-lg font-bold text-warm-gold">{currentRound}/{maxRounds}</p>
          </div>
          <div>
            <p className="text-elderly-sm text-warm-gray-600">得分</p>
            <p className="text-elderly-lg font-bold text-sage-green">{score}</p>
          </div>
          <div>
            <p className="text-elderly-sm text-warm-gray-600">長度</p>
            <p className="text-elderly-lg font-bold text-ocean-blue">{sequence.length}</p>
          </div>
        </div>
        
        <p className="text-elderly-base text-warm-gray-700">
          {getInstructionText()}
        </p>
      </div>

      {/* Lamp grid */}
      <div className="max-w-xs mx-auto">
        <div className="grid grid-cols-3 gap-3">
          {lamps.map((lamp) => (
            <button
              key={lamp.id}
              onClick={() => lightLamp(lamp.id)}
              disabled={gamePhase !== 'play' || showingSequence}
              className={`
                aspect-square rounded-full border-2 transition-all duration-300 text-3xl
                transform active:scale-95 
                ${lamp.lit
                  ? 'bg-warm-gold border-yellow-400 shadow-lg scale-110' 
                  : 'bg-warm-gray-100 border-warm-gray-300 hover:border-warm-gold hover:bg-warm-gray-200'
                }
                ${gamePhase !== 'play' ? 'cursor-not-allowed' : 'cursor-pointer'}
              `}
              data-testid={`lamp-${lamp.id}`}
            >
              <span>
                {getLampEmoji()}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="text-center">
        {gamePhase === 'watch' && (
          <div className="flex items-center justify-center space-x-2">
            <Zap className="w-5 h-5 text-warm-gold animate-pulse" />
            <span className="text-elderly-sm text-warm-gray-600">
              {showingSequence ? '正在顯示順序...' : '準備中...'}
            </span>
          </div>
        )}
        
        {gamePhase === 'play' && (
          <p className="text-elderly-sm text-warm-gray-600">
            點擊燈具來重現剛才的順序
          </p>
        )}
      </div>
    </div>
  );
};

export default LightingGame;