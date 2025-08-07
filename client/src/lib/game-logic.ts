import { type Religion, type GameType } from "@shared/schema";

export interface GameDifficulty {
  level: number;
  chapter: number;
  timeLimit: number;
  pointsMultiplier: number;
  hintsAvailable: number;
  memoryTime: number;
  reactionWindow: number;
  gridSize: number;
  sequenceLength: number;
}

export interface ChapterInfo {
  id: number;
  name: string;
  description: string;
  levels: number[];
  unlockRequirement: number; // minimum stars needed to unlock
}

export const CHAPTERS: ChapterInfo[] = [
  { id: 1, name: "初心啟蒙", description: "踏出修行第一步，建立基礎能力", levels: [1, 2, 3], unlockRequirement: 0 },
  { id: 2, name: "勤修精進", description: "持續練習，提升認知技能", levels: [4, 5, 6], unlockRequirement: 6 },
  { id: 3, name: "智慧開悟", description: "深化理解，開發智慧潛能", levels: [7, 8, 9], unlockRequirement: 12 },
  { id: 4, name: "深度修行", description: "挑戰自我，達到更高境界", levels: [10, 11, 12], unlockRequirement: 18 },
  { id: 5, name: "圓滿境界", description: "融會貫通，達成完美修行", levels: [13, 14, 15], unlockRequirement: 24 },
];

export const DIFFICULTY_LEVELS: Record<number, GameDifficulty> = {
  1: { level: 1, chapter: 1, timeLimit: 120, pointsMultiplier: 1, hintsAvailable: 999, memoryTime: 15, reactionWindow: 800, gridSize: 3, sequenceLength: 2 },
  2: { level: 2, chapter: 1, timeLimit: 110, pointsMultiplier: 1.1, hintsAvailable: 999, memoryTime: 14, reactionWindow: 750, gridSize: 4, sequenceLength: 3 },
  3: { level: 3, chapter: 1, timeLimit: 100, pointsMultiplier: 1.2, hintsAvailable: 999, memoryTime: 13, reactionWindow: 700, gridSize: 6, sequenceLength: 4 },
  4: { level: 4, chapter: 2, timeLimit: 95, pointsMultiplier: 1.3, hintsAvailable: 3, memoryTime: 12, reactionWindow: 650, gridSize: 6, sequenceLength: 4 },
  5: { level: 5, chapter: 2, timeLimit: 90, pointsMultiplier: 1.4, hintsAvailable: 3, memoryTime: 11, reactionWindow: 600, gridSize: 8, sequenceLength: 5 },
  6: { level: 6, chapter: 2, timeLimit: 85, pointsMultiplier: 1.5, hintsAvailable: 3, memoryTime: 10, reactionWindow: 550, gridSize: 9, sequenceLength: 6 },
  7: { level: 7, chapter: 3, timeLimit: 80, pointsMultiplier: 1.6, hintsAvailable: 2, memoryTime: 10, reactionWindow: 500, gridSize: 9, sequenceLength: 7 },
  8: { level: 8, chapter: 3, timeLimit: 75, pointsMultiplier: 1.7, hintsAvailable: 2, memoryTime: 9, reactionWindow: 450, gridSize: 12, sequenceLength: 8 },
  9: { level: 9, chapter: 3, timeLimit: 70, pointsMultiplier: 1.8, hintsAvailable: 2, memoryTime: 8, reactionWindow: 400, gridSize: 12, sequenceLength: 8 },
  10: { level: 10, chapter: 4, timeLimit: 65, pointsMultiplier: 1.9, hintsAvailable: 1, memoryTime: 8, reactionWindow: 400, gridSize: 15, sequenceLength: 9 },
  11: { level: 11, chapter: 4, timeLimit: 60, pointsMultiplier: 2.0, hintsAvailable: 1, memoryTime: 7, reactionWindow: 350, gridSize: 18, sequenceLength: 10 },
  12: { level: 12, chapter: 4, timeLimit: 55, pointsMultiplier: 2.1, hintsAvailable: 1, memoryTime: 6, reactionWindow: 300, gridSize: 18, sequenceLength: 10 },
  13: { level: 13, chapter: 5, timeLimit: 50, pointsMultiplier: 2.2, hintsAvailable: 0, memoryTime: 6, reactionWindow: 300, gridSize: 20, sequenceLength: 12 },
  14: { level: 14, chapter: 5, timeLimit: 45, pointsMultiplier: 2.3, hintsAvailable: 0, memoryTime: 5, reactionWindow: 250, gridSize: 24, sequenceLength: 14 },
  15: { level: 15, chapter: 5, timeLimit: 40, pointsMultiplier: 2.5, hintsAvailable: 0, memoryTime: 5, reactionWindow: 250, gridSize: 24, sequenceLength: 15 },
};

