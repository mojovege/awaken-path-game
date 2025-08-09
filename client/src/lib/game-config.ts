// Game Configuration System
// Updated: 2025-08-08

export interface GameDifficulty {
  chapter: number;
  memoryTime: number;     // 記憶時間 (秒)
  reactionWindow: number; // 反應窗口 (毫秒)
  elementCount: number;   // 元素數量
  speedMultiplier: number; // 速度倍率
  requiredStars: number;  // 解鎖所需星數
}

export const GAME_DIFFICULTIES: GameDifficulty[] = [
  { chapter: 1, memoryTime: 10, reactionWindow: 1000, elementCount: 3, speedMultiplier: 1.0, requiredStars: 0 },
  { chapter: 2, memoryTime: 8.5, reactionWindow: 850, elementCount: 4, speedMultiplier: 1.4, requiredStars: 6 },
  { chapter: 3, memoryTime: 7, reactionWindow: 700, elementCount: 6, speedMultiplier: 1.8, requiredStars: 12 },
  { chapter: 4, memoryTime: 5.5, reactionWindow: 500, elementCount: 7, speedMultiplier: 2.2, requiredStars: 18 },
  { chapter: 5, memoryTime: 4, reactionWindow: 300, elementCount: 9, speedMultiplier: 2.5, requiredStars: 24 },
];

export interface GameType {
  id: string;
  name: string;
  category: 'memory' | 'reaction' | 'logic';
  audioType: 'zen' | 'rhythm' | 'meditation' | 'fire';
  getDuration: (difficulty: GameDifficulty) => number;
  getMaxScore: (difficulty: GameDifficulty) => number;
}

export const GAME_TYPES: Record<string, GameType> = {
  'memory-scripture': {
    id: 'memory-scripture',
    name: '經文記憶配對',
    category: 'memory',
    audioType: 'zen',
    getDuration: () => 0, // 無時間限制
    getMaxScore: (d) => d.elementCount * 20 // 每對20分
  },
  'memory-temple': {
    id: 'memory-temple',
    name: '寺廟導覽記憶',
    category: 'memory',
    audioType: 'zen',
    getDuration: (d) => d.memoryTime + 15, // 記憶時間 + 15秒作答
    getMaxScore: (d) => d.elementCount * 20 // 每個建築20分
  },
  'reaction-rhythm': {
    id: 'reaction-rhythm',
    name: '節奏跟隨訓練',
    category: 'reaction',
    audioType: 'rhythm',
    getDuration: (d) => 20 + (d.chapter - 1) * 3.75, // 20秒到35秒
    getMaxScore: (d) => Math.floor((20 + (d.chapter - 1) * 3.75) * 5) // 每秒5分
  },
  'reaction-lighting': {
    id: 'reaction-lighting',
    name: '祈福點燈',
    category: 'reaction',
    audioType: 'fire',
    getDuration: (d) => d.elementCount * (d.reactionWindow / 1000), // 燈數 × 反應時間
    getMaxScore: (d) => d.elementCount * 15 // 每燈15分
  },
  'logic-scripture': {
    id: 'logic-scripture',
    name: '經典排序',
    category: 'logic',
    audioType: 'meditation',
    getDuration: (d) => 60 - (d.chapter - 1) * 3.75, // 60秒到45秒
    getMaxScore: (d) => d.elementCount * 10 // 每個位置10分
  },
  'logic-sequence': {
    id: 'logic-sequence',
    name: '智慧序列',
    category: 'logic',
    audioType: 'meditation',
    getDuration: (d) => 30, // 固定30秒
    getMaxScore: (d) => (d.chapter + 2) * 25 // 題數 × 25分
  }
};

export const RELIGIOUS_CONTENT = {
  buddhism: {
    name: '佛教',
    emoji: '🧘‍♂️',
    buildings: ['大雄寶殿', '天王殿', '觀音殿', '藏經樓', '鐘樓', '鼓樓'],
    buildingEmojis: ['🏛️', '🏮', '🏛', '📚', '🔔', '🥁'],
    concepts: [
      { text: '念佛', match: '阿彌陀佛' },
      { text: '慈悲', match: '無緣大慈' },
      { text: '智慧', match: '般若波羅蜜' },
      { text: '禪定', match: '一心不亂' },
      { text: '功德', match: '廣種福田' },
      { text: '因果', match: '善惡有報' }
    ]
  },
  taoism: {
    name: '道教',
    emoji: '☯️',
    buildings: ['三清殿', '玉皇閣', '太極殿', '藏經閣', '鐘亭', '鼓亭'],
    buildingEmojis: ['⛩️', '🏯', '☯️', '📜', '🔔', '🥁'],
    concepts: [
      { text: '無為', match: '順其自然' },
      { text: '陰陽', match: '太極生兩儀' },
      { text: '道德', match: '上善若水' },
      { text: '修煉', match: '煉精化氣' },
      { text: '自然', match: '道法自然' },
      { text: '長生', match: '延年益壽' }
    ]
  },
  mazu: {
    name: '媽祖',
    emoji: '🌊',
    buildings: ['正殿', '媽祖廟', '觀音亭', '文昌閣', '鐘樓', '香客大樓'],
    buildingEmojis: ['🏛️', '🛕', '🏮', '📚', '🔔', '🏢'],
    concepts: [
      { text: '護佑', match: '海上平安' },
      { text: '慈航', match: '救苦救難' },
      { text: '靈驗', match: '有求必應' },
      { text: '祈福', match: '風調雨順' },
      { text: '平安', match: '出入平安' },
      { text: '豐收', match: '五穀豐登' }
    ]
  }
};

export function getChapterFromLevel(level: number): number {
  return Math.ceil(level / 6);
}

export function getGameTypeFromLevel(level: number): string {
  const gameTypes = Object.keys(GAME_TYPES);
  const gameIndex = (level - 1) % 6;
  return gameTypes[gameIndex];
}

export function getDifficultyForLevel(level: number): GameDifficulty {
  const chapter = getChapterFromLevel(level);
  return GAME_DIFFICULTIES[chapter - 1];
}

export function calculateStarRating(score: number, maxScore: number): number {
  if (maxScore === 0) return 0;
  const percentage = (score / maxScore) * 100;
  console.log('計算星級評分:', { score, maxScore, percentage });
  if (percentage >= 80) return 3;  // 80%以上得3星
  if (percentage >= 60) return 2;  // 60-79%得2星
  if (percentage >= 40) return 1;  // 40-59%得1星
  return 0; // 40%以下得0星
}