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
            content: '一位年長者來到寺院，學習靜心觀想和慈悲心。透過記憶佛陀的智慧話語，跟隨木魚聲節奏誦經，在佛前點燈祈願，理解基本的佛理教導，學會排序簡單的修行步驟。每一個動作都是為了培養內心的平靜與慈悲。',
            games: baseGames.map(g => ({ ...g, title: g.title.replace('木魚', '木魚') })),
            unlocked: true,
            completed: false,
            totalStars: 0,
            requiredStars: 0,
          },
          {
            id: 2,
            title: '勤修精進',
            content: '修行者開始更深入地學習，記住各種善行與功德，掌握更複雜的誦經節拍，學會點亮代表智慧的燈火序列，理解因果報應的道理，並能安排日常修行的順序。持之以恆是通往智慧的關鍵。',
            games: baseGames.map(g => ({ ...g })),
            unlocked: false,
            completed: false,
            totalStars: 0,
            requiredStars: 6,
          },
          {
            id: 3,
            title: '智慧開悟',
            content: '經過長期修行，修行者開始領悟更深的佛法智慧。能記住各種佛教典故和寺院建築意義，與清晨鐘聲完美同步，點燃象徵覺悟的明燈，深入理解空性和無常的道理，正確安排複雜的修行課程。',
            games: baseGames.map(g => ({ ...g })),
            unlocked: false,
            completed: false,
            totalStars: 0,
            requiredStars: 12,
          },
          {
            id: 4,
            title: '深度修行',
            content: '修行者進入更高的修行層次，能夠記住深奧的佛學概念，在快速變化的節拍中保持專注，以正確順序點亮代表菩提道的燈火，理解中觀哲學和唯識學說，安排精密的禪修次第。',
            games: baseGames.map(g => ({ ...g })),
            unlocked: false,
            completed: false,
            totalStars: 0,
            requiredStars: 18,
          },
          {
            id: 5,
            title: '圓滿境界',
            content: '達到了修行的最高境界，成為能夠指導他人的智者。完全掌握各種佛法要義，在任何節拍下都能保持內心平靜，點亮最複雜的智慧燈陣，完全理解緣起性空的深義，能夠完美安排利益眾生的各種方法。',
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
            content: '一位尋道者來到山中道觀，開始學習道法自然的智慧。記住基本的道德經句子，跟隨古鐘的悠揚聲響，點燃心燈照亮前路，理解陰陽平衡的基礎概念，學會安排簡單的修煉步驟。',
            games: taoGames.map(g => ({ ...g })),
            unlocked: true,
            completed: false,
            totalStars: 0,
            requiredStars: 0,
          },
          {
            id: 2,
            title: '勤修精進',
            content: '修道者深入學習五行相生相剋的道理，記住各種天地自然的規律，掌握更複雜的鐘鼓節拍，點亮代表五行的燈火，理解太極圖的變化，安排更精密的煉氣方法。',
            games: taoGames.map(g => ({ ...g })),
            unlocked: false,
            completed: false,
            totalStars: 0,
            requiredStars: 6,
          },
          {
            id: 3,
            title: '智慧開悟',
            content: '通過持續修煉，修道者開始與天地同頻共振。能記住複雜的道家典籍，在變化的節拍中找到不變的道，點燃象徵天人合一的燈陣，深度理解無為而治的智慧，正確安排內丹修煉的次序。',
            games: taoGames.map(g => ({ ...g })),
            unlocked: false,
            completed: false,
            totalStars: 0,
            requiredStars: 12,
          },
          {
            id: 4,
            title: '深度修行',
            content: '修道者達到更高的境界，開始理解宇宙運行的深層規律。掌握高深的道學理論，在快速節拍中保持如水般的柔韌，以精確順序點亮北斗七星燈陣，理解返璞歸真的真義，安排復雜的修真方法。',
            games: taoGames.map(g => ({ ...g })),
            unlocked: false,
            completed: false,
            totalStars: 0,
            requiredStars: 18,
          },
          {
            id: 5,
            title: '圓滿境界',
            content: '成為得道高人，具備了濟世救人的能力。完全融會貫通道家思想，任何節拍都不能動搖其內心的寧靜，點亮最高層次的仙家燈陣，完全理解道的本質，能夠安排幫助眾生的各種方便法門。',
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
            content: '一位漁村子弟開始學習媽祖的慈悲精神。記住媽祖救苦救難的故事，跟隨廟會鑣鼓的熱鬧節拍，點燃祈求平安的明燈，理解助人為樂的道理，學會安排簡單的行善步驟。',
            games: mazuGames.map(g => ({ ...g })),
            unlocked: true,
            completed: false,
            totalStars: 0,
            requiredStars: 0,
          },
          {
            id: 2,
            title: '勤修精進',
            content: '信徒更深入理解媽祖的大愛精神，記住各種行善積德的方法，掌握更複雜的廟會節慶節拍，點亮代表家庭和睦的燈火，理解守護家園的重要，安排更多的善行計畫。',
            games: mazuGames.map(g => ({ ...g })),
            unlocked: false,
            completed: false,
            totalStars: 0,
            requiredStars: 6,
          },
          {
            id: 3,
            title: '智慧開悟',
            content: '通過不斷的善行，信徒開始體會媽祖無私奉獻的精神。能記住複雜的媽祖靈驗故事，在變化的鑣鼓聲中找到內心的安定，點燃象徵社區和諧的燈陣，深入理解海納百川的胸懷，正確安排社區服務的順序。',
            games: mazuGames.map(g => ({ ...g })),
            unlocked: false,
            completed: false,
            totalStars: 0,
            requiredStars: 12,
          },
          {
            id: 4,
            title: '深度修行',
            content: '信徒成長為能夠幫助他人的善心人士。掌握各種助人技巧和智慧，在激昂的節拍中保持慈悲的心境，以精準順序點亮代表眾生平安的燈火，理解犧牲奉獻的真諦，安排複雜的公益活動。',
            games: mazuGames.map(g => ({ ...g })),
            unlocked: false,
            completed: false,
            totalStars: 0,
            requiredStars: 18,
          },
          {
            id: 5,
            title: '圓滿境界',
            content: '成為如媽祖一般的慈悲使者，時刻守護著需要幫助的人。完全體現媽祖的慈悲智慧，任何困難都不能阻擋其助人的決心，點亮最神聖的護佑眾生燈陣，完全理解無條件大愛的意義，能夠安排各種濟世救人的方法。',
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
  const currentStory = stories.find(s => s.unlocked && !s.completed) || stories[0];

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
              
              {/* Games in Chapter */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                {currentStory.games.map((game, index) => (
                  <Button
                    key={game.type}
                    onClick={() => onGameClick(game.type)}
                    variant="outline"
                    size="sm"
                    className="text-elderly-sm h-auto py-3 text-left flex flex-col items-center"
                    data-testid={`button-chapter-game-${game.type}`}
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-warm-gold bg-opacity-20 rounded-full mb-2">
                      <span className="text-elderly-sm font-semibold">{index + 1}</span>
                    </div>
                    <span className="text-center">{game.title}</span>
                    {game.stars > 0 && (
                      <div className="flex mt-1">
                        {Array.from({ length: Math.min(game.stars, 3) }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-yellow-500 fill-current" />
                        ))}
                      </div>
                    )}
                  </Button>
                ))}
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
    </div>
  );
}