import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";
import ProgressRing from "./progress-ring";
import AICompanion from "./ai-companion";
import SharingModal from "./sharing-modal";
import { Share2, BarChart3, Settings, Flame, Trophy, Play, Lock } from "lucide-react";

interface User {
  id: string;
  displayName: string;
  selectedReligion: string | null;
}

interface UserStats {
  memoryProgress: number;
  reactionProgress: number;
  logicProgress: number;
  focusProgress: number;
  consecutiveDays: number;
  totalGamesPlayed: number;
  averageScore: number;
}

interface StoryProgress {
  currentChapter: number;
  chapterProgress: number;
  completedChapters: string[];
  achievements: string[];
}

interface DashboardProps {
  user: User | undefined;
  userStats: UserStats | undefined;
  userId: string;
}

const gameTypes = [
  {
    category: "記憶訓練",
    categoryColor: "warm-gold",
    icon: "🧠",
    games: [
      { id: "memory-scripture", name: "經文記憶配對", difficulty: 3 },
      { id: "memory-temple", name: "寺廟導覽記憶", difficulty: 2 },
    ],
  },
  {
    category: "反應訓練", 
    categoryColor: "soft-red",
    icon: "⏱️",
    games: [
      { id: "reaction-rhythm", name: "敲木魚節奏", difficulty: 3 },
      { id: "reaction-lighting", name: "祈福點燈", difficulty: 2 },
    ],
  },
  {
    category: "邏輯思考",
    categoryColor: "sage-green", 
    icon: "🧩",
    games: [
      { id: "logic-scripture", name: "佛偈解讀", difficulty: 4 },
      { id: "logic-sequence", name: "智慧排序", difficulty: 3 },
    ],
  },
];

