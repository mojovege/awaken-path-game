import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, Puzzle, CheckCircle } from 'lucide-react';

interface LogicGameProps {
  onScore: (points: number) => void;
  onComplete: () => void;
  religion: string;
  gameType: string;
}

interface SequenceItem {
  id: number;
  content: string;
  order: number;
  currentPosition: number;
}

const LogicGame: React.FC<LogicGameProps> = ({ onScore, onComplete, religion, gameType }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const [sequences, setSequences] = useState<SequenceItem[]>([]);
  const [completed, setCompleted] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const getGameContent = () => {
    if (gameType === 'logic-scripture') {
      // Scripture interpretation
      switch (religion) {
        case 'buddhism':
          return [
            { content: '苦', order: 1 },
            { content: '集', order: 2 },
            { content: '滅', order: 3 },
            { content: '道', order: 4 },
          ];
        case 'taoism':
          return [
            { content: '道生一', order: 1 },
            { content: '一生二', order: 2 },
            { content: '二生三', order: 3 },
            { content: '三生萬物', order: 4 },
          ];
        case 'mazu':
          return [
            { content: '誠心祈求', order: 1 },
            { content: '媽祖庇佑', order: 2 },
            { content: '化險為夷', order: 3 },
            { content: '平安歸來', order: 4 },
          ];
        default:
          return [];
      }
    } else {
      // Wisdom sequence
      switch (religion) {
        case 'buddhism':
          return [
            { content: '聞', order: 1 },
            { content: '思', order: 2 },
            { content: '修', order: 3 },
            { content: '證', order: 4 },
          ];
        case 'taoism':
          return [
            { content: '立志', order: 1 },
            { content: '修心', order: 2 },
            { content: '煉神', order: 3 },
            { content: '得道', order: 4 },
          ];
        case 'mazu':
          return [
            { content: '出海', order: 1 },
            { content: '祈福', order: 2 },
            { content: '航行', order: 3 },
            { content: '歸港', order: 4 },
          ];
        default:
          return [];
      }
    }
  };

  useEffect(() => {
    if (gameStarted) {
      const content = getGameContent();
      // Shuffle the items
      const shuffled = content
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
      
      setSequences(shuffled);
    }
  }, [gameStarted]);

  useEffect(() => {
    if (sequences.length > 0) {
      checkCompletion();
    }
  }, [sequences]);

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
    return (
      <div className="text-center space-y-6">
        <div className="text-8xl mb-4">🧩</div>
        <h3 className="text-elderly-xl font-semibold text-gray-800">
          {getGameTitle()}
        </h3>
        <p className="text-elderly-base text-warm-gray-600">
          運用邏輯思考，將內容按正確順序排列
        </p>
        <Button 
          onClick={startGame}
          className="btn-primary text-elderly-base px-8 py-3"
          data-testid="button-start-logic"
        >
          <Puzzle className="w-5 h-5 mr-2" />
          開始思考
        </Button>
      </div>
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

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-elderly-lg font-semibold text-gray-800">
          {getInstruction()}
        </h3>
        <p className="text-elderly-sm text-warm-gray-600">
          嘗試次數: {attempts}
        </p>
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