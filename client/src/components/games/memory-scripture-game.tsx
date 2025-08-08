import React, { useState, useEffect } from 'react';
import { RELIGIOUS_CONTENT, GameDifficulty, calculateStarRating, GAME_TYPES } from '@/lib/game-config';
import BackgroundMusic from '../audio/background-music';

interface MemoryScriptureGameProps {
  religion: string;
  difficulty: GameDifficulty;
  onGameComplete: (score: number, stars: number) => void;
}

interface Card {
  id: number;
  text: string;
  type: 'concept' | 'meaning';
  pairId: number;
  isFlipped: boolean;
  isMatched: boolean;
}

interface ConceptPair {
  concept: string;
  meaning: string;
}

export default function MemoryScriptureGame({ religion, difficulty, onGameComplete }: MemoryScriptureGameProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [gamePhase, setGamePhase] = useState<'waiting' | 'studying' | 'playing' | 'complete'>('waiting');
  const [studyPairs, setStudyPairs] = useState<ConceptPair[]>([]);
  const [studyTimeLeft, setStudyTimeLeft] = useState(0);

  const religionData = RELIGIOUS_CONTENT[religion as keyof typeof RELIGIOUS_CONTENT];
  const maxScore = GAME_TYPES['memory-scripture'].getMaxScore(difficulty);

  useEffect(() => {
    initializeGame();
  }, [religion, difficulty]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (gamePhase === 'studying' && studyTimeLeft > 0) {
      timer = setTimeout(() => setStudyTimeLeft(prev => prev - 1), 1000);
    } else if (gamePhase === 'studying' && studyTimeLeft === 0) {
      startCardGame();
    }
    
    return () => clearTimeout(timer);
  }, [gamePhase, studyTimeLeft]);

  const initializeGame = () => {
    const concepts = religionData.concepts.slice(0, difficulty.elementCount);
    const pairs: ConceptPair[] = concepts.map(concept => ({
      concept: concept.text,
      meaning: concept.match
    }));
    
    setStudyPairs(pairs);
  };

  const initializeCards = () => {
    const newCards: Card[] = [];
    
    studyPairs.forEach((pair, index) => {
      newCards.push({
        id: newCards.length,
        text: pair.concept,
        type: 'concept',
        pairId: index,
        isFlipped: false,
        isMatched: false
      });
      newCards.push({
        id: newCards.length,
        text: pair.meaning,
        type: 'meaning',
        pairId: index,
        isFlipped: false,
        isMatched: false
      });
    });

    // 洗牌
    for (let i = newCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newCards[i], newCards[j]] = [newCards[j], newCards[i]];
    }

    setCards(newCards);
  };

  const handleCardClick = (cardId: number) => {
    if (gamePhase !== 'playing' || selectedCards.length >= 2) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    // 翻開卡片
    setCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    ));

    const newSelected = [...selectedCards, cardId];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      setAttempts(prev => prev + 1);
      
      setTimeout(() => {
        const card1 = cards.find(c => c.id === newSelected[0]);
        const card2 = cards.find(c => c.id === newSelected[1]);
        
        if (card1 && card2 && card1.pairId === card2.pairId) {
          // 配對成功
          setCards(prev => prev.map(c => 
            newSelected.includes(c.id) ? { ...c, isMatched: true } : c
          ));
          setScore(prev => prev + 20);
          
          // 檢查是否完成
          const matchedCount = cards.filter(c => c.isMatched).length + 2;
          if (matchedCount === cards.length) {
            const finalScore = score + 20;
            const stars = calculateStarRating(finalScore, maxScore);
            setGamePhase('complete');
            onGameComplete(finalScore, stars);
          }
        } else {
          // 配對失敗，翻回去
          setCards(prev => prev.map(c => 
            newSelected.includes(c.id) ? { ...c, isFlipped: false } : c
          ));
        }
        
        setSelectedCards([]);
      }, 1000);
    }
  };

  const startGame = () => {
    setGamePhase('studying');
    setStudyTimeLeft(10); // 10秒學習時間
    setScore(0);
    setAttempts(0);
    initializeGame();
  };

  const startCardGame = () => {
    setGamePhase('playing');
    initializeCards();
  };

  return (
    <div className="min-h-screen bg-warm-bg p-6">
      <BackgroundMusic 
        audioType="zen" 
        isPlaying={gamePhase === 'playing' || gamePhase === 'studying'} 
      />
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-elderly-2xl font-bold text-warm-gold mb-4">
            {religionData.name}經文概念配對
          </h2>
          
          {gamePhase === 'waiting' && (
            <div className="mb-6">
              <p className="text-elderly-lg text-warm-gray-600 mb-4">
                先學習配對關係，然後進行翻牌配對
              </p>
              <p className="text-elderly-base text-warm-gray-500">
                配對數量：{difficulty.elementCount}對 | 每對得分：20分
              </p>
            </div>
          )}

          {gamePhase === 'studying' && (
            <div className="mb-6">
              <p className="text-elderly-lg text-blue-600 font-bold">
                請記住以下配對關係！剩餘時間：{studyTimeLeft}秒
              </p>
            </div>
          )}

          {gamePhase === 'playing' && (
            <div className="mb-6">
              <p className="text-elderly-lg text-green-600 font-bold">
                得分：{score} / {maxScore} | 嘗試次數：{attempts} | 
                已配對：{cards.filter(c => c.isMatched).length / 2} / {difficulty.elementCount}
              </p>
            </div>
          )}
        </div>

        {/* 學習階段：顯示配對關係 */}
        {gamePhase === 'studying' && (
          <div className="grid grid-cols-1 gap-4 mb-8 max-w-2xl mx-auto">
            {studyPairs.map((pair, index) => (
              <div
                key={index}
                className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 flex items-center justify-between"
              >
                <div className="text-elderly-lg font-bold text-blue-800">
                  {pair.concept}
                </div>
                <div className="text-elderly-2xl text-blue-600">↔</div>
                <div className="text-elderly-lg font-bold text-blue-800">
                  {pair.meaning}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 遊戲階段：翻牌配對 */}
        {gamePhase === 'playing' && (
          <div className="grid grid-cols-4 gap-4 mb-8">
            {cards.map(card => (
              <div
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                className={`
                  relative h-24 rounded-lg border-2 cursor-pointer transition-all duration-300
                  ${card.isMatched 
                    ? 'bg-green-100 border-green-400 shadow-lg' 
                    : card.isFlipped 
                      ? 'bg-yellow-100 border-yellow-400 shadow-md' 
                      : 'bg-warm-gray-100 border-warm-gray-300 hover:shadow-md'
                  }
                `}
              >
                <div className="absolute inset-0 flex items-center justify-center p-2">
                  {card.isFlipped || card.isMatched ? (
                    <span className="text-elderly-base font-bold text-center text-warm-gray-800">
                      {card.text}
                    </span>
                  ) : (
                    <span className="text-elderly-xl text-warm-gold">❓</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center">
          {gamePhase === 'waiting' ? (
            <button
              onClick={startGame}
              className="bg-warm-gold text-white px-8 py-4 rounded-lg text-elderly-lg font-bold hover:bg-yellow-600 transition-colors"
            >
              開始學習
            </button>
          ) : gamePhase === 'studying' ? (
            <p className="text-elderly-base text-warm-gray-600">
              請仔細記住這些配對關係，倒數{studyTimeLeft}秒後開始遊戲...
            </p>
          ) : gamePhase === 'complete' ? (
            <div>
              <p className="text-elderly-lg text-green-600 font-bold mb-4">
                恭喜完成！最終得分：{score}分
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
              點擊卡片尋找配對...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}