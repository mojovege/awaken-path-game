import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, Brain, Timer, Target, Lightbulb, Star, Clock } from "lucide-react";

interface GameRulesModalProps {
  gameType: string;
  level: number;
  religion: string;
  difficulty: {
    memoryTime: number;
    reactionWindow: number;
    gridSize: number;
    sequenceLength: number;
    hintsAvailable: number;
  };
  onStart: () => void;
  onClose: () => void;
}

export default function GameRulesModal({ 
  gameType, 
  level, 
  religion,
  difficulty,
  onStart, 
  onClose 
}: GameRulesModalProps) {
  const [currentPage, setCurrentPage] = useState(0);

  const getGameInfo = () => {
    switch (gameType) {
      case 'memory-scripture':
        return {
          title: '經文記憶配對',
          icon: '📖',
          description: '記住經文內容並找出相同的配對',
          rules: [
            '觀看階段：仔細記住每個經文與圖標的配對關係',
            `記憶時間：${difficulty.memoryTime}秒`,
            '遊戲階段：點擊卡片找出相同內容的配對',
            '配對成功會保持翻開狀態',
            '嘗試用最少次數完成所有配對'
          ],
          tips: [
            '專心記住圖標和經文的關聯',
            '可以按類型分組記憶',
            '先翻開容易記住的卡片',
            '保持耐心，慢慢思考'
          ]
        };
      case 'memory-temple':
        return {
          title: '寺廟導覽記憶',
          icon: '🏛️',
          description: '記住寺廟建築與位置的配對關係',
          rules: [
            '觀看階段：仔細記住每個建築物與圖標的配對',
            `記憶時間：${difficulty.memoryTime}秒`,
            '遊戲階段：點擊卡片找出相同的建築配對',
            '配對成功會保持翻開狀態',
            '完成所有配對即可過關'
          ],
          tips: [
            '記住建築的特色和位置',
            '聯想建築的功能幫助記憶',
            '按順序記憶會更容易',
            '多玩幾次會越來越熟練'
          ]
        };
      case 'reaction-rhythm':
        return {
          title: '敲木魚節奏',
          icon: '🥢',
          description: '跟隨節奏敲擊木魚，訓練反應能力',
          rules: [
            '遊戲會顯示節拍提示',
            `反應時間：${difficulty.reactionWindow}毫秒內點擊有效`,
            '點擊畫面中央的木魚進行敲擊',
            '準確敲擊可獲得高分和連擊',
            '錯過節拍會打斷連擊'
          ],
          tips: [
            '專注看節拍指示',
            '跟著音樂節奏感覺',
            '不要太早或太晚點擊',
            '保持穩定的節奏感'
          ]
        };
      case 'reaction-lighting':
        return {
          title: '祈福點燈',
          icon: '🪔',
          description: '記住點燈順序並正確重現',
          rules: [
            '觀看階段：記住燈籠亮起的順序',
            `序列長度：${difficulty.sequenceLength}個燈籠`,
            '重現階段：按相同順序點擊燈籠',
            '點錯順序會重新開始',
            '完成序列可進入下一輪'
          ],
          tips: [
            '專心觀察每盞燈的位置',
            '可以在心裡默念順序',
            '不要急躁，慢慢點擊',
            '記住燈籠的空間位置'
          ]
        };
      case 'logic-sequence':
        return {
          title: '智慧排序',
          icon: '🧩',
          description: '將打亂的項目按正確順序排列',
          rules: [
            '觀看打亂的項目列表',
            '使用上下按鈕調整項目位置',
            '按照邏輯順序重新排列',
            '排列正確即可完成',
            '嘗試次數越少分數越高'
          ],
          tips: [
            '先理解項目的邏輯關係',
            '可以分段整理',
            '確認每個項目的正確位置',
            '完成後檢查一遍順序'
          ]
        };
      default:
        return {
          title: '認知訓練',
          icon: '🧠',
          description: '提升認知能力的訓練遊戲',
          rules: ['按照提示完成遊戲任務'],
          tips: ['保持專注，慢慢練習']
        };
    }
  };

  const gameInfo = getGameInfo();
  const pages = [
    {
      title: '遊戲介紹',
      icon: <Brain className="w-8 h-8 text-warm-gold" />,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">{gameInfo.icon}</div>
            <h3 className="text-elderly-xl font-semibold text-gray-800 mb-2">
              {gameInfo.title}
            </h3>
            <p className="text-elderly-base text-warm-gray-600">
              {gameInfo.description}
            </p>
          </div>
          
          <div className="bg-warm-gold bg-opacity-10 rounded-xl p-6 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Star className="w-5 h-5 text-warm-gold" />
              <span className="text-elderly-lg font-semibold text-gray-800">
                第 {level} 關
              </span>
            </div>
            <p className="text-elderly-sm text-warm-gray-600">
              {religion === 'buddhism' ? '佛教修行' : religion === 'taoism' ? '道教養生' : '媽祖護佑'}
            </p>
          </div>
        </div>
      )
    },
    {
      title: '遊戲規則',
      icon: <Target className="w-8 h-8 text-ocean-blue" />,
      content: (
        <div className="space-y-4">
          <h4 className="text-elderly-lg font-semibold text-gray-800 mb-4">遊戲規則</h4>
          {gameInfo.rules.map((rule, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-ocean-blue bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-elderly-sm font-semibold text-ocean-blue">{index + 1}</span>
              </div>
              <p className="text-elderly-base text-gray-700">{rule}</p>
            </div>
          ))}
        </div>
      )
    },
    {
      title: '遊戲技巧',
      icon: <Lightbulb className="w-8 h-8 text-sage-green" />,
      content: (
        <div className="space-y-4">
          <h4 className="text-elderly-lg font-semibold text-gray-800 mb-4">遊戲技巧</h4>
          {gameInfo.tips.map((tip, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="text-sage-green mt-1">💡</div>
              <p className="text-elderly-base text-gray-700">{tip}</p>
            </div>
          ))}
          
          <div className="mt-6 p-4 bg-sage-green bg-opacity-10 rounded-xl">
            <div className="flex items-center space-x-2 mb-2">
              <Timer className="w-5 h-5 text-sage-green" />
              <span className="text-elderly-base font-semibold text-gray-800">本關設定</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-elderly-sm">
              {difficulty.memoryTime && (
                <div className="flex justify-between">
                  <span className="text-warm-gray-600">記憶時間：</span>
                  <span className="font-medium">{difficulty.memoryTime}秒</span>
                </div>
              )}
              {difficulty.reactionWindow && (
                <div className="flex justify-between">
                  <span className="text-warm-gray-600">反應時間：</span>
                  <span className="font-medium">{difficulty.reactionWindow}毫秒</span>
                </div>
              )}
              {difficulty.sequenceLength && (
                <div className="flex justify-between">
                  <span className="text-warm-gray-600">序列長度：</span>
                  <span className="font-medium">{difficulty.sequenceLength}個</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-warm-gray-600">提示次數：</span>
                <span className="font-medium">
                  {difficulty.hintsAvailable === 999 ? '不限' : `${difficulty.hintsAvailable}次`}
                </span>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const currentPageData = pages[currentPage];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            {currentPageData.icon}
            <h2 className="text-elderly-xl font-semibold text-gray-800">
              {currentPageData.title}
            </h2>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="w-10 h-10 rounded-full hover:bg-gray-100"
            data-testid="button-close-rules"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-96">
          {currentPageData.content}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center p-6 border-t border-gray-100">
          <div className="flex space-x-2">
            {pages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  currentPage === index ? 'bg-warm-gold' : 'bg-warm-gray-200'
                }`}
              />
            ))}
          </div>
          
          <div className="flex space-x-3">
            {currentPage > 0 && (
              <Button
                onClick={() => setCurrentPage(currentPage - 1)}
                variant="outline"
                className="text-elderly-base"
                data-testid="button-rules-prev"
              >
                上一頁
              </Button>
            )}
            
            {currentPage < pages.length - 1 ? (
              <Button
                onClick={() => setCurrentPage(currentPage + 1)}
                className="btn-primary text-elderly-base"
                data-testid="button-rules-next"
              >
                下一頁
              </Button>
            ) : (
              <Button
                onClick={onStart}
                className="btn-primary text-elderly-base px-8"
                data-testid="button-start-game"
              >
                <Clock className="w-5 h-5 mr-2" />
                開始遊戲
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}