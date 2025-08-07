import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, User, Flame, Trophy, Star, Lock, BookOpen, Play } from "lucide-react";
import ProgressRing from "./progress-ring";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";

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

interface UserInfoModalProps {
  userName?: string;
  selectedReligion?: string;
  userStats?: UserStats;
  userId?: string;
  onClose: () => void;
}

export default function UserInfoModal({ 
  userName, 
  selectedReligion, 
  userStats, 
  userId = "demo-user-1",
  onClose 
}: UserInfoModalProps) {
  const [, setLocation] = useLocation();
  
  const { data: storyProgress } = useQuery<StoryProgress>({
    queryKey: ['/api/user', userId, 'story'],
    enabled: !!userId,
  });

  const startGame = (gameType: string) => {
    onClose(); // 關閉 modal
    setLocation(`/game/${gameType}`);
  };

  const getReligionName = () => {
    switch (selectedReligion) {
      case 'buddhism': return '佛教修行';
      case 'taoism': return '道教養生';
      case 'mazu': return '媽祖護佑';
      default: return '未選擇';
    }
  };

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

  const renderStarRating = (difficulty: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < difficulty ? "text-yellow-400" : "text-gray-300"}>
        ★
      </span>
    ));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-warm-gold rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-elderly-xl font-semibold text-gray-800">
                {userName || "王阿嬤"}
              </h2>
              <p className="text-elderly-base text-warm-gray-600">
                {getReligionName()}
              </p>
            </div>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="w-10 h-10 rounded-full hover:bg-gray-100"
            data-testid="button-close-user-info"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Today's Practice Progress */}
        <div className="p-6">
          <Card className="shadow-lg">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6">
                <div>
                  <h3 className="text-elderly-xl md:text-elderly-2xl font-semibold text-gray-800 mb-2">
                    今日修行進度
                  </h3>
                  <p className="text-elderly-base text-warm-gray-600">持續練習，智慧成長</p>
                </div>
                <div className="mt-4 lg:mt-0">
                  <div className="inline-flex items-center px-4 py-2 bg-warm-gold bg-opacity-20 text-warm-gold text-elderly-base font-medium rounded-xl">
                    <Flame className="w-5 h-5 mr-2" />
                    連續修行 {userStats?.consecutiveDays || 0} 天
                  </div>
                </div>
              </div>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="progress-overview">
                <div className="text-center">
                  <ProgressRing 
                    percentage={userStats?.memoryProgress || 0} 
                    color="hsl(45, 78%, 52%)"
                    size={96}
                  />
                  <p className="text-elderly-base font-medium text-gray-800 mt-4 mb-1">記憶訓練</p>
                  <p className="text-elderly-sm text-warm-gray-600">今日完成 3/4</p>
                </div>
                
                <div className="text-center">
                  <ProgressRing 
                    percentage={userStats?.reactionProgress || 0} 
                    color="hsl(0, 62%, 55%)"
                    size={96}
                  />
                  <p className="text-elderly-base font-medium text-gray-800 mt-4 mb-1">反應訓練</p>
                  <p className="text-elderly-sm text-warm-gray-600">今日完成 2/4</p>
                </div>
                
                <div className="text-center">
                  <ProgressRing 
                    percentage={userStats?.logicProgress || 0} 
                    color="hsl(95, 20%, 55%)"
                    size={96}
                  />
                  <p className="text-elderly-base font-medium text-gray-800 mt-4 mb-1">邏輯思考</p>
                  <p className="text-elderly-sm text-warm-gray-600">今日完成 1/4</p>
                </div>
                
                <div className="text-center">
                  <ProgressRing 
                    percentage={userStats?.focusProgress || 0} 
                    color="hsl(192, 38%, 47%)"
                    size={96}
                  />
                  <p className="text-elderly-base font-medium text-gray-800 mt-4 mb-1">專注訓練</p>
                  <p className="text-elderly-sm text-warm-gray-600">今日完成 4/4</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Statistics */}
          <Card className="shadow-lg mt-6">
            <CardContent className="p-6">
              <h4 className="text-elderly-lg font-semibold text-gray-800 mb-4">統計資訊</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-warm-gray-50 rounded-xl">
                  <p className="text-elderly-2xl font-bold text-warm-gold">
                    {userStats?.totalGamesPlayed || 0}
                  </p>
                  <p className="text-elderly-sm text-warm-gray-600">總遊戲次數</p>
                </div>
                <div className="text-center p-4 bg-warm-gray-50 rounded-xl">
                  <p className="text-elderly-2xl font-bold text-ocean-blue">
                    {userStats?.averageScore || 0}
                  </p>
                  <p className="text-elderly-sm text-warm-gray-600">平均分數</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Story Progress Section */}
          <Card className="shadow-lg mt-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h4 className="text-elderly-lg font-semibold text-gray-800 mb-2">修行故事進度</h4>
                  <p className="text-elderly-base text-warm-gray-600">跟隨智慧導師的腳步，展開心靈之旅</p>
                </div>
                <div className="text-right">
                  <p className="text-elderly-xl font-bold text-warm-gold">
                    第{storyProgress?.currentChapter || 1}章
                  </p>
                  <p className="text-elderly-sm text-warm-gray-600">共5章</p>
                </div>
              </div>
              
              {/* Story Timeline */}
              <div className="space-y-4">
                {/* Completed Chapter */}
                {(storyProgress?.completedChapters?.length || 0) > 0 && (
                  <div className="flex items-center p-4 bg-green-50 rounded-xl border border-green-200">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h5 className="text-elderly-base font-semibold text-gray-800">已完成章節</h5>
                      <p className="text-elderly-sm text-warm-gray-600">
                        獲得成就：{storyProgress?.achievements?.[0] || "修行有成"}
                      </p>
                    </div>
                    <div className="text-green-600">
                      <Star className="w-5 h-5 fill-current" />
                    </div>
                  </div>
                )}
                
                {/* Current Chapter */}
                <div className="flex items-center p-4 bg-warm-gold bg-opacity-10 rounded-xl border border-warm-gold">
                  <div className="w-12 h-12 bg-warm-gold rounded-full flex items-center justify-center mr-4">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h5 className="text-elderly-base font-semibold text-gray-800">
                      第{storyProgress?.currentChapter || 1}章：當前修行
                    </h5>
                    <div className="w-full bg-warm-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-warm-gold h-2 rounded-full transition-all duration-300"
                        style={{ width: `${storyProgress?.chapterProgress || 0}%` }}
                      ></div>
                    </div>
                    <p className="text-elderly-sm text-warm-gray-600 mt-1">
                      進度：{storyProgress?.chapterProgress || 0}%
                    </p>
                  </div>
                </div>
                
                {/* Next Chapter Preview */}
                <div className="flex items-center p-4 bg-warm-gray-50 rounded-xl opacity-60">
                  <div className="w-12 h-12 bg-warm-gray-300 rounded-full flex items-center justify-center mr-4">
                    <Lock className="w-6 h-6 text-warm-gray-500" />
                  </div>
                  <div className="flex-1">
                    <h5 className="text-elderly-base font-semibold text-gray-800">
                      第{(storyProgress?.currentChapter || 1) + 1}章：即將開啟
                    </h5>
                    <p className="text-elderly-sm text-warm-gray-600">
                      完成當前章節後解鎖
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Game Selection Section */}
          <Card className="shadow-lg mt-6">
            <CardContent className="p-6">
              <h4 className="text-elderly-lg font-semibold text-gray-800 mb-4">開始認知訓練</h4>
              <div className="space-y-4">
                {gameTypes.map((category) => (
                  <div key={category.category} className="border border-warm-gray-200 rounded-xl p-4">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 bg-warm-gold bg-opacity-20 rounded-lg flex items-center justify-center mr-3">
                        <span className="text-lg">{category.icon}</span>
                      </div>
                      <div>
                        <h5 className="text-elderly-base font-semibold text-gray-800">{category.category}</h5>
                        <p className="text-elderly-sm text-warm-gray-600">強化認知・活化大腦</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {category.games.map((game) => (
                        <div key={game.id} className="flex items-center justify-between p-3 bg-warm-gray-50 rounded-lg">
                          <div className="flex-1">
                            <p className="text-elderly-sm font-medium text-gray-800 mb-1">{game.name}</p>
                            <div className="flex items-center">
                              {renderStarRating(game.difficulty)}
                            </div>
                          </div>
                          <Button
                            onClick={() => startGame(game.id)}
                            size="sm"
                            className="bg-warm-gold text-white hover:bg-warm-gold hover:bg-opacity-90 text-elderly-sm px-4 py-2"
                            data-testid={`button-start-${game.id}`}
                          >
                            <Play className="w-4 h-4 mr-1" />
                            開始
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100">
          <Button
            onClick={onClose}
            className="w-full btn-primary text-elderly-base"
            data-testid="button-close-user-modal"
          >
            關閉
          </Button>
        </div>
      </div>
    </div>
  );
}