import { type User, type InsertUser, type GameProgress, type InsertGameProgress, 
         type UserStats, type InsertUserStats, type StoryProgress, type InsertStoryProgress,
         type ChatMessage, type InsertChatMessage, type Religion, type GameType,
         users, gameProgress, userStats, storyProgress, chatMessages } from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(userId: string, updates: Partial<Pick<User, 'displayName' | 'selectedReligion'> & { age?: number }>): Promise<User>;
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
      selectedReligion: "buddhism",
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

  async updateUser(userId: string, updates: Partial<Pick<User, 'displayName' | 'selectedReligion'> & { age?: number }>): Promise<User> {
    let user = this.users.get(userId);
    if (!user) {
      // 如果用戶不存在，先創建一個基本用戶
      user = {
        id: userId,
        username: userId,
        displayName: "新用戶",
        selectedReligion: null,
        createdAt: new Date(),
      };
      this.users.set(userId, user);
      
      // 同時初始化用戶統計
      const stats: UserStats = {
        id: randomUUID(),
        userId: userId,
        memoryProgress: 0,
        reactionProgress: 0,
        logicProgress: 0,
        focusProgress: 0,
        consecutiveDays: 0,
        totalGamesPlayed: 0,
        averageScore: 0,
      };
      this.userStats.set(userId, stats);
      
      // 初始化故事進度
      const story: StoryProgress = {
        id: randomUUID(),
        userId: userId,
        currentChapter: 1,
        chapterProgress: 0,
        completedChapters: [],
        achievements: [],
      };
      this.storyProgress.set(userId, story);
    }
    
    const updatedUser: User = {
      ...user,
      ...updates,
    };
    this.users.set(userId, updatedUser);
    return updatedUser;
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

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
      
    // Initialize user stats
    await db.insert(userStats).values({
      userId: user.id,
      memoryProgress: 0,
      reactionProgress: 0,
      logicProgress: 0,
      focusProgress: 0,
      consecutiveDays: 0,
      totalGamesPlayed: 0,
      averageScore: 0,
    });
    
    // Initialize story progress
    await db.insert(storyProgress).values({
      userId: user.id,
      currentChapter: 1,
      chapterProgress: 0,
      completedChapters: [],
      achievements: [],
    });
    
    return user;
  }

  async updateUser(userId: string, updates: Partial<Pick<User, 'displayName' | 'selectedReligion'> & { age?: number }>): Promise<User> {
    // First try to get the user by ID
    let user = await this.getUser(userId);
    
    if (!user) {
      // If user doesn't exist by ID, check if user exists by username (userId as username)
      user = await this.getUserByUsername(userId);
      
      if (!user) {
        // User doesn't exist at all, create one with the updates
        try {
          user = await this.createUser({
            username: userId,
            displayName: updates.displayName || "新用戶",
            selectedReligion: updates.selectedReligion || null,
          });
          return user;
        } catch (error) {
          // If creation fails due to unique constraint, try to get by username again
          user = await this.getUserByUsername(userId);
          if (!user) {
            throw error;
          }
        }
      }
    }
    
    // User exists, update it using the correct ID
    const [updatedUser] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, user.id))
      .returning();
      
    return updatedUser;
  }

  async updateUserReligion(userId: string, religion: Religion): Promise<User> {
    // First get the user to ensure we use the correct ID
    let user = await this.getUser(userId);
    if (!user) {
      user = await this.getUserByUsername(userId);
      if (!user) {
        throw new Error("User not found");
      }
    }
    
    const [updatedUser] = await db
      .update(users)
      .set({ selectedReligion: religion })
      .where(eq(users.id, user.id))
      .returning();
      
    if (!updatedUser) {
      throw new Error("Failed to update user religion");
    }
    
    return updatedUser;
  }

  async createGameProgress(progress: InsertGameProgress): Promise<GameProgress> {
    const [gameProgressRecord] = await db
      .insert(gameProgress)
      .values(progress)
      .returning();
    
    // Update user stats
    const [currentStats] = await db.select().from(userStats).where(eq(userStats.userId, progress.userId));
    if (currentStats) {
      const totalGames = (currentStats.totalGamesPlayed || 0) + 1;
      const currentAvg = currentStats.averageScore || 0;
      const newScore = progress.score || 0;
      
      await db
        .update(userStats)
        .set({
          totalGamesPlayed: totalGames,
          averageScore: Math.round((currentAvg * (totalGames - 1) + newScore) / totalGames),
        })
        .where(eq(userStats.userId, progress.userId));
    }
    
    return gameProgressRecord;
  }

  async getGameProgressByUser(userId: string): Promise<GameProgress[]> {
    return await db
      .select()
      .from(gameProgress)
      .where(eq(gameProgress.userId, userId))
      .orderBy(desc(gameProgress.completedAt));
  }

  async getUserStats(userId: string): Promise<UserStats | undefined> {
    const [stats] = await db.select().from(userStats).where(eq(userStats.userId, userId));
    return stats || undefined;
  }

  async updateUserStats(userId: string, statsUpdate: Partial<InsertUserStats>): Promise<UserStats> {
    // First try to update existing stats
    const [updatedStats] = await db
      .update(userStats)
      .set(statsUpdate)
      .where(eq(userStats.userId, userId))
      .returning();
      
    if (!updatedStats) {
      // If no existing stats, create new ones
      const newStats = {
        userId,
        memoryProgress: 0,
        reactionProgress: 0,
        logicProgress: 0,
        focusProgress: 0,
        consecutiveDays: 0,
        totalGamesPlayed: 0,
        averageScore: 0,
        ...statsUpdate,
      };
      
      const [createdStats] = await db
        .insert(userStats)
        .values(newStats)
        .returning();
        
      return createdStats;
    }
    
    return updatedStats;
  }

  async getStoryProgress(userId: string): Promise<StoryProgress | undefined> {
    const [progress] = await db.select().from(storyProgress).where(eq(storyProgress.userId, userId));
    return progress || undefined;
  }

  async updateStoryProgress(userId: string, progressUpdate: Partial<InsertStoryProgress>): Promise<StoryProgress> {
    // First try to update existing progress
    const [updatedProgress] = await db
      .update(storyProgress)
      .set(progressUpdate)
      .where(eq(storyProgress.userId, userId))
      .returning();
      
    if (!updatedProgress) {
      // If no existing progress, create new one
      const newProgress = {
        userId,
        currentChapter: 1,
        chapterProgress: 0,
        completedChapters: [],
        achievements: [],
        ...progressUpdate,
      };
      
      const [createdProgress] = await db
        .insert(storyProgress)
        .values(newProgress)
        .returning();
        
      return createdProgress;
    }
    
    return updatedProgress;
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const [chatMessage] = await db
      .insert(chatMessages)
      .values(message)
      .returning();
      
    return chatMessage;
  }

  async getChatMessages(userId: string, limit: number = 50): Promise<ChatMessage[]> {
    return await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.userId, userId))
      .orderBy(chatMessages.createdAt)
      .limit(limit);
  }
}

export const storage = new DatabaseStorage();
