import { users, bots, knowledge, transactions, settings, type User, type InsertUser, type Bot, type InsertBot, type Knowledge, type InsertKnowledge, type Transaction, type InsertTransaction, type Setting, type InsertSetting } from "@shared/schema";
import session from "express-session";
import { db, pool } from "./db";
import { eq } from "drizzle-orm";
import connectPg from "connect-pg-simple";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  getAllUsers(): Promise<User[]>;
  
  // Bot management
  getBot(id: number): Promise<Bot | undefined>;
  getBotsByUserId(userId: number): Promise<Bot[]>;
  getBotByToken(token: string): Promise<Bot | undefined>;
  createBot(bot: InsertBot & { userId: number; botName: string; botUsername: string }): Promise<Bot>;
  updateBot(id: number, updates: Partial<Bot>): Promise<Bot | undefined>;
  deleteBot(id: number): Promise<boolean>;
  getAllBots(): Promise<Bot[]>;
  
  // Knowledge management
  getKnowledge(id: number): Promise<Knowledge | undefined>;
  getKnowledgeByBotId(botId: number): Promise<Knowledge[]>;
  createKnowledge(knowledge: InsertKnowledge): Promise<Knowledge>;
  updateKnowledge(id: number, updates: Partial<Knowledge>): Promise<Knowledge | undefined>;
  deleteKnowledge(id: number): Promise<boolean>;
  
  // Transaction management
  getTransaction(id: number): Promise<Transaction | undefined>;
  getTransactionsByUserId(userId: number): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransaction(id: number, updates: Partial<Transaction>): Promise<Transaction | undefined>;
  
  // Settings management
  getSetting(key: string): Promise<Setting | undefined>;
  setSetting(setting: InsertSetting): Promise<Setting>;
  updateSetting(key: string, value: string): Promise<Setting | undefined>;
  
  sessionStore: session.SessionStore;
}

export class DatabaseStorage implements IStorage {
  sessionStore: any;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        role: "user",
        level: "basic", 
        credits: 250,
      })
      .returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return result.rowCount > 0;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  // Bot methods
  async getBot(id: number): Promise<Bot | undefined> {
    return this.bots.get(id);
  }

  async getBotsByUserId(userId: number): Promise<Bot[]> {
    return Array.from(this.bots.values()).filter(bot => bot.userId === userId);
  }

  async getBotByToken(token: string): Promise<Bot | undefined> {
    return Array.from(this.bots.values()).find(bot => bot.token === token);
  }

  async createBot(botData: InsertBot & { userId: number; botName: string; botUsername: string }): Promise<Bot> {
    const id = this.currentBotId++;
    const bot: Bot = {
      id,
      userId: botData.userId,
      token: botData.token,
      botName: botData.botName,
      botUsername: botData.botUsername,
      isActive: true,
      messageCount: 0,
      createdAt: new Date(),
    };
    this.bots.set(id, bot);
    return bot;
  }

  async updateBot(id: number, updates: Partial<Bot>): Promise<Bot | undefined> {
    const bot = this.bots.get(id);
    if (!bot) return undefined;
    
    const updatedBot = { ...bot, ...updates };
    this.bots.set(id, updatedBot);
    return updatedBot;
  }

  async deleteBot(id: number): Promise<boolean> {
    // Also delete associated knowledge
    const knowledgeItems = Array.from(this.knowledge.values()).filter(k => k.botId === id);
    knowledgeItems.forEach(k => this.knowledge.delete(k.id));
    
    return this.bots.delete(id);
  }

  async getAllBots(): Promise<Bot[]> {
    return Array.from(this.bots.values());
  }

  // Knowledge methods
  async getKnowledge(id: number): Promise<Knowledge | undefined> {
    return this.knowledge.get(id);
  }

  async getKnowledgeByBotId(botId: number): Promise<Knowledge[]> {
    return Array.from(this.knowledge.values()).filter(k => k.botId === botId);
  }

  async createKnowledge(insertKnowledge: InsertKnowledge): Promise<Knowledge> {
    const id = this.currentKnowledgeId++;
    const knowledgeItem: Knowledge = {
      ...insertKnowledge,
      id,
      url: insertKnowledge.url || null,
      fileName: insertKnowledge.fileName || null,
      productName: insertKnowledge.productName || null,
      productPrice: insertKnowledge.productPrice || null,
      createdAt: new Date(),
    };
    this.knowledge.set(id, knowledgeItem);
    return knowledgeItem;
  }

  async updateKnowledge(id: number, updates: Partial<Knowledge>): Promise<Knowledge | undefined> {
    const knowledgeItem = this.knowledge.get(id);
    if (!knowledgeItem) return undefined;
    
    const updatedKnowledge = { ...knowledgeItem, ...updates };
    this.knowledge.set(id, updatedKnowledge);
    return updatedKnowledge;
  }

  async deleteKnowledge(id: number): Promise<boolean> {
    return this.knowledge.delete(id);
  }

  // Transaction methods
  async getTransaction(id: number): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }

  async getTransactionsByUserId(userId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(t => t.userId === userId);
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.currentTransactionId++;
    const transaction: Transaction = {
      ...insertTransaction,
      id,
      status: "pending",
      paymentInfo: null,
      createdAt: new Date(),
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async updateTransaction(id: number, updates: Partial<Transaction>): Promise<Transaction | undefined> {
    const transaction = this.transactions.get(id);
    if (!transaction) return undefined;
    
    const updatedTransaction = { ...transaction, ...updates };
    this.transactions.set(id, updatedTransaction);
    return updatedTransaction;
  }

  // Settings methods
  async getSetting(key: string): Promise<Setting | undefined> {
    return this.settings.get(key);
  }

  async setSetting(insertSetting: InsertSetting): Promise<Setting> {
    const setting: Setting = {
      id: 1, // Not used in memory storage
      key: insertSetting.key,
      value: insertSetting.value,
      updatedAt: new Date(),
    };
    this.settings.set(insertSetting.key, setting);
    return setting;
  }

  async updateSetting(key: string, value: string): Promise<Setting | undefined> {
    const setting = this.settings.get(key);
    if (!setting) return undefined;
    
    const updatedSetting = { ...setting, value, updatedAt: new Date() };
    this.settings.set(key, updatedSetting);
    return updatedSetting;
  }
}

export const storage = new DatabaseStorage();
