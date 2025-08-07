import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, User, Flame } from "lucide-react";
import ProgressRing from "./progress-ring";

interface UserStats {
  memoryProgress: number;
  reactionProgress: number;
  logicProgress: number;
  focusProgress: number;
  consecutiveDays: number;
  totalGamesPlayed: number;
  averageScore: number;
}

interface UserInfoModalProps {
  userName?: string;
  selectedReligion?: string;
  userStats?: UserStats;
  onClose: () => void;
}

export default function UserInfoModal({ 
  userName, 
  selectedReligion, 
  userStats, 
  onClose 
}: UserInfoModalProps) {
  const getReligionName = () => {
    switch (selectedReligion) {
      case 'buddhism': return '佛教修行';
      case 'taoism': return '道教養生';
      case 'mazu': return '媽祖護佑';
      default: return '未選擇';
    }
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