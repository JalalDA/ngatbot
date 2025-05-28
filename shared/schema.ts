
import { z } from "zod";

// Zod schemas untuk validasi input
export const insertUserSchema = z.object({
  username: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string(),
});

export const insertBotSchema = z.object({
  token: z.string(),
});

export const insertKnowledgeSchema = z.object({
  botId: z.number(),
  type: z.string(),
  content: z.string(),
  url: z.string().optional(),
  fileName: z.string().optional(),
});

export const insertTransactionSchema = z.object({
  userId: z.number(),
  plan: z.string(),
  amount: z.number(),
  status: z.string().optional(),
  midtransOrderId: z.string().optional(),
  paymentInfo: z.string().optional(),
});

export const insertSettingSchema = z.object({
  key: z.string(),
  value: z.string(),
});

export const insertSmmProviderSchema = z.object({
  userId: z.number().optional(),
  name: z.string(),
  apiKey: z.string(),
  apiEndpoint: z.string(),
  isActive: z.boolean().optional(),
});

export const insertSmmServiceSchema = z.object({
  userId: z.number(),
  providerId: z.number(),
  mid: z.number(),
  name: z.string(),
  description: z.string().optional(),
  min: z.number(),
  max: z.number(),
  rate: z.number(),
  category: z.string(),
  serviceIdApi: z.string(),
  isActive: z.boolean().optional(),
});

export const insertSmmOrderSchema = z.object({
  userId: z.number(),
  serviceId: z.number(),
  providerId: z.number(),
  orderId: z.string(),
  providerOrderId: z.string().optional(),
  transactionId: z.number().optional(),
  link: z.string(),
  quantity: z.number(),
  amount: z.number(),
  status: z.string().optional(),
  paymentStatus: z.string().optional(),
  startCount: z.number().optional(),
  remains: z.number().optional(),
  notes: z.string().optional(),
  errorMessage: z.string().optional(),
});

export const insertAutoBotSchema = z.object({
  userId: z.number(),
  token: z.string(),
  botName: z.string(),
  botUsername: z.string(),
  welcomeMessage: z.string().optional(),
  welcomeImageUrl: z.string().optional(),
  keyboardConfig: z.any().optional(),
  isActive: z.boolean().optional(),
});

export const insertApiKeySchema = z.object({
  userId: z.number(),
  name: z.string(),
  apiKey: z.string(),
  isActive: z.boolean().optional(),
});

export const insertTelegramOrderSchema = z.object({
  orderId: z.string(),
  botToken: z.string(),
  telegramUserId: z.string(),
  telegramUsername: z.string().optional(),
  serviceId: z.string(),
  serviceName: z.string(),
  quantity: z.number(),
  amount: z.number(),
  currency: z.string().optional(),
  status: z.string().optional(),
  midtransTransactionId: z.string().optional(),
  qrisUrl: z.string().optional(),
  targetLink: z.string().optional(),
  resultLink: z.string().optional(),
  paymentExpiredAt: z.date().optional(),
});

export const insertTelegramServiceSchema = z.object({
  botToken: z.string(),
  serviceId: z.string(),
  serviceName: z.string(),
  category: z.string(),
  description: z.string().optional(),
  price: z.number(),
  minQuantity: z.number().optional(),
  maxQuantity: z.number().optional(),
  isActive: z.boolean().optional(),
});

export const insertTelegramPaymentSettingsSchema = z.object({
  botToken: z.string(),
  botOwnerId: z.string(),
  midtransServerKey: z.string().optional(),
  midtransClientKey: z.string().optional(),
  midtransIsProduction: z.boolean().optional(),
  isConfigured: z.boolean().optional(),
});

// Types berdasarkan Prisma models
export type User = {
  id: number;
  username: string;
  email: string;
  password: string;
  fullName: string;
  role: string;
  level: string;
  credits: number;
  createdAt: Date;
};

export type InsertUser = z.infer<typeof insertUserSchema>;
export type Bot = {
  id: number;
  userId: number;
  token: string;
  botName: string;
  botUsername: string;
  systemPrompt: string | null;
  isActive: boolean;
  messageCount: number;
  createdAt: Date;
};

