import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateAIResponse, generateHealthTip, generateGameQuestion } from "./services/openai";
import { insertUserSchema, insertGameProgressSchema, insertChatMessageSchema, type Religion } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.get("/api/user/:id", async (req, res) => {
    try {
      let user = await storage.getUser(req.params.id);
      
      // If user not found by ID, try to find by username
      if (!user) {
        user = await storage.getUserByUsername(req.params.id);
      }
      
      // If still not found, create a new user
      if (!user) {
        try {
          const newUser = {
            username: req.params.id,
            displayName: "新用戶", // 會在用戶設定頁面更新
            selectedReligion: null,
          };
          user = await storage.createUser(newUser);
        } catch (createError) {
          // If creation fails due to unique constraint, try to find by username again
          user = await storage.getUserByUsername(req.params.id);
          if (!user) {
            throw createError;
          }
        }
      }
      
      res.json(user);
    } catch (error) {
      console.error("Error getting user:", error);
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  app.post("/api/user", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.put("/api/user/:id", async (req, res) => {
    try {
      const user = await storage.updateUser(req.params.id, req.body);
      res.json(user);
    } catch (error) {
      console.error("Error updating user:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      res.status(400).json({ message: "Failed to update user", error: errorMessage });
    }
  });

  app.put("/api/user/:id/religion", async (req, res) => {
    try {
      const { religion } = req.body;
      const user = await storage.updateUserReligion(req.params.id, religion as Religion);
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: "Failed to update religion" });
    }
  });

  // Stats routes
  app.get("/api/user/:id/stats", async (req, res) => {
    try {
      let stats = await storage.getUserStats(req.params.id);
      
      // If stats don't exist, get user (by ID or username) and create stats
      if (!stats) {
        let user = await storage.getUser(req.params.id);
        if (!user) {
          user = await storage.getUserByUsername(req.params.id);
        }
        
        if (user) {
          // Use the user's actual ID for stats operations
          stats = await storage.updateUserStats(user.id, {
            memoryProgress: 0,
            reactionProgress: 0,
            logicProgress: 0,
            focusProgress: 0,
            consecutiveDays: 0,
            totalGamesPlayed: 0,
            averageScore: 0,
          });
        }
      }
      
      if (!stats) {
        return res.status(404).json({ message: "Stats not found" });
      }
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to get stats" });
    }
  });

  app.put("/api/user/:id/stats", async (req, res) => {
    try {
      const stats = await storage.updateUserStats(req.params.id, req.body);
      res.json(stats);
    } catch (error) {
      res.status(400).json({ message: "Failed to update stats" });
    }
  });

  // Story progress routes
  app.get("/api/user/:id/story", async (req, res) => {
    try {
      let story = await storage.getStoryProgress(req.params.id);
      
      // If story doesn't exist, get user (by ID or username) and create story progress
      if (!story) {
        let user = await storage.getUser(req.params.id);
        if (!user) {
          user = await storage.getUserByUsername(req.params.id);
        }
        
        if (user) {
          // Use the user's actual ID for story operations
          story = await storage.updateStoryProgress(user.id, {
            currentChapter: 1,
            chapterProgress: 0,
            completedChapters: [],
            achievements: [],
          });
        }
      }
      
      if (!story) {
        return res.status(404).json({ message: "Story progress not found" });
      }
      res.json(story);
    } catch (error) {
      res.status(500).json({ message: "Failed to get story progress" });
    }
  });

  app.put("/api/user/:id/story", async (req, res) => {
    try {
      const story = await storage.updateStoryProgress(req.params.id, req.body);
      res.json(story);
    } catch (error) {
      res.status(400).json({ message: "Failed to update story progress" });
    }
  });

  // Game routes
  app.post("/api/game/progress", async (req, res) => {
    try {
      const progressData = insertGameProgressSchema.parse(req.body);
      const progress = await storage.createGameProgress(progressData);
      res.json(progress);
    } catch (error) {
      res.status(400).json({ message: "Invalid progress data" });
    }
  });

  app.post("/api/user/:id/progress", async (req, res) => {
    try {
      // Get the user first to ensure we use correct ID
      let user = await storage.getUser(req.params.id);
      if (!user) {
        user = await storage.getUserByUsername(req.params.id);
      }
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const progressData = {
        userId: user.id,
        gameType: req.body.gameType,
        score: req.body.score || 0,
        stars: req.body.stars || 0,
        level: req.body.level || 1,
      };
      
      const progress = await storage.createGameProgress(progressData);
      
      console.log('遊戲進度已保存:', {
        用戶: user.username,
        遊戲類型: progressData.gameType,
        分數: progressData.score,
        星級: progressData.stars,
        等級: progressData.level
      });
      
      res.json(progress);
    } catch (error) {
      console.error('保存遊戲進度時出錯:', error);
      res.status(400).json({ message: "Failed to save game progress" });
    }
  });

  app.get("/api/user/:id/game-progress", async (req, res) => {
    try {
      const progress = await storage.getGameProgressByUser(req.params.id);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to get game progress" });
    }
  });

  app.post("/api/game/question", async (req, res) => {
    try {
      const { gameType, religion, difficulty } = req.body;
      const question = await generateGameQuestion(gameType, religion, difficulty || 3);
      res.json(question);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate question" });
    }
  });

  // AI Chat routes
  app.post("/api/chat", async (req, res) => {
    try {
      const messageData = insertChatMessageSchema.parse(req.body);
      const userMessage = await storage.createChatMessage(messageData);
      
      const user = await storage.getUser(messageData.userId);
      const stats = await storage.getUserStats(messageData.userId);
      
      if (!user?.selectedReligion) {
        return res.status(400).json({ message: "Religion not selected" });
      }
      
      const aiResponse = await generateAIResponse(
        messageData.message,
        user.selectedReligion as Religion,
        user.displayName,
        { recentProgress: stats }
      );
      
      const aiMessage = await storage.createChatMessage({
        userId: messageData.userId,
        message: aiResponse,
        isAI: true,
        aiPersona: user.selectedReligion,
      });
      
      res.json({ userMessage, aiMessage });
    } catch (error) {
      res.status(400).json({ message: "Failed to process chat" });
    }
  });

  app.get("/api/user/:id/chat", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const messages = await storage.getChatMessages(req.params.id, limit);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to get chat messages" });
    }
  });

  // Health tips
  app.get("/api/health-tip/:religion", async (req, res) => {
    try {
      const tip = await generateHealthTip(req.params.religion as Religion);
      res.json({ tip });
    } catch (error) {
      res.status(500).json({ message: "Failed to get health tip" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
