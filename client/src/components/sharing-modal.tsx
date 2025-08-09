import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserStats {
  memoryProgress: number;
  reactionProgress: number;
  logicProgress: number;
  focusProgress: number;
  consecutiveDays: number;
  averageScore: number;
}

interface SharingModalProps {
  userStats: UserStats | undefined;
  userName: string | undefined;
  onClose: () => void;
}

export default function SharingModal({ userStats, userName, onClose }: SharingModalProps) {
  const { toast } = useToast();
  
  const handleCopyLink = async () => {
    const shareText = `我在覺悟之路上持續修行 ${userStats?.consecutiveDays || 0} 天！
📊 今日進度：
🧠 記憶訓練 ${userStats?.memoryProgress || 0}%
⚡ 反應訓練 ${userStats?.reactionProgress || 0}%
🧩 邏輯思考 ${userStats?.logicProgress || 0}%
🎯 專注訓練 ${userStats?.focusProgress || 0}%

平均分數：${userStats?.averageScore || 0}分
一起來挑戰智慧養成吧！`;

    try {
      await navigator.clipboard.writeText(shareText);
      toast({
        title: "分享內容已複製",
        description: "可以貼到任何地方分享您的成果！",
      });
      onClose();
    } catch (error) {
      toast({
        title: "複製失敗",
        description: "請手動複製分享內容",
        variant: "destructive",
      });
    }
  };

  const handleSocialShare = (platform: string) => {
    const shareText = encodeURIComponent(`我在覺悟之路上持續修行 ${userStats?.consecutiveDays || 0} 天，智慧與健康同步提升！`);
    const url = encodeURIComponent(window.location?.href || 'https://awaken-path.app');
    
    const shareUrls: Record<string, string> = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${shareText}`,
      line: `https://social-plugins.line.me/lineit/share?url=${url}&text=${shareText}`,
    };
    
    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
    
    toast({
      title: "分享成功",
      description: `已開啟 ${platform === 'facebook' ? 'Facebook' : 'LINE'} 分享頁面`,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" data-testid="sharing-modal">
      <Card className="w-full max-w-md fade-in">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-elderly-xl font-semibold text-gray-800">分享我的進度</h3>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="w-8 h-8 bg-warm-gray-100 rounded-lg hover:bg-warm-gray-200"
              data-testid="button-close-sharing"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Share Content Preview */}
          <div className="bg-warm-gray-50 rounded-xl p-4 mb-6">
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 bg-warm-gold rounded-xl flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"/>
                </svg>
              </div>
              <div>
                <p className="text-elderly-base font-semibold text-gray-800">覺悟之路 - 修行進度</p>
                <p className="text-elderly-sm text-warm-gray-600">
                  {userName || "使用者"}的今日成果
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-center mb-3">
              <div className="bg-white rounded-lg p-3">
                <p className="text-elderly-lg font-bold text-warm-gold">
                  {userStats?.memoryProgress || 0}%
                </p>
                <p className="text-elderly-xs text-warm-gray-600">記憶訓練</p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <p className="text-elderly-lg font-bold soft-red">
                  {userStats?.reactionProgress || 0}%
                </p>
                <p className="text-elderly-xs text-warm-gray-600">反應訓練</p>
              </div>
            </div>
            
            <p className="text-elderly-sm text-warm-gray-600 text-center">
              持續修行{userStats?.consecutiveDays || 0}天，智慧與健康同步提升！
            </p>
          </div>
          
          {/* Share Options */}
          <div className="space-y-3">
            <Button
              onClick={() => handleSocialShare('line')}
              variant="outline"
              className="w-full flex items-center p-4 bg-green-50 hover:bg-green-100 border-green-200 text-elderly-base"
              data-testid="button-share-line"
            >
              <span className="text-green-600 text-xl mr-4">💬</span>
              <span className="text-gray-800">分享到 LINE</span>
            </Button>
            
            <Button
              onClick={() => handleSocialShare('facebook')}
              variant="outline"
              className="w-full flex items-center p-4 bg-blue-50 hover:bg-blue-100 border-blue-200 text-elderly-base"
              data-testid="button-share-facebook"
            >
              <span className="text-blue-600 text-xl mr-4">📘</span>
              <span className="text-gray-800">分享到 Facebook</span>
            </Button>
            
            <Button
              onClick={handleCopyLink}
              variant="outline"
              className="w-full flex items-center p-4 bg-warm-gray-50 hover:bg-warm-gray-100 border-warm-gray-200 text-elderly-base"
              data-testid="button-copy-share"
            >
              <Copy className="w-5 h-5 text-warm-gray-600 mr-4" />
              <span className="text-gray-800">複製分享內容</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
