import { users, User, InsertUser, projects, Project, InsertProject, skills, Skill, InsertSkill, messages, Message, InsertMessage, settings, Settings, InsertSettings } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  
  // Project operations
  getProjects(userId: number): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;
  
  // Skill operations
  getSkills(userId: number): Promise<Skill[]>;
  getSkillsByCategory(userId: number, category: string): Promise<Skill[]>;
  createSkill(skill: InsertSkill): Promise<Skill>;
  updateSkill(id: number, skill: Partial<InsertSkill>): Promise<Skill | undefined>;
  deleteSkill(id: number): Promise<boolean>;
  
  // Message operations
  getMessages(userId: number): Promise<Message[]>;
  getMessage(id: number): Promise<Message | undefined>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(id: number): Promise<Message | undefined>;
  deleteMessage(id: number): Promise<boolean>;
  
  // Settings operations
  getSettings(userId: number): Promise<Settings | undefined>;
  updateSettings(userId: number, settings: Partial<InsertSettings>): Promise<Settings | undefined>;
  
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private projects: Map<number, Project>;
  private skills: Map<number, Skill>;
  private messages: Map<number, Message>;
  private settings: Map<number, Settings>;
  sessionStore: session.SessionStore;
  currentUserId: number;
  currentProjectId: number;
  currentSkillId: number;
  currentMessageId: number;
  currentSettingsId: number;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.skills = new Map();
    this.messages = new Map();
    this.settings = new Map();
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
    this.currentUserId = 2; // Start at 2 since we're creating a demo user with ID 1
    this.currentProjectId = 3; // Start at 3 since we're creating 2 demo projects
    this.currentSkillId = 5; // Start at 5 since we're creating 4 demo skills
    this.currentMessageId = 1;
    this.currentSettingsId = 1;

    // Create a demo user
    const demoUser: User = {
      id: 1,
      username: "demo",
      password: "$2a$10$demohashedpassword", // This is just a placeholder, not a real hash
      name: "Demo User",
      title: "Full Stack Developer",
      shortBio: "Passionate web developer with expertise in modern technologies",
      bio: "I'm a full stack developer with over 5 years of experience building web applications. I specialize in React, Node.js, and TypeScript.",
      profileImage: null,
      email: "demo@example.com",
      phone: null,
      location: null,
      github: "https://github.com/demo",
      linkedin: "https://linkedin.com/in/demo",
      twitter: null,
      medium: null,
      createdAt: new Date()
    };
    this.users.set(1, demoUser);

    // Create some demo projects
    const demoProjects: Project[] = [
      {
        id: 1,
        title: "Portfolio Website",
        description: "A responsive portfolio website built with React and Node.js",
        type: "Web Development",
        image: null,
        primaryTag: "React",
        tags: ["React", "Node.js", "TypeScript"],
        liveLink: "https://demo-portfolio.example.com",
        githubLink: "https://github.com/demo/portfolio",
        featured: true,
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 1
      },
      {
        id: 2,
        title: "E-commerce Platform",
        description: "Full-featured e-commerce platform with payment processing",
        type: "Web Application",
        image: null,
        primaryTag: "Node.js",
        tags: ["React", "Node.js", "MongoDB", "Stripe"],
        liveLink: "https://demo-shop.example.com",
        githubLink: "https://github.com/demo/ecommerce",
        featured: true,
        order: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 1
      }
    ];
    this.projects.set(1, demoProjects[0]);
    this.projects.set(2, demoProjects[1]);
    this.currentProjectId = 3;

    // Create some demo skills
    const demoSkills: Skill[] = [
      {
        id: 1,
        name: "React",
        category: "Frontend",
        percentage: 90,
        userId: 1
      },
      {
        id: 2,
        name: "Node.js",
        category: "Backend",
        percentage: 85,
        userId: 1
      },
      {
        id: 3,
        name: "TypeScript",
        category: "Languages",
        percentage: 80,
        userId: 1
      },
      {
        id: 4,
        name: "MongoDB",
        category: "Database",
        percentage: 75,
        userId: 1
      }
    ];
    this.skills.set(1, demoSkills[0]);
    this.skills.set(2, demoSkills[1]);
    this.skills.set(3, demoSkills[2]);
    this.skills.set(4, demoSkills[3]);
    this.currentSkillId = 5;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, data: Partial<InsertUser>): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...data };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Project operations
  async getProjects(userId: number): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(
      (project) => project.userId === userId,
    );
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.currentProjectId++;
    const now = new Date();
    const project: Project = { 
      ...insertProject, 
      id,
      createdAt: now,
      updatedAt: now
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: number, data: Partial<InsertProject>): Promise<Project | undefined> {
    const project = await this.getProject(id);
    if (!project) return undefined;
    
    const updatedProject = { 
      ...project, 
      ...data,
      updatedAt: new Date()
    };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: number): Promise<boolean> {
    return this.projects.delete(id);
  }

  // Skill operations
  async getSkills(userId: number): Promise<Skill[]> {
    return Array.from(this.skills.values()).filter(
      (skill) => skill.userId === userId,
    );
  }

  async getSkillsByCategory(userId: number, category: string): Promise<Skill[]> {
    return (await this.getSkills(userId)).filter(
      (skill) => skill.category === category,
    );
  }

  async createSkill(insertSkill: InsertSkill): Promise<Skill> {
    const id = this.currentSkillId++;
    const skill: Skill = { ...insertSkill, id };
    this.skills.set(id, skill);
    return skill;
  }

  async updateSkill(id: number, data: Partial<InsertSkill>): Promise<Skill | undefined> {
    const skill = await this.getSkill(id);
    if (!skill) return undefined;
    
    const updatedSkill = { ...skill, ...data };
    this.skills.set(id, updatedSkill);
    return updatedSkill;
  }

  async getSkill(id: number): Promise<Skill | undefined> {
    return this.skills.get(id);
  }

  async deleteSkill(id: number): Promise<boolean> {
    return this.skills.delete(id);
  }

  // Message operations
  async getMessages(userId: number): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(
      (message) => message.userId === userId,
    );
  }

  async getMessage(id: number): Promise<Message | undefined> {
    return this.messages.get(id);
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.currentMessageId++;
    const message: Message = { 
      ...insertMessage, 
      id,
      read: false,
      createdAt: new Date()
    };
    this.messages.set(id, message);
    return message;
  }

  async markMessageAsRead(id: number): Promise<Message | undefined> {
    const message = await this.getMessage(id);
    if (!message) return undefined;
    
    const updatedMessage = { ...message, read: true };
    this.messages.set(id, updatedMessage);
    return updatedMessage;
  }

  async deleteMessage(id: number): Promise<boolean> {
    return this.messages.delete(id);
  }

  // Settings operations
  async getSettings(userId: number): Promise<Settings | undefined> {
    return Array.from(this.settings.values()).find(
      (setting) => setting.userId === userId,
    );
  }

  async updateSettings(userId: number, data: Partial<InsertSettings>): Promise<Settings | undefined> {
    let settings = await this.getSettings(userId);
    
    if (!settings) {
      // Create new settings if it doesn't exist
      const id = this.currentSettingsId++;
      settings = { id, userId, data: {} };
      this.settings.set(id, settings);
    }
    
    // Update the settings data
    const updatedSettings = { ...settings, ...data };
    this.settings.set(settings.id, updatedSettings);
    return updatedSettings;
  }
}

export const storage = new MemStorage();
