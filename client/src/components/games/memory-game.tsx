import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Brain } from 'lucide-react';

interface MemoryGameProps {
  onScore: (points: number) => void;
  onComplete: () => void;
  religion: string;
  gameType: string;
}

interface Card {
  id: number;
  content: string;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const MemoryGame: React.FC<MemoryGameProps> = ({ onScore, onComplete, religion, gameType }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [studyPhase, setStudyPhase] = useState(true);
  const [studyTime, setStudyTime] = useState(8);
  const [attempts, setAttempts] = useState(0);
  const [matches, setMatches] = useState(0);

  const getGameContent = () => {
    if (gameType === 'memory-scripture') {
      // Scripture memory matching
      switch (religion) {
        case 'buddhism':
          return [
            { content: '色即是空', emoji: '🌸' },
            { content: '空即是色', emoji: '🌸' },
            { content: '諸行無常', emoji: '🍃' },
            { content: '是生滅法', emoji: '🍃' },
            { content: '慈悲為懷', emoji: '❤️' },
            { content: '普度眾生', emoji: '❤️' },
          ];
        case 'taoism':
          return [
            { content: '道法自然', emoji: '🌿' },
            { content: '無為而治', emoji: '🌿' },
            { content: '上善若水', emoji: '💧' },
            { content: '利萬物', emoji: '💧' },
            { content: '清靜無為', emoji: '🌙' },
            { content: '返璞歸真', emoji: '🌙' },
          ];
        case 'mazu':
          return [
            { content: '救苦救難', emoji: '🌊' },
            { content: '保佑平安', emoji: '🌊' },
            { content: '慈悲濟世', emoji: '⭐' },
            { content: '福澤眾生', emoji: '⭐' },
            { content: '海上守護', emoji: '🚢' },
            { content: '航行平安', emoji: '🚢' },
          ];
        default:
          return [];
      }
    } else {
      // Temple/location memory
      switch (religion) {
        case 'buddhism':
          return [
            { content: '大雄寶殿', emoji: '🏛️' },
            { content: '主殿', emoji: '🏛️' },
            { content: '天王殿', emoji: '🏮' },
            { content: '入口殿', emoji: '🏮' },
            { content: '觀音殿', emoji: '🪷' },
            { content: '側殿', emoji: '🪷' },
          ];
        case 'taoism':
          return [
            { content: '三清殿', emoji: '⛩️' },
            { content: '主殿', emoji: '⛩️' },
            { content: '玉皇殿', emoji: '👑' },
            { content: '天庭', emoji: '👑' },
            { content: '太歲殿', emoji: '🌟' },
            { content: '祈福處', emoji: '🌟' },
          ];
        case 'mazu':
          return [
            { content: '媽祖殿', emoji: '🛶' },
            { content: '正殿', emoji: '🛶' },
            { content: '觀音殿', emoji: '🙏' },
            { content: '配殿', emoji: '🙏' },
            { content: '鐘樓', emoji: '🔔' },
            { content: '祈福塔', emoji: '🔔' },
          ];
        default:
          return [];
      }
    }
  };

  useEffect(() => {
    if (gameStarted && !studyPhase) {
      const content = getGameContent();
      const gameCards = content.map((item, index) => ({
        id: index,
        content: item.content,
        emoji: item.emoji,
        isFlipped: false,
        isMatched: false,
      }));
      
      // Shuffle cards
      const shuffled = [...gameCards].sort(() => Math.random() - 0.5);
      setCards(shuffled);
    }
  }, [gameStarted, studyPhase]);

  // Study phase timer
  useEffect(() => {
    if (studyPhase && gameStarted && studyTime > 0) {
      const timer = setTimeout(() => {
        setStudyTime(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (studyPhase && studyTime === 0) {
      setStudyPhase(false);
    }
  }, [studyPhase, studyTime, gameStarted]);

  // Check for matches
  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards;
      const firstCard = cards[first];
      const secondCard = cards[second];
      
      setAttempts(prev => prev + 1);
      
      if (firstCard.emoji === secondCard.emoji) {
        // Match found
        setCards(prev => prev.map(card => 
          card.id === firstCard.id || card.id === secondCard.id
            ? { ...card, isMatched: true }
            : card
        ));
        
        setMatches(prev => prev + 1);
        onScore(100 - (attempts * 5)); // Higher score for fewer attempts
        
        setFlippedCards([]);
        
        // Check if game is complete
        if (matches + 1 === cards.length / 2) {
          setTimeout(onComplete, 1000);
        }
      } else {
        // No match, flip back after delay
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === firstCard.id || card.id === secondCard.id
              ? { ...card, isFlipped: false }
              : card
          ));
          setFlippedCards([]);
        }, 1500);
      }
    }
  }, [flippedCards, cards, attempts, matches]);

  const startGame = () => {
    setGameStarted(true);
    setStudyPhase(true);
    setStudyTime(8);
    setAttempts(0);
    setMatches(0);
  };

  const flipCard = (cardId: number) => {
    if (studyPhase || flippedCards.length >= 2) return;
    
    const card = cards[cardId];
    if (card.isFlipped || card.isMatched) return;
    
    setCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    ));
    
    setFlippedCards(prev => [...prev, cardId]);
  };

  const getGameTitle = () => {
    return gameType === 'memory-scripture' ? '經文記憶配對' : '寺廟導覽記憶';
  };

  if (!gameStarted) {
    return (
      <div className="text-center space-y-6">
        <div className="text-8xl mb-4">🧠</div>
        <h3 className="text-elderly-xl font-semibold text-gray-800">
          {getGameTitle()}
        </h3>
        <p className="text-elderly-base text-warm-gray-600">
          記住配對內容，訓練記憶力和專注力
        </p>
        <Button 
          onClick={startGame}
          className="btn-primary text-elderly-base px-8 py-3"
          data-testid="button-start-memory"
        >
          <Brain className="w-5 h-5 mr-2" />
          開始訓練
        </Button>
      </div>
    );
  }

  if (studyPhase) {
    const content = getGameContent();
    return (
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Eye className="w-6 h-6 text-warm-gold" />
          <h3 className="text-elderly-xl font-semibold text-gray-800">
            記住這些配對
          </h3>
        </div>
        
        <div className="text-elderly-2xl font-bold text-warm-gold mb-4">
          {studyTime}秒
        </div>
        
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          {content.map((item, index) => (
            <div 
              key={index}
              className="bg-warm-gray-50 rounded-xl p-4 border-2 border-warm-gray-200"
            >
              <div className="text-3xl mb-2">{item.emoji}</div>
              <div className="text-elderly-base font-medium">{item.content}</div>
            </div>
          ))}
        </div>
        
        <p className="text-elderly-sm text-warm-gray-600">
          仔細記住每個配對，等等要找出相同的圖標
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="text-center">
          <p className="text-elderly-sm text-warm-gray-600">嘗試次數</p>
          <p className="text-elderly-xl font-bold text-warm-gold">{attempts}</p>
        </div>
        <div className="text-center">
          <p className="text-elderly-sm text-warm-gray-600">配對成功</p>
          <p className="text-elderly-xl font-bold text-sage-green">{matches}/{cards.length / 2}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => flipCard(card.id)}
            disabled={studyPhase || card.isMatched || flippedCards.length >= 2}
            className={`
              aspect-square rounded-xl border-2 transition-all duration-300 transform hover:scale-105
              ${card.isMatched 
                ? 'bg-green-100 border-green-500' 
                : card.isFlipped 
                ? 'bg-white border-warm-gold' 
                : 'bg-warm-gray-100 border-warm-gray-200 hover:border-warm-gold'
              }
            `}
            data-testid={`card-${card.id}`}
          >
            {card.isFlipped || card.isMatched ? (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="text-2xl mb-1">{card.emoji}</div>
                <div className="text-elderly-xs text-center px-1">{card.content}</div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <EyeOff className="w-6 h-6 text-warm-gray-400" />
              </div>
            )}
          </button>
        ))}
      </div>

      <p className="text-center text-elderly-sm text-warm-gray-600">
        點擊卡片找出相同圖標的配對
      </p>
    </div>
  );
};

export default MemoryGame;