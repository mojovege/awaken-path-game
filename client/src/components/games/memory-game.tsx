import React, { useState, useEffect } from 'react';
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

  const getGameContent = () => {
    // 將邏輯乘以2來讓故事內容更豐富
    const pairsNeeded = Math.floor(difficulty.gridSize / 2) * 2;
    const allContent = getFullGameContent();
    return allContent.slice(0, pairsNeeded);
  };

  const getFullGameContent = () => {
    if (gameType === 'memory-scripture') {
      // Scripture memory matching
      switch (religion) {
        case 'buddhism':
          return [
            { content: '色即是空', emoji: '🌸' },
            { content: '諸行無常', emoji: '🍃' },
            { content: '慈悲為懷', emoji: '❤️' },
            { content: '因果循環', emoji: '🔄' },
            { content: '四聖諦理', emoji: '🧘' },
            { content: '八正道行', emoji: '🛤️' },
            { content: '三寶皈依', emoji: '🙏' },
            { content: '六波羅蜜', emoji: '⭐' },
            { content: '十二因緣', emoji: '🔗' },
            { content: '涅槃寂靜', emoji: '🌙' },
            { content: '般若智慧', emoji: '💎' },
            { content: '慈悲喜捨', emoji: '🤲' },
            { content: '戒定慧學', emoji: '📿' },
            { content: '五蘊皆空', emoji: '🌀' },
            { content: '三十七道品', emoji: '🌟' },
            { content: '菩提心願', emoji: '🌺' },
            { content: '正法眼藏', emoji: '👁️' },
            { content: '禪定解脫', emoji: '🕯️' },
            { content: '功德圓滿', emoji: '✨' },
            { content: '慧眼明心', emoji: '👀' },
            { content: '法輪常轉', emoji: '☸️' },
            { content: '慈航普度', emoji: '⛵' },
            { content: '萬法歸一', emoji: '🎯' },
            { content: '佛性本然', emoji: '🪬' },
          ];
        case 'taoism':
          return [
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
            { content: '五氣朝元', emoji: '🌬️' },
            { content: '周天運化', emoji: '🌀' },
            { content: '虛無大道', emoji: '⭕' },
            { content: '混元一氣', emoji: '🌌' },
            { content: '太上忘情', emoji: '🤍' },
            { content: '真人境界', emoji: '👤' },
          ];
        case 'mazu':
          return [
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
            { content: '航海平安', emoji: '⚓' },
            { content: '港口安寧', emoji: '🏘️' },
            { content: '信眾虔誠', emoji: '🙏' },
            { content: '香火鼎盛', emoji: '🕯️' },
            { content: '神恩浩蕩', emoji: '🌅' },
            { content: '福澤綿延', emoji: '🌸' },
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

  useEffect(() => {
    if (gameStarted && !studyPhase && cards.length === 0) {
      const content = getGameContent();
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
      const shuffled = [...gameCards].sort(() => Math.random() - 0.5);
      setCards(shuffled);
    }
  }, [gameStarted, studyPhase, level, gameType, religion]);

  // Study phase timer
  useEffect(() => {
    if (studyPhase && gameStarted && studyTime > 0) {
      const timer = setTimeout(() => {
        setStudyTime(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (studyPhase && gameStarted && studyTime === 0) {
      setStudyPhase(false);
    }
  }, [studyPhase, studyTime, gameStarted]);

  // Check for matches
  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards;
      const firstCard = cards.find(c => c.id === first);
      const secondCard = cards.find(c => c.id === second);
      
      if (!firstCard || !secondCard) return;
      
      setAttempts(prev => prev + 1);
      
      if (firstCard.content === secondCard.content && firstCard.emoji === secondCard.emoji) {
        // Match found
        setCards(prev => prev.map(card => 
          card.id === firstCard.id || card.id === secondCard.id
            ? { ...card, isMatched: true }
            : card
        ));
        
        const newMatches = matches + 1;
        setMatches(newMatches);
        onScore(100 - (attempts * 5)); // Higher score for fewer attempts
        
        setFlippedCards([]);
        
        // Check if game is complete
        if (newMatches === cards.length / 2) {
          setTimeout(onComplete, 1500);
        }
      } else {
        // No match, flip back after longer delay for elderly users
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === firstCard.id || card.id === secondCard.id
              ? { ...card, isFlipped: false }
              : card
          ));
          setFlippedCards([]);
        }, 2500); // 增加到2.5秒讓用戶看清楚
      }
    }
  }, [flippedCards, cards, matches, attempts, onScore, onComplete]);

  const startGame = () => {
    setCards([]); // 重置卡片
    setFlippedCards([]);
    setGameStarted(true);
    setStudyPhase(true);
    setStudyTime(difficulty.memoryTime);
    setAttempts(0);
    setMatches(0);
    setShowRules(false);
  };

  const flipCard = (cardId: number) => {
    if (studyPhase || flippedCards.length >= 2) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;
    
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
      <>
        <div className="text-center space-y-6">
          <div className="text-8xl mb-4">🧠</div>
          <h3 className="text-elderly-xl font-semibold text-gray-800">
            {getGameTitle()}
          </h3>
          <p className="text-elderly-base text-warm-gray-600">
            記住配對內容，訓練記憶力和專注力
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={() => setShowRules(true)}
              variant="outline"
              className="text-elderly-base px-8 py-3"
              data-testid="button-show-rules"
            >
              <Lightbulb className="w-5 h-5 mr-2" />
              遊戲說明
            </Button>
            <Button 
              onClick={startGame}
              className="btn-primary text-elderly-base px-8 py-3"
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

      <div className={`grid gap-3 max-w-lg mx-auto ${
        difficulty.gridSize <= 6 ? 'grid-cols-3' : 
        difficulty.gridSize <= 12 ? 'grid-cols-4' : 
        difficulty.gridSize <= 20 ? 'grid-cols-5' : 'grid-cols-6'
      }`}>
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