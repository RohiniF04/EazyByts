import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  shortBio: text("short_bio").notNull(),
  bio: text("bio").notNull(),
  profileImage: text("profile_image"),
  email: text("email"),
  phone: text("phone"),
  location: text("location"),
  github: text("github"),
  linkedin: text("linkedin"),
  twitter: text("twitter"),
  medium: text("medium"),
  createdAt: timestamp("created_at").defaultNow()
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  image: text("image"),
  primaryTag: text("primary_tag"),
  tags: text("tags").array(),
  liveLink: text("live_link"),
  githubLink: text("github_link"),
  featured: boolean("featured").default(false),
  type: text("type"),
  status: text("status").default("draft"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  userId: integer("user_id").references(() => users.id)
});

export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  percentage: integer("percentage").notNull(),
  category: text("category").notNull(),
  userId: integer("user_id").references(() => users.id)
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  userId: integer("user_id").references(() => users.id)
});

export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  data: jsonb("data"),
  userId: integer("user_id").references(() => users.id)
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSkillSchema = createInsertSchema(skills).omit({
  id: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  read: true,
  createdAt: true,
});

export const insertSettingsSchema = createInsertSchema(settings).omit({
  id: true,
});

// Insert types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type InsertSkill = z.infer<typeof insertSkillSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type InsertSettings = z.infer<typeof insertSettingsSchema>;

// Select types
export type User = typeof users.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type Skill = typeof skills.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type Settings = typeof settings.$inferSelect;
