import TelegramBot from "node-telegram-bot-api";
import { storage } from "./storage";
import { generateBotResponse } from "./openai";

interface BotInstance {
  bot: TelegramBot;
  botId: number;
}

class TelegramBotManager {
  private activeBots: Map<string, BotInstance> = new Map();

  async validateBotToken(token: string): Promise<{ valid: boolean; botInfo?: any }> {
    try {
      const response = await fetch(`https://api.telegram.org/bot${token}/getMe`);
      const data = await response.json();
      
      if (data.ok) {
        return { valid: true, botInfo: data.result };
      } else {
        return { valid: false };
      }
    } catch (error) {
      console.error("Telegram API validation error:", error);
      return { valid: false };
    }
  }

  async startBot(token: string, botId: number): Promise<void> {
    try {
      // Don't start if already running
      if (this.activeBots.has(token)) {
        return;
      }

      const bot = new TelegramBot(token, { polling: true });
      this.activeBots.set(token, { bot, botId });

      bot.on('message', async (msg) => {
        await this.handleMessage(msg, botId);
      });

      bot.on('polling_error', (error) => {
        console.error(`Polling error for bot ${botId}:`, error);
      });

      console.log(`Bot ${botId} started successfully`);
    } catch (error) {
      console.error(`Failed to start bot ${botId}:`, error);
      throw error;
    }
  }

  async stopBot(token: string): Promise<void> {
    const botInstance = this.activeBots.get(token);
    if (botInstance) {
      try {
        await botInstance.bot.stopPolling();
        this.activeBots.delete(token);
        console.log(`Bot ${botInstance.botId} stopped successfully`);
      } catch (error) {
        console.error(`Error stopping bot ${botInstance.botId}:`, error);
      }
    }
  }

  private async handleMessage(msg: any, botId: number): Promise<void> {
    try {
      // Skip non-text messages
      if (!msg.text) return;

      // Get bot and user information
      const bot = await storage.getBot(botId);
      if (!bot || !bot.isActive) return;

      const user = await storage.getUser(bot.userId);
      if (!user || user.credits <= 0) {
        // Send out of credits message
        const botInstance = this.activeBots.get(bot.token);
        if (botInstance) {
          await botInstance.bot.sendMessage(msg.chat.id, "Sorry, this bot is temporarily unavailable due to insufficient credits.");
        }
        return;
      }

      // Get knowledge base for the bot
      const knowledgeItems = await storage.getKnowledgeByBotId(botId);
      const baseKnowledge = knowledgeItems.map(item => {
        switch (item.type) {
          case 'text':
            return item.content;
          case 'link':
            return `Website: ${item.url}\nContent: ${item.content}`;
          case 'product':
            return `Product: ${item.productName}\nDescription: ${item.content}\nPrice: ${item.productPrice}`;
          case 'file':
            return `File: ${item.fileName}\nContent: ${item.content}`;
          default:
            return item.content;
        }
      }).join('\n\n');

      // Get SMM Panel services for the bot owner
      const smmServices = await storage.getSmmServicesByUserId(bot.userId);
      const smmKnowledge = smmServices
        .filter(service => service.isActive)
        .map(service => 
          `ID ${service.mid}: ${service.name} - Min: ${service.min}, Max: ${service.max}, Rate: Rp ${service.rate}/1000${service.description ? ` - ${service.description}` : ''}`
        ).join('\n');

      // Combine all knowledge
      const knowledgeBase = [
        baseKnowledge,
        smmKnowledge ? `\n\nSMM Panel Services Available:\n${smmKnowledge}` : ''
      ].filter(Boolean).join('\n\n');

      // Generate AI response
      const aiResponse = await generateBotResponse(msg.text, knowledgeBase);

      // Send response
      const botInstance = this.activeBots.get(bot.token);
      if (botInstance) {
        await botInstance.bot.sendMessage(msg.chat.id, aiResponse);
      }

      // Update message count and reduce credits
      await storage.updateBot(botId, { 
        messageCount: bot.messageCount + 1 
      });
      
      await storage.updateUser(user.id, { 
        credits: user.credits - 1 
      });

    } catch (error) {
      console.error("Error handling message:", error);
      
      // Send error message to user
      const bot = await storage.getBot(botId);
      if (bot) {
        const botInstance = this.activeBots.get(bot.token);
        if (botInstance) {
          await botInstance.bot.sendMessage(msg.chat.id, "Sorry, I encountered an error processing your message. Please try again later.");
        }
      }
    }
  }

  async restartAllBots(): Promise<void> {
    try {
      const allBots = await storage.getAllBots();
      
      for (const bot of allBots) {
        if (bot.isActive) {
          await this.startBot(bot.token, bot.id);
        }
      }
    } catch (error) {
      console.error("Error restarting bots:", error);
    }
  }
}

export const telegramBotManager = new TelegramBotManager();
