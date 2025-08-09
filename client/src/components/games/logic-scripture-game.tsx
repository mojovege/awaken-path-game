import React, { useState, useEffect } from 'react';
import { RELIGIOUS_CONTENT, GameDifficulty, calculateStarRating, GAME_TYPES } from '@/lib/game-config';
import BackgroundMusic from '../audio/background-music';

interface LogicScriptureGameProps {
  religion: string;
  difficulty: GameDifficulty;
  onGameComplete: (score: number, stars: number) => void;
}

interface ScriptureItem {
  id: number;
  text: string;
  correctOrder: number;
  currentOrder: number;
}

export default function LogicScriptureGame({ religion, difficulty, onGameComplete }: LogicScriptureGameProps) {
  const [gameStarted, setGameStarted] = useState(false);
  const [scriptureItems, setScriptureItems] = useState<ScriptureItem[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);

  const religionData = RELIGIOUS_CONTENT[religion as keyof typeof RELIGIOUS_CONTENT] || RELIGIOUS_CONTENT.buddhism;
  const maxScore = GAME_TYPES['logic-scripture'].getMaxScore(difficulty);
  const gameTime = GAME_TYPES['logic-scripture'].getDuration(difficulty);
  
  // 調試輸出
  console.log('經典排序遊戲 - 宗教:', religion, '宗教資料:', religionData?.name);
  console.log('經典排序遊戲 - 難度:', difficulty, 'maxScore:', maxScore, '計算:', difficulty.elementCount + ' × 10 = ' + (difficulty.elementCount * 10));

  // 根據宗教生成不同的經典內容
  const getScriptureSequences = () => {
    const sequences = {
      buddhism: [
        '南無阿彌陀佛',
        '般若波羅蜜多心經',
        '觀自在菩薩',
        '行深般若波羅蜜多時',
        '照見五蘊皆空',
        '度一切苦厄',
        '舍利子',
        '色不異空',
        '空不異色'
      ],
      taoism: [
        '道可道非常道',
        '名可名非常名',
        '無名天地之始',
        '有名萬物之母',
        '故常無欲以觀其妙',
        '常有欲以觀其徼',
        '此兩者同出而異名',
        '同謂之玄',
        '玄之又玄眾妙之門'
      ],
      mazu: [
        '天上聖母媽祖',
        '護佑蒼生',
        '慈悲為懷',
        '救苦救難',
        '有求必應',
        '風調雨順',
        '國泰民安',
        '出入平安',
        '闔家安康'
      ]
    };

    return sequences[religion as keyof typeof sequences] || sequences.buddhism;
  };

  useEffect(() => {
    initializeGame();
  }, [religion, difficulty]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (gameStarted && timeLeft > 0 && !isComplete) {
      timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (gameStarted && timeLeft === 0 && !isComplete) {
      completeGame();
    }
    
    return () => clearTimeout(timer);
  }, [gameStarted, timeLeft, isComplete]);

  const initializeGame = () => {
    const sequences = getScriptureSequences();
    const selectedSequences = sequences.slice(0, difficulty.elementCount);
    
    console.log('經典排序遊戲內容生成:', {
      宗教: religion,
      難度: difficulty.chapter,
      元素數量: difficulty.elementCount,
      經典序列: selectedSequences
    });
    
    const items: ScriptureItem[] = selectedSequences.map((text, index) => ({
      id: index,
      text,
      correctOrder: index,
      currentOrder: index
    }));

    // 洗牌
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }

    // 重新分配當前順序
    items.forEach((item, index) => {
      item.currentOrder = index;
    });

    setScriptureItems(items);
  };

  const startGame = () => {
    console.log('開始經典排序遊戲 - 宗教:', religion, '題目數量:', difficulty.elementCount, '遊戲時間:', gameTime);
    setGameStarted(true);
    setTimeLeft(gameTime);
    setScore(0);
    setIsComplete(false);
    initializeGame();
  };

  const handleDragStart = (e: React.DragEvent, itemId: number) => {
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetOrder: number) => {
    e.preventDefault();
    
    if (draggedItem === null) return;

    setScriptureItems(prev => {
      const newItems = [...prev];
      const draggedIndex = newItems.findIndex(item => item.id === draggedItem);
      const targetIndex = newItems.findIndex(item => item.currentOrder === targetOrder);
      
      if (draggedIndex === -1 || targetIndex === -1) return prev;

      // 交換位置
      [newItems[draggedIndex].currentOrder, newItems[targetIndex].currentOrder] = 
      [newItems[targetIndex].currentOrder, newItems[draggedIndex].currentOrder];

      return newItems;
    });

    setDraggedItem(null);
  };

  const checkSequence = () => {
    let correctCount = 0;
    scriptureItems.forEach(item => {
      if (item.correctOrder === item.currentOrder) {
        correctCount++;
      }
    });

    const finalScore = (correctCount / scriptureItems.length) * maxScore;
    setScore(Math.floor(finalScore));
    completeGame();
  };

  const completeGame = () => {
    let finalScore = score;
    
    // 如果還沒檢查，自動檢查序列
    if (score === 0) {
      let correctCount = 0;
      scriptureItems.forEach(item => {
        if (item.correctOrder === item.currentOrder) {
          correctCount++;
        }
      });
      finalScore = (correctCount / scriptureItems.length) * maxScore;
      setScore(Math.floor(finalScore));
      
      console.log('經典排序遊戲完成 - 正確項目:', correctCount, '總項目:', scriptureItems.length);
      console.log('經典排序遊戲完成 - 最終分數:', Math.floor(finalScore), '最高分數:', maxScore);
      console.log('經典排序星級計算:', { score: Math.floor(finalScore), maxScore, percentage: (Math.floor(finalScore) / maxScore) * 100 });
    }

    setIsComplete(true);
    const stars = calculateStarRating(Math.floor(finalScore), maxScore);
    console.log('經典排序獲得星級:', stars);
    setTimeout(() => onGameComplete(Math.floor(finalScore), stars), 1000);
  };

  const getSortedItems = () => {
    return [...scriptureItems].sort((a, b) => a.currentOrder - b.currentOrder);
  };

  return (
    <div className="min-h-screen bg-warm-bg p-6">
      <BackgroundMusic 
        audioType="meditation" 
        isPlaying={gameStarted && !isComplete} 
      />
      
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-elderly-2xl font-bold text-warm-gold mb-4">
            {religionData.name}經典排序
          </h2>
          
          {!gameStarted && (
            <div className="mb-6">
              <p className="text-elderly-lg text-warm-gray-600 mb-4">
                將{religionData.name}經典按照正確順序排列
              </p>
              <p className="text-elderly-base text-warm-gray-500">
                拖拽重新排序 | 項目數：{difficulty.elementCount}個 | 時間：{gameTime}秒
              </p>
            </div>
          )}

          {gameStarted && !isComplete && (
            <div className="mb-6">
              <p className="text-elderly-lg text-blue-600 font-bold">
                剩餘時間：{timeLeft}秒 | 得分：{score} / {maxScore}
              </p>
            </div>
          )}
        </div>

        {/* 經典序列 */}
        {gameStarted && (
          <div className="space-y-4 mb-8">
            {getSortedItems().map((item, index) => (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, item.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, item.currentOrder)}
                className={`
                  p-4 rounded-lg border-2 cursor-move transition-all duration-200
                  ${item.correctOrder === item.currentOrder 
                    ? 'bg-green-50 border-green-300' 
                    : 'bg-white border-warm-gray-300 hover:border-warm-gold'
                  }
                  ${draggedItem === item.id ? 'opacity-50 scale-95' : ''}
                `}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-warm-gold text-white rounded-full flex items-center justify-center text-elderly-base font-bold">
                    {index + 1}
                  </div>
                  <div className="text-elderly-lg font-medium text-warm-gray-800">
                    {item.text}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center">
          {!gameStarted ? (
            <button
              onClick={startGame}
              className="bg-warm-gold text-white px-8 py-4 rounded-lg text-elderly-lg font-bold hover:bg-yellow-600 transition-colors"
            >
              開始排序
            </button>
          ) : isComplete ? (
            <div>
              <p className="text-elderly-lg text-green-600 font-bold mb-4">
                排序完成！得分：{score} / {maxScore}分
              </p>
              <button
                onClick={startGame}
                className="bg-warm-gold text-white px-8 py-4 rounded-lg text-elderly-lg font-bold hover:bg-yellow-600 transition-colors"
              >
                再次排序
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-elderly-base text-warm-gray-600">
                拖拽卡片重新排序經典內容
              </p>
              
              <div className="flex justify-center space-x-4">
                <button
                  onClick={checkSequence}
                  className="bg-green-500 text-white px-6 py-3 rounded-lg text-elderly-base font-bold hover:bg-green-600 transition-colors"
                >
                  檢查排序
                </button>
                
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="bg-blue-500 text-white px-4 py-2 rounded text-elderly-sm hover:bg-blue-600 transition-colors"
                >
                  {showHint ? '隱藏提示' : '顯示提示'}
                </button>
              </div>
              
              {/* 提示內容 */}
              {showHint && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
                  <h3 className="text-elderly-base font-bold text-blue-800 mb-2">正確順序提示：</h3>
                  <div className="grid grid-cols-1 gap-1">
                    {getScriptureSequences().slice(0, difficulty.elementCount).map((text, index) => (
                      <div key={index} className="text-elderly-sm text-blue-700">
                        <span className="font-medium">{index + 1}.</span> {text}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}