import { type Religion, type GameType } from "@shared/schema";

export interface GameDifficulty {
  level: 1 | 2 | 3 | 4 | 5;
  timeLimit: number;
  pointsMultiplier: number;
  hintsAvailable: number;
}

export const DIFFICULTY_LEVELS: Record<number, GameDifficulty> = {
  1: { level: 1, timeLimit: 120, pointsMultiplier: 1, hintsAvailable: 3 },
  2: { level: 2, timeLimit: 100, pointsMultiplier: 1.2, hintsAvailable: 2 },
  3: { level: 3, timeLimit: 90, pointsMultiplier: 1.5, hintsAvailable: 2 },
  4: { level: 4, timeLimit: 75, pointsMultiplier: 1.8, hintsAvailable: 1 },
  5: { level: 5, timeLimit: 60, pointsMultiplier: 2, hintsAvailable: 1 },
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

export function getDifficultyForQuestion(questionNumber: number): number {
  // Gradually increase difficulty
  if (questionNumber <= 2) return 1;
  if (questionNumber <= 4) return 2;
  if (questionNumber <= 6) return 3;
  if (questionNumber <= 8) return 4;
  return 5;
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
