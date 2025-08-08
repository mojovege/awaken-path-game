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



  return (
    <div className="fade-in space-y-8" data-testid="dashboard">
      {/* Back to Religion Selection Button */}
      <div className="flex justify-between items-center">
        <Button
          onClick={() => {
            console.log('重新選擇信仰');
            // 清除宗教選擇後重新載入頁面
            localStorage.removeItem('selectedReligion');
            window.location.href = '/';
          }}
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
      
      {/* Welcome Message */}
      <Card className="shadow-lg bg-gradient-to-r from-warm-gold to-yellow-100">
        <CardContent className="p-6 md:p-8">
          <div className="text-center">
            <div className="text-4xl mb-4">
              {user?.selectedReligion === 'buddhism' ? '🧘‍♂️' :
               user?.selectedReligion === 'taoism' ? '☯️' :
               user?.selectedReligion === 'mazu' ? '🌊' : '🙏'}
            </div>
            <h3 className="text-elderly-xl md:text-elderly-2xl font-semibold text-gray-800 mb-2">
              歡迎來到修行聊天室
            </h3>
            <p className="text-elderly-base text-warm-gray-700">
              與您的智慧導師交流，獲得修行指導和生活建議
            </p>
          </div>
        </CardContent>
      </Card>



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
