import { type User, type InsertUser, type GameProgress, type InsertGameProgress, 
         type UserStats, type InsertUserStats, type StoryProgress, type InsertStoryProgress,
         type ChatMessage, type InsertChatMessage, type Religion, type GameType } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserReligion(userId: string, religion: Religion): Promise<User>;
  
  // Game progress
  createGameProgress(progress: InsertGameProgress): Promise<GameProgress>;
  getGameProgressByUser(userId: string): Promise<GameProgress[]>;
  
  // User stats
  getUserStats(userId: string): Promise<UserStats | undefined>;
  updateUserStats(userId: string, stats: Partial<InsertUserStats>): Promise<UserStats>;
  
  // Story progress
  getStoryProgress(userId: string): Promise<StoryProgress | undefined>;
  updateStoryProgress(userId: string, progress: Partial<InsertStoryProgress>): Promise<StoryProgress>;
  
  // Chat messages
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatMessages(userId: string, limit?: number): Promise<ChatMessage[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private gameProgress: Map<string, GameProgress> = new Map();
  private userStats: Map<string, UserStats> = new Map();
  private storyProgress: Map<string, StoryProgress> = new Map();
  private chatMessages: Map<string, ChatMessage> = new Map();

  constructor() {
    // Initialize with demo user
    const demoUser: User = {
      id: "demo-user-1",
      username: "demo",
      displayName: "王阿嬤",
      selectedReligion: null,
      createdAt: new Date(),
    };
    this.users.set(demoUser.id, demoUser);
    
    // Initialize demo stats
    const demoStats: UserStats = {
      id: randomUUID(),
      userId: demoUser.id,
      memoryProgress: 75,
      reactionProgress: 50,
      logicProgress: 25,
      focusProgress: 100,
      consecutiveDays: 12,
      totalGamesPlayed: 48,
      averageScore: 87,
    };
    this.userStats.set(demoUser.id, demoStats);
    
    // Initialize demo story progress
    const demoStory: StoryProgress = {
      id: randomUUID(),
      userId: demoUser.id,
      currentChapter: 3,
      chapterProgress: 60,
      completedChapters: ["1", "2"],
      achievements: ["記憶大師"],
    };
    this.storyProgress.set(demoUser.id, demoStory);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date(),
      selectedReligion: insertUser.selectedReligion || null,
    };
    this.users.set(id, user);
    
    // Initialize user stats
    const stats: UserStats = {
      id: randomUUID(),
      userId: id,
      memoryProgress: 0,
      reactionProgress: 0,
      logicProgress: 0,
      focusProgress: 0,
      consecutiveDays: 0,
      totalGamesPlayed: 0,
      averageScore: 0,
    };
    this.userStats.set(id, stats);
    
    // Initialize story progress
    const story: StoryProgress = {
      id: randomUUID(),
      userId: id,
      currentChapter: 1,
      chapterProgress: 0,
      completedChapters: [],
      achievements: [],
    };
    this.storyProgress.set(id, story);
    
    return user;
  }

  async updateUserReligion(userId: string, religion: Religion): Promise<User> {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error("User not found");
    }
    
    const updatedUser = { ...user, selectedReligion: religion };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async createGameProgress(progress: InsertGameProgress): Promise<GameProgress> {
    const id = randomUUID();
    const gameProgress: GameProgress = {
      ...progress,
      id,
      score: progress.score || 0,
      level: progress.level || 1,
      completedAt: new Date(),
    };
    this.gameProgress.set(id, gameProgress);
    
    // Update user stats
    const stats = this.userStats.get(progress.userId);
    if (stats) {
      const totalGames = (stats.totalGamesPlayed || 0) + 1;
      const currentAvg = stats.averageScore || 0;
      const newScore = progress.score || 0;
      const updatedStats = {
        ...stats,
        totalGamesPlayed: totalGames,
        averageScore: Math.round((currentAvg * (totalGames - 1) + newScore) / totalGames),
      };
      this.userStats.set(progress.userId, updatedStats);
    }
    
    return gameProgress;
  }

  async getGameProgressByUser(userId: string): Promise<GameProgress[]> {
    return Array.from(this.gameProgress.values())
      .filter(progress => progress.userId === userId)
      .sort((a, b) => b.completedAt!.getTime() - a.completedAt!.getTime());
  }

  async getUserStats(userId: string): Promise<UserStats | undefined> {
    return this.userStats.get(userId);
  }

  async updateUserStats(userId: string, statsUpdate: Partial<InsertUserStats>): Promise<UserStats> {
    const existing = this.userStats.get(userId);
    if (!existing) {
      throw new Error("User stats not found");
    }
    
    const updated = { ...existing, ...statsUpdate };
    this.userStats.set(userId, updated);
    return updated;
  }

  async getStoryProgress(userId: string): Promise<StoryProgress | undefined> {
    return this.storyProgress.get(userId);
  }

  async updateStoryProgress(userId: string, progressUpdate: Partial<InsertStoryProgress>): Promise<StoryProgress> {
    const existing = this.storyProgress.get(userId);
    if (!existing) {
      throw new Error("Story progress not found");
    }
    
    const updated = { ...existing, ...progressUpdate };
    this.storyProgress.set(userId, updated);
    return updated;
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const chatMessage: ChatMessage = {
      ...message,
      id,
      isAI: message.isAI || false,
      aiPersona: message.aiPersona || null,
      createdAt: new Date(),
    };
    this.chatMessages.set(id, chatMessage);
    return chatMessage;
  }

  async getChatMessages(userId: string, limit: number = 50): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values())
      .filter(msg => msg.userId === userId)
      .sort((a, b) => a.createdAt!.getTime() - b.createdAt!.getTime())
      .slice(-limit);
  }
}

export const storage = new MemStorage();
