import { db } from "./db";
import session from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import type { 
  User, InsertUser, Bot, InsertBot, Knowledge, InsertKnowledge, 
  Transaction, InsertTransaction, Setting, InsertSetting, 
  SmmProvider, InsertSmmProvider, SmmService, InsertSmmService, 
  SmmOrder, InsertSmmOrder, AutoBot, InsertAutoBot, 
  PaymentSettings, InsertPaymentSettings, ApiKey, InsertApiKey 
} from "@shared/schema";

// Session storage menggunakan Prisma
export const storage = {
  // User methods
  async getUser(id: number): Promise<User | null> {
    return await db.user.findUnique({
      where: { id }
    });
  },

  async getUserByUsername(username: string): Promise<User | null> {
    return await db.user.findUnique({
      where: { username }
    });
  },

  async getUserByEmail(email: string): Promise<User | null> {
    return await db.user.findUnique({
      where: { email }
    });
  },

  async createUser(user: InsertUser): Promise<User> {
    return await db.user.create({
      data: user
    });
  },

  async updateUserCredits(userId: number, credits: number): Promise<void> {
    await db.user.update({
      where: { id: userId },
      data: { credits }
    });
  },

  // Bot methods
  async getBots(userId: number): Promise<Bot[]> {
    return await db.bot.findMany({
      where: { userId }
    });
  },

  async getBot(id: number): Promise<Bot | null> {
    return await db.bot.findUnique({
      where: { id }
    });
  },

  async createBot(bot: InsertBot & { userId: number }): Promise<Bot> {
    return await db.bot.create({
      data: bot
    });
  },

  async updateBot(id: number, updates: Partial<Bot>): Promise<void> {
    await db.bot.update({
      where: { id },
      data: updates
    });
  },

  async deleteBot(id: number): Promise<void> {
    await db.bot.delete({
      where: { id }
    });
  },

  // Knowledge methods
  async getKnowledge(botId: number): Promise<Knowledge[]> {
    return await db.knowledge.findMany({
      where: { botId }
    });
  },

  async createKnowledge(knowledge: InsertKnowledge): Promise<Knowledge> {
    return await db.knowledge.create({
      data: knowledge
    });
  },

  async deleteKnowledge(id: number): Promise<void> {
    await db.knowledge.delete({
      where: { id }
    });
  },

  // Transaction methods
  async getTransactions(userId: number): Promise<Transaction[]> {
    return await db.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  },

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    return await db.transaction.create({
      data: transaction
    });
  },

  async updateTransaction(id: number, updates: Partial<Transaction>): Promise<void> {
    await db.transaction.update({
      where: { id },
      data: updates
    });
  },

  // Settings methods
  async getSetting(key: string): Promise<Setting | null> {
    return await db.setting.findUnique({
      where: { key }
    });
  },

  async setSetting(setting: InsertSetting): Promise<void> {
    await db.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting
    });
  },

  // SMM Provider methods
  async getSmmProviders(userId: number): Promise<SmmProvider[]> {
    return await db.smmProvider.findMany({
      where: { userId }
    });
  },

  async createSmmProvider(provider: InsertSmmProvider & { userId: number }): Promise<SmmProvider> {
    return await db.smmProvider.create({
      data: provider
    });
  },

  async updateSmmProvider(id: number, updates: Partial<SmmProvider>): Promise<void> {
    await db.smmProvider.update({
      where: { id },
      data: updates
    });
  },

  async deleteSmmProvider(id: number): Promise<void> {
    await db.smmProvider.delete({
      where: { id }
    });
  },

  // SMM Service methods
  async getSmmServices(userId: number): Promise<SmmService[]> {
    return await db.smmService.findMany({
      where: { userId }
    });
  },

  async createSmmService(service: InsertSmmService): Promise<SmmService> {
    return await db.smmService.create({
      data: service
    });
  },

  async updateSmmService(id: number, updates: Partial<SmmService>): Promise<void> {
    await db.smmService.update({
      where: { id },
      data: updates
    });
  },

  async deleteSmmService(id: number): Promise<void> {
    await db.smmService.delete({
      where: { id }
    });
  },

  // SMM Order methods
  async getSmmOrders(userId: number): Promise<SmmOrder[]> {
    return await db.smmOrder.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  },

  async createSmmOrder(order: InsertSmmOrder): Promise<SmmOrder> {
    return await db.smmOrder.create({
      data: order
    });
  },

  async updateSmmOrder(id: number, updates: Partial<SmmOrder>): Promise<void> {
    await db.smmOrder.update({
      where: { id },
      data: updates
    });
  },

  // AutoBot methods
  async getAutoBots(userId: number): Promise<AutoBot[]> {
    return await db.autoBot.findMany({
      where: { userId }
    });
  },

  async createAutoBot(bot: InsertAutoBot): Promise<AutoBot> {
    return await db.autoBot.create({
      data: bot
    });
  },

  async updateAutoBot(id: number, updates: Partial<AutoBot>): Promise<void> {
    await db.autoBot.update({
      where: { id },
      data: updates
    });
  },

  async deleteAutoBot(id: number): Promise<void> {
    await db.autoBot.delete({
      where: { id }
    });
  },

  // API Key methods
  async getApiKeys(userId: number): Promise<ApiKey[]> {
    return await db.apiKey.findMany({
      where: { userId }
    });
  },

  async createApiKey(apiKey: InsertApiKey): Promise<ApiKey> {
    return await db.apiKey.create({
      data: apiKey
    });
  },

  async updateApiKey(id: number, updates: Partial<ApiKey>): Promise<void> {
    await db.apiKey.update({
      where: { id },
      data: updates
    });
  },

  async deleteApiKey(id: number): Promise<void> {
    await db.apiKey.delete({
      where: { id }
    });
  },

  // Payment Settings methods
  async getPaymentSettings(userId: number): Promise<PaymentSettings | null> {
    return await db.paymentSettings.findFirst({
      where: { userId }
    });
  },

  async createPaymentSettings(settings: InsertPaymentSettings): Promise<PaymentSettings> {
    return await db.paymentSettings.create({
      data: settings
    });
  },

  async updatePaymentSettings(userId: number, updates: Partial<PaymentSettings>): Promise<void> {
    await db.paymentSettings.updateMany({
      where: { userId },
      data: updates
    });
  }
};

// Session store configuration
export const sessionStore = new PrismaSessionStore(db, {
  checkPeriod: 2 * 60 * 1000, // ms
  dbRecordIdIsSessionId: true,
  dbRecordIdFunction: undefined,
});