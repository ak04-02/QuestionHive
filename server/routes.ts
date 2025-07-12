import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertQuestionSchema, insertAnswerSchema, insertVoteSchema } from "@shared/schema";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const user = await storage.createUser(userData);
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: "Invalid data" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(email);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(400).json({ message: "Invalid data" });
    }
  });

  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Question routes
  app.get("/api/questions", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;
      const questions = await storage.getQuestions(limit, offset);
      res.json(questions);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/questions/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Query parameter required" });
      }
      const questions = await storage.searchQuestions(query);
      res.json(questions);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/questions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const question = await storage.getQuestion(id);
      if (!question) {
        return res.status(404).json({ message: "Question not found" });
      }
      
      // Increment view count
      await storage.updateQuestionViews(id);
      res.json(question);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/questions", async (req, res) => {
    try {
      const questionData = insertQuestionSchema.parse(req.body);
      const authorId = req.body.authorId || 1; // Mock user ID
      
      const question = await storage.createQuestion({ ...questionData, authorId });
      res.status(201).json(question);
    } catch (error) {
      res.status(400).json({ message: "Invalid data" });
    }
  });

  // Answer routes
  app.get("/api/questions/:id/answers", async (req, res) => {
    try {
      const questionId = parseInt(req.params.id);
      const answers = await storage.getAnswersByQuestion(questionId);
      res.json(answers);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/answers", async (req, res) => {
    try {
      const answerData = insertAnswerSchema.parse(req.body);
      const authorId = req.body.authorId || 1; // Mock user ID
      
      const answer = await storage.createAnswer({ ...answerData, authorId });
      
      // Update question answer count
      const currentAnswers = await storage.getAnswersByQuestion(answerData.questionId);
      await storage.updateQuestionAnswerCount(answerData.questionId, currentAnswers.length + 1);
      
      res.status(201).json(answer);
    } catch (error) {
      res.status(400).json({ message: "Invalid data" });
    }
  });

  // Vote routes
  app.post("/api/votes", async (req, res) => {
    try {
      const voteData = insertVoteSchema.parse(req.body);
      const userId = req.body.userId || 1; // Mock user ID
      
      // Check if user already voted
      const existingVote = await storage.getVote(userId, voteData.targetId, voteData.targetType);
      
      if (existingVote) {
        if (existingVote.voteType === voteData.voteType) {
          // Remove vote if same type
          await storage.deleteVote(userId, voteData.targetId, voteData.targetType);
          
          // Update vote count
          if (voteData.targetType === "question") {
            const question = await storage.getQuestion(voteData.targetId);
            if (question) {
              const newVotes = question.votes + (voteData.voteType === "up" ? -1 : 1);
              await storage.updateQuestionVotes(voteData.targetId, newVotes);
            }
          } else {
            const answer = await storage.getAnswer(voteData.targetId);
            if (answer) {
              const newVotes = answer.votes + (voteData.voteType === "up" ? -1 : 1);
              await storage.updateAnswerVotes(voteData.targetId, newVotes);
            }
          }
          
          return res.json({ message: "Vote removed" });
        } else {
          // Update vote type
          await storage.deleteVote(userId, voteData.targetId, voteData.targetType);
          const vote = await storage.createVote({ ...voteData, userId });
          
          // Update vote count (change from opposite to current)
          const changeValue = voteData.voteType === "up" ? 2 : -2;
          
          if (voteData.targetType === "question") {
            const question = await storage.getQuestion(voteData.targetId);
            if (question) {
              await storage.updateQuestionVotes(voteData.targetId, question.votes + changeValue);
            }
          } else {
            const answer = await storage.getAnswer(voteData.targetId);
            if (answer) {
              await storage.updateAnswerVotes(voteData.targetId, answer.votes + changeValue);
            }
          }
          
          return res.json(vote);
        }
      } else {
        // Create new vote
        const vote = await storage.createVote({ ...voteData, userId });
        
        // Update vote count
        const changeValue = voteData.voteType === "up" ? 1 : -1;
        
        if (voteData.targetType === "question") {
          const question = await storage.getQuestion(voteData.targetId);
          if (question) {
            await storage.updateQuestionVotes(voteData.targetId, question.votes + changeValue);
          }
        } else {
          const answer = await storage.getAnswer(voteData.targetId);
          if (answer) {
            await storage.updateAnswerVotes(voteData.targetId, answer.votes + changeValue);
          }
        }
        
        res.status(201).json(vote);
      }
    } catch (error) {
      res.status(400).json({ message: "Invalid data" });
    }
  });

  // Users routes
  app.get("/api/users", async (req, res) => {
    try {
      // For demo purposes, return mock users data
      // In production, this would fetch from storage.getUsers()
      const mockUsers = [
        {
          id: 1,
          username: "john_doe",
          email: "john@example.com",
          reputation: 1234,
          role: "user",
          createdAt: new Date("2024-01-15"),
          updatedAt: new Date("2024-01-15")
        },
        {
          id: 2,
          username: "alice_smith",
          email: "alice@example.com",
          reputation: 567,
          role: "admin",
          createdAt: new Date("2024-02-10"),
          updatedAt: new Date("2024-02-10")
        },
        {
          id: 3,
          username: "mike_johnson",
          email: "mike@example.com",
          reputation: 2891,
          role: "user",
          createdAt: new Date("2024-03-05"),
          updatedAt: new Date("2024-03-05")
        }
      ];
      res.json(mockUsers);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Tag routes
  app.get("/api/tags", async (req, res) => {
    try {
      const tags = await storage.getTags();
      res.json(tags);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/tags/popular", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const tags = await storage.getPopularTags(limit);
      res.json(tags);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Statistics routes
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
