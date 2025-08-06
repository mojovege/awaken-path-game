import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Flame, Zap } from 'lucide-react';

interface LightingGameProps {
  onScore: (points: number) => void;
  onComplete: () => void;
  religion: string;
}

interface Lamp {
  id: number;
  x: number;
  y: number;
  lit: boolean;
  target: boolean;
  delay: number;
}

const LightingGame: React.FC<LightingGameProps> = ({ onScore, onComplete, religion }) => {
  const [lamps, setLamps] = useState<Lamp[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gamePhase, setGamePhase] = useState<'watch' | 'play' | 'complete'>('watch');
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [score, setScore] = useState(0);
  const [showingSequence, setShowingSequence] = useState(false);

  // Initialize lamps in a 3x3 grid
  useEffect(() => {
    if (gameStarted) {
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
  }, [gameStarted]);

  const generateSequence = () => {
    const newSequence: number[] = [];
    const sequenceLength = Math.min(3 + currentRound, 7); // Start with 4, max 8
    
    for (let i = 0; i < sequenceLength; i++) {
      newSequence.push(Math.floor(Math.random() * 9));
    }
    
    setSequence(newSequence);
    setPlayerSequence([]);
    setGamePhase('watch');
    setTimeout(() => showSequence(newSequence), 1000);
  };

  const showSequence = async (seq: number[]) => {
    setShowingSequence(true);
    
    for (let i = 0; i < seq.length; i++) {
      const lampId = seq[i];
      
      // Light up the lamp
      setLamps(prev => prev.map(lamp => 
        lamp.id === lampId ? { ...lamp, lit: true, target: true } : lamp
      ));
      
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Turn off the lamp
      setLamps(prev => prev.map(lamp => 
        lamp.id === lampId ? { ...lamp, lit: false, target: false } : lamp
      ));
      
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    setShowingSequence(false);
    setGamePhase('play');
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
      // Wrong! Game over or retry
      setTimeout(() => {
        if (currentRound > 1) {
          setCurrentRound(prev => prev - 1);
          generateSequence();
        } else {
          endGame();
        }
      }, 500);
      return;
    }
    
    // Check if sequence is complete
    if (newPlayerSequence.length === sequence.length) {
      // Correct sequence completed!
      const points = sequence.length * 25 + (currentRound * 10);
      setScore(prev => prev + points);
      onScore(points);
      
      if (currentRound >= 5) {
        // Game complete
        setGamePhase('complete');
        setTimeout(onComplete, 1500);
      } else {
        // Next round
        setCurrentRound(prev => prev + 1);
        setTimeout(generateSequence, 1000);
      }
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setCurrentRound(1);
    setScore(0);
    setPlayerSequence([]);
  };

  const endGame = () => {
    setGamePhase('complete');
    setTimeout(onComplete, 1000);
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
      <div className="text-center space-y-6">
        <div className="text-8xl mb-4">{getLampEmoji()}</div>
        <h3 className="text-elderly-xl font-semibold text-gray-800">
          {getGameTitle()}
        </h3>
        <p className="text-elderly-base text-warm-gray-600">
          記住點燈順序，訓練記憶力和反應速度
        </p>
        <Button 
          onClick={startGame}
          className="btn-primary text-elderly-base px-8 py-3"
          data-testid="button-start-lighting"
        >
          <Flame className="w-5 h-5 mr-2" />
          開始點燈
        </Button>
      </div>
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
            完成回合: {currentRound}/5
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
          {lamps.map((lamp) => (
            <div
              key={lamp.id}
              className="aspect-square bg-warm-gold rounded-full flex items-center justify-center text-2xl animate-pulse"
            >
              {getLampEmoji()}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Game status */}
      <div className="text-center space-y-2">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-elderly-sm text-warm-gray-600">回合</p>
            <p className="text-elderly-lg font-bold text-warm-gold">{currentRound}/5</p>
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
                ${lamp.lit || lamp.target
                  ? 'bg-warm-gold border-yellow-400 shadow-lg scale-110 animate-pulse' 
                  : 'bg-warm-gray-100 border-warm-gray-300 hover:border-warm-gold hover:bg-warm-gray-200'
                }
                ${gamePhase !== 'play' ? 'cursor-not-allowed' : 'cursor-pointer'}
              `}
              data-testid={`lamp-${lamp.id}`}
            >
              <span className={lamp.lit || lamp.target ? 'animate-bounce' : ''}>
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