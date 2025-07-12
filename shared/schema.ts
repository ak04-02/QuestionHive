import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role", { enum: ["guest", "user", "admin"] }).notNull().default("user"),
  reputation: integer("reputation").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  authorId: integer("author_id").references(() => users.id).notNull(),
  votes: integer("votes").notNull().default(0),
  views: integer("views").notNull().default(0),
  answerCount: integer("answer_count").notNull().default(0),
  tags: text("tags").array().notNull().default([]),
  accepted: boolean("accepted").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const answers = pgTable("answers", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  questionId: integer("question_id").references(() => questions.id).notNull(),
  authorId: integer("author_id").references(() => users.id).notNull(),
  votes: integer("votes").notNull().default(0),
  accepted: boolean("accepted").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const votes = pgTable("votes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  targetId: integer("target_id").notNull(),
  targetType: text("target_type", { enum: ["question", "answer"] }).notNull(),
  voteType: text("vote_type", { enum: ["up", "down"] }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  useCount: integer("use_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
});

export const insertQuestionSchema = createInsertSchema(questions).pick({
  title: true,
  content: true,
  tags: true,
});

export const insertAnswerSchema = createInsertSchema(answers).pick({
  content: true,
  questionId: true,
});

export const insertVoteSchema = createInsertSchema(votes).pick({
  targetId: true,
  targetType: true,
  voteType: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type InsertAnswer = z.infer<typeof insertAnswerSchema>;
export type InsertVote = z.infer<typeof insertVoteSchema>;

export type User = typeof users.$inferSelect;
export type Question = typeof questions.$inferSelect;
export type Answer = typeof answers.$inferSelect;
export type Vote = typeof votes.$inferSelect;
export type Tag = typeof tags.$inferSelect;
