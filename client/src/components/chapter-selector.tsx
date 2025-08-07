import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Lock, Trophy, ArrowRight } from 'lucide-react';
import { CHAPTERS, getDifficultyForLevel, isChapterUnlocked } from '@/lib/game-logic';

interface ChapterSelectorProps {
  userStars: number;
  currentLevel: number;
  onLevelSelect: (level: number) => void;
  onClose: () => void;
}

export default function ChapterSelector({ 
  userStars, 
  currentLevel, 
  onLevelSelect, 
  onClose 
}: ChapterSelectorProps) {
  const getStarsForLevel = (level: number): number => {
    // 這裡應該從用戶數據獲取，暫時返回模擬數據
    return level <= currentLevel ? Math.floor(Math.random() * 3) + 1 : 0;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-warm-gold to-sage-green p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-elderly-xl font-semibold mb-2">選擇修行章節</h2>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-300" />
                <span className="text-elderly-base">總共獲得 {userStars} 顆星</span>
              </div>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full"
              data-testid="button-close-chapter"
            >
              ✕
            </Button>
          </div>
        </div>

        {/* Chapters */}
        <div className="p-6 overflow-y-auto max-h-96">
          <div className="grid gap-6">
            {CHAPTERS.map((chapter, chapterIndex) => {
              const unlocked = isChapterUnlocked(chapterIndex, userStars);
              const chapterStars = chapter.levels.reduce((total, level) => total + getStarsForLevel(level), 0);
              const maxStars = chapter.levels.length * 3;

              return (
                <Card key={chapter.id} className={`transition-all duration-200 ${
                  unlocked ? 'hover:shadow-lg cursor-pointer' : 'opacity-50'
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-elderly-lg font-bold ${
                          unlocked ? 'bg-warm-gold text-white' : 'bg-gray-300 text-gray-500'
                        }`}>
                          {unlocked ? chapter.id : <Lock className="w-6 h-6" />}
                        </div>
                        <div>
                          <h3 className="text-elderly-lg font-semibold text-gray-800">
                            {chapter.name}
                          </h3>
                          <p className="text-elderly-sm text-warm-gray-600">
                            {chapter.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center space-x-1 mb-1">
                          {[...Array(3)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(chapterStars / chapter.levels.length) 
                                  ? 'text-yellow-400 fill-current' 
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-elderly-xs text-warm-gray-500">
                          {chapterStars}/{maxStars}
                        </span>
                      </div>
                    </div>

                    {unlocked && (
                      <div className="grid grid-cols-3 gap-3">
                        {chapter.levels.map((level) => {
                          const levelStars = getStarsForLevel(level);
                          const difficulty = getDifficultyForLevel(level);
                          const isCurrentLevel = level === currentLevel;
                          const isCompleted = levelStars > 0;
                          const isAccessible = level <= currentLevel + 1;

                          return (
                            <Button
                              key={level}
                              onClick={() => isAccessible ? onLevelSelect(level) : null}
                              disabled={!isAccessible}
                              variant={isCurrentLevel ? "default" : "outline"}
                              className={`h-16 flex-col space-y-1 relative ${
                                isCurrentLevel ? 'ring-2 ring-warm-gold' : ''
                              } ${!isAccessible ? 'opacity-50 cursor-not-allowed' : ''}`}
                              data-testid={`button-level-${level}`}
                            >
                              <div className="flex items-center space-x-1">
                                <span className="text-elderly-sm font-semibold">第 {level} 關</span>
                                {isCurrentLevel && (
                                  <ArrowRight className="w-3 h-3 text-warm-gold" />
                                )}
                              </div>
                              
                              <div className="flex items-center space-x-1">
                                {[...Array(3)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-3 h-3 ${
                                      i < levelStars 
                                        ? 'text-yellow-400 fill-current' 
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>

                              {isCompleted && (
                                <div className="absolute -top-1 -right-1">
                                  <Trophy className="w-4 h-4 text-yellow-500" />
                                </div>
                              )}
                            </Button>
                          );
                        })}
                      </div>
                    )}

                    {!unlocked && (
                      <div className="text-center py-4 text-warm-gray-500">
                        <Lock className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-elderly-sm">需要 {chapter.unlockRequirement} 顆星解鎖</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}