export type InsertBot = z.infer<typeof insertBotSchema>;
export type Knowledge = {
  id: number;
  botId: number;
  type: string;
  content: string;
  url: string | null;
  fileName: string | null;
  createdAt: Date;
};

export type InsertKnowledge = z.infer<typeof insertKnowledgeSchema>;
export type TelegramOrder = {
  id: number;
  orderId: string;
  botToken: string;
  telegramUserId: string;
  telegramUsername: string | null;
  serviceId: string;
  serviceName: string;
  quantity: number;
  amount: number;
  currency: string;
  status: string;
  midtransTransactionId: string | null;
  qrisUrl: string | null;
  targetLink: string | null;
  resultLink: string | null;
  paymentExpiredAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type InsertTelegramOrder = z.infer<typeof insertTelegramOrderSchema>;
export type TelegramService = {
  id: number;
  botToken: string;
  serviceId: string;
  serviceName: string;
  category: string;
  description: string | null;
  price: number;
  minQuantity: number;
  maxQuantity: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type InsertTelegramService = z.infer<typeof insertTelegramServiceSchema>;
export type TelegramPaymentSettings = {
  id: number;
  botToken: string;
  botOwnerId: string;
  midtransServerKey: string | null;
  midtransClientKey: string | null;
  midtransIsProduction: boolean;
  isConfigured: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type InsertTelegramPaymentSettings = z.infer<typeof insertTelegramPaymentSettingsSchema>;
export type Transaction = {
  id: number;
  userId: number;
  plan: string;
  amount: number;
  status: string;
  midtransOrderId: string | null;
  snapToken: string | null;
  paymentInfo: string | null;
  createdAt: Date;
};

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Setting = {
  id: number;
  key: string;
  value: string;
  updatedAt: Date;
};

export type InsertSetting = z.infer<typeof insertSettingSchema>;
export type SmmProvider = {
  id: number;
  userId: number;
  name: string;
  apiKey: string;
  apiEndpoint: string;
  balance: number;
  currency: string | null;
  balanceUpdatedAt: Date | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type InsertSmmProvider = z.infer<typeof insertSmmProviderSchema>;
export type SmmService = {
  id: number;
  userId: number;
  providerId: number;
  mid: number;
  name: string;
  description: string | null;
  min: number;
  max: number;
  rate: number;
  category: string;
  serviceIdApi: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type InsertSmmService = z.infer<typeof insertSmmServiceSchema>;
export type SmmOrder = {
  id: number;
  userId: number;
  serviceId: number;
  providerId: number;
  orderId: string;
  providerOrderId: string | null;
  transactionId: number | null;
  link: string;
  quantity: number;
  amount: number;
  status: string;
  paymentStatus: string;
  startCount: number | null;
  remains: number | null;
  notes: string | null;
  errorMessage: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type InsertSmmOrder = z.infer<typeof insertSmmOrderSchema>;
export type AutoBot = {
  id: number;
  userId: number;
  token: string;
  botName: string;
  botUsername: string;
  welcomeMessage: string;
  welcomeImageUrl: string | null;
  keyboardConfig: any;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type InsertAutoBot = z.infer<typeof insertAutoBotSchema>;
export type ApiKey = {
  id: number;
  userId: number;
  name: string;
  apiKey: string;
  apiEndpoint: string | null;
  balance: number;
  isActive: boolean;
  totalRequests: number;
  totalOrders: number;
  totalRevenue: number;
  lastUsed: Date | null;
  createdAt: Date;
  updatedAt: Date;
  balanceUpdatedAt: Date | null;
};

export type InsertApiKey = z.infer<typeof insertApiKeySchema>;
export type PaymentSettings = {
  id: number;
  userId: number;
  serverKey: string;
  clientKey: string;
  isProduction: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type InsertPaymentSettings = {
  userId: number;
  serverKey: string;
  clientKey: string;
  isProduction?: boolean;
};
