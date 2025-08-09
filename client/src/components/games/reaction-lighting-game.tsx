import React, { useState, useEffect, useRef } from 'react';
import { RELIGIOUS_CONTENT, GameDifficulty, calculateStarRating, GAME_TYPES } from '@/lib/game-config';
import BackgroundMusic from '../audio/background-music';

interface ReactionLightingGameProps {
  religion: string;
  difficulty: GameDifficulty;
  onGameComplete: (score: number, stars: number) => void;
}

interface Lamp {
  id: number;
  isLit: boolean;
  shouldLight: boolean;
  position: { x: number; y: number };
}

export default function ReactionLightingGame({ religion, difficulty, onGameComplete }: ReactionLightingGameProps) {
  const [gameStarted, setGameStarted] = useState(false);
  const [lamps, setLamps] = useState<Lamp[]>([]);
  const [sequence, setSequence] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showingSequence, setShowingSequence] = useState(false);
  const [waitingForInput, setWaitingForInput] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const religionData = RELIGIOUS_CONTENT[religion as keyof typeof RELIGIOUS_CONTENT] || RELIGIOUS_CONTENT.buddhism;
  const maxScore = GAME_TYPES['reaction-lighting'].getMaxScore(difficulty);
  
  // 調試輸出
  console.log('點燈遊戲 - 宗教:', religion, '宗教資料:', religionData?.name);
  console.log('點燈遊戲 - 難度:', difficulty, 'maxScore:', maxScore, '計算:', difficulty.elementCount + ' × 15 = ' + (difficulty.elementCount * 15));

  useEffect(() => {
    initializeLamps();
  }, [difficulty]);

  const initializeLamps = () => {
    const newLamps: Lamp[] = [];
    const gridSize = Math.ceil(Math.sqrt(difficulty.elementCount));
    
    for (let i = 0; i < difficulty.elementCount; i++) {
      const row = Math.floor(i / gridSize);
      const col = i % gridSize;
      
      newLamps.push({
        id: i,
        isLit: false,
        shouldLight: false,
        position: {
          x: (col * 100) / gridSize + 50 / gridSize,
          y: (row * 100) / gridSize + 50 / gridSize
        }
      });
    }
    
    setLamps(newLamps);
    
    // 生成隨機點燈序列
    const newSequence: number[] = [];
    for (let i = 0; i < difficulty.elementCount; i++) {
      newSequence.push(i);
    }
    // 洗牌
    for (let i = newSequence.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newSequence[i], newSequence[j]] = [newSequence[j], newSequence[i]];
    }
    
    setSequence(newSequence);
  };

  const playLightingSound = async () => {
    try {
      console.log('播放點燈音效，宗教:', religion);
      const { SoundEffects } = await import('../audio/sound-effects');
      const success = await SoundEffects.playSound('fire', religion);
      if (!success) {
        console.error('點燈音效播放失敗');
      }
    } catch (error) {
      console.error('點燈音效載入失敗:', error);
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setCurrentStep(0);
    setIsComplete(false);
    setShowingSequence(false);
    setWaitingForInput(false);
    initializeLamps();
    
    // 開始展示序列
    setTimeout(() => showSequence(), 1000);
  };

  const showSequence = () => {
    setShowingSequence(true);
    let step = 0;
    
    const showNextLamp = () => {
      if (step < sequence.length) {
        const lampId = sequence[step];
        
        // 點亮燈籠
        setLamps(prev => prev.map(lamp => 
          lamp.id === lampId ? { ...lamp, shouldLight: true } : { ...lamp, shouldLight: false }
        ));
        
        playLightingSound();
        
        // 1秒後熄滅，繼續下一個
        setTimeout(() => {
          setLamps(prev => prev.map(lamp => ({ ...lamp, shouldLight: false })));
          step++;
          
          if (step < sequence.length) {
            setTimeout(showNextLamp, 500); // 0.5秒間隔
          } else {
            // 序列展示完成，開始用戶輸入
            setTimeout(() => {
              setShowingSequence(false);
              setWaitingForInput(true);
              startUserInput();
            }, 1000);
          }
        }, 1000);
      }
    };
    
    showNextLamp();
  };

  const startUserInput = () => {
    setCurrentStep(0);
    // 設置更合理的超時時間 - 給用戶足夠時間完成
    const timeoutDuration = Math.max(difficulty.reactionWindow * sequence.length * 2, 15000); // 至少15秒，每個燈雙倍時間
    console.log('點燈遊戲開始用戶輸入階段，超時時間:', timeoutDuration, 'ms');
    timeoutRef.current = setTimeout(() => {
      if (!isComplete && waitingForInput) {
        console.log('點燈遊戲超時，用戶未完成所有步驟');
        completeGame();
      }
    }, timeoutDuration);
  };

  const handleLampClick = async (lampId: number) => {
    if (!waitingForInput || isComplete) return;
    
    const expectedLamp = sequence[currentStep];
    
    if (lampId === expectedLamp) {
      // 正確點擊
      console.log('點燈正確:', lampId, '當前步驟:', currentStep + 1, '/', sequence.length);
      
      setLamps(prev => prev.map(lamp => 
        lamp.id === lampId ? { ...lamp, isLit: true } : lamp
      ));
      
      await playLightingSound();
      setScore(prev => prev + 15);
      setCurrentStep(prev => prev + 1);
      
      // 檢查是否完成
      if (currentStep + 1 >= sequence.length) {
        console.log('點燈遊戲完成！');
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        setTimeout(() => completeGame(), 500);
      }
    } else {
      // 錯誤點擊
      console.log('點燈錯誤:', lampId, '預期:', expectedLamp);
      setScore(prev => Math.max(0, prev - 5));
      
      // 播放錯誤音效
      try {
        const { SoundEffects } = await import('../audio/sound-effects');
        SoundEffects.playSound('error', religion);
      } catch (error) {
        console.error('錯誤音效播放失敗:', error);
      }
      
      // 錯誤點擊不應該結束遊戲，讓用戶繼續嘗試
      // setTimeout(() => completeGame(), 1000);
    }
  };

  const completeGame = () => {
    console.log('祈福點燈遊戲完成 - 最終分數:', score, '最高分數:', maxScore);
    console.log('點燈遊戲星級計算:', { score, maxScore, percentage: (score / maxScore) * 100 });
    setIsComplete(true);
    setWaitingForInput(false);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    const stars = calculateStarRating(score, maxScore);
    console.log('點燈遊戲獲得星級:', stars);
    setTimeout(() => onGameComplete(score, stars), 1000);
  };

  const getPhaseText = () => {
    if (!gameStarted) return '準備開始祈福點燈';
    if (showingSequence) return `觀看點燈順序... (${currentStep + 1}/${sequence.length})`;
    if (waitingForInput) return `按照順序點燈 (${currentStep + 1}/${sequence.length})`;
    if (isComplete) return `祈福完成！得分：${score}分`;
    return '';
  };

  return (
    <div className="min-h-screen bg-warm-bg p-6">
      <BackgroundMusic 
        audioType="fire" 
        isPlaying={gameStarted && !isComplete} 
      />
      
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-elderly-2xl font-bold text-warm-gold mb-4">
            {religionData.name}祈福點燈
          </h2>
          
          <div className="mb-6">
            <p className="text-elderly-lg text-warm-gray-600 font-bold mb-2">
              {getPhaseText()}
            </p>
            {!gameStarted && (
              <p className="text-elderly-base text-warm-gray-500">
                記住點燈順序，然後重複點亮 | 燈籠數：{difficulty.elementCount}個
              </p>
            )}
            {gameStarted && !isComplete && (
              <p className="text-elderly-base text-green-600">
                得分：{score} / {maxScore}
              </p>
            )}
          </div>
        </div>

        {/* 燈籠區域 */}
        <div className="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg h-96 mb-8 overflow-hidden">
          {lamps.map(lamp => (
            <div
              key={lamp.id}
              onClick={() => handleLampClick(lamp.id)}
              className={`
                absolute w-12 h-16 transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2
                ${waitingForInput ? 'cursor-pointer hover:scale-110' : 'cursor-default'}
              `}
              style={{
                left: `${lamp.position.x}%`,
                top: `${lamp.position.y}%`,
                userSelect: 'none',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none'
              }}
            >
              {/* 燈籠主體 */}
              <div className={`
                w-full h-full rounded-lg border-2 transition-all duration-300
                ${lamp.isLit || lamp.shouldLight
                  ? 'bg-yellow-300 border-yellow-500 shadow-lg shadow-yellow-400/50'
                  : 'bg-gray-600 border-gray-500'
                }
              `}>
                {/* 燈籠裝飾 */}
                <div className="flex items-center justify-center h-full">
                  <span className={`text-xl transition-colors duration-300 ${
                    lamp.isLit || lamp.shouldLight ? 'text-red-600' : 'text-gray-400'
                  }`}>
                    🏮
                  </span>
                </div>
              </div>
              
              {/* 光暈效果 */}
              {(lamp.isLit || lamp.shouldLight) && (
                <div className="absolute inset-0 rounded-lg bg-yellow-400 opacity-20 animate-pulse"></div>
              )}
            </div>
          ))}
        </div>

        {/* 進度指示 */}
        {gameStarted && !isComplete && (
          <div className="mb-6">
            <div className="flex justify-center space-x-2">
              {sequence.map((_, index) => (
                <div
                  key={index}
                  className={`w-4 h-4 rounded-full transition-colors duration-300 ${
                    index < currentStep
                      ? 'bg-green-500'
                      : index === currentStep && waitingForInput
                        ? 'bg-yellow-500 animate-pulse'
                        : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        <div className="text-center">
          {!gameStarted ? (
            <button
              onClick={startGame}
              className="bg-warm-gold text-white px-8 py-4 rounded-lg text-elderly-lg font-bold hover:bg-yellow-600 transition-colors"
            >
              開始祈福
            </button>
          ) : isComplete ? (
            <div>
              <p className="text-elderly-lg text-green-600 font-bold mb-4">
                祈福完成！得分：{score} / {maxScore}分
              </p>
              <button
                onClick={startGame}
                className="bg-warm-gold text-white px-8 py-4 rounded-lg text-elderly-lg font-bold hover:bg-yellow-600 transition-colors"
              >
                再次祈福
              </button>
            </div>
          ) : showingSequence ? (
            <p className="text-elderly-base text-warm-gray-600">
              請仔細觀看點燈順序...
            </p>
          ) : waitingForInput ? (
            <p className="text-elderly-base text-warm-gray-600">
              按照剛才的順序點亮燈籠
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}