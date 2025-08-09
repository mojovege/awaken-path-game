import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  displayName: text("display_name").notNull(),
  selectedReligion: text("selected_religion"),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const gameProgress = pgTable("game_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  gameType: text("game_type").notNull(),
  score: integer("score").default(0),
  stars: integer("stars").default(0),
  level: integer("level").default(1),
  completedAt: timestamp("completed_at").default(sql`now()`),
});

export const userStats = pgTable("user_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  memoryProgress: integer("memory_progress").default(0),
  reactionProgress: integer("reaction_progress").default(0),
  logicProgress: integer("logic_progress").default(0),
  focusProgress: integer("focus_progress").default(0),
  consecutiveDays: integer("consecutive_days").default(0),
  totalGamesPlayed: integer("total_games_played").default(0),
  averageScore: integer("average_score").default(0),
});

export const storyProgress = pgTable("story_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  currentChapter: integer("current_chapter").default(1),
  chapterProgress: integer("chapter_progress").default(0),
  completedChapters: text("completed_chapters").array().default([]),
  achievements: text("achievements").array().default([]),
});

export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  message: text("message").notNull(),
  isAI: boolean("is_ai").default(false),
  aiPersona: text("ai_persona"),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertGameProgressSchema = createInsertSchema(gameProgress).omit({
  id: true,
  completedAt: true,
});

export const insertUserStatsSchema = createInsertSchema(userStats).omit({
  id: true,
});

export const insertStoryProgressSchema = createInsertSchema(storyProgress).omit({
  id: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertGameProgress = z.infer<typeof insertGameProgressSchema>;
export type GameProgress = typeof gameProgress.$inferSelect;

export type InsertUserStats = z.infer<typeof insertUserStatsSchema>;
export type UserStats = typeof userStats.$inferSelect;

export type InsertStoryProgress = z.infer<typeof insertStoryProgressSchema>;
export type StoryProgress = typeof storyProgress.$inferSelect;

export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;

export type Religion = "buddhism" | "taoism" | "mazu";

export type GameType = "memory-scripture" | "memory-temple" | "reaction-rhythm" | "reaction-lighting" | "logic-scripture" | "logic-sequence";

export interface GameQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: 1 | 2 | 3 | 4 | 5;
  religion: Religion;
}

export interface HealthTip {
  id: string;
  title: string;
  content: string;
  category: "nutrition" | "exercise" | "mental" | "sleep";
}

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  gameProgress: many(gameProgress),
  userStats: one(userStats, {
    fields: [users.id],
    references: [userStats.userId],
  }),
  storyProgress: one(storyProgress, {
    fields: [users.id],
    references: [storyProgress.userId],
  }),
  chatMessages: many(chatMessages),
}));

export const gameProgressRelations = relations(gameProgress, ({ one }) => ({
  user: one(users, {
    fields: [gameProgress.userId],
    references: [users.id],
  }),
}));

export const userStatsRelations = relations(userStats, ({ one }) => ({
  user: one(users, {
    fields: [userStats.userId],
    references: [users.id],
  }),
}));

export const storyProgressRelations = relations(storyProgress, ({ one }) => ({
  user: one(users, {
    fields: [storyProgress.userId],
    references: [users.id],
  }),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  user: one(users, {
    fields: [chatMessages.userId],
    references: [users.id],
  }),
}));