export default function Dashboard({ user, userStats, userId }: DashboardProps) {
  const [, setLocation] = useLocation();
  const [showSharing, setShowSharing] = useState(false);

  const { data: storyProgress } = useQuery<StoryProgress>({
    queryKey: ['/api/user', userId, 'story'],
  });

  const { data: healthTip } = useQuery<{ tip: string }>({
    queryKey: ['/api/health-tip', user?.selectedReligion],
    enabled: !!user?.selectedReligion,
  });

  const startGame = (gameType: string) => {
    setLocation(`/game/${gameType}`);
  };

  const renderStarRating = (difficulty: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < difficulty ? "text-yellow-400" : "text-gray-300"}>
        ★
      </span>
    ));
  };

  return (
    <div className="fade-in space-y-8" data-testid="dashboard">
      {/* Back to Religion Selection Button */}
      <div className="flex justify-between items-center">
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          className="text-warm-gray-600 hover:text-gray-800 border-warm-gray-300"
          data-testid="button-back-to-selection"
        >
          ← 重新選擇信仰
        </Button>
        <div className="text-right">
          <p className="text-elderly-base text-warm-gray-600">
            當前選擇：{
              user?.selectedReligion === 'buddhism' ? '佛教修行' :
              user?.selectedReligion === 'taoism' ? '道教養生' :
              user?.selectedReligion === 'mazu' ? '媽祖護佑' : '未選擇'
            }
          </p>
        </div>
      </div>
      
      {/* Story Progress Section - moved from bottom */}
      <Card className="shadow-lg">
        <CardContent className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-elderly-xl md:text-elderly-2xl font-semibold text-gray-800 mb-2">修行故事進度</h3>
              <p className="text-elderly-base text-warm-gray-600">跟隨智慧導師的腳步，展開心靈之旅</p>
            </div>
            <div className="text-right">
              <p className="text-elderly-2xl font-bold text-warm-gold">
                第{storyProgress?.currentChapter || 1}章
              </p>
              <p className="text-elderly-sm text-warm-gray-600">共12章</p>
            </div>
          </div>
          
          {/* Story Timeline */}
          <div className="relative" data-testid="story-timeline">
            <div className="absolute left-8 top-0 bottom-0 w-px bg-warm-gray-100"></div>
            
            {/* Completed Chapter */}
            <div className="relative flex items-start mb-8">
              <div className="w-16 h-16 bg-warm-gold rounded-full flex items-center justify-center z-10">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div className="ml-6 flex-1">
                <div className="bg-warm-gray-50 rounded-xl p-4">
                  <h4 className="text-elderly-lg font-semibold text-gray-800 mb-2">第二章：智慧的種子</h4>
                  <p className="text-elderly-base text-warm-gray-600 mb-3">
                    您已成功完成了記憶訓練，就像在心田中播下智慧的種子。繼續努力，這些種子將茁壯成長。
                  </p>
                  <div className="flex items-center text-elderly-sm text-green-600">
                    <Trophy className="w-4 h-4 mr-2" />
                    <span>獲得成就：{storyProgress?.achievements?.[0] || "記憶大師"}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Current Chapter */}
            <div className="relative flex items-start mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-warm-gold to-yellow-500 rounded-full flex items-center justify-center z-10">
                <Play className="w-6 h-6 text-white" />
              </div>
              <div className="ml-6 flex-1">
                <div className="bg-warm-gold bg-opacity-10 border-2 border-warm-gold rounded-xl p-4">
                  <h4 className="text-elderly-lg font-semibold text-gray-800 mb-2">
                    第{storyProgress?.currentChapter || 3}章：專注之光
                  </h4>
                  <p className="text-elderly-base text-warm-gray-600 mb-3">
                    現在正是修煉專注力的時候。完成反應訓練遊戲，點亮內心的專注之光。
                  </p>
                  <div className="w-full bg-warm-gray-200 rounded-full h-2 mb-3">
                    <div 
                      className="bg-warm-gold h-2 rounded-full transition-all duration-300"
                      style={{ width: `${storyProgress?.chapterProgress || 60}%` }}
                    ></div>
                  </div>
                  <p className="text-elderly-sm text-warm-gray-600">
                    進度：{storyProgress?.chapterProgress || 60}%
                  </p>
                </div>
              </div>
            </div>
            
            {/* Next Chapter */}
            <div className="relative flex items-start">
              <div className="w-16 h-16 bg-warm-gray-200 rounded-full flex items-center justify-center z-10">
                <Lock className="w-6 h-6 text-warm-gray-400" />
              </div>
              <div className="ml-6 flex-1">
                <div className="bg-warm-gray-50 rounded-xl p-4 opacity-60">
                  <h4 className="text-elderly-lg font-semibold text-gray-800 mb-2">第四章：邏輯之門</h4>
                  <p className="text-elderly-base text-warm-gray-600">
                    完成當前章節後解鎖。邏輯思維將為您開啟更深層的智慧大門。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Game Selection Grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6" data-testid="game-selection">
        {gameTypes.map((category) => (
          <Card key={category.category} className="shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 bg-${category.categoryColor} bg-opacity-20 rounded-xl flex items-center justify-center mr-4`}>
                  <span className="text-xl">{category.icon}</span>
                </div>
                <div>
                  <h3 className="text-elderly-lg font-semibold text-gray-800">{category.category}</h3>
                  <p className="text-elderly-sm text-warm-gray-600">強化記憶・活化大腦</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                {category.games.map((game) => (
                  <div key={game.id} className="flex items-center justify-between p-3 bg-warm-gray-50 rounded-xl">
                    <div className="flex-1">
                      <p className="text-elderly-base font-medium text-gray-800 mb-1">{game.name}</p>
                      <div className="flex items-center">
                        {renderStarRating(game.difficulty)}
                      </div>
                    </div>
                    <Button
                      onClick={() => startGame(game.id)}
                      size="sm"
                      className={`btn-primary text-elderly-sm`}
                      data-testid={`button-start-${game.id}`}
                    >
                      開始
                    </Button>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-warm-gray-100 pt-4">
                <div className="flex justify-between text-elderly-sm text-warm-gray-600">
                  <span>本週最佳：95分</span>
                  <span>平均分數：{userStats?.averageScore || 0}分</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Companion and Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AICompanion userId={userId} religion={user?.selectedReligion || undefined} userName={user?.displayName} />
        </div>
        
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <h4 className="text-elderly-lg font-semibold text-gray-800 mb-4">快速功能</h4>
              <div className="space-y-3">
                <Button
                  onClick={() => setShowSharing(true)}
                  variant="ghost"
                  className="w-full flex items-center justify-between p-3 bg-warm-gray-50 rounded-xl hover:bg-warm-gray-100 transition-colors"
                  data-testid="button-share-progress"
                >
                  <div className="flex items-center">
                    <Share2 className="w-5 h-5 text-warm-gold mr-3" />
                    <span className="text-elderly-base text-gray-800">分享進度</span>
                  </div>
                  <span className="text-warm-gray-600">→</span>
                </Button>
                
                <Button
                  variant="ghost"
                  className="w-full flex items-center justify-between p-3 bg-warm-gray-50 rounded-xl hover:bg-warm-gray-100 transition-colors"
                  data-testid="button-view-report"
                >
                  <div className="flex items-center">
                    <BarChart3 className="w-5 h-5 text-ocean-blue mr-3" />
                    <span className="text-elderly-base text-gray-800">查看報告</span>
                  </div>
                  <span className="text-warm-gray-600">→</span>
                </Button>
                
                <Button
                  variant="ghost"
                  className="w-full flex items-center justify-between p-3 bg-warm-gray-50 rounded-xl hover:bg-warm-gray-100 transition-colors"
                  data-testid="button-game-settings"
                >
                  <div className="flex items-center">
                    <Settings className="w-5 h-5 text-sage-green mr-3" />
                    <span className="text-elderly-base text-gray-800">遊戲設定</span>
                  </div>
                  <span className="text-warm-gray-600">→</span>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Daily Health Tip */}
          <Card className="shadow-lg bg-gradient-to-br from-green-50 to-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center mb-3">
                <span className="w-5 h-5 text-green-600 mr-2">💡</span>
                <h4 className="text-elderly-lg font-semibold text-gray-800">今日健康小貼士</h4>
              </div>
              <p className="text-elderly-base text-gray-700 mb-3" data-testid="text-health-tip">
                {healthTip?.tip || "規律的作息有助於維持大腦健康。建議每天在固定時間進行認知訓練，效果會更好。"}
              </p>
              <div className="flex items-center text-elderly-sm text-green-600">
                <span className="mr-1">❤️</span>
                <span>來自智慧導師的關懷</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>



      {/* Sharing Modal */}
      {showSharing && (
        <SharingModal
          userStats={userStats}
          userName={user?.displayName}
          onClose={() => setShowSharing(false)}
        />
      )}
    </div>
  );
}
