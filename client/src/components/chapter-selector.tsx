import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Star, Lock, Play } from 'lucide-react';
import { getChapterForLevel } from '@/lib/game-logic';

interface ChapterSelectorProps {
  userStars: number;
  currentLevel: number;
  onLevelSelect: (level: number) => void;
  onClose: () => void;
  religion: string;
}

interface ChapterInfo {
  id: number;
  title: string;
  levels: number[];
  requiredStars: number;
  description: string;
}

const ChapterSelector: React.FC<ChapterSelectorProps> = ({ 
  userStars, 
  currentLevel, 
  onLevelSelect, 
  onClose,
  religion 
}) => {
  
  const getChapters = (): ChapterInfo[] => {
    const baseChapters: ChapterInfo[] = [
      {
        id: 1,
        title: '初心啟蒙',
        levels: [1, 2, 3],
        requiredStars: 0,
        description: '開始修行之路，學習基礎知識'
      },
      {
        id: 2,
        title: '勤修精進',
        levels: [4, 5, 6],
        requiredStars: 6,
        description: '持續修行，技能逐步提升'
      },
      {
        id: 3,
        title: '智慧開悟',
        levels: [7, 8, 9],
        requiredStars: 12,
        description: '開始領悟更深層的智慧'
      },
      {
        id: 4,
        title: '深度修行',
        levels: [10, 11, 12],
        requiredStars: 18,
        description: '修行進入更深層次'
      },
      {
        id: 5,
        title: '圓滿境界',
        levels: [13, 14, 15],
        requiredStars: 24,
        description: '達到修行的最高境界'
      }
    ];

    return baseChapters;
  };

  const chapters = getChapters();

  const getReligionEmoji = () => {
    switch (religion) {
      case 'buddhism': return '🧘‍♂️';
      case 'taoism': return '☯️';
      case 'mazu': return '🌊';
      default: return '🙏';
    }
  };

  const isChapterUnlocked = (chapter: ChapterInfo) => {
    return userStars >= chapter.requiredStars;
  };

  const getCurrentChapter = () => {
    return chapters.find(ch => ch.levels.includes(currentLevel)) || chapters[0];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-warm-gray-100">
          <div className="flex items-center space-x-4">
            <div className="text-4xl">{getReligionEmoji()}</div>
            <div>
              <h2 className="text-elderly-xl font-semibold text-gray-800">
                選擇修行章節
              </h2>
              <p className="text-elderly-sm text-warm-gray-600">
                當前星數：{userStars} ⭐
              </p>
            </div>
          </div>
          <Button 
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="rounded-full"
            data-testid="button-close-chapter-selector"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Chapters */}
        <div className="p-6 space-y-4">
          {chapters.map((chapter) => {
            const isUnlocked = isChapterUnlocked(chapter);
            const isCurrent = getCurrentChapter()?.id === chapter.id;
            
            return (
              <Card 
                key={chapter.id}
                className={`transition-all duration-200 ${
                  isCurrent 
                    ? 'ring-2 ring-warm-gold bg-warm-gold bg-opacity-5' 
                    : isUnlocked 
                    ? 'hover:shadow-md cursor-pointer' 
                    : 'opacity-50'
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-elderly-base font-semibold ${
                        isUnlocked 
                          ? 'bg-warm-gold text-white' 
                          : 'bg-gray-300 text-gray-500'
                      }`}>
                        {isUnlocked ? (
                          chapter.id
                        ) : (
                          <Lock className="w-5 h-5" />
                        )}
                      </div>
                      
                      <div>
                        <h3 className="text-elderly-lg font-semibold text-gray-800">
                          第{chapter.id}章：{chapter.title}
                        </h3>
                        <p className="text-elderly-sm text-warm-gray-600">
                          {chapter.description}
                        </p>
                        {!isUnlocked && (
                          <p className="text-elderly-sm text-orange-600 mt-1">
                            需要 {chapter.requiredStars} 顆星解鎖
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Levels in Chapter */}
                  {isUnlocked && (
                    <div className="flex flex-wrap gap-2">
                      {chapter.levels.map((level) => (
                        <Button
                          key={level}
                          onClick={() => {
                            onLevelSelect(level);
                            onClose();
                          }}
                          variant={level === currentLevel ? "default" : "outline"}
                          size="sm"
                          className="text-elderly-sm min-w-[60px]"
                          data-testid={`button-level-${level}`}
                        >
                          <Play className="w-3 h-3 mr-1" />
                          第{level}關
                        </Button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-warm-gray-100 bg-warm-gray-50">
          <div className="text-center">
            <p className="text-elderly-sm text-warm-gray-600 mb-2">
              完成遊戲獲得星數，解鎖更多章節
            </p>
            <div className="flex justify-center space-x-6 text-elderly-sm text-warm-gray-500">
              <span>⭐ 1星：60-79分</span>
              <span>⭐⭐ 2星：80-89分</span>
              <span>⭐⭐⭐ 3星：90-100分</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterSelector;