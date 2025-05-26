import TelegramBot from "node-telegram-bot-api";
import { storage } from "./storage";
import type { AutoBot } from "@shared/schema";

interface TelegramBotInfo {
  id: number;
  is_bot: boolean;
  first_name: string;
  username: string;
  can_join_groups?: boolean;
  can_read_all_group_messages?: boolean;
  supports_inline_queries?: boolean;
}

interface TelegramApiResponse<T> {
  ok: boolean;
  result?: T;
  description?: string;
  error_code?: number;
}

interface InlineKeyboard {
  id: string;
  text: string;
  callbackData: string;
  url?: string;
  level?: number;
  parentId?: string;
  responseText?: string;
  isAllShow?: boolean; // New property for All Show button
}

export class AutoBotManager {
  private activeBots: Map<string, { bot: TelegramBot; config: AutoBot }> = new Map();

  /**
   * Validate bot token by calling Telegram getMe API
   */
  async validateBotToken(token: string): Promise<{ valid: boolean; botInfo?: TelegramBotInfo; error?: string }> {
    try {
      console.log('🤖 Validating bot token...');
      
      const response = await fetch(`https://api.telegram.org/bot${token}/getMe`, {
        method: 'GET'
      });

      console.log(`📡 Response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ HTTP error response:', errorText);
        return {
          valid: false,
          error: `HTTP ${response.status}: Token tidak valid atau kadaluarsa`
        };
      }

      const responseText = await response.text();
      console.log('📜 Raw response:', responseText.substring(0, 200) + '...');

      // Check if response is HTML (error page)
      if (responseText.startsWith('<!DOCTYPE') || responseText.startsWith('<html')) {
        console.error('❌ Received HTML response instead of JSON');
        return {
          valid: false,
          error: 'Token bot tidak valid atau ada masalah dengan koneksi ke Telegram API'
        };
      }

      let data: TelegramApiResponse<TelegramBotInfo>;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('❌ JSON parse error:', parseError);
        console.error('📄 Response text that failed to parse:', responseText);
        return {
          valid: false,
          error: 'Format response dari Telegram API tidak valid. Pastikan token bot benar.'
        };
      }

      if (data.ok && data.result) {
        console.log('✅ Token validation successful:', data.result.username);
        return {
          valid: true,
          botInfo: data.result
        };
      } else {
        console.error('❌ Telegram API error:', data);
        return {
          valid: false,
          error: data.description || 'Token bot tidak valid'
        };
      }
    } catch (error: any) {
      console.error('❌ Token validation error:', error);
      return {
        valid: false,
        error: 'Gagal memvalidasi token: ' + (error.message || 'Unknown error')
      };
    }
  }

  /**
   * Start auto bot with inline keyboard configuration
   */
  async startAutoBot(autoBot: AutoBot): Promise<{ success: boolean; error?: string }> {
    try {
      // Check if bot is already running
      if (this.activeBots.has(autoBot.token)) {
        await this.stopAutoBot(autoBot.token);
      }

      const bot = new TelegramBot(autoBot.token, { polling: true });
      
      // Store bot instance
      this.activeBots.set(autoBot.token, { bot, config: autoBot });

      // Handle /start command
      bot.onText(/\/start/, async (msg) => {
        const chatId = msg.chat.id;
        const welcomeMessage = autoBot.welcomeMessage || "Selamat datang! Silakan pilih opsi di bawah ini:";
        
        // Show main menu buttons (level 0) and check for All Show button
        const mainMenuButtons = (autoBot.keyboardConfig || []).filter(btn => !btn.level || btn.level === 0);
        
        // Check if there's an All Show button configured
        const allShowButton = (autoBot.keyboardConfig || []).find(btn => btn.isAllShow);
        const buttonsToShow = [...mainMenuButtons];
        
        // Add All Show button if configured
        if (allShowButton) {
          buttonsToShow.push({
            id: 'all_show_button',
            text: allShowButton.text || '📋 Lihat Semua Menu',
            callbackData: 'show_all_menus',
            level: 0
          });
        }
        
        const keyboard = this.createInlineKeyboard(buttonsToShow);
        
        const options: any = {
          reply_markup: keyboard
        };

        try {
          await bot.sendMessage(chatId, welcomeMessage, options);
        } catch (error) {
          console.error(`Error sending message for bot ${autoBot.botName}:`, error);
        }
      });

      // Handle callback queries (inline button presses)
      bot.on('callback_query', async (callbackQuery) => {
        const msg = callbackQuery.message;
        const data = callbackQuery.data;
        
        if (msg && data) {
          const chatId = msg.chat.id;
          
          // Debug: Log the callback data
          console.log(`Received callback data: ${data}`);
          
          // Find the button that was pressed
          const pressedButton = autoBot.keyboardConfig?.find(btn => btn.callbackData === data);
          
          console.log(`Found pressed button: ${pressedButton ? pressedButton.text : 'Not found'}`);
          
          try {
            // Answer the callback query to remove loading state
            const answerText = pressedButton ? `Anda memilih: ${pressedButton.text}` : 'Navigasi...';
            await bot.answerCallbackQuery(callbackQuery.id, {
              text: answerText,
              show_alert: false
            });
          } catch (error) {
            console.error('Error answering callback query:', error);
          }
          
          // Handle special navigation callbacks first (they might not be in pressedButton)
          if (data === 'back_to_main') {
            // Show main menu again
            const mainMenuButtons = (autoBot.keyboardConfig || []).filter(btn => !btn.level || btn.level === 0);
            const keyboard = this.createInlineKeyboard(mainMenuButtons);
            
            await bot.editMessageText(autoBot.welcomeMessage || "Selamat datang! Silakan pilih opsi di bawah ini:", {
              chat_id: chatId,
              message_id: msg.message_id,
              reply_markup: keyboard
            });
            return;
          }

          // Handle All Show button
          if (data === 'show_all_menus') {
            const allShowMessage = this.createAllShowMessage(autoBot.keyboardConfig || []);
            const keyboard = this.createAllShowKeyboard(autoBot.keyboardConfig || []);
            
            await bot.editMessageText(allShowMessage, {
              chat_id: chatId,
              message_id: msg.message_id,
              reply_markup: keyboard,
              parse_mode: 'Markdown'
            });
            return;
          }


          
          if (pressedButton) {
            try {
              

              
              // Check if this is a main menu button (level 0) that has sub-menus
              if (!pressedButton.level || pressedButton.level === 0) {
                // Find sub-menus for this main menu
                const subMenus = (autoBot.keyboardConfig || []).filter(btn => 
                  btn.level === 1 && btn.parentId === pressedButton.id
                );
                
                if (subMenus.length > 0) {
                  // Add only "Menu Utama" button for level 1
                  const subMenusWithMainMenu = [
                    ...subMenus,
                    {
                      id: 'main_menu_button_level_1',
                      text: '🏠 Menu Utama',
                      callbackData: 'back_to_main',
                      level: 1
                    }
                  ];
                  
                  // Replace main menu with sub-menus by editing the message
                  const subMenuKeyboard = this.createInlineKeyboard(subMenusWithMainMenu);
                  
                  await bot.editMessageText(`📋 Menu ${pressedButton.text}:`, {
                    chat_id: chatId,
                    message_id: msg.message_id,
                    reply_markup: subMenuKeyboard
                  });
                } else {
                  // No sub-menus, send response text if available
                  const responseMessage = pressedButton.responseText || `✅ Anda telah memilih: *${pressedButton.text}*`;
                  await bot.sendMessage(chatId, responseMessage, {
                    parse_mode: 'Markdown'
                  });
                }
              } else {
                // Handle any level button (level 1, 2, 3, 4, 5)
                const currentLevel = pressedButton.level || 0;
                const childMenus = (autoBot.keyboardConfig || []).filter(btn => 
                  btn.level === currentLevel + 1 && btn.parentId === pressedButton.id
                );
                
                if (childMenus.length > 0) {
                  // This button has child menus, show them with only "Menu Utama" button
                  const childMenusWithMainMenu = [
                    ...childMenus,
                    {
                      id: `main_menu_button_level_${currentLevel + 1}`,
                      text: '🏠 Menu Utama',
                      callbackData: 'back_to_main',
                      level: currentLevel + 1
                    }
                  ];
                  
                  const childMenuKeyboard = this.createInlineKeyboard(childMenusWithMainMenu);
                  const levelNames = ['Menu', 'Sub Menu', 'Sub Sub Menu', 'Level 4 Menu', 'Level 5 Menu', 'Level 6 Menu'];
                  const levelName = levelNames[currentLevel] || `Level ${currentLevel + 1} Menu`;
                  
                  await bot.editMessageText(`📋 ${levelName} ${pressedButton.text}:`, {
                    chat_id: chatId,
                    message_id: msg.message_id,
                    reply_markup: childMenuKeyboard
                  });
                } else {
                  // No child menus, this is a final button - send response text
                  const responseMessage = pressedButton.responseText || `✅ Anda telah memilih: *${pressedButton.text}*`;
                  await bot.sendMessage(chatId, responseMessage, {
                    parse_mode: 'Markdown'
                  });
                }
              }
            } catch (error) {
              console.error(`Error handling callback for bot ${autoBot.botName}:`, error);
            }
          }
        }
      });

      // Handle errors
      bot.on('polling_error', (error) => {
        console.error(`Polling error for bot ${autoBot.botName}:`, error);
      });

      bot.on('error', (error) => {
        console.error(`Bot error for ${autoBot.botName}:`, error);
      });

      console.log(`Auto bot ${autoBot.botName} started successfully`);
      return { success: true };

    } catch (error: any) {
      console.error(`Failed to start auto bot ${autoBot.botName}:`, error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Stop auto bot
   */
  async stopAutoBot(token: string): Promise<{ success: boolean; error?: string }> {
    try {
      const botInstance = this.activeBots.get(token);
      
      if (botInstance) {
        await botInstance.bot.stopPolling();
        this.activeBots.delete(token);
        console.log(`Auto bot with token ${token.slice(0, 10)}... stopped`);
      }

      return { success: true };
    } catch (error: any) {
      console.error(`Failed to stop auto bot:`, error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Create All Show message with hierarchical menu structure
   */
  private createAllShowMessage(buttons: InlineKeyboard[]): string {
    let message = "📋 *Semua Menu Tersedia:*\n\n";
    
    // Group buttons by level
    const buttonsByLevel: { [key: number]: InlineKeyboard[] } = {};
    buttons.forEach(btn => {
      const level = btn.level || 0;
      if (!buttonsByLevel[level]) buttonsByLevel[level] = [];
      buttonsByLevel[level].push(btn);
    });
    
    // Create hierarchical display
    for (let level = 0; level <= 4; level++) {
      const levelButtons = buttonsByLevel[level] || [];
      if (levelButtons.length === 0) continue;
      
      const levelNames = ['📌 Menu Utama', '📂 Sub Menu', '📄 Sub Sub Menu', '📎 Level 4', '📊 Level 5'];
      message += `${levelNames[level]}:\n`;
      
      levelButtons.forEach(btn => {
        if (!btn.isAllShow) { // Don't show the All Show button itself
          const indent = '  '.repeat(level);
          message += `${indent}• ${btn.text}\n`;
        }
      });
      message += '\n';
    }
    
    message += "Pilih menu yang ingin Anda akses:";
    return message;
  }

  /**
   * Create All Show keyboard with all available buttons
   */
  private createAllShowKeyboard(buttons: InlineKeyboard[]): any {
    const availableButtons = buttons.filter(btn => !btn.isAllShow);
    const keyboardButtons = [
      ...availableButtons,
      {
        id: 'main_menu_from_all_show',
        text: '🏠 Menu Utama',
        callbackData: 'back_to_main',
        level: 0
      }
    ];
    
    return this.createInlineKeyboard(keyboardButtons);
  }

  /**
   * Create inline keyboard markup from configuration
   */
  private createInlineKeyboard(buttons: InlineKeyboard[]): any {
    if (!buttons || buttons.length === 0) {
      return { inline_keyboard: [] };
    }

    // Create rows of buttons (2 buttons per row)
    const keyboard: any[][] = [];
    
    for (let i = 0; i < buttons.length; i += 2) {
      const row: any[] = [];
      
      // Add first button in row
      const firstButton = buttons[i];
      if (firstButton.url) {
        row.push({
          text: firstButton.text,
          url: firstButton.url
        });
      } else {
        row.push({
          text: firstButton.text,
          callback_data: firstButton.callbackData
        });
      }
      
      // Add second button in row if exists
      if (i + 1 < buttons.length) {
        const secondButton = buttons[i + 1];
        if (secondButton.url) {
          row.push({
            text: secondButton.text,
            url: secondButton.url
          });
        } else {
          row.push({
            text: secondButton.text,
            callback_data: secondButton.callbackData
          });
        }
      }
      
      keyboard.push(row);
    }

    return { inline_keyboard: keyboard };
  }

  /**
   * Restart all active auto bots
   */
  async restartAllAutoBots(): Promise<void> {
    try {
      const allAutoBots = await storage.getAllAutoBots();
      const activeAutoBots = allAutoBots.filter(bot => bot.isActive);

      // Stop all running bots first
      for (const [token] of this.activeBots) {
        await this.stopAutoBot(token);
      }

      // Start active bots
      for (const autoBot of activeAutoBots) {
        await this.startAutoBot(autoBot);
      }

      console.log(`Restarted ${activeAutoBots.length} active auto bots`);
    } catch (error) {
      console.error('Failed to restart auto bots:', error);
    }
  }

  /**
   * Get active bots count
   */
  getActiveBotCount(): number {
    return this.activeBots.size;
  }

  /**
   * Check if bot is running
   */
  isBotRunning(token: string): boolean {
    return this.activeBots.has(token);
  }
}

// Export singleton instance
export const autoBotManager = new AutoBotManager();