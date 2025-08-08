import React, { useState, useEffect } from 'react';
import { RELIGIOUS_CONTENT, GameDifficulty, calculateStarRating, GAME_TYPES } from '@/lib/game-config';

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

export default function MemoryScriptureGame({ religion, difficulty, onGameComplete }: MemoryScriptureGameProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const religionData = RELIGIOUS_CONTENT[religion as keyof typeof RELIGIOUS_CONTENT];
  const maxScore = GAME_TYPES['memory-scripture'].getMaxScore(difficulty);

  useEffect(() => {
    initializeCards();
  }, [religion, difficulty]);

  const initializeCards = () => {
    const concepts = religionData.concepts.slice(0, difficulty.elementCount);
    const newCards: Card[] = [];
    
    concepts.forEach((concept, index) => {
      newCards.push({
        id: newCards.length,
        text: concept.text,
        type: 'concept',
        pairId: index,
        isFlipped: false,
        isMatched: false
      });
      newCards.push({
        id: newCards.length,
        text: concept.match,
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
    if (!gameStarted || selectedCards.length >= 2) return;
    
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
            setIsComplete(true);
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
    setGameStarted(true);
    setScore(0);
    setAttempts(0);
    setIsComplete(false);
    initializeCards();
  };

  return (
    <div className="min-h-screen bg-warm-bg p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-elderly-2xl font-bold text-warm-gold mb-4">
            {religionData.name}經文概念配對
          </h2>
          
          {!gameStarted && (
            <div className="mb-6">
              <p className="text-elderly-lg text-warm-gray-600 mb-4">
                點擊兩張卡片，找出相關概念的配對
              </p>
              <p className="text-elderly-base text-warm-gray-500">
                配對數量：{difficulty.elementCount}對 | 每對得分：20分
              </p>
            </div>
          )}

          {gameStarted && (
            <div className="mb-6">
              <p className="text-elderly-lg text-green-600 font-bold">
                得分：{score} / {maxScore} | 嘗試次數：{attempts} | 
                已配對：{cards.filter(c => c.isMatched).length / 2} / {difficulty.elementCount}
              </p>
            </div>
          )}
        </div>

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
              style={{ 
                transform: card.isFlipped || card.isMatched ? 'rotateY(0deg)' : 'rotateY(180deg)',
                transformStyle: 'preserve-3d'
              }}
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