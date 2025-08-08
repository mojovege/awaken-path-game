import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { RELIGIOUS_CONTENT, GameDifficulty, calculateStarRating, GAME_TYPES } from '@/lib/game-config';

interface FixedRhythmGameProps {
  religion: string;
  difficulty: GameDifficulty;
  onGameComplete: (score: number, stars: number) => void;
}

export default function FixedRhythmGame({ religion, difficulty, onGameComplete }: FixedRhythmGameProps) {
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [hits, setHits] = useState(0);
  const [gameTime, setGameTime] = useState(20);
  const [isComplete, setIsComplete] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [totalBeats] = useState(8);
  
  const religionData = RELIGIOUS_CONTENT[religion as keyof typeof RELIGIOUS_CONTENT] || RELIGIOUS_CONTENT.buddhism;
  const maxScore = totalBeats * 15; // 每拍最高15分
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const beatTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startGame = () => {
    console.log('開始節奏遊戲');
    setGameStarted(true);
    setScore(0);
    setHits(0);
    setCurrentBeat(0);
    setGameTime(20);
    setIsComplete(false);
    
    // 開始遊戲計時
    timerRef.current = setInterval(() => {
      setGameTime(prev => {
        if (prev <= 1) {
          completeGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // 開始節拍計時
    beatTimerRef.current = setInterval(() => {
      setCurrentBeat(prev => {
        if (prev >= totalBeats - 1) {
          return 0; // 循環
        }
        return prev + 1;
      });
    }, 2000); // 每2秒一個節拍
  };

  const handleBeatClick = () => {
    if (!gameStarted || isComplete) return;
    
    // 簡化：每次點擊都得分
    const points = 15;
    setScore(prev => prev + points);
    setHits(prev => prev + 1);
    
    console.log('節拍命中，得分:', points);
  };

  const completeGame = () => {
    setIsComplete(true);
    setGameStarted(false);
    
    if (timerRef.current) clearInterval(timerRef.current);
    if (beatTimerRef.current) clearInterval(beatTimerRef.current);
    
    const stars = calculateStarRating(score, maxScore);
    console.log('節奏遊戲完成 - 分數:', score, '星級:', stars);
    
    setTimeout(() => onGameComplete(score, stars), 1000);
  };

  return (
    <div className="min-h-screen bg-warm-bg p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-elderly-2xl font-bold text-warm-gold mb-4">
            {religionData.name}節奏跟隨訓練
          </h2>
          
          {gameStarted && (
            <div className="mb-6">
              <p className="text-elderly-lg text-green-600 font-bold">
                得分：{score} | 命中：{hits} | 時間：{gameTime}秒
              </p>
            </div>
          )}
        </div>

        {/* 節拍顯示 */}
        <div className="flex justify-center mb-8">
          <div className="grid grid-cols-4 gap-4">
            {Array.from({length: totalBeats}, (_, i) => (
              <div
                key={i}
                className={`w-16 h-16 rounded-full border-4 flex items-center justify-center font-bold ${
                  i === currentBeat && gameStarted
                    ? 'bg-warm-gold border-warm-gold text-white animate-pulse scale-110'
                    : 'bg-white border-gray-300 text-gray-500'
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* 點擊按鈕 */}
        <div className="text-center mb-8">
          <button
            onClick={handleBeatClick}
            disabled={!gameStarted || isComplete}
            className={`w-32 h-32 rounded-full text-4xl font-bold transition-all duration-150 ${
              gameStarted && !isComplete
                ? 'bg-warm-gold text-white hover:scale-110 active:scale-95 shadow-lg cursor-pointer'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {religion === 'buddhism' ? '🥢' : religion === 'taoism' ? '🥁' : '🌊'}
          </button>
          <p className="mt-4 text-elderly-base text-warm-gray-600">
            {gameStarted && !isComplete ? '跟隨節拍點擊' : '準備開始'}
          </p>
        </div>

        {/* 控制按鈕 */}
        <div className="text-center">
          {!gameStarted ? (
            <Button
              onClick={startGame}
              className="bg-warm-gold text-white px-8 py-4 text-elderly-lg font-bold hover:bg-yellow-600"
            >
              開始遊戲
            </Button>
          ) : isComplete ? (
            <div>
              <p className="text-elderly-lg text-green-600 font-bold mb-4">
                遊戲完成！得分：{score}分
              </p>
              <Button
                onClick={startGame}
                className="bg-warm-gold text-white px-8 py-4 text-elderly-lg font-bold hover:bg-yellow-600"
              >
                再玩一次
              </Button>
            </div>
          ) : (
            <p className="text-elderly-base text-warm-gray-600">
              跟隨節拍點擊按鈕
            </p>
          )}
        </div>
      </div>
    </div>
  );
}