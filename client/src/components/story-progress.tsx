import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Star, Play, Lock } from 'lucide-react';
import { useLocation } from 'wouter';

interface StoryProgressProps {
  religion: string;
  onChatClick: () => void;
  onGameClick: (gameType: string) => void;
}

interface StoryChapter {
  id: number;
  title: string;
  content: string;
  gameType: string;
  gameTitle: string;
  unlocked: boolean;
  completed: boolean;
}

export default function StoryProgress({ religion, onChatClick, onGameClick }: StoryProgressProps) {
  const [, setLocation] = useLocation();

  const getStoryContent = (): StoryChapter[] => {
    switch (religion) {
      case 'buddhism':
        return [
          {
            id: 1,
            title: '初心之路',
            content: '在古老的寺院中，一位年輕的僧侶開始了他的修行之路。清晨的鐘聲響起，他學會了靜心觀想，記住佛陀的教誨。每一句經文都深深印在心中，如同明燈照亮前路。',
            gameType: 'memory-scripture',
            gameTitle: '經文記憶配對',
            unlocked: true,
            completed: false,
          },
          {
            id: 2,
            title: '節奏修行',
            content: '木魚聲聲，節拍如心跳般規律。僧侶學會了跟隨木魚的節奏誦經，每一下敲擊都與內心的平靜共鳴。在這規律的節拍中，找到了專注與寧靜。',
            gameType: 'reaction-rhythm',
            gameTitle: '木魚節奏訓練',
            unlocked: true,
            completed: false,
          },
          {
            id: 3,
            title: '智慧點燈',
            content: '在佛前點燃酥油燈，每一盞燈都代表一份智慧。僧侶必須記住點燈的順序，象徵著修行路上的每一個階段。燈光搖曳，照亮了心中的疑惑。',
            gameType: 'reaction-lighting',
            gameTitle: '祈福點燈',
            unlocked: false,
            completed: false,
          },
          {
            id: 4,
            title: '佛理思辨',
            content: '面對佛理的深奥，僧侶學會了邏輯思考。四聖諦的順序、八正道的排列，每一個概念都需要正確的理解和安排。智慧在思辨中逐漸綻放。',
            gameType: 'logic-scripture',
            gameTitle: '佛理邏輯',
            unlocked: false,
            completed: false,
          },
          {
            id: 5,
            title: '圓滿境界',
            content: '經過長期的修行，僧侶達到了圓滿的境界。他已能夠自如地運用所學的一切，在生活中實踐佛法，幫助眾生離苦得樂。',
            gameType: 'logic-sequence',
            gameTitle: '智慧序列',
            unlocked: false,
            completed: false,
          },
        ];
      case 'taoism':
        return [
          {
            id: 1,
            title: '道法自然',
            content: '山中隱士開始學習道法，觀察自然的規律，記憶天地間的奧秘。每一個符號、每一句道德經，都蘊含著宇宙的智慧。',
            gameType: 'memory-scripture',
            gameTitle: '道經記憶',
            unlocked: true,
            completed: false,
          },
          {
            id: 2,
            title: '鐘鼓和鳴',
            content: '道觀中鐘鼓齊鳴，隱士學會了與天地節拍同步。每一下鐘聲都與道的韻律相合，在和諧的節奏中感受天人合一。',
            gameType: 'reaction-rhythm',
            gameTitle: '道鐘節奏',
            unlocked: true,
            completed: false,
          },
          {
            id: 3,
            title: '點亮心燈',
            content: '在靜室中點燃心燈，每一盞燈代表一份領悟。隱士必須按照特定順序點亮，象徵著修道過程中的層層境界。',
            gameType: 'reaction-lighting',
            gameTitle: '心燈點亮',
            unlocked: false,
            completed: false,
          },
          {
            id: 4,
            title: '陰陽平衡',
            content: '理解陰陽五行的奧秘，隱士學會了邏輯推理。太極圖的變化、五行的相生相剋，每一個概念都需要精確的排列和理解。',
            gameType: 'logic-scripture',
            gameTitle: '道理邏輯',
            unlocked: false,
            completed: false,
          },
          {
            id: 5,
            title: '得道成仙',
            content: '通過不斷的修煉，隱士終於達到了得道的境界。他已能運用道法自如，與天地同壽，幫助有緣人領悟道的真諦。',
            gameType: 'logic-sequence',
            gameTitle: '道法序列',
            unlocked: false,
            completed: false,
          },
        ];
      case 'mazu':
        return [
          {
            id: 1,
            title: '媽祖顯靈',
            content: '漁村中的年輕人開始學習媽祖的故事，記住每一個神蹟、每一次救助。媽祖的慈悲與智慧深深印在心中，成為海上的明燈。',
            gameType: 'memory-scripture',
            gameTitle: '媽祖故事記憶',
            unlocked: true,
            completed: false,
          },
          {
            id: 2,
            title: '鑼鼓喧天',
            content: '媽祖廟會中鑼鼓喧天，信徒們跟隨著節拍祈福。每一下鑼聲都承載著虔誠的心願，在熱鬧的節奏中感受媽祖的庇佑。',
            gameType: 'reaction-rhythm',
            gameTitle: '廟會鑼鼓',
            unlocked: true,
            completed: false,
          },
          {
            id: 3,
            title: '祈福明燈',
            content: '在媽祖面前點燃祈福燈，每一盞燈代表一個心願。信徒必須按照正確順序點亮，祈求媽祖保佑家人平安、出入順利。',
            gameType: 'reaction-lighting',
            gameTitle: '祈福明燈',
            unlocked: false,
            completed: false,
          },
          {
            id: 4,
            title: '海上救援',
            content: '學習媽祖救助海難的智慧，理解每一次救援的邏輯和順序。在危急時刻，需要正確的判斷和行動，才能化險為夷。',
            gameType: 'logic-scripture',
            gameTitle: '救援邏輯',
            unlocked: false,
            completed: false,
          },
          {
            id: 5,
            title: '海神護航',
            content: '成為媽祖的使者，擁有了保護海上平安的能力。已能預知風浪、指引航向，成為所有海上人的守護神。',
            gameType: 'logic-sequence',
            gameTitle: '護航序列',
            unlocked: false,
            completed: false,
          },
        ];
      default:
        return [];
    }
  };

  const stories = getStoryContent();
  const currentStory = stories.find(s => !s.completed) || stories[0];

  const getReligionTitle = () => {
    switch (religion) {
      case 'buddhism':
        return '佛教修行之路';
      case 'taoism':
        return '道教修煉之路';
      case 'mazu':
        return '媽祖信仰之路';
      default:
        return '修行之路';
    }
  };

  const getReligionEmoji = () => {
    switch (religion) {
      case 'buddhism':
        return '🧘‍♂️';
      case 'taoism':
        return '☯️';
      case 'mazu':
        return '🌊';
      default:
        return '🙏';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="text-6xl">{getReligionEmoji()}</div>
        <h1 className="text-elderly-2xl font-bold text-gray-800">
          {getReligionTitle()}
        </h1>
        <p className="text-elderly-base text-warm-gray-600">
          跟隨故事進度，完成相應的認知訓練遊戲
        </p>
      </div>

      {/* Current Story */}
      <Card className="bg-gradient-to-r from-warm-gold to-yellow-100 border-warm-gold">
        <CardContent className="p-8">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-elderly-lg font-bold text-warm-gold">
              {currentStory.id}
            </div>
            <div className="flex-1">
              <h2 className="text-elderly-xl font-semibold text-gray-800 mb-4">
                {currentStory.title}
              </h2>
              <p className="text-elderly-base text-warm-gray-700 mb-6 leading-relaxed">
                {currentStory.content}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => onGameClick(currentStory.gameType)}
                  className="btn-primary text-elderly-base px-8 py-3"
                  data-testid="button-start-story-game"
                >
                  <Play className="w-5 h-5 mr-2" />
                  開始 {currentStory.gameTitle}
                </Button>
                
                <Button
                  onClick={onChatClick}
                  variant="outline"
                  className="text-elderly-base px-8 py-3"
                  data-testid="button-chat-companion"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  與修行夥伴聊天
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Story Timeline */}
      <div className="space-y-4">
        <h3 className="text-elderly-lg font-semibold text-gray-800 mb-6">修行進度</h3>
        <div className="grid gap-4">
          {stories.map((story, index) => (
            <Card 
              key={story.id} 
              className={`transition-all duration-200 ${
                story.id === currentStory.id 
                  ? 'ring-2 ring-warm-gold bg-warm-gold bg-opacity-5' 
                  : story.unlocked 
                  ? 'hover:shadow-md cursor-pointer' 
                  : 'opacity-50'
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-elderly-base font-semibold ${
                      story.completed 
                        ? 'bg-green-500 text-white' 
                        : story.unlocked 
                        ? 'bg-warm-gold text-white' 
                        : 'bg-gray-300 text-gray-500'
                    }`}>
                      {story.completed ? (
                        <Star className="w-5 h-5" />
                      ) : story.unlocked ? (
                        story.id
                      ) : (
                        <Lock className="w-4 h-4" />
                      )}
                    </div>
                    
                    <div>
                      <h4 className="text-elderly-base font-semibold text-gray-800">
                        {story.title}
                      </h4>
                      <p className="text-elderly-sm text-warm-gray-600">
                        {story.gameTitle}
                      </p>
                    </div>
                  </div>
                  
                  {story.unlocked && (
                    <Button
                      onClick={() => onGameClick(story.gameType)}
                      size="sm"
                      variant={story.id === currentStory.id ? "default" : "outline"}
                      className="text-elderly-sm"
                      data-testid={`button-story-game-${story.id}`}
                    >
                      {story.completed ? '重新遊戲' : '開始遊戲'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}