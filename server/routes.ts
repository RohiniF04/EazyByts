import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { insertProjectSchema, insertSkillSchema, insertMessageSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Middleware to check authentication
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };

  // Project routes
  app.get("/api/projects", async (req, res) => {
    try {
      if (req.isAuthenticated()) {
        const projects = await storage.getProjects(req.user.id);
        res.json(projects);
      } else {
        // For public view, get projects from the first user (for demo)
        const users = await storage.getUser(1);
        if (users) {
          const projects = await storage.getProjects(users.id);
          res.json(projects);
        } else {
          res.json([]);
        }
      }
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProject(Number(req.params.id));
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/projects", requireAuth, async (req, res) => {
    try {
      const validatedData = insertProjectSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      const project = await storage.createProject(validatedData);
      res.status(201).json(project);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: err.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  app.put("/api/projects/:id", requireAuth, async (req, res) => {
    try {
      const project = await storage.getProject(Number(req.params.id));
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      if (project.userId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const validatedData = insertProjectSchema.partial().parse({
        ...req.body,
        userId: req.user.id
      });
      const updatedProject = await storage.updateProject(Number(req.params.id), validatedData);
      res.json(updatedProject);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: err.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  app.delete("/api/projects/:id", requireAuth, async (req, res) => {
    try {
      const project = await storage.getProject(Number(req.params.id));
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      if (project.userId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }

      await storage.deleteProject(Number(req.params.id));
      res.status(204).end();
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Skills routes
  app.get("/api/skills", async (req, res) => {
    try {
      if (req.isAuthenticated()) {
        const skills = await storage.getSkills(req.user.id);
        res.json(skills);
      } else {
        // For public view, get skills from the first user (for demo)
        const users = await storage.getUser(1);
        if (users) {
          const skills = await storage.getSkills(users.id);
          res.json(skills);
        } else {
          res.json([]);
        }
      }
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/skills/category/:category", async (req, res) => {
    try {
      const userId = req.isAuthenticated() ? req.user.id : 1;
      const skills = await storage.getSkillsByCategory(userId, req.params.category);
      res.json(skills);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/skills", requireAuth, async (req, res) => {
    try {
      const validatedData = insertSkillSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      const skill = await storage.createSkill(validatedData);
      res.status(201).json(skill);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: err.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  app.put("/api/skills/:id", requireAuth, async (req, res) => {
    try {
      const skill = await storage.getSkill(Number(req.params.id));
      if (!skill) {
        return res.status(404).json({ message: "Skill not found" });
      }
      if (skill.userId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const validatedData = insertSkillSchema.partial().parse({
        ...req.body,
        userId: req.user.id
      });
      const updatedSkill = await storage.updateSkill(Number(req.params.id), validatedData);
      res.json(updatedSkill);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: err.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  app.delete("/api/skills/:id", requireAuth, async (req, res) => {
    try {
      const skill = await storage.getSkill(Number(req.params.id));
      if (!skill) {
        return res.status(404).json({ message: "Skill not found" });
      }
      if (skill.userId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }

      await storage.deleteSkill(Number(req.params.id));
      res.status(204).end();
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Messages routes
  app.get("/api/messages", requireAuth, async (req, res) => {
    try {
      const messages = await storage.getMessages(req.user.id);
      res.json(messages);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post("/api/messages", async (req, res) => {
    try {
      // Get the first user for demo purposes if not authenticated
      const userId = req.isAuthenticated() ? req.user.id : 1;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(400).json({ message: "Cannot determine message recipient" });
      }

      const validatedData = insertMessageSchema.parse({
        ...req.body,
        userId
      });
      const message = await storage.createMessage(validatedData);
      res.status(201).json(message);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: err.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  app.put("/api/messages/:id/read", requireAuth, async (req, res) => {
    try {
      const message = await storage.getMessage(Number(req.params.id));
      if (!message) {
        return res.status(404).json({ message: "Message not found" });
      }
      if (message.userId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const updatedMessage = await storage.markMessageAsRead(Number(req.params.id));
      res.json(updatedMessage);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.delete("/api/messages/:id", requireAuth, async (req, res) => {
    try {
      const message = await storage.getMessage(Number(req.params.id));
      if (!message) {
        return res.status(404).json({ message: "Message not found" });
      }
      if (message.userId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }

      await storage.deleteMessage(Number(req.params.id));
      res.status(204).end();
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // User profile routes
  app.get("/api/profile", async (req, res) => {
    try {
      if (req.isAuthenticated()) {
        const { password, ...userWithoutPassword } = req.user;
        res.json(userWithoutPassword);
      } else {
        // Get the first user for public view
        const user = await storage.getUser(1);
        if (user) {
          const { password, ...userWithoutPassword } = user;
          res.json(userWithoutPassword);
        } else {
          res.status(404).json({ message: "Profile not found" });
        }
      }
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.put("/api/profile", requireAuth, async (req, res) => {
    try {
      // Remove sensitive fields
      const { password, username, ...updateData } = req.body;
      
      const updatedUser = await storage.updateUser(req.user.id, updateData);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { password: _, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
