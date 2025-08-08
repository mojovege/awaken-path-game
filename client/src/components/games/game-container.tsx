import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';
import { GAME_TYPES, getDifficultyForLevel, getGameTypeFromLevel, RELIGIOUS_CONTENT } from '@/lib/game-config';
import MemoryScriptureGame from './memory-scripture-game';
import MemoryTempleGame from './memory-temple-game';
import ReactionRhythmGame from './reaction-rhythm-game';
import ReactionLightingGame from './reaction-lighting-game';
import LogicScriptureGame from './logic-scripture-game';
import LogicSequenceGame from './logic-sequence-game';

interface GameContainerProps {
  level?: number;
  gameType?: string;
  religion?: string;
}

export default function GameContainer({ level, gameType: propGameType, religion: propReligion }: GameContainerProps) {
  const params = useParams();
  const [, setLocation] = useLocation();
  const [userReligion, setUserReligion] = useState<string>('buddhism');
  const [currentScore, setCurrentScore] = useState(0);
  const [currentStars, setCurrentStars] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // 確定遊戲參數
  const gameLevel = level || parseInt(params.level || '1');
  const gameType = propGameType || getGameTypeFromLevel(gameLevel);
  const difficulty = getDifficultyForLevel(gameLevel);

  useEffect(() => {
    // 從API獲取用戶信息
    const userId = localStorage.getItem('awaken_path_user_id') || localStorage.getItem('userId') || 'demo-user-1';
    
    fetch(`/api/user/${userId}`)
      .then(res => res.json())
      .then(data => {
        console.log('用戶資料:', data); // 調試信息
        if (data.selectedReligion) {
          console.log('設定宗教為:', data.selectedReligion); // 調試信息
          setUserReligion(data.selectedReligion);
          localStorage.setItem('selectedReligion', data.selectedReligion);
        }
      })
      .catch(console.error);
  }, [propReligion]);

  const handleGameComplete = async (score: number, stars: number) => {
    setCurrentScore(score);
    setCurrentStars(stars);
    setIsComplete(true);

    // 保存遊戲結果到服務器
    try {
      const userId = localStorage.getItem('awaken_path_user_id') || localStorage.getItem('userId') || 'demo-user-1';
      await fetch(`/api/user/${userId}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level: gameLevel,
          gameType,
          score,
          stars,
          completedAt: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Failed to save game progress:', error);
    }
  };

  const handleBackToStory = () => {
    console.log('返回主頁...');
    // 清除所有遊戲狀態
    setIsComplete(false);
    setCurrentScore(0);
    setCurrentStars(0);
    // 強制重新載入首頁
    window.location.href = '/';
  };

  const handleNextLevel = () => {
    setIsComplete(false);
    setCurrentScore(0);
    setCurrentStars(0);
    
    if (gameLevel < 30) {
      setLocation(`/game/level/${gameLevel + 1}`);
    } else {
      setLocation('/');
    }
  };

  const renderGame = () => {
    const gameProps = {
      religion: userReligion,
      difficulty,
      onGameComplete: handleGameComplete
    };

    switch (gameType) {
      case 'memory-scripture':
        return <MemoryScriptureGame {...gameProps} />;
      case 'memory-temple':
        return <MemoryTempleGame {...gameProps} />;
      // TODO: 實現其他遊戲類型
      case 'reaction-rhythm':
        return <ReactionRhythmGame {...gameProps} />;
      case 'reaction-lighting':
        return <ReactionLightingGame {...gameProps} />;
      case 'logic-scripture':
        return <LogicScriptureGame {...gameProps} />;
      case 'logic-sequence':
        return <LogicSequenceGame {...gameProps} />;
      default:
        return <div className="text-center p-8 text-elderly-lg">未知遊戲類型</div>;
    }
  };

  const religionData = RELIGIOUS_CONTENT[userReligion as keyof typeof RELIGIOUS_CONTENT] || RELIGIOUS_CONTENT.buddhism;
  const gameInfo = GAME_TYPES[gameType];
  
  // 調試輸出 - 確保宗教內容正確
  console.log('遊戲容器 - 當前宗教:', userReligion, '宗教名稱:', religionData?.name);

  return (
    <div className="min-h-screen bg-warm-bg">
      {/* 標題欄 */}
      <div className="bg-white shadow-sm border-b border-warm-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={handleBackToStory}
                className="text-warm-gray-600 hover:text-warm-brown"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                返回故事
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  console.log('點擊主頁按鈕');
                  window.location.href = '/';
                }}
                className="text-warm-gray-600 hover:text-warm-brown"
              >
                <Home className="w-5 h-5 mr-2" />
                主頁
              </Button>
            </div>
            
            <div className="text-center">
              <h1 className="text-elderly-xl font-bold text-warm-gold">
                第{gameLevel}關：{gameInfo?.name}
              </h1>
              <p className="text-elderly-base text-warm-gray-600">
                {religionData?.name} - 第{Math.ceil(gameLevel / 6)}章
              </p>
            </div>
            
            <div className="text-right">
              <p className="text-elderly-base text-warm-gray-600">
                難度等級：{difficulty.chapter}/5
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 遊戲內容 */}
      {!isComplete ? (
        renderGame()
      ) : (
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 text-center">
            <div className="text-6xl mb-4">
              {currentStars === 3 ? '🌟' : currentStars === 2 ? '⭐' : currentStars === 1 ? '⭐' : '💫'}
            </div>
            <h2 className="text-elderly-2xl font-bold text-warm-gold mb-2">
              遊戲完成！
            </h2>
            <p className="text-elderly-lg text-warm-gray-700 mb-4">
              獲得 {currentStars} 顆星
            </p>
            <p className="text-elderly-base text-warm-gray-600 mb-6">
              最終得分：{currentScore}分
            </p>
            
            <div className="flex flex-col space-y-3">
              {gameLevel < 30 && (
                <Button
                  onClick={handleNextLevel}
                  className="bg-warm-gold text-white hover:bg-yellow-600 text-elderly-base py-3"
                >
                  下一關
                </Button>
              )}
              <Button
                onClick={handleBackToStory}
                variant="outline"
                className="border-warm-gold text-warm-gold hover:bg-warm-gold hover:text-white text-elderly-base py-3"
              >
                返回故事
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}