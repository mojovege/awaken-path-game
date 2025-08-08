import React, { useState, useEffect, useRef } from 'react';
import { RELIGIOUS_CONTENT, GameDifficulty, calculateStarRating, GAME_TYPES } from '@/lib/game-config';

interface ReactionRhythmGameProps {
  religion: string;
  difficulty: GameDifficulty;
  onGameComplete: (score: number, stars: number) => void;
}

interface Beat {
  time: number;
  hit: boolean;
  accuracy?: number;
}

export default function ReactionRhythmGame({ religion, difficulty, onGameComplete }: ReactionRhythmGameProps) {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [beats, setBeats] = useState<Beat[]>([]);
  const [score, setScore] = useState(0);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const gameStartTimeRef = useRef<number>(0);

  const religionData = RELIGIOUS_CONTENT[religion as keyof typeof RELIGIOUS_CONTENT];
  const maxScore = GAME_TYPES['reaction-rhythm'].getMaxScore(difficulty);
  const gameDuration = GAME_TYPES['reaction-rhythm'].getDuration(difficulty);

  useEffect(() => {
    generateBeats();
  }, [difficulty]);

  useEffect(() => {
    let animationFrame: number;
    
    if (gameStarted && !isComplete) {
      const updateTime = () => {
        const elapsed = (Date.now() - gameStartTimeRef.current) / 1000;
        setCurrentTime(elapsed);
        
        if (elapsed >= gameDuration) {
          completeGame();
        } else {
          animationFrame = requestAnimationFrame(updateTime);
        }
      };
      
      animationFrame = requestAnimationFrame(updateTime);
    }
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [gameStarted, isComplete, gameDuration]);

  const generateBeats = () => {
    const newBeats: Beat[] = [];
    const beatInterval = 1 / difficulty.speedMultiplier; // 基礎間隔為1秒，速度倍率影響間隔
    
    for (let time = 1; time < gameDuration; time += beatInterval) {
      // 添加一些隨機變化
      const variance = Math.random() * 0.2 - 0.1; // ±0.1秒變化
      newBeats.push({
        time: time + variance,
        hit: false
      });
    }
    
    setBeats(newBeats);
  };

  const startGame = () => {
    setGameStarted(true);
    setCurrentTime(0);
    setScore(0);
    setHits(0);
    setMisses(0);
    setIsComplete(false);
    gameStartTimeRef.current = Date.now();
    generateBeats();
    
    // 播放節拍序列
    setTimeout(() => playRhythmSequence(), 500);
  };

  const playBeatSound = (delay: number = 0) => {
    setTimeout(() => {
      if (gameStarted && !isComplete) {
        import('../audio/sound-effects').then(({ SoundEffects }) => {
          SoundEffects.playSound('beat', religion);
        });
      }
    }, delay);
  };

  const playRhythmSequence = () => {
    beats.forEach(beat => {
      playBeatSound(beat.time * 1000);
    });
  };

  const handleBeatClick = () => {
    if (!gameStarted || isComplete) return;
    
    // 找到最近的未命中節拍
    const nearestBeat = beats
      .filter(beat => !beat.hit)
      .reduce((closest, beat) => {
        const currentDist = Math.abs(beat.time - currentTime);
        const closestDist = closest ? Math.abs(closest.time - currentTime) : Infinity;
        return currentDist < closestDist ? beat : closest;
      }, null as Beat | null);
    
    if (nearestBeat && Math.abs(nearestBeat.time - currentTime) <= (difficulty.reactionWindow / 1000)) {
      const timeDiff = Math.abs(nearestBeat.time - currentTime);
      const accuracy = Math.max(0, 1 - timeDiff / (difficulty.reactionWindow / 1000));
      const points = Math.floor(accuracy * 15); // 最高15分每拍
      
      setBeats(prev => prev.map(beat => 
        beat === nearestBeat ? { ...beat, hit: true, accuracy } : beat
      ));
      
      setScore(prev => prev + points);
      setHits(prev => prev + 1);
      
      // 播放成功音效
      import('../audio/sound-effects').then(({ SoundEffects }) => {
        SoundEffects.playSound('success');
      });
    } else {
      // 錯誤點擊，扣分
      setScore(prev => Math.max(0, prev - 2));
      setMisses(prev => prev + 1);
      
      // 播放錯誤音效
      import('../audio/sound-effects').then(({ SoundEffects }) => {
        SoundEffects.playSound('error');
      });
    }
  };

  const completeGame = () => {
    setIsComplete(true);
    
    // 計算未命中的節拍
    const missedBeats = beats.filter(beat => !beat.hit).length;
    setMisses(prev => prev + missedBeats);
    
    const stars = calculateStarRating(score, maxScore);
    setTimeout(() => onGameComplete(score, stars), 1000);
  };

  const getAccuracy = () => {
    const totalBeats = beats.length;
    if (totalBeats === 0) return 0;
    return Math.round((hits / totalBeats) * 100);
  };

  return (
    <div className="min-h-screen bg-warm-bg p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-elderly-2xl font-bold text-warm-gold mb-4">
            {religionData.name}節奏跟隨訓練
          </h2>
          
          {!gameStarted && (
            <div className="mb-6">
              <p className="text-elderly-lg text-warm-gray-600 mb-4">
                跟隨{religion === 'buddhism' ? '木魚' : religion === 'taoism' ? '鼓聲' : '節拍'}的節奏點擊
              </p>
              <p className="text-elderly-base text-warm-gray-500">
                遊戲時間：{gameDuration}秒 | 反應窗口：{difficulty.reactionWindow}毫秒
              </p>
            </div>
          )}

          {gameStarted && (
            <div className="mb-6">
              <p className="text-elderly-lg text-green-600 font-bold">
                得分：{score} | 準確率：{getAccuracy()}% | 
                命中：{hits} | 失誤：{misses}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
                <div 
                  className="bg-warm-gold h-3 rounded-full transition-all duration-100"
                  style={{ width: `${(currentTime / gameDuration) * 100}%` }}
                ></div>
              </div>
              <p className="text-elderly-base text-warm-gray-600 mt-2">
                時間：{Math.floor(currentTime)}s / {gameDuration}s
              </p>
            </div>
          )}
        </div>

        {/* 節拍可視化 */}
        <div className="relative h-32 bg-white rounded-lg border-2 border-warm-gray-300 mb-8 overflow-hidden">
          {gameStarted && beats.map((beat, index) => {
            const position = ((currentTime - beat.time + 2) / 4) * 100; // 2秒預警時間
            
            if (position < -10 || position > 110) return null;
            
            return (
              <div
                key={index}
                className={`absolute w-4 h-4 rounded-full top-1/2 transform -translate-y-1/2 transition-all duration-100 ${
                  beat.hit 
                    ? beat.accuracy && beat.accuracy > 0.7 
                      ? 'bg-green-500' 
                      : 'bg-yellow-500'
                    : Math.abs(beat.time - currentTime) <= 0.5
                      ? 'bg-red-500 animate-pulse'
                      : 'bg-warm-gold'
                }`}
                style={{ left: `${100 - position}%` }}
              />
            );
          })}
          
          {/* 中央線 */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-red-500 transform -translate-x-1/2" />
        </div>

        {/* 點擊區域 */}
        <div className="text-center mb-8">
          <div
            onClick={handleBeatClick}
            className={`
              w-32 h-32 rounded-full text-elderly-2xl font-bold transition-all duration-150 cursor-pointer mx-auto flex items-center justify-center
              ${gameStarted && !isComplete
                ? 'bg-warm-gold text-white hover:bg-yellow-600 hover:scale-110 active:scale-95 shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
            style={{ 
              userSelect: 'none',
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none'
            }}
          >
            {religion === 'buddhism' ? '🥢' : religion === 'taoism' ? '🥁' : '🎵'}
          </div>
          <p className="text-elderly-base text-warm-gray-600 mt-4">
            {gameStarted && !isComplete ? '跟隨節拍點擊' : '等待開始'}
          </p>
        </div>

        <div className="text-center">
          {!gameStarted ? (
            <button
              onClick={startGame}
              className="bg-warm-gold text-white px-8 py-4 rounded-lg text-elderly-lg font-bold hover:bg-yellow-600 transition-colors"
            >
              開始遊戲
            </button>
          ) : isComplete ? (
            <div>
              <p className="text-elderly-lg text-green-600 font-bold mb-4">
                遊戲完成！最終得分：{score}分 | 準確率：{getAccuracy()}%
              </p>
              <button
                onClick={startGame}
                className="bg-warm-gold text-white px-8 py-4 rounded-lg text-elderly-lg font-bold hover:bg-yellow-600 transition-colors"
              >
                再玩一次
              </button>
            </div>
          ) : (
            <p className="text-elderly-base text-warm-gray-600">
              聽到節拍音效時點擊按鈕
            </p>
          )}
        </div>
      </div>
    </div>
  );
}