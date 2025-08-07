import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Brain, Lightbulb } from 'lucide-react';
import GameRulesModal from '../game-rules-modal';
import { getDifficultyForLevel } from '@/lib/game-logic';

interface MemoryGameProps {
  onScore: (points: number) => void;
  onComplete: () => void;
  religion: string;
  gameType: string;
  level?: number;
}

interface Card {
  id: number;
  content: string;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const MemoryGame: React.FC<MemoryGameProps> = ({ onScore, onComplete, religion, gameType, level = 1 }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [studyPhase, setStudyPhase] = useState(true);
  const [studyTime, setStudyTime] = useState(8);
  const [attempts, setAttempts] = useState(0);
  const [matches, setMatches] = useState(0);
  const [showRules, setShowRules] = useState(false);
  
  const difficulty = getDifficultyForLevel(level);

  const getFullGameContent = () => {
    console.log(`🔍 Memory Game Debug: religion="${religion}", gameType="${gameType}", level=${level}`);
    
    if (gameType === 'memory-scripture') {
      // Scripture memory matching
      switch (religion) {
        case 'buddhism':
          return [
            // 初心啟蒙：基礎簡單概念
            { content: '念佛', emoji: '🙏' },
            { content: '慈悲', emoji: '❤️' },
            { content: '善心', emoji: '💝' },
            { content: '平安', emoji: '🕊️' },
            { content: '感恩', emoji: '🤲' },
            { content: '健康', emoji: '💪' },
            // 進階內容 - 與邏輯遊戲統一
            { content: '苦', emoji: '😔' },
            { content: '集', emoji: '🔗' },
            { content: '滅', emoji: '🌅' },
            { content: '道', emoji: '🛤️' },
            { content: '聞', emoji: '👂' },
            { content: '思', emoji: '🤔' },
            { content: '修', emoji: '🧘' },
            { content: '證', emoji: '✨' },
            { content: '色即是空', emoji: '🌸' },
            { content: '諸行無常', emoji: '🍃' },
            { content: '因果循環', emoji: '🔄' },
            { content: '三寶皈依', emoji: '🙏' },
            { content: '六波羅蜜', emoji: '⭐' },
            { content: '十二因緣', emoji: '🔗' },
            { content: '涅槃寂靜', emoji: '🌙' },
            { content: '般若智慧', emoji: '💎' },
            { content: '慈悲喜捨', emoji: '🤲' },
            { content: '戒定慧學', emoji: '📿' },
          ];
        case 'taoism':
          return [
            // 初心啟蒙：基礎簡單概念
            { content: '養生', emoji: '💪' },
            { content: '自然', emoji: '🌿' },
            { content: '和諧', emoji: '☯️' },
            { content: '平衡', emoji: '⚖️' },
            { content: '清心', emoji: '💙' },
            { content: '長壽', emoji: '🏔️' },
            // 進階內容
            { content: '道法自然', emoji: '🌿' },
            { content: '上善若水', emoji: '💧' },
            { content: '清靜無為', emoji: '🌙' },
            { content: '陰陽調和', emoji: '☯️' },
            { content: '五行相生', emoji: '🌟' },
            { content: '太極生兩儀', emoji: '🎭' },
            { content: '無為而治', emoji: '🌊' },
            { content: '返璞歸真', emoji: '🌱' },
            { content: '天人合一', emoji: '🌈' },
            { content: '長生久視', emoji: '🏔️' },
            { content: '逍遙遊世', emoji: '🦋' },
            { content: '至虛極守', emoji: '⚪' },
            { content: '得道昇仙', emoji: '🕊️' },
            { content: '煉氣化神', emoji: '🌪️' },
            { content: '內丹修真', emoji: '💊' },
            { content: '外丹長生', emoji: '⚗️' },
            { content: '玄元妙道', emoji: '🔮' },
            { content: '三花聚頂', emoji: '🌸' },
          ];
        case 'mazu':
          return [
            // 初心啟蒙：基礎簡單概念
            { content: '平安', emoji: '🏠' },
            { content: '健康', emoji: '💪' },
            { content: '順利', emoji: '🏆' },
            { content: '保佑', emoji: '🙏' },
            { content: '幸福', emoji: '💝' },
            { content: '安全', emoji: '🚗' },
            // 進階內容
            { content: '救苦救難', emoji: '🌊' },
            { content: '慈悲濟世', emoji: '⭐' },
            { content: '海上守護', emoji: '🚢' },
            { content: '風調雨順', emoji: '🌤️' },
            { content: '國泰民安', emoji: '🏮' },
            { content: '漁獲豐收', emoji: '🐟' },
            { content: '闔家平安', emoji: '🏠' },
            { content: '身體健康', emoji: '💪' },
            { content: '學業進步', emoji: '📚' },
            { content: '事業順利', emoji: '🏆' },
            { content: '姻緣美滿', emoji: '💝' },
            { content: '出入平安', emoji: '🚗' },
            { content: '千里眼護', emoji: '👁️' },
            { content: '順風耳佑', emoji: '👂' },
            { content: '天后慈航', emoji: '⛵' },
            { content: '媽祖顯靈', emoji: '✨' },
            { content: '海神庇護', emoji: '🔱' },
            { content: '漁民守護', emoji: '🎣' },
          ];
        default:
          return [];
      }
    } else {
      // Temple/location memory
      console.log(`🏛️ Temple Memory: About to switch on religion="${religion}"`);
      
      switch (religion) {
        case 'buddhism':
          return [
            { content: '大雄寶殿', emoji: '🏛️' },
            { content: '天王殿', emoji: '🏮' },
            { content: '觀音殿', emoji: '🪷' },
            { content: '藏經樓', emoji: '📚' },
            { content: '鐘樓', emoji: '🔔' },
            { content: '鼓樓', emoji: '🥁' },
            { content: '禪堂', emoji: '🧘' },
            { content: '齋堂', emoji: '🍜' },
            { content: '客堂', emoji: '🏠' },
            { content: '方丈室', emoji: '🏡' },
            { content: '法堂', emoji: '⚖️' },
            { content: '念佛堂', emoji: '🙏' },
            { content: '地藏殿', emoji: '🌍' },
            { content: '文殊殿', emoji: '📖' },
            { content: '普賢殿', emoji: '🐘' },
            { content: '韋陀殿', emoji: '⚔️' },
            { content: '伽藍殿', emoji: '👮' },
            { content: '羅漢堂', emoji: '👨‍🦳' },
            { content: '舍利塔', emoji: '🗼' },
            { content: '萬佛塔', emoji: '🏯' },
            { content: '蓮花池', emoji: '🪷' },
            { content: '菩提樹', emoji: '🌳' },
            { content: '山門殿', emoji: '🚪' },
            { content: '香客寮', emoji: '🏨' },
          ];
        case 'taoism':
          console.log(`✅ Returning Taoism temple content`);
          return [
            { content: '三清殿', emoji: '⛩️' },
            { content: '玉皇殿', emoji: '👑' },
            { content: '太歲殿', emoji: '🌟' },
            { content: '文昌殿', emoji: '📝' },
            { content: '財神殿', emoji: '💰' },
            { content: '藥王殿', emoji: '💊' },
            { content: '呂祖殿', emoji: '⚔️' },
            { content: '王母殿', emoji: '👸' },
            { content: '鬥姆殿', emoji: '✨' },
            { content: '雷祖殿', emoji: '⚡' },
            { content: '慈航殿', emoji: '🛶' },
            { content: '斗姥殿', emoji: '🌌' },
            { content: '老君殿', emoji: '👴' },
            { content: '元始殿', emoji: '🌅' },
            { content: '通天殿', emoji: '🌠' },
            { content: '紫微殿', emoji: '🔮' },
            { content: '北極殿', emoji: '🧭' },
            { content: '南斗殿', emoji: '⭐' },
            { content: '丹房', emoji: '⚗️' },
            { content: '藥圃', emoji: '🌿' },
            { content: '道經樓', emoji: '📜' },
            { content: '修真洞', emoji: '🕳️' },
            { content: '八卦亭', emoji: '☯️' },
            { content: '五行台', emoji: '🎭' },
          ];
        case 'mazu':
          return [
            { content: '媽祖殿', emoji: '🛶' },
            { content: '觀音殿', emoji: '🙏' },
            { content: '鐘樓', emoji: '🔔' },
            { content: '天后宮', emoji: '👑' },
            { content: '千里眼殿', emoji: '👁️' },
            { content: '順風耳殿', emoji: '👂' },
            { content: '福德殿', emoji: '🍀' },
            { content: '註生娘娘殿', emoji: '👶' },
            { content: '文昌帝君殿', emoji: '📖' },
            { content: '關聖帝君殿', emoji: '⚔️' },
            { content: '月老殿', emoji: '💕' },
            { content: '城隍殿', emoji: '🏰' },
            { content: '開台聖王殿', emoji: '🏛️' },
            { content: '保生大帝殿', emoji: '💊' },
            { content: '三山國王殿', emoji: '🏔️' },
            { content: '虎爺廟', emoji: '🐅' },
            { content: '土地公廟', emoji: '🌾' },
            { content: '水仙王殿', emoji: '🌊' },
            { content: '海龍王殿', emoji: '🐲' },
            { content: '航海祈福廳', emoji: '⚓' },
            { content: '漁民會館', emoji: '🎣' },
            { content: '香客大廳', emoji: '🏢' },
            { content: '祈願牆', emoji: '🧱' },
            { content: '平安橋', emoji: '🌉' },
          ];
        default:
          return [];
      }
    }
  };

  // Generate cards for the game
  const generateCards = useCallback(() => {
    console.log(`🔍 Memory Game Debug: religion="${religion}", gameType="${gameType}", level=${level}`);
    
    // Get all available content based on religion and game type
    const allContent = getFullGameContent();
    
    // Calculate pairs needed based on difficulty
    let pairsNeeded;
    if (difficulty.chapter === 1) {
      pairsNeeded = Math.max(2, Math.floor(difficulty.gridSize / 3));
    } else {
      pairsNeeded = Math.floor(difficulty.gridSize / 2) * Math.min(2, difficulty.chapter * 0.5);
    }
    
    const content = allContent.slice(0, pairsNeeded);
    console.log(`Level ${level}: Generated ${content.length} pairs for memory game`, content.map(c => c.content));
    
    const gameCards = content.flatMap((item, index) => [
      {
        id: index * 2,
        content: item.content,
        emoji: item.emoji,
        isFlipped: false,
        isMatched: false,
      },
      {
        id: index * 2 + 1,
        content: item.content,
        emoji: item.emoji,
        isFlipped: false,
        isMatched: false,
      }
    ]);
    
    // Shuffle cards
    return [...gameCards].sort(() => Math.random() - 0.5);
  }, [level, gameType, religion, difficulty.chapter, difficulty.gridSize]);

  // Initialize cards on game start
  useEffect(() => {
    if (gameStarted && !studyPhase) {
      const newCards = generateCards();
      setCards(newCards);
      setMatches(0);
      setAttempts(0);
    }
  }, [gameStarted, studyPhase, generateCards]);

  // Study phase timer
  useEffect(() => {
    if (studyPhase && gameStarted && studyTime > 0) {
      const timer = setTimeout(() => setStudyTime(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (studyPhase && studyTime === 0) {
      setStudyPhase(false);
    }
  }, [studyPhase, studyTime, gameStarted]);

  const startGame = () => {
    setGameStarted(true);
    setStudyPhase(true);
    // Calculate study time based on level: level 1 = 8s, level 15 = 2s
    const calculatedTime = Math.max(2, 10 - Math.floor(level / 2));
    setStudyTime(calculatedTime);
  };

  const flipCard = (cardId: number) => {
    if (flippedCards.length === 2) return;
    if (flippedCards.includes(cardId)) return;
    if (cards[cardId]?.isMatched) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setAttempts(prev => prev + 1);
      const [firstId, secondId] = newFlippedCards;
      const firstCard = cards[firstId];
      const secondCard = cards[secondId];

      if (firstCard.content === secondCard.content) {
        // Match found
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === firstId || card.id === secondId 
              ? { ...card, isMatched: true }
              : card
          ));
          setMatches(prev => prev + 1);
          setFlippedCards([]);
          
          // Calculate score based on attempts and level
          const baseScore = 50;
          const levelBonus = level * 5;
          const attemptPenalty = Math.max(0, (attempts - 1) * 5);
          const finalScore = Math.max(10, baseScore + levelBonus - attemptPenalty);
          onScore(finalScore);
          
          // Check if game is complete
          if (matches + 1 >= cards.length / 2) {
            setTimeout(() => onComplete(), 500);
          }
        }, 1000);
      } else {
        // No match
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  if (!gameStarted) {
    return (
      <>
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Brain className="w-8 h-8 text-warm-gold" />
            <h2 className="text-elderly-2xl font-bold text-warm-gold">
              {gameType === 'memory-scripture' ? '經文配對記憶' : '寺廟導覽記憶'}
            </h2>
          </div>
          
          <p className="text-elderly-base text-warm-gray-600 max-w-md mx-auto leading-relaxed">
            {gameType === 'memory-scripture' 
              ? '記住經文概念的配對，然後在記憶中找出相同的內容' 
              : '記住寺廟建築的名稱和位置，訓練你的空間記憶能力'
            }
          </p>
          
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => setShowRules(true)}
              variant="outline"
              className="text-elderly-base px-6 py-3"
              data-testid="button-rules-memory"
            >
              <Lightbulb className="w-5 h-5 mr-2" />
              遊戲說明
            </Button>
            
            <Button
              onClick={startGame}
              className="bg-warm-gold hover:bg-warm-gold/80 text-warm-brown text-elderly-base px-6 py-3"
              data-testid="button-start-memory"
            >
              <Brain className="w-5 h-5 mr-2" />
              開始訓練
            </Button>
          </div>
        </div>

        {showRules && (
          <GameRulesModal
            gameType={gameType}
            level={level}
            religion={religion}
            difficulty={{
              memoryTime: difficulty.memoryTime,
              reactionWindow: difficulty.reactionWindow,
              gridSize: difficulty.gridSize,
              sequenceLength: difficulty.sequenceLength,
              hintsAvailable: difficulty.hintsAvailable,
            }}
            onStart={startGame}
            onClose={() => setShowRules(false)}
          />
        )}
      </>
    );
  }

  if (studyPhase) {
    const content = getFullGameContent().slice(0, Math.floor(difficulty.gridSize / 2));
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
          {content.map((item: any, index: number) => (
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

      <div className={`grid gap-3 max-w-lg mx-auto ${
        difficulty.gridSize <= 8 ? 'grid-cols-4' : 'grid-cols-4'
      }`}>
        {cards.map(card => (
          <button
            key={card.id}
            onClick={() => flipCard(card.id)}
            className={`aspect-square p-4 rounded-xl border-2 transition-all duration-300 ${
              card.isMatched 
                ? 'bg-sage-green/20 border-sage-green text-sage-green cursor-default'
                : flippedCards.includes(card.id)
                ? 'bg-warm-gold/20 border-warm-gold text-warm-gold'
                : 'bg-warm-gray-100 border-warm-gray-200 hover:border-warm-gold text-warm-brown'
            }`}
            disabled={card.isMatched || flippedCards.length === 2}
            data-testid={`card-${card.id}`}
          >
            {(flippedCards.includes(card.id) || card.isMatched) && (
              <div className="text-center">
                <div className="text-2xl mb-1">{card.emoji}</div>
                <div className="text-elderly-xs font-medium">{card.content}</div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MemoryGame;
