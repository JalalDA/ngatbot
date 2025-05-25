import { users, bots, knowledge, transactions, settings, smmProviders, smmServices, smmOrders, chatBots, menuItems, flowRules, chatBotOrders, type User, type InsertUser, type Bot, type InsertBot, type Knowledge, type InsertKnowledge, type Transaction, type InsertTransaction, type Setting, type InsertSetting, type SmmProvider, type InsertSmmProvider, type SmmService, type InsertSmmService, type SmmOrder, type InsertSmmOrder, type ChatBot, type InsertChatBot, type MenuItem, type InsertMenuItem, type FlowRule, type InsertFlowRule, type ChatBotOrder, type InsertChatBotOrder } from "@shared/schema";
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
  getTransactionByOrderId(orderId: string): Promise<Transaction | undefined>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransaction(id: number, updates: Partial<Transaction>): Promise<Transaction | undefined>;
  
  // Settings management
  getSetting(key: string): Promise<Setting | undefined>;
  setSetting(setting: InsertSetting): Promise<Setting>;
  updateSetting(key: string, value: string): Promise<Setting | undefined>;
  
  // SMM Provider management
  getSmmProvider(id: number): Promise<SmmProvider | undefined>;
  getSmmProvidersByUserId(userId: number): Promise<SmmProvider[]>;
  createSmmProvider(provider: InsertSmmProvider): Promise<SmmProvider>;
  updateSmmProvider(id: number, updates: Partial<SmmProvider>): Promise<SmmProvider | undefined>;
  deleteSmmProvider(id: number): Promise<boolean>;
  
  // SMM Service management
  getSmmService(id: number): Promise<SmmService | undefined>;
  getSmmServicesByUserId(userId: number): Promise<SmmService[]>;
  getSmmServicesByProviderId(providerId: number): Promise<SmmService[]>;
  getSmmServiceByMid(userId: number, mid: number): Promise<SmmService | undefined>;
  createSmmService(service: InsertSmmService): Promise<SmmService>;
  updateSmmService(id: number, updates: Partial<SmmService>): Promise<SmmService | undefined>;
  deleteSmmService(id: number): Promise<boolean>;
  getUsedMids(userId: number): Promise<number[]>;
  
  // SMM Order management
  getSmmOrder(id: number): Promise<SmmOrder | undefined>;
  getSmmOrderByOrderId(orderId: string): Promise<SmmOrder | undefined>;
  getSmmOrdersByUserId(userId: number): Promise<SmmOrder[]>;
  createSmmOrder(order: InsertSmmOrder): Promise<SmmOrder>;
  updateSmmOrder(id: number, updates: Partial<SmmOrder>): Promise<SmmOrder | undefined>;
  
  // ChatBot Builder management
  getChatBot(id: number): Promise<ChatBot | undefined>;
  getChatBotsByUserId(userId: number): Promise<ChatBot[]>;
  getChatBotByToken(token: string): Promise<ChatBot | undefined>;
  createChatBot(chatBot: InsertChatBot & { userId: number; botName: string; botUsername: string }): Promise<ChatBot>;
  updateChatBot(id: number, updates: Partial<ChatBot>): Promise<ChatBot | undefined>;
  deleteChatBot(id: number): Promise<boolean>;
  
  // Menu Items management
  getMenuItem(id: number): Promise<MenuItem | undefined>;
  getMenuItemsByChatBotId(chatBotId: number): Promise<MenuItem[]>;
  createMenuItem(menuItem: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(id: number, updates: Partial<MenuItem>): Promise<MenuItem | undefined>;
  deleteMenuItem(id: number): Promise<boolean>;
  
  // Flow Rules management
  getFlowRule(id: number): Promise<FlowRule | undefined>;
  getFlowRulesByChatBotId(chatBotId: number): Promise<FlowRule[]>;
  createFlowRule(flowRule: InsertFlowRule): Promise<FlowRule>;
  updateFlowRule(id: number, updates: Partial<FlowRule>): Promise<FlowRule | undefined>;
  deleteFlowRule(id: number): Promise<boolean>;
  
  // ChatBot Orders management
  getChatBotOrder(id: number): Promise<ChatBotOrder | undefined>;
  getChatBotOrdersByUserId(userId: number): Promise<ChatBotOrder[]>;
  getChatBotOrderByMidtransOrderId(orderId: string): Promise<ChatBotOrder | undefined>;
  createChatBotOrder(order: InsertChatBotOrder): Promise<ChatBotOrder>;
  updateChatBotOrder(id: number, updates: Partial<ChatBotOrder>): Promise<ChatBotOrder | undefined>;
  
  sessionStore: any;
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
    return (result.rowCount || 0) > 0;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  // Bot methods
  async getBot(id: number): Promise<Bot | undefined> {
    const [bot] = await db.select().from(bots).where(eq(bots.id, id));
    return bot || undefined;
  }

  async getBotsByUserId(userId: number): Promise<Bot[]> {
    return await db.select().from(bots).where(eq(bots.userId, userId));
  }

  async getBotByToken(token: string): Promise<Bot | undefined> {
    const [bot] = await db.select().from(bots).where(eq(bots.token, token));
    return bot || undefined;
  }

  async createBot(botData: InsertBot & { userId: number; botName: string; botUsername: string }): Promise<Bot> {
    const [bot] = await db
      .insert(bots)
      .values({
        userId: botData.userId,
        token: botData.token,
        botName: botData.botName,
        botUsername: botData.botUsername,
        isActive: true,
        messageCount: 0,
      })
      .returning();
    return bot;
  }

  async updateBot(id: number, updates: Partial<Bot>): Promise<Bot | undefined> {
    const [bot] = await db
      .update(bots)
      .set(updates)
      .where(eq(bots.id, id))
      .returning();
    return bot || undefined;
  }

  async deleteBot(id: number): Promise<boolean> {
    const result = await db.delete(bots).where(eq(bots.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getAllBots(): Promise<Bot[]> {
    return await db.select().from(bots);
  }

  // Knowledge methods
  async getKnowledge(id: number): Promise<Knowledge | undefined> {
    const [knowledgeItem] = await db.select().from(knowledge).where(eq(knowledge.id, id));
    return knowledgeItem || undefined;
  }

  async getKnowledgeByBotId(botId: number): Promise<Knowledge[]> {
    return await db.select().from(knowledge).where(eq(knowledge.botId, botId));
  }

  async createKnowledge(insertKnowledge: InsertKnowledge): Promise<Knowledge> {
    const [knowledgeItem] = await db
      .insert(knowledge)
      .values(insertKnowledge)
      .returning();
    return knowledgeItem;
  }

  async updateKnowledge(id: number, updates: Partial<Knowledge>): Promise<Knowledge | undefined> {
    const [knowledgeItem] = await db
      .update(knowledge)
      .set(updates)
      .where(eq(knowledge.id, id))
      .returning();
    return knowledgeItem || undefined;
  }

  async deleteKnowledge(id: number): Promise<boolean> {
    const result = await db.delete(knowledge).where(eq(knowledge.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Transaction methods
  async getTransaction(id: number): Promise<Transaction | undefined> {
    const [transaction] = await db.select().from(transactions).where(eq(transactions.id, id));
    return transaction || undefined;
  }

  async getTransactionsByUserId(userId: number): Promise<Transaction[]> {
    return await db.select().from(transactions).where(eq(transactions.userId, userId));
  }

  async getTransactionByOrderId(orderId: string): Promise<Transaction | undefined> {
    const [transaction] = await db.select().from(transactions).where(eq(transactions.midtransOrderId, orderId));
    return transaction || undefined;
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const [transaction] = await db
      .insert(transactions)
      .values(insertTransaction)
      .returning();
    return transaction;
  }

  async updateTransaction(id: number, updates: Partial<Transaction>): Promise<Transaction | undefined> {
    const [transaction] = await db
      .update(transactions)
      .set(updates)
      .where(eq(transactions.id, id))
      .returning();
    return transaction || undefined;
  }

  // Settings methods
  async getSetting(key: string): Promise<Setting | undefined> {
    const [setting] = await db.select().from(settings).where(eq(settings.key, key));
    return setting || undefined;
  }

  async setSetting(insertSetting: InsertSetting): Promise<Setting> {
    const [setting] = await db
      .insert(settings)
      .values(insertSetting)
      .returning();
    return setting;
  }

  async updateSetting(key: string, value: string): Promise<Setting | undefined> {
    const [setting] = await db
      .update(settings)
      .set({ value, updatedAt: new Date() })
      .where(eq(settings.key, key))
      .returning();
    return setting || undefined;
  }

  // SMM Provider methods
  async getSmmProvider(id: number): Promise<SmmProvider | undefined> {
    const [provider] = await db.select().from(smmProviders).where(eq(smmProviders.id, id));
    return provider || undefined;
  }

  async getSmmProvidersByUserId(userId: number): Promise<SmmProvider[]> {
    return await db.select().from(smmProviders).where(eq(smmProviders.userId, userId));
  }

  async createSmmProvider(insertProvider: InsertSmmProvider): Promise<SmmProvider> {
    const [provider] = await db
      .insert(smmProviders)
      .values(insertProvider)
      .returning();
    return provider;
  }

  async updateSmmProvider(id: number, updates: Partial<SmmProvider>): Promise<SmmProvider | undefined> {
    const [provider] = await db
      .update(smmProviders)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(smmProviders.id, id))
      .returning();
    return provider || undefined;
  }

  async deleteSmmProvider(id: number): Promise<boolean> {
    const result = await db.delete(smmProviders).where(eq(smmProviders.id, id));
    return (result.rowCount || 0) > 0;
  }

  // SMM Service methods
  async getSmmService(id: number): Promise<SmmService | undefined> {
    const [service] = await db.select().from(smmServices).where(eq(smmServices.id, id));
    return service || undefined;
  }

  async getSmmServicesByUserId(userId: number): Promise<SmmService[]> {
    return await db.select().from(smmServices).where(eq(smmServices.userId, userId));
  }

  async getSmmServicesByProviderId(providerId: number): Promise<SmmService[]> {
    return await db.select().from(smmServices).where(eq(smmServices.providerId, providerId));
  }

  async getSmmServiceByMid(userId: number, mid: number): Promise<SmmService | undefined> {
    const [service] = await db
      .select()
      .from(smmServices)
      .where(eq(smmServices.userId, userId) && eq(smmServices.mid, mid));
    return service || undefined;
  }

  async createSmmService(insertService: InsertSmmService): Promise<SmmService> {
    const [service] = await db
      .insert(smmServices)
      .values(insertService)
      .returning();
    return service;
  }

  async updateSmmService(id: number, updates: Partial<SmmService>): Promise<SmmService | undefined> {
    const [service] = await db
      .update(smmServices)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(smmServices.id, id))
      .returning();
    return service || undefined;
  }

  async deleteSmmService(id: number): Promise<boolean> {
    const result = await db.delete(smmServices).where(eq(smmServices.id, id));
    return result.rowCount > 0;
  }

  async getUsedMids(userId: number): Promise<number[]> {
    const services = await db
      .select({ mid: smmServices.mid })
      .from(smmServices)
      .where(eq(smmServices.userId, userId));
    return services.map(s => s.mid);
  }

  // SMM Order methods
  async getSmmOrder(id: number): Promise<SmmOrder | undefined> {
    const [order] = await db.select().from(smmOrders).where(eq(smmOrders.id, id));
    return order || undefined;
  }

  async getSmmOrderByOrderId(orderId: string): Promise<SmmOrder | undefined> {
    const [order] = await db.select().from(smmOrders).where(eq(smmOrders.orderId, orderId));
    return order || undefined;
  }

  async getSmmOrdersByUserId(userId: number): Promise<SmmOrder[]> {
    return await db.select().from(smmOrders).where(eq(smmOrders.userId, userId));
  }

  async createSmmOrder(insertOrder: InsertSmmOrder): Promise<SmmOrder> {
    const [order] = await db
      .insert(smmOrders)
      .values(insertOrder)
      .returning();
    return order;
  }

  async updateSmmOrder(id: number, updates: Partial<SmmOrder>): Promise<SmmOrder | undefined> {
    const [order] = await db
      .update(smmOrders)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(smmOrders.id, id))
      .returning();
    return order || undefined;
  }

  // ChatBot Builder methods
  async getChatBot(id: number): Promise<ChatBot | undefined> {
    const [chatBot] = await db.select().from(chatBots).where(eq(chatBots.id, id));
    return chatBot || undefined;
  }

  async getChatBotsByUserId(userId: number): Promise<ChatBot[]> {
    return await db.select().from(chatBots).where(eq(chatBots.userId, userId));
  }

  async getChatBotByToken(token: string): Promise<ChatBot | undefined> {
    const [chatBot] = await db.select().from(chatBots).where(eq(chatBots.token, token));
    return chatBot || undefined;
  }

  async createChatBot(chatBotData: InsertChatBot & { userId: number; botName: string; botUsername: string }): Promise<ChatBot> {
    const [chatBot] = await db
      .insert(chatBots)
      .values({
        userId: chatBotData.userId,
        token: chatBotData.token,
        botName: chatBotData.botName,
        botUsername: chatBotData.botUsername,
        welcomeMessage: chatBotData.welcomeMessage || "Selamat datang! Pilih menu di bawah ini:",
        isActive: true
      })
      .returning();
    return chatBot;
  }

  async updateChatBot(id: number, updates: Partial<ChatBot>): Promise<ChatBot | undefined> {
    const [chatBot] = await db
      .update(chatBots)
      .set(updates)
      .where(eq(chatBots.id, id))
      .returning();
    return chatBot || undefined;
  }

  async deleteChatBot(id: number): Promise<boolean> {
    const result = await db.delete(chatBots).where(eq(chatBots.id, id));
    return result.rowCount > 0;
  }

  // Menu Items methods
  async getMenuItem(id: number): Promise<MenuItem | undefined> {
    const [menuItem] = await db.select().from(menuItems).where(eq(menuItems.id, id));
    return menuItem || undefined;
  }

  async getMenuItemsByChatBotId(chatBotId: number): Promise<MenuItem[]> {
    return await db.select().from(menuItems).where(eq(menuItems.chatBotId, chatBotId));
  }

  async createMenuItem(insertMenuItem: InsertMenuItem): Promise<MenuItem> {
    const [menuItem] = await db
      .insert(menuItems)
      .values(insertMenuItem)
      .returning();
    return menuItem;
  }

  async updateMenuItem(id: number, updates: Partial<MenuItem>): Promise<MenuItem | undefined> {
    const [menuItem] = await db
      .update(menuItems)
      .set(updates)
      .where(eq(menuItems.id, id))
      .returning();
    return menuItem || undefined;
  }

  async deleteMenuItem(id: number): Promise<boolean> {
    const result = await db.delete(menuItems).where(eq(menuItems.id, id));
    return result.rowCount > 0;
  }

  // Flow Rules methods
  async getFlowRule(id: number): Promise<FlowRule | undefined> {
    const [flowRule] = await db.select().from(flowRules).where(eq(flowRules.id, id));
    return flowRule || undefined;
  }

  async getFlowRulesByChatBotId(chatBotId: number): Promise<FlowRule[]> {
    return await db.select().from(flowRules).where(eq(flowRules.chatBotId, chatBotId));
  }

  async createFlowRule(insertFlowRule: InsertFlowRule): Promise<FlowRule> {
    const [flowRule] = await db
      .insert(flowRules)
      .values(insertFlowRule)
      .returning();
    return flowRule;
  }

  async updateFlowRule(id: number, updates: Partial<FlowRule>): Promise<FlowRule | undefined> {
    const [flowRule] = await db
      .update(flowRules)
      .set(updates)
      .where(eq(flowRules.id, id))
      .returning();
    return flowRule || undefined;
  }

  async deleteFlowRule(id: number): Promise<boolean> {
    const result = await db.delete(flowRules).where(eq(flowRules.id, id));
    return result.rowCount > 0;
  }

  // ChatBot Orders methods
  async getChatBotOrder(id: number): Promise<ChatBotOrder | undefined> {
    const [order] = await db.select().from(chatBotOrders).where(eq(chatBotOrders.id, id));
    return order || undefined;
  }

  async getChatBotOrdersByUserId(userId: number): Promise<ChatBotOrder[]> {
    return await db.select().from(chatBotOrders)
      .innerJoin(chatBots, eq(chatBotOrders.chatBotId, chatBots.id))
      .where(eq(chatBots.userId, userId));
  }

  async getChatBotOrderByMidtransOrderId(orderId: string): Promise<ChatBotOrder | undefined> {
    const [order] = await db.select().from(chatBotOrders).where(eq(chatBotOrders.midtransOrderId, orderId));
    return order || undefined;
  }

  async createChatBotOrder(insertOrder: InsertChatBotOrder): Promise<ChatBotOrder> {
    const [order] = await db
      .insert(chatBotOrders)
      .values(insertOrder)
      .returning();
    return order;
  }

  async updateChatBotOrder(id: number, updates: Partial<ChatBotOrder>): Promise<ChatBotOrder | undefined> {
    const [order] = await db
      .update(chatBotOrders)
      .set(updates)
      .where(eq(chatBotOrders.id, id))
      .returning();
    return order || undefined;
  }
}

export const storage = new DatabaseStorage();