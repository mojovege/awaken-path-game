import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowUp, ArrowDown, Puzzle, CheckCircle, Lightbulb, BookOpen } from 'lucide-react';
import GameRulesModal from '../game-rules-modal';
import { getDifficultyForLevel } from '@/lib/game-logic';

interface LogicGameProps {
  onScore: (points: number) => void;
  onComplete: () => void;
  religion: string;
  gameType: string;
  level?: number;
}

interface SequenceItem {
  id: number;
  content: string;
  order: number;
  currentPosition: number;
}

const LogicGame: React.FC<LogicGameProps> = ({ onScore, onComplete, religion, gameType, level = 1 }) => {
  const difficulty = getDifficultyForLevel(level);
  
  const [gameStarted, setGameStarted] = useState(false);
  const [sequences, setSequences] = useState<SequenceItem[]>([]);
  const [completed, setCompleted] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showRules, setShowRules] = useState(false);
  const [showStory, setShowStory] = useState(false);

  const getGameContent = () => {
    if (gameType === 'logic-scripture') {
      // Scripture interpretation
      switch (religion) {
        case 'buddhism':
          // 根據章節選擇不同難度的內容
          if (difficulty.chapter <= 2) {
            return [
              { content: '念佛', order: 1 },
              { content: '慈悲', order: 2 },
              { content: '善心', order: 3 },
              { content: '平安', order: 4 },
            ];
          } else {
            return [
              { content: '苦', order: 1 },
              { content: '集', order: 2 },
              { content: '滅', order: 3 },
              { content: '道', order: 4 },
            ];
          }
        case 'taoism':
          // 根據章節選擇不同難度的內容
          if (difficulty.chapter <= 2) {
            return [
              { content: '養生', order: 1 },
              { content: '自然', order: 2 },
              { content: '和諧', order: 3 },
              { content: '平衡', order: 4 },
            ];
          } else {
            return [
              { content: '道生一', order: 1 },
              { content: '一生二', order: 2 },
              { content: '二生三', order: 3 },
              { content: '三生萬物', order: 4 },
            ];
          }
        case 'mazu':
          // 根據章節選擇不同難度的內容
          if (difficulty.chapter <= 2) {
            return [
              { content: '平安', order: 1 },
              { content: '健康', order: 2 },
              { content: '順利', order: 3 },
              { content: '保佑', order: 4 },
            ];
          } else {
            return [
              { content: '誠心祈求', order: 1 },
              { content: '媽祖庇佑', order: 2 },
              { content: '化險為夷', order: 3 },
              { content: '平安歸來', order: 4 },
            ];
          }
        default:
          return [];
      }
    } else {
      // Wisdom sequence - 與記憶配對遊戲內容統一
      switch (religion) {
        case 'buddhism':
          // 根據章節選擇不同難度的內容
          if (difficulty.chapter <= 2) {
            return [
              { content: '感恩', order: 1 },
              { content: '健康', order: 2 },
              { content: '念佛', order: 3 },
              { content: '慈悲', order: 4 },
            ];
          } else {
            return [
              { content: '聞', order: 1 },
              { content: '思', order: 2 },
              { content: '修', order: 3 },
              { content: '證', order: 4 },
            ];
          }
        case 'taoism':
          // 根據章節選擇不同難度的內容
          if (difficulty.chapter <= 2) {
            return [
              { content: '清心', order: 1 },
              { content: '長壽', order: 2 },
              { content: '養生', order: 3 },
              { content: '自然', order: 4 },
            ];
          } else {
            return [
              { content: '立志', order: 1 },
              { content: '修心', order: 2 },
              { content: '煉神', order: 3 },
              { content: '得道', order: 4 },
            ];
          }
        case 'mazu':
          // 根據章節選擇不同難度的內容
          if (difficulty.chapter <= 2) {
            return [
              { content: '幸福', order: 1 },
              { content: '安全', order: 2 },
              { content: '平安', order: 3 },
              { content: '健康', order: 4 },
            ];
          } else {
            return [
              { content: '出海', order: 1 },
              { content: '祈福', order: 2 },
              { content: '航行', order: 3 },
              { content: '歸港', order: 4 },
            ];
          }
        default:
          return [];
      }
    }
  };

  const getStoryContent = () => {
    if (gameType === 'logic-scripture') {
      // Scripture interpretation stories
      switch (religion) {
        case 'buddhism':
          if (difficulty.chapter <= 2) {
            return {
              title: '佛教基礎修行',
              content: `在佛教的修行路上，我們需要按照正確的順序來培養心靈：

1. 念佛 - 專心念誦佛號，淨化心靈
2. 慈悲 - 培養對眾生的慈悲心
3. 善心 - 保持善良的心念
4. 平安 - 達到內心的平靜安寧

這個順序幫助我們從基礎的修行開始，逐步提升心靈境界，最終獲得內心的平安。`
            };
          } else {
            return {
              title: '四聖諦的智慧',
              content: `四聖諦是佛教的核心教義，揭示了生命的真相：

1. 苦 - 認識生命中存在的苦難
2. 集 - 了解苦難的根源和成因
3. 滅 - 知道苦難是可以消除的
4. 道 - 學習消除苦難的方法

按照這個順序理解，我們能夠從認識問題到解決問題，獲得真正的解脫。`
            };
          }
        case 'taoism':
          if (difficulty.chapter <= 2) {
            return {
              title: '道教養生之道',
              content: `道教重視身心的和諧統一，養生有其順序：

1. 養生 - 注重身體的保養
2. 自然 - 順應自然的規律
3. 和諧 - 追求內外的和諧
4. 平衡 - 達到陰陽的平衡

這個過程讓我們從關注身體開始，逐步達到與自然的和諧統一。`
            };
          } else {
            return {
              title: '道生萬物的奧秘',
              content: `老子在《道德經》中揭示了宇宙生成的過程：

1. 道生一 - 道是萬物的根源，生出太極
2. 一生二 - 太極分化為陰陽兩儀
3. 二生三 - 陰陽交合產生第三者
4. 三生萬物 - 從而化生出萬事萬物

這個順序說明了從無到有、從簡單到複雜的宇宙演化過程。`
            };
          }
        case 'mazu':
          if (difficulty.chapter <= 2) {
            return {
              title: '媽祖的祝福',
              content: `信仰媽祖的人們祈求的祝福有其順序：

1. 平安 - 首先祈求基本的平安
2. 健康 - 身體的健康康泰
3. 順利 - 事事順心如意
4. 保佑 - 得到媽祖的庇護

這個順序體現了從基本需求到更高願望的祈求過程。`
            };
          } else {
            return {
              title: '祈福的正確流程',
              content: `向媽祖祈福有著傳統的流程：

1. 誠心祈求 - 帶著真誠的心意向媽祖祈求
2. 媽祖庇佑 - 相信媽祖會給予保護
3. 化險為夷 - 在媽祖的庇護下度過難關
4. 平安歸來 - 最終平安順利地回到家中

這個流程體現了完整的祈福過程，從祈求到實現的全過程。`
            };
          }
        default:
          return { title: '智慧排序', content: '按照正確的順序排列元素。' };
      }
    } else {
      // Wisdom sequence stories
      switch (religion) {
        case 'buddhism':
          if (difficulty.chapter <= 2) {
            return {
              title: '佛教基礎智慧',
              content: `佛教修行者培養智慧的基礎步驟：

1. 感恩 - 學會感恩現有的一切
2. 健康 - 保持身心的健康
3. 念佛 - 通過念佛淨化心靈
4. 慈悲 - 培養慈悲的胸懷

這個順序幫助我們從基本的感恩之心開始，逐步提升到慈悲的境界。`
            };
          } else {
            return {
              title: '聞思修證的智慧',
              content: `佛教修行的四個階段：

1. 聞 - 聽聞佛法，學習教義
2. 思 - 思考理解所學的內容
3. 修 - 通過實修來體驗佛法
4. 證 - 最終證得佛法的真理

這是佛教修行的完整過程，從學習到實證的全程。`
            };
          }
        case 'taoism':
          if (difficulty.chapter <= 2) {
            return {
              title: '道教基礎修行',
              content: `道教修行者的基礎修養：

1. 清心 - 保持心靈的清淨
2. 長壽 - 追求身體的長壽
3. 養生 - 實踐養生的方法
4. 自然 - 達到順應自然的境界

這個過程從內心修養開始，最終達到與自然和諧統一。`
            };
          } else {
            return {
              title: '修道的四個階段',
              content: `道教修行者的進階過程：

1. 立志 - 確立修道的志向
2. 修心 - 修煉內心的品格
3. 煉神 - 煉化精神的境界
4. 得道 - 最終得道成仙

這是從立志到得道的完整修煉過程。`
            };
          }
        case 'mazu':
          if (difficulty.chapter <= 2) {
            return {
              title: '媽祖信仰的智慧',
              content: `媽祖信仰帶給人們的智慧：

1. 幸福 - 追求內心的幸福
2. 安全 - 獲得生活的安全感
3. 平安 - 保持生活的平安
4. 健康 - 維護身體的健康

這個順序體現了從精神到物質的全面祈求。`
            };
          } else {
            return {
              title: '航海的智慧流程',
              content: `漁民出海的傳統流程：

1. 出海 - 帶著希望出海捕魚
2. 祈福 - 向媽祖祈求保佑
3. 航行 - 在媽祖的庇護下航行
4. 歸港 - 平安滿載而歸

這個流程體現了漁民生活的智慧和對媽祖的信仰。`
            };
          }
        default:
          return { title: '智慧排序', content: '按照正確的順序排列元素。' };
      }
    }
  };

  useEffect(() => {
    if (gameStarted) {
      const content = getGameContent();
      let shuffled;
      let attempts = 0;
      
      // 確保打亂後的序列不等於正確答案，最多嘗試10次
      do {
        shuffled = content
          .map((item, index) => ({
            ...item,
            id: index,
            currentPosition: index,
          }))
          .sort(() => Math.random() - 0.5)
          .map((item, index) => ({
            ...item,
            currentPosition: index,
          }));
        attempts++;
      } while (
        attempts < 10 && 
        shuffled.every((item, index) => item.order === index + 1)
      );
      
      // 如果10次都是正確順序，手動打亂
      if (shuffled.every((item, index) => item.order === index + 1)) {
        // 簡單交換第一個和第二個元素
        if (shuffled.length >= 2) {
          [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]];
          shuffled = shuffled.map((item, index) => ({
            ...item,
            currentPosition: index,
          }));
        }
      }
      
      console.log('Generated logic sequence:', { 
        original: content.map(item => item.content), 
        shuffled: shuffled.map(item => item.content),
        isAlreadyCorrect: shuffled.every((item, index) => item.order === index + 1)
      });
      
      setSequences(shuffled);
      setCompleted(false);
      setAttempts(0);
    }
  }, [gameStarted]);

  useEffect(() => {
    if (sequences.length > 0 && !completed) {
      checkCompletion();
    }
  }, [sequences, completed]);

  const startGame = () => {
    setGameStarted(true);
    setCompleted(false);
    setAttempts(0);
  };

  const moveItem = (id: number, direction: 'up' | 'down') => {
    if (completed) return; // 防止完成後繼續操作
    
    setAttempts(prev => prev + 1);
    
    setSequences(prev => {
      const currentIndex = prev.findIndex(item => item.id === id);
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      
      if (newIndex < 0 || newIndex >= prev.length) return prev;
      
      const newSequences = [...prev];
      [newSequences[currentIndex], newSequences[newIndex]] = 
      [newSequences[newIndex], newSequences[currentIndex]];
      
      return newSequences.map((item, index) => ({
        ...item,
        currentPosition: index,
      }));
    });
  };

  const checkCompletion = () => {
    if (sequences.length === 0 || completed) return;
    
    const isComplete = sequences.every((item, index) => item.order === index + 1);
    
    if (isComplete) {
      setCompleted(true);
      const score = Math.max(50, 200 - (attempts * 10));
      onScore(score);
      setTimeout(onComplete, 2500); // 給用戶更多時間看結果
    }
  };

  const getGameTitle = () => {
    if (gameType === 'logic-scripture') {
      switch (religion) {
        case 'buddhism': return '四聖諦排序';
        case 'taoism': return '道德經排序';
        case 'mazu': return '祈福流程排序';
        default: return '智慧排序';
      }
    } else {
      switch (religion) {
        case 'buddhism': return '修行次第排序';
        case 'taoism': return '修道程序排序';
        case 'mazu': return '航海流程排序';
        default: return '智慧排序';
      }
    }
  };

  const getInstruction = () => {
    if (gameType === 'logic-scripture') {
      switch (religion) {
        case 'buddhism': return '將四聖諦按照正確順序排列';
        case 'taoism': return '將道生萬物的過程按順序排列';
        case 'mazu': return '將祈福流程按正確順序排列';
        default: return '按正確順序排列';
      }
    } else {
      switch (religion) {
        case 'buddhism': return '將修行步驟按正確次第排列';
        case 'taoism': return '將修道程序按正確順序排列';
        case 'mazu': return '將航海流程按正確順序排列';
        default: return '按正確順序排列';
      }
    }
  };

  if (!gameStarted) {
    const storyContent = getStoryContent();
    
    return (
      <>
        <div className="text-center space-y-6">
          <div className="text-8xl mb-4">🧩</div>
          <h3 className="text-elderly-xl font-semibold text-gray-800">
            {getGameTitle()}
          </h3>
          
          <p className="text-elderly-base text-gray-600 max-w-md mx-auto leading-relaxed">
            {getInstruction()}
          </p>

          <div className="flex flex-col gap-4 max-w-xs mx-auto">
            <Button 
              onClick={startGame}
              className="text-elderly-base py-6 bg-blue-600 hover:bg-blue-700"
            >
              <Puzzle className="w-6 h-6 mr-3" />
              開始遊戲
            </Button>
            
            <Dialog open={showStory} onOpenChange={setShowStory}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="text-elderly-base py-6 border-2 border-green-500 text-green-700 hover:bg-green-50"
                >
                  <BookOpen className="w-6 h-6 mr-3" />
                  故事提示
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-elderly-lg font-semibold text-center">
                    {storyContent.title}
                  </DialogTitle>
                </DialogHeader>
                <div className="mt-6">
                  <div className="text-elderly-base leading-relaxed whitespace-pre-line text-gray-700">
                    {storyContent.content}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button 
              variant="outline" 
              onClick={() => setShowRules(true)}
              className="text-elderly-base py-6 border-2"
            >
              <Lightbulb className="w-6 h-6 mr-3" />
              遊戲規則
            </Button>
          </div>
        </div>

        <GameRulesModal 
          isOpen={showRules}
          onClose={() => setShowRules(false)}
          gameType={gameType}
          religion={religion}
        />
      </>
    );
  }

  if (completed) {
    return (
      <div className="text-center space-y-6">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
        <h3 className="text-elderly-xl font-semibold text-green-600">
          完成！
        </h3>
        <p className="text-elderly-base text-warm-gray-600">
          恭喜你正確排列了順序！
        </p>
        <div className="space-y-2">
          {sequences.map((item, index) => (
            <div 
              key={item.id}
              className="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-center"
            >
              <span className="text-elderly-base font-medium">
                {index + 1}. {item.content}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const storyContent = getStoryContent();
  
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-elderly-lg font-semibold text-gray-800">
          {getInstruction()}
        </h3>
        <p className="text-elderly-sm text-warm-gray-600">
          嘗試次數: {attempts}
        </p>
        
        <Dialog open={showStory} onOpenChange={setShowStory}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              className="text-elderly-sm py-2 px-4 border border-green-500 text-green-700 hover:bg-green-50"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              故事提示
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-elderly-lg font-semibold text-center">
                {storyContent.title}
              </DialogTitle>
            </DialogHeader>
            <div className="mt-6">
              <div className="text-elderly-base leading-relaxed whitespace-pre-line text-gray-700">
                {storyContent.content}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3 max-w-sm mx-auto">
        {sequences.map((item, index) => (
          <div 
            key={item.id}
            className={`
              bg-white border-2 rounded-xl p-4 flex items-center justify-between
              ${item.order === index + 1 
                ? 'border-green-500 bg-green-50' 
                : 'border-warm-gray-200'
              }
            `}
          >
            <div className="flex items-center space-x-3">
              <span className="w-8 h-8 rounded-full bg-warm-gray-100 flex items-center justify-center text-elderly-sm font-medium">
                {index + 1}
              </span>
              <span className="text-elderly-base font-medium">
                {item.content}
              </span>
            </div>
            
            <div className="flex flex-col space-y-1">
              <Button
                onClick={() => moveItem(item.id, 'up')}
                disabled={index === 0}
                variant="outline"
                size="sm"
                className="w-10 h-10 p-0"
                data-testid={`button-move-up-${item.id}`}
              >
                <ArrowUp className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => moveItem(item.id, 'down')}
                disabled={index === sequences.length - 1}
                variant="outline"
                size="sm"
                className="w-10 h-10 p-0"
                data-testid={`button-move-down-${item.id}`}
              >
                <ArrowDown className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <p className="text-center text-elderly-sm text-warm-gray-600">
        使用上下箭頭調整順序，綠色表示位置正確
      </p>
    </div>
  );
};

export default LogicGame;