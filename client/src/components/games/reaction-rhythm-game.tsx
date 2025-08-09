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
  const [showHint, setShowHint] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const gameStartTimeRef = useRef<number>(0);

  const religionData = RELIGIOUS_CONTENT[religion as keyof typeof RELIGIOUS_CONTENT] || RELIGIOUS_CONTENT.buddhism;
  const maxScore = GAME_TYPES['reaction-rhythm'].getMaxScore(difficulty);
  const gameDuration = GAME_TYPES['reaction-rhythm'].getDuration(difficulty);
  
  // 調試輸出
  console.log('節奏遊戲 - 宗教:', religion, '宗教資料:', religionData?.name);
  console.log('節奏遊戲 - 難度:', difficulty, 'maxScore:', maxScore, '遊戲時長:', gameDuration + 's');

  // 移除這個useEffect，避免循環依賴
  // generateBeats 會在startGame中調用

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
    // 使用固定參數避免依賴問題
    const beatInterval = 1.5;
    const startTime = 2;
    const maxBeats = 8; // 固定8個節拍，簡化邏輯
    
    const newBeats: Beat[] = [];
    for (let i = 0; i < maxBeats; i++) {
      newBeats.push({
        time: startTime + (i * beatInterval),
        hit: false
      });
    }
    
    console.log('節拍生成完成:', newBeats.length, '個節拍');
    return newBeats;
  };

  const startGame = () => {
    console.log('開始節奏遊戲');
    
    // 重置狀態
    setCurrentTime(0);
    setScore(0);
    setHits(0);
    setMisses(0);
    setIsComplete(false);
    
    // 生成節拍
    const newBeats = generateBeats();
    setBeats(newBeats);
    
    // 開始遊戲
    setGameStarted(true);
    gameStartTimeRef.current = Date.now();
    
    // 播放節拍序列
    setTimeout(() => {
      playRhythmSequence(newBeats);
    }, 500);
  };

  const playBeatSound = async (delay: number = 0) => {
    setTimeout(async () => {
      if (gameStarted && !isComplete) {
        console.log('🥁 準備播放節拍音效，宗教:', religion, '延遲:', delay);
        try {
          const { SoundEffects } = await import('../audio/sound-effects');
          const success = await SoundEffects.playSound('beat', religion);
          if (!success) {
            console.error('❌ 節拍音效播放失敗');
          }
        } catch (error) {
          console.error('❌ 音效模塊載入失敗:', error);
        }
      }
    }, delay);
  };

  const playRhythmSequence = (beatSequence: Beat[]) => {
    if (!beatSequence || beatSequence.length === 0) {
      console.error('節拍序列為空，無法播放');
      return;
    }
    
    console.log('開始播放節拍序列，共', beatSequence.length, '個節拍');
    
    beatSequence.forEach((beat, index) => {
      const delay = beat.time * 1000;
      
      setTimeout(async () => {
        if (gameStarted && !isComplete) {
          console.log(`播放節拍 ${index + 1}/${beatSequence.length} (時間: ${beat.time.toFixed(1)}s)`);
          try {
            const { SoundEffects } = await import('../audio/sound-effects');
            await SoundEffects.playSound('beat', religion);
          } catch (error) {
            console.error('節拍音效播放失敗:', error);
          }
        }
      }, delay);
    });
  };

  const handleBeatClick = () => {
    if (!gameStarted || isComplete || beats.length === 0) return;
    
    console.log('點擊節拍，當前時間:', currentTime.toFixed(2), 's');
    
    // 找到最近的未命中節拍
    const availableBeats = beats.filter(beat => !beat.hit);
    
    if (availableBeats.length === 0) {
      console.log('所有節拍已被命中');
      return;
    }
    
    const nearestBeat = availableBeats.reduce((closest, beat) => {
      const currentDist = Math.abs(beat.time - currentTime);
      const closestDist = closest ? Math.abs(closest.time - currentTime) : Infinity;
      return currentDist < closestDist ? beat : closest;
    }, null as Beat | null);
    
    if (!nearestBeat) return;
    
    const timeDiff = Math.abs(nearestBeat.time - currentTime);
    const reactionWindowSeconds = difficulty.reactionWindow / 1000;
    
    console.log('檢查節拍命中:', {
      節拍時間: nearestBeat.time.toFixed(2),
      當前時間: currentTime.toFixed(2),
      時間差: timeDiff.toFixed(3),
      反應窗口: reactionWindowSeconds.toFixed(3),
      是否命中: timeDiff <= reactionWindowSeconds
    });
    
    if (timeDiff <= reactionWindowSeconds) {
      // 命中成功
      const accuracy = Math.max(0, 1 - timeDiff / reactionWindowSeconds);
      const points = Math.floor(accuracy * 15); // 最高15分每拍
      
      setBeats(prev => prev.map(beat => 
        beat === nearestBeat ? { ...beat, hit: true, accuracy } : beat
      ));
      
      setScore(prev => prev + points);
      setHits(prev => prev + 1);
      
      console.log('節拍命中成功！準確度:', (accuracy * 100).toFixed(1) + '%', '得分:', points);
      
      // 播放成功音效
      import('../audio/sound-effects').then(({ SoundEffects }) => {
        SoundEffects.playSound('success', religion);
      });
    } else {
      // 錯誤點擊
      setScore(prev => Math.max(0, prev - 2));
      setMisses(prev => prev + 1);
      
      console.log('節拍錯過，扣2分');
      
      // 播放錯誤音效
      import('../audio/sound-effects').then(({ SoundEffects }) => {
        SoundEffects.playSound('error', religion);
      });
    }
  };

  const completeGame = () => {
    setIsComplete(true);
    
    // 計算未命中的節拍
    const missedBeats = beats.filter(beat => !beat.hit).length;
    const hitBeats = beats.filter(beat => beat.hit).length;
    setMisses(prev => prev + missedBeats);
    
    console.log('節奏遊戲完成 - 命中節拍:', hitBeats, '總節拍:', beats.length);
    console.log('節奏遊戲完成 - 最終分數:', score, '最高分數:', maxScore);
    console.log('節奏遊戲星級計算:', { score, maxScore, percentage: (score / maxScore) * 100 });
    
    const stars = calculateStarRating(score, maxScore);
    console.log('節奏遊戲獲得星級:', stars);
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
            {religion === 'buddhism' ? '🥢' : religion === 'taoism' ? '🥁' : religion === 'mazu' ? '🌊' : '🎵'}
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