import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Heart, Smile } from "lucide-react";

const DEMO_USER_ID = "demo-user-1";

export default function UserSetup() {
  const [, setLocation] = useLocation();
  const [displayName, setDisplayName] = useState("");
  const [age, setAge] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const updateUserMutation = useMutation({
    mutationFn: async (userData: { displayName: string; age: number }) => {
      const response = await apiRequest('PUT', `/api/user/${DEMO_USER_ID}`, userData);
      return response.json();
    },
    onSuccess: () => {
      // 立即更新緩存並導向主頁面
      queryClient.invalidateQueries({ queryKey: ['/api/user', DEMO_USER_ID] });
      queryClient.invalidateQueries({ queryKey: ['/api/user', DEMO_USER_ID, 'stats'] });
      
      toast({
        title: "歡迎您！",
        description: "讓我們開始這段美好的修行之旅",
      });
      
      // 立即導向主頁面
      setLocation("/");
    },
    onError: () => {
      toast({
        title: "設定失敗",
        description: "請稍後再試",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!displayName.trim()) {
      toast({
        title: "請告訴我們怎麼稱呼您",
        description: "這樣我們就能更親切地與您互動",
        variant: "destructive",
      });
      return;
    }

    const ageNum = parseInt(age);
    if (!age || ageNum < 30 || ageNum > 120) {
      toast({
        title: "請輸入正確的年齡",
        description: "我們的應用適合30歲以上的朋友使用",
        variant: "destructive",
      });
      return;
    }

    updateUserMutation.mutate({
      displayName: displayName.trim(),
      age: ageNum,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-gray-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Welcome Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-warm-gold rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"/>
            </svg>
          </div>
          <h1 className="text-elderly-3xl font-bold text-gray-800 mb-4">
            歡迎來到覺悟之路
          </h1>
          <p className="text-elderly-lg text-warm-gray-700 mb-2">
            您好！很高興認識您 
            <Heart className="w-5 h-5 text-red-400 inline mx-2" />
          </p>
          <p className="text-elderly-base text-warm-gray-600">
            請讓我們更了解您，這樣就能為您提供最適合的修行體驗
          </p>
        </div>

        {/* Setup Form */}
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardContent className="p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Name Input */}
              <div className="space-y-3">
                <Label htmlFor="displayName" className="text-elderly-lg font-semibold text-gray-800 flex items-center">
                  <Smile className="w-5 h-5 text-warm-gold mr-2" />
                  我們該怎麼稱呼您呢？
                </Label>
                <p className="text-elderly-sm text-warm-gray-600 ml-7">
                  您可以輸入您喜歡的稱呼，比如「王阿嬤」、「李伯伯」或您的名字
                </p>
                <Input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="例如：王阿嬤"
                  className="text-elderly-base h-14 px-4 border-2 border-warm-gray-200 focus:border-warm-gold rounded-xl"
                  data-testid="input-display-name"
                />
              </div>

              {/* Age Input */}
              <div className="space-y-3">
                <Label htmlFor="age" className="text-elderly-lg font-semibold text-gray-800 flex items-center">
                  <span className="text-warm-gold mr-2">🎂</span>
                  請問您今年幾歲呢？
                </Label>
                <p className="text-elderly-sm text-warm-gray-600 ml-7">
                  這能幫助我們調整適合您的遊戲難度和內容
                </p>
                <Input
                  id="age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="例如：65"
                  min="30"
                  max="120"
                  className="text-elderly-base h-14 px-4 border-2 border-warm-gray-200 focus:border-warm-gold rounded-xl"
                  data-testid="input-age"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button
                  type="submit"
                  disabled={updateUserMutation.isPending}
                  className="w-full h-16 bg-warm-gold text-white hover:bg-opacity-90 text-elderly-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  data-testid="button-complete-setup"
                >
                  {updateUserMutation.isPending ? (
                    <div className="flex items-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                      正在準備中...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <span>開始我的修行之旅</span>
                      <span className="ml-3 text-xl">✨</span>
                    </div>
                  )}
                </Button>
              </div>
            </form>

            {/* Encouraging Message */}
            <div className="mt-8 p-6 bg-gradient-to-r from-warm-gold/10 to-yellow-100 rounded-xl border border-warm-gold/20">
              <div className="text-center">
                <p className="text-elderly-base text-warm-gray-700 mb-2">
                  <span className="text-warm-gold font-semibold">💫 溫馨提醒</span>
                </p>
                <p className="text-elderly-sm text-warm-gray-600 leading-relaxed">
                  覺悟之路是專為中老年朋友設計的認知訓練應用。
                  透過寓教於樂的方式，幫助您保持思維活躍，享受學習的樂趣。
                  我們會根據您的信仰選擇，提供個人化的修行指導與陪伴。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}