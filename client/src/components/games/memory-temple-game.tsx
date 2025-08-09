import React, { useState, useEffect } from 'react';
import { RELIGIOUS_CONTENT, GameDifficulty, calculateStarRating, GAME_TYPES } from '@/lib/game-config';
import BackgroundMusic from '../audio/background-music';

interface MemoryTempleGameProps {
  religion: string;
  difficulty: GameDifficulty;
  onGameComplete: (score: number, stars: number) => void;
}

interface Building {
  id: number;
  name: string;
  emoji: string;
  isTarget: boolean;
  isSelected: boolean;
  isCorrect?: boolean;
}

export default function MemoryTempleGame({ religion, difficulty, onGameComplete }: MemoryTempleGameProps) {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [gamePhase, setGamePhase] = useState<'waiting' | 'memorizing' | 'shuffled' | 'answering' | 'complete'>('waiting');
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedCount, setSelectedCount] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const religionData = RELIGIOUS_CONTENT[religion as keyof typeof RELIGIOUS_CONTENT] || RELIGIOUS_CONTENT.buddhism;
  const maxScore = GAME_TYPES['memory-temple'].getMaxScore(difficulty);
  const gameTime = GAME_TYPES['memory-temple'].getDuration(difficulty);
  
  // 調試輸出
  console.log('寺廟記憶遊戲 - 宗教:', religion, '宗教資料:', religionData?.name, '建築:', religionData?.buildings);
  console.log('寺廟記憶遊戲 - 難度:', difficulty, 'maxScore:', maxScore, '計算:', difficulty.elementCount + ' × 20 = ' + (difficulty.elementCount * 20));

  useEffect(() => {
    initializeBuildings();
  }, [religion, difficulty]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (gamePhase === 'memorizing' && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (gamePhase === 'memorizing' && timeLeft === 0) {
      shuffleBuildings();
    } else if (gamePhase === 'answering' && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (gamePhase === 'answering' && timeLeft === 0) {
      completeGame();
    }

    return () => clearTimeout(timer);
  }, [gamePhase, timeLeft]);

  const initializeBuildings = () => {
    const buildingData = religionData.buildings.slice(0, 6);
    const emojis = religionData.buildingEmojis.slice(0, 6);
    
    const newBuildings: Building[] = buildingData.map((name, index) => ({
      id: index,
      name,
      emoji: emojis[index],
      isTarget: index < difficulty.elementCount,
      isSelected: false
    }));

    setBuildings(newBuildings);
  };

  const shuffleBuildings = () => {
    setBuildings(prev => {
      const shuffled = [...prev];
      // 洗牌算法
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled.map(b => ({ ...b, isTarget: false })); // 清除目標標記
    });
    
    setGamePhase('shuffled');
    setTimeout(() => {
      setGamePhase('answering');
      setTimeLeft(15); // 15秒作答時間（符合replit.md規範：記憶時間+15秒作答）
    }, 1000);
  };

  const startGame = () => {
    setGamePhase('memorizing');
    setTimeLeft(difficulty.memoryTime);
    setScore(0);
    setSelectedCount(0);
    initializeBuildings();
  };

  const handleBuildingClick = (buildingId: number) => {
    if (gamePhase !== 'answering') return;
    
    const building = buildings.find(b => b.id === buildingId);
    if (!building || building.isSelected) return;
    
    if (selectedCount >= 3) return; // 固定選擇3個

    setBuildings(prev => prev.map(b => 
      b.id === buildingId ? { ...b, isSelected: true } : b
    ));
    
    setSelectedCount(prev => prev + 1);
    
    // 檢查是否選擇完畢
    if (selectedCount + 1 === 3) {
      setTimeout(() => completeGame(), 500);
    }
  };

  const completeGame = () => {
    console.log('記憶導覽遊戲完成 - 當前建築:', buildings.map(b => ({name: b.name, target: b.isTarget, selected: b.isSelected})));
    
    // 計算得分 - 修正邏輯，基於實際目標建築
    let finalScore = 0;
    let correctSelections = 0;
    let incorrectSelections = 0;
    
    // 使用實際的目標建築進行計算
    buildings.forEach(b => {
      if (b.isSelected) {
        if (b.isTarget) {
          correctSelections++;
          finalScore += 20; // 正確選擇加20分
        } else {
          incorrectSelections++;
          finalScore -= 5; // 錯誤選擇扣5分
        }
      }
    });

    finalScore = Math.max(0, finalScore); // 確保分數不為負數
    
    console.log('記憶導覽分數計算:', {
      正確選擇: correctSelections,
      錯誤選擇: incorrectSelections,
      最終分數: finalScore,
      最高分數: maxScore,
      百分比: (finalScore / maxScore) * 100
    });

    setScore(finalScore);
    setGamePhase('complete');
    
    const stars = calculateStarRating(finalScore, maxScore);
    console.log('獲得星級:', stars);
    setTimeout(() => onGameComplete(finalScore, stars), 1500);
  };

  const getPhaseText = () => {
    switch (gamePhase) {
      case 'waiting':
        return '準備開始遊戲';
      case 'memorizing':
        return `記住標示的${difficulty.elementCount}個建築位置！時間：${timeLeft}秒`;
      case 'shuffled':
        return '建築位置已重新排列...';
      case 'answering':
        return `點擊您記住的${difficulty.elementCount}個建築！時間：${timeLeft}秒`;
      case 'complete':
        return `遊戲完成！得分：${score}分`;
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-warm-bg p-6">
      <BackgroundMusic 
        audioType="zen" 
        isPlaying={gamePhase === 'memorizing' || gamePhase === 'answering'} 
      />
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-elderly-2xl font-bold text-warm-gold mb-4">
            {religionData.name}建築記憶
          </h2>
          
          <div className="mb-6">
            <p className="text-elderly-lg text-warm-gray-600 font-bold mb-2">
              {getPhaseText()}
            </p>
            {gamePhase === 'waiting' && (
              <p className="text-elderly-base text-warm-gray-500">
                記憶時間：{difficulty.memoryTime}秒 | 作答時間：15秒 | 目標數量：{difficulty.elementCount}個
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          {buildings.map(building => (
            <div
              key={building.id}
              onClick={() => handleBuildingClick(building.id)}
              className={`
                relative p-6 rounded-lg border-3 transition-all duration-300 cursor-pointer
                ${gamePhase === 'memorizing' && building.isTarget
                  ? 'border-yellow-400 bg-yellow-100 shadow-lg animate-pulse'
                  : building.isSelected
                    ? building.isCorrect !== undefined
                      ? building.isCorrect
                        ? 'border-green-400 bg-green-100 shadow-lg'
                        : 'border-red-400 bg-red-100 shadow-lg'
                      : 'border-blue-400 bg-blue-100 shadow-md'
                    : 'border-warm-gray-300 bg-white hover:shadow-md'
                }
              `}
            >
              <div className="text-center">
                <div className="text-4xl mb-2">{building.emoji}</div>
                <div className="text-elderly-base font-bold text-warm-gray-800">
                  {building.name}
                </div>
              </div>
              
              {gamePhase === 'complete' && building.isCorrect && (
                <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  ✓
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center">
          {gamePhase === 'waiting' ? (
            <button
              onClick={startGame}
              className="bg-warm-gold text-white px-8 py-4 rounded-lg text-elderly-lg font-bold hover:bg-yellow-600 transition-colors"
            >
              開始遊戲
            </button>
          ) : gamePhase === 'complete' ? (
            <div>
              <p className="text-elderly-lg text-green-600 font-bold mb-4">
                遊戲完成！最終得分：{score} / {maxScore}分
              </p>
              <button
                onClick={startGame}
                className="bg-warm-gold text-white px-8 py-4 rounded-lg text-elderly-lg font-bold hover:bg-yellow-600 transition-colors"
              >
                再玩一次
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}