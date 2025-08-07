import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import ReligionSelection from "../components/religion-selection";
import Dashboard from "../components/dashboard";
import UserInfoModal from "../components/user-info-modal";
import StoryProgress from "../components/story-progress";
import { Button } from "@/components/ui/button";
import { Bell, User } from "lucide-react";
import { useLocation } from "wouter";

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

const DEMO_USER_ID = "demo-user-1";

export default function Home() {
  const [showReligionSelection, setShowReligionSelection] = useState(true);
  const [showUserInfo, setShowUserInfo] = useState(false);
  const [showStoryProgress, setShowStoryProgress] = useState(false);
  const [, setLocation] = useLocation();

  const { data: user, refetch: refetchUser } = useQuery<User>({
    queryKey: ['/api/user', DEMO_USER_ID],
  });

  const { data: userStats } = useQuery<UserStats>({
    queryKey: ['/api/user', DEMO_USER_ID, 'stats'],
  });

  useEffect(() => {
    if (user?.selectedReligion) {
      setShowReligionSelection(false);
      setShowStoryProgress(true);
    }
  }, [user]);

  const handleReligionSelected = async () => {
    await refetchUser();
    setShowReligionSelection(false);
    setShowStoryProgress(true);
  };

  const handleGameStart = (gameType: string) => {
    setLocation(`/game/${gameType}`);
  };

  const handleChatStart = () => {
    setShowStoryProgress(false);
  };

  return (
    <div className="min-h-screen bg-warm-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-warm-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            <div className="flex items-center space-x-4" data-testid="header-logo">
              <div className="w-12 h-12 bg-warm-gold rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-elderly-xl md:text-elderly-2xl font-semibold text-gray-800">
                  覺悟之路
                </h1>
                <p className="text-elderly-sm text-warm-gray-600 hidden sm:block">
                  智慧養成・心靈陪伴
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                className="relative p-3 bg-warm-gray-50 rounded-xl hover:bg-warm-gray-100"
                onClick={() => {
                  // Show notification modal or navigate to notifications page
                  alert('通知功能開發中，敬請期待！');
                }}
                data-testid="button-notifications"
              >
                <Bell className="h-5 w-5 text-warm-gray-600" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-soft-red text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </Button>
              
              <Button
                onClick={() => setShowUserInfo(true)}
                variant="ghost"
                className="flex items-center space-x-3 bg-warm-gray-50 rounded-xl px-4 py-2 hover:bg-warm-gray-100 transition-colors"
                data-testid="button-user-profile"
              >
                <div className="w-10 h-10 bg-warm-gold rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <span className="text-elderly-base font-medium hidden sm:block">
                  {user?.displayName || "王阿嬤"}
                </span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {showReligionSelection ? (
          <ReligionSelection
            userId={DEMO_USER_ID}
            onReligionSelected={handleReligionSelected}
          />
        ) : showStoryProgress ? (
          <StoryProgress
            religion={user?.selectedReligion || 'buddhism'}
            onChatClick={handleChatStart}
            onGameClick={handleGameStart}
          />
        ) : (
          <Dashboard
            user={user}
            userStats={userStats}
            userId={DEMO_USER_ID}
          />
        )}
      </main>

      {/* Navigation Buttons */}
      {!showReligionSelection && (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col space-y-3">
          {showStoryProgress && (
            <Button
              onClick={() => setShowStoryProgress(false)}
              className="w-16 h-16 bg-sage-green text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
              data-testid="button-dashboard"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
              </svg>
            </Button>
          )}
          
          <Button
            className="w-16 h-16 bg-warm-gold text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300"
            onClick={() => {
              if (showStoryProgress) {
                handleChatStart();
              } else {
                const aiSection = document.querySelector('[data-testid="ai-companion"]');
                if (aiSection) {
                  aiSection.scrollIntoView({ behavior: 'smooth' });
                }
              }
            }}
            data-testid="button-ai-assistant"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.9 1 3 1.9 3 3V21C3 22.1 3.9 23 5 23H19C20.1 23 21 22.1 21 21V9H21Z"/>
            </svg>
          </Button>
        </div>
      )}

      {/* User Info Modal */}
      {showUserInfo && (
        <UserInfoModal
          userName={user?.displayName}
          selectedReligion={user?.selectedReligion || undefined}
          userStats={userStats}
          onClose={() => setShowUserInfo(false)}
        />
      )}
    </div>
  );
}
