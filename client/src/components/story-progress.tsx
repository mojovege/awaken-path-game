import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Star, Play, Lock, ChevronDown } from 'lucide-react';
import { useLocation } from 'wouter';
import ChapterSelector from './chapter-selector';

interface StoryProgressProps {
  religion: string;
  onChatClick: () => void;
  onGameClick: (gameType: string) => void;
}

interface GameInChapter {
  type: string;
  title: string;
  completed: boolean;
  stars: number;
}

interface StoryChapter {
  id: number;
  title: string;
  content: string;
  games: GameInChapter[];
  unlocked: boolean;
  completed: boolean;
  totalStars: number;
  requiredStars: number;
}

export default function StoryProgress({ religion, onChatClick, onGameClick }: StoryProgressProps) {
  const [, setLocation] = useLocation();
  const [showChapterSelector, setShowChapterSelector] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(1); // 當前選擇的關卡

  const getStoryContent = (): StoryChapter[] => {
    const baseGames: GameInChapter[] = [
      { type: 'memory-scripture', title: '經文記憶配對', completed: false, stars: 0 },
      { type: 'memory-temple', title: '寺廟導覽記憶', completed: false, stars: 0 },
      { type: 'reaction-rhythm', title: '木魚節奏訓練', completed: false, stars: 0 },
      { type: 'reaction-lighting', title: '祈福點燈', completed: false, stars: 0 },
      { type: 'logic-scripture', title: '佛理邏輯', completed: false, stars: 0 },
      { type: 'logic-sequence', title: '智慧序列', completed: false, stars: 0 },
    ];

    switch (religion) {
      case 'buddhism':
        return [
          {
            id: 1,
            title: '初心啟蒙',
            content: '一位年長者來到寺院，首先從山門殿進入，參拜天王殿的四大天王，接著來到大雄寶殿禮佛。學習靜心觀想和慈悲心，熟悉寺院各殿堂如觀音殿、藏經樓、禪堂等建築。透過記憶佛陀的智慧話語，跟隨木魚聲節奏誦經，在佛前點燈祈願。',
            games: baseGames.map(g => ({ ...g, title: g.title.replace('木魚', '木魚') })),
            unlocked: true,
            completed: false,
            totalStars: 0,
            requiredStars: 0,
          },
          {
            id: 2,
            title: '勤修精進',
            content: '修行者開始更深入地學習，在法堂聽聞佛法，在念佛堂誦經修行。記住各種善行與功德，熟悉鐘樓、鼓樓、齋堂等各處建築功能，掌握更複雜的誦經節拍，學會點亮代表智慧的燈火序列，理解因果報應的道理。',
            games: baseGames.map(g => ({ ...g })),
            unlocked: false,
            completed: false,
            totalStars: 0,
            requiredStars: 6,
          },
          {
            id: 3,
            title: '智慧開悟',
            content: '經過長期修行，修行者開始領悟更深的佛法智慧。深入了解文殊殿、普賢殿、地藏殿等各殿供奉的菩薩意義，能記住各種佛教典故和寺院建築用途，與清晨鐘聲完美同步，點燃象徵覺悟的明燈，深入理解空性和無常的道理。',
            games: baseGames.map(g => ({ ...g })),
            unlocked: false,
            completed: false,
            totalStars: 0,
            requiredStars: 12,
          },
          {
            id: 4,
            title: '深度修行',
            content: '修行者進入更高的修行層次，在韋陀殿、伽藍殿學習護法知識，在羅漢堂參拜五百羅漢。能夠記住深奧的佛學概念，在快速變化的節拍中保持專注，以正確順序點亮代表菩提道的燈火，理解中觀哲學和唯識學說，安排精密的禪修次第。',
            games: baseGames.map(g => ({ ...g })),
            unlocked: false,
            completed: false,
            totalStars: 0,
            requiredStars: 18,
          },
          {
            id: 5,
            title: '圓滿境界',
            content: '達到了修行的最高境界，成為能夠指導他人的智者。從舍利塔、萬佛塔感悟佛法精髓，在蓮花池旁菩提樹下禪定。完全掌握各種佛法要義，在任何節拍下都能保持內心平靜，點亮最複雜的智慧燈陣，完全理解緣起性空的深義。',
            games: baseGames.map(g => ({ ...g })),
            unlocked: false,
            completed: false,
            totalStars: 0,
            requiredStars: 24,
          },
        ];
      case 'taoism':
        const taoGames: GameInChapter[] = [
          { type: 'memory-scripture', title: '道經記憶', completed: false, stars: 0 },
          { type: 'memory-temple', title: '道觀導覽記憶', completed: false, stars: 0 },
          { type: 'reaction-rhythm', title: '鐘鼓節奏', completed: false, stars: 0 },
          { type: 'reaction-lighting', title: '心燈點亮', completed: false, stars: 0 },
          { type: 'logic-scripture', title: '道理邏輯', completed: false, stars: 0 },
          { type: 'logic-sequence', title: '道法序列', completed: false, stars: 0 },
        ];
        
        return [
          {
            id: 1,
            title: '初心啟蒙',
            content: '一位尋道者來到山中道觀，首先進入三清殿參拜三清道祖，在太上老君殿學習道德經，到玉皇殿敬拜玉皇大帝。學習道法自然的智慧，熟悉道觀各殿堂如文昌殿、財神殿、藥王殿等建築布局。記住基本的道德經句子，跟隨古鐘的悠揚聲響。',
            games: taoGames.map(g => ({ ...g })),
            unlocked: true,
            completed: false,
            totalStars: 0,
            requiredStars: 0,
          },
          {
            id: 2,
            title: '勤修精進',
            content: '修道者深入學習五行相生相剋的道理，在呂祖殿學習劍法，在雷祖殿了解天地變化，在斗姆殿觀星象。記住各種天地自然的規律，熟悉鐘樓、鼓樓、丹房、齋堂等各處功能，掌握更複雜的鐘鼓節拍，點亮代表五行的燈火。',
            games: taoGames.map(g => ({ ...g })),
            unlocked: false,
            completed: false,
            totalStars: 0,
            requiredStars: 6,
          },
          {
            id: 3,
            title: '智慧開悟',
            content: '通過持續修煉，修道者開始與天地同頻共振。深入了解慈航殿、斗姥殿、老君殿等各殿神祇意義，能記住複雜的道家典籍，在變化的節拍中找到不變的道，點燃象徵天人合一的燈陣，深度理解無為而治的智慧。',
            games: taoGames.map(g => ({ ...g })),
            unlocked: false,
            completed: false,
            totalStars: 0,
            requiredStars: 12,
          },
          {
            id: 4,
            title: '深度修行',
            content: '修道者達到更高的境界，在元始殿、通天殿學習上清道法，在紫微殿、北極殿觀天象占卜。開始理解宇宙運行的深層規律，掌握高深的道學理論，在快速節拍中保持如水般的柔韌，以精確順序點亮北斗七星燈陣。',
            games: taoGames.map(g => ({ ...g })),
            unlocked: false,
            completed: false,
            totalStars: 0,
            requiredStars: 18,
          },
          {
            id: 5,
            title: '圓滿境界',
            content: '成為得道高人，具備了濟世救人的能力。在丹房煉製仙丹，在藥圃種植靈草，在道經樓研讀經典，在修真洞參悟大道。完全融會貫通道家思想，任何節拍都不能動搖其內心的寧靜，點亮最高層次的仙家燈陣。',
            games: taoGames.map(g => ({ ...g })),
            unlocked: false,
            completed: false,
            totalStars: 0,
            requiredStars: 24,
          },
        ];
      case 'mazu':
        const mazuGames: GameInChapter[] = [
          { type: 'memory-scripture', title: '媽祖故事記憶', completed: false, stars: 0 },
          { type: 'memory-temple', title: '廟宇導覽記憶', completed: false, stars: 0 },
          { type: 'reaction-rhythm', title: '廟會鑣鼓', completed: false, stars: 0 },
          { type: 'reaction-lighting', title: '祈福明燈', completed: false, stars: 0 },
          { type: 'logic-scripture', title: '救援邏輯', completed: false, stars: 0 },
          { type: 'logic-sequence', title: '護航序列', completed: false, stars: 0 },
        ];
        
        return [
          {
            id: 1,
            title: '初心啟蒙',
            content: '一位漁村子弟來到媽祖廟，首先在天后宮參拜媽祖聖母，到千里眼殿、順風耳殿拜見媽祖的護法神將，在觀音殿祈求平安。學習媽祖的慈悲精神，熟悉廟宇各殿堂如福德殿、註生娘娘殿、文昌帝君殿等建築布局。記住媽祖救苦救難的故事。',
            games: mazuGames.map(g => ({ ...g })),
            unlocked: true,
            completed: false,
            totalStars: 0,
            requiredStars: 0,
          },
          {
            id: 2,
            title: '勤修精進',
            content: '信徒更深入理解媽祖的大愛精神，在關聖帝君殿學習忠義，在月老殿祈求姻緣，在城隍殿了解善惡報應。記住各種行善積德的方法，熟悉鐘樓、香客大廳、祈願牆等各處功能，掌握更複雜的廟會節慶節拍。',
            games: mazuGames.map(g => ({ ...g })),
            unlocked: false,
            completed: false,
            totalStars: 0,
            requiredStars: 6,
          },
          {
            id: 3,
            title: '智慧開悟',
            content: '通過不斷的善行，信徒開始體會媽祖無私奉獻的精神。深入了解開台聖王殿、保生大帝殿、三山國王殿等各殿神祇意義，能記住複雜的媽祖靈驗故事，在變化的鑣鼓聲中找到內心的安定，點燃象徵社區和諧的燈陣。',
            games: mazuGames.map(g => ({ ...g })),
            unlocked: false,
            completed: false,
            totalStars: 0,
            requiredStars: 12,
          },
          {
            id: 4,
            title: '深度修行',
            content: '信徒成長為能夠幫助他人的善心人士，在虎爺廟求平安，在土地公廟祈豐收，在水仙王殿、海龍王殿學習海洋智慧。掌握各種助人技巧和智慧，在激昂的節拍中保持慈悲的心境，以精準順序點亮代表眾生平安的燈火。',
            games: mazuGames.map(g => ({ ...g })),
            unlocked: false,
            completed: false,
            totalStars: 0,
            requiredStars: 18,
          },
          {
            id: 5,
            title: '圓滿境界',
            content: '成為如媽祖一般的慈悲使者，時刻守護著需要幫助的人。在航海祈福廳為船員祈福，在漁民會館分享經驗，走過平安橋獲得庇佑。完全體現媽祖的慈悲智慧，任何困難都不能阻擋其助人的決心，點亮最神聖的護佑眾生燈陣。',
            games: mazuGames.map(g => ({ ...g })),
            unlocked: false,
            completed: false,
            totalStars: 0,
            requiredStars: 24,
          },
        ];
      default:
        return [];
    }
  };

  const stories = getStoryContent();
  // 根據選擇的關卡計算當前章節 (每章6關，對應6種遊戲類型)
  const currentChapter = Math.ceil(selectedLevel / 6);
  const currentStory = stories[currentChapter - 1] || stories[0];
  
  // 根據關卡計算當前遊戲類型
  const gameTypes = [
    'memory-scripture', 'memory-temple', 
    'reaction-rhythm', 'reaction-lighting', 
    'logic-scripture', 'logic-sequence'
  ];
  const gameTypeIndex = (selectedLevel - 1) % 6;
  const currentGameType = gameTypes[gameTypeIndex];
  
  const getGameTitle = (gameType: string) => {
    const gameTitles: Record<string, string> = {
      'memory-scripture': '經文記憶配對',
      'memory-temple': '寺廟導覽記憶', 
      'reaction-rhythm': '木魚節奏訓練',
      'reaction-lighting': '祈福點燈',
      'logic-scripture': '佛理邏輯',
      'logic-sequence': '智慧序列'
    };
    return gameTitles[gameType] || '認知訓練';
  };

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
        
        {/* Chapter Selector Button */}
        <div className="flex justify-center">
          <Button
            onClick={() => setShowChapterSelector(true)}
            variant="outline"
            className="text-elderly-base px-6 py-3 border-2 border-warm-gold text-warm-gold hover:bg-warm-gold hover:text-white"
          >
            <ChevronDown className="w-5 h-5 mr-2" />
            第{selectedLevel}關：{getGameTitle(currentGameType)}
          </Button>
        </div>
      </div>

      {/* Current Story */}
      <Card className="bg-gradient-to-r from-warm-gold to-yellow-100 border-warm-gold">
        <CardContent className="p-8">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-elderly-lg font-bold text-warm-gold">
              {currentStory.id}
            </div>
            <div className="flex-1">
              <h2 className="text-elderly-xl font-semibold text-gray-800 mb-2">
                第{selectedLevel}關：{getGameTitle(currentGameType)}
              </h2>
              <h3 className="text-elderly-lg font-medium text-warm-gray-700 mb-4">
                {currentStory.title} - 章節背景
              </h3>
              <p className="text-elderly-base text-warm-gray-700 mb-6 leading-relaxed">
                {currentStory.content}
              </p>
              
              {/* 開始當前關卡按鈕 */}
              <div className="flex items-center justify-center mb-6">
                <Button
                  onClick={() => onGameClick(currentGameType)}
                  className="bg-warm-gold text-white hover:bg-opacity-90 text-elderly-lg px-12 py-4"
                  data-testid={`button-start-current-game`}
                >
                  <Play className="w-6 h-6 mr-3" />
                  開始遊戲
                </Button>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
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
                        {story.games.length} 個訓練遊戲
                        {story.requiredStars > 0 && ` · 需要 ${story.requiredStars} 顆星解鎖`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-elderly-sm text-warm-gray-500">
                      {story.totalStars}/18 ⭐
                    </span>
                    {story.unlocked && (
                      <Button
                        onClick={() => {
                          // Navigate to first uncompleted game in chapter
                          const firstUncompletedGame = story.games.find(g => !g.completed);
                          if (firstUncompletedGame) {
                            onGameClick(firstUncompletedGame.type);
                          }
                        }}
                        size="sm"
                        variant={story.id === currentStory.id ? "default" : "outline"}
                        className="text-elderly-sm"
                        data-testid={`button-story-chapter-${story.id}`}
                      >
                        {story.completed ? '重玩章節' : '進入章節'}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Chapter Selector Modal */}
      {showChapterSelector && (
        <ChapterSelector
          userStars={0} // 這裡可以從 API 獲取真實的星數
          currentLevel={selectedLevel}
          onLevelSelect={(level) => {
            setSelectedLevel(level);
            setShowChapterSelector(false);
          }}
          onClose={() => setShowChapterSelector(false)}
          religion={religion}
        />
      )}
    </div>
  );
}