export function calculateScore(
  timeRemaining: number,
  totalTime: number,
  difficulty: number,
  isCorrect: boolean
): number {
  if (!isCorrect) return 0;
  
  const baseScore = 50;
  const timeBonus = Math.floor((timeRemaining / totalTime) * 50);
  const difficultyMultiplier = DIFFICULTY_LEVELS[difficulty]?.pointsMultiplier || 1;
  
  return Math.floor((baseScore + timeBonus) * difficultyMultiplier);
}

export function getDifficultyForLevel(level: number): GameDifficulty {
  return DIFFICULTY_LEVELS[level] || DIFFICULTY_LEVELS[1];
}

export function getChapterForLevel(level: number): ChapterInfo {
  return CHAPTERS.find(chapter => chapter.levels.includes(level)) || CHAPTERS[0];
}

export function calculateStarRating(score: number, timeRemaining: number, totalTime: number): number {
  const timeRatio = timeRemaining / totalTime;
  const timeBonus = timeRatio * 20;
  const finalScore = score + timeBonus;
  
  if (finalScore >= 90) return 3;
  if (finalScore >= 80) return 2;
  if (finalScore >= 60) return 1;
  return 0;
}

export function isChapterUnlocked(chapterIndex: number, totalStars: number): boolean {
  const chapter = CHAPTERS[chapterIndex];
  return totalStars >= chapter.unlockRequirement;
}

export function shouldShowHint(
  timeRemaining: number,
  totalTime: number,
  hintsUsed: number,
  hintsAvailable: number
): boolean {
  const timeRatio = timeRemaining / totalTime;
  return timeRatio < 0.3 && hintsUsed < hintsAvailable;
}

export function generateProgressUpdate(
  gameType: GameType,
  score: number,
  questionsAnswered: number
): {
  memoryProgress?: number;
  reactionProgress?: number;
  logicProgress?: number;
  focusProgress?: number;
} {
  const baseProgress = Math.min(100, (questionsAnswered / 5) * 25);
  const bonusProgress = Math.min(25, score / 100);
  const totalProgress = Math.min(100, baseProgress + bonusProgress);
  
  switch (gameType) {
    case 'memory-scripture':
    case 'memory-temple':
      return { memoryProgress: totalProgress };
    case 'reaction-rhythm':
    case 'reaction-lighting':
      return { reactionProgress: totalProgress };
    case 'logic-scripture':
    case 'logic-sequence':
      return { logicProgress: totalProgress };
    default:
      return { focusProgress: totalProgress };
  }
}

export const GAME_CATEGORIES = {
  memory: {
    name: '記憶訓練',
    color: 'warm-gold',
    icon: '🧠',
    description: '強化記憶・活化大腦',
  },
  reaction: {
    name: '反應訓練',
    color: 'soft-red', 
    icon: '⏱️',
    description: '提升反應・手眼協調',
  },
  logic: {
    name: '邏輯思考',
    color: 'sage-green',
    icon: '🧩',
    description: '啟發智慧・邏輯推理',
  },
  focus: {
    name: '專注訓練',
    color: 'ocean-blue',
    icon: '🎯',
    description: '集中注意・提升專注',
  },
};

export function getGameCategory(gameType: GameType): keyof typeof GAME_CATEGORIES {
  if (gameType.startsWith('memory')) return 'memory';
  if (gameType.startsWith('reaction')) return 'reaction';
  if (gameType.startsWith('logic')) return 'logic';
  return 'focus';
}

export function formatGameStats(stats: {
  totalGamesPlayed: number;
  averageScore: number;
  bestScore?: number;
  averageTime?: number;
}): string {
  const { totalGamesPlayed, averageScore, bestScore, averageTime } = stats;
  
  let result = `已完成 ${totalGamesPlayed} 場遊戲，平均得分 ${averageScore} 分`;
  
  if (bestScore) {
    result += `，最高得分 ${bestScore} 分`;
  }
  
  if (averageTime) {
    const mins = Math.floor(averageTime / 60);
    const secs = Math.floor(averageTime % 60);
    result += `，平均用時 ${mins}分${secs}秒`;
  }
  
  return result;
}
