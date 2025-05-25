import axios from 'axios';

export interface TelegramBotInfo {
  id: number;
  is_bot: boolean;
  first_name: string;
  username: string;
  can_join_groups?: boolean;
  can_read_all_group_messages?: boolean;
  supports_inline_queries?: boolean;
}

export interface TelegramApiResponse<T> {
  ok: boolean;
  result?: T;
  description?: string;
  error_code?: number;
}

export class NonAiChatbotService {
  
  /**
   * Validate bot token by calling Telegram getMe API
   */
  static async validateBotToken(token: string): Promise<{ valid: boolean; botInfo?: TelegramBotInfo; error?: string }> {
    try {
      const response = await axios.get<TelegramApiResponse<TelegramBotInfo>>(
        `https://api.telegram.org/bot${token}/getMe`,
        { timeout: 10000 }
      );

      if (response.data.ok && response.data.result) {
        return {
          valid: true,
          botInfo: response.data.result
        };
      } else {
        return {
          valid: false,
          error: response.data.description || 'Invalid bot token'
        };
      }
    } catch (error: any) {
      return {
        valid: false,
        error: error.response?.data?.description || 'Failed to validate bot token'
      };
    }
  }

  /**
   * Set webhook for the bot
   */
  static async setWebhook(token: string, webhookUrl: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await axios.post<TelegramApiResponse<boolean>>(
        `https://api.telegram.org/bot${token}/setWebhook`,
        {
          url: webhookUrl,
          allowed_updates: ['message', 'callback_query']
        },
        { timeout: 10000 }
      );

      if (response.data.ok) {
        return { success: true };
      } else {
        return {
          success: false,
          error: response.data.description || 'Failed to set webhook'
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.description || 'Failed to set webhook'
      };
    }
  }

  /**
   * Remove webhook for the bot
   */
  static async removeWebhook(token: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await axios.post<TelegramApiResponse<boolean>>(
        `https://api.telegram.org/bot${token}/deleteWebhook`,
        {},
        { timeout: 10000 }
      );

      if (response.data.ok) {
        return { success: true };
      } else {
        return {
          success: false,
          error: response.data.description || 'Failed to remove webhook'
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.description || 'Failed to remove webhook'
      };
    }
  }

  /**
   * Send message to Telegram chat
   */
  static async sendMessage(
    token: string,
    chatId: number,
    text: string,
    replyMarkup?: any
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const payload: any = {
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML'
      };

      if (replyMarkup) {
        payload.reply_markup = replyMarkup;
      }

      const response = await axios.post<TelegramApiResponse<any>>(
        `https://api.telegram.org/bot${token}/sendMessage`,
        payload,
        { timeout: 10000 }
      );

      if (response.data.ok) {
        return { success: true };
      } else {
        return {
          success: false,
          error: response.data.description || 'Failed to send message'
        };
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.description || 'Failed to send message'
      };
    }
  }

  /**
   * Create keyboard markup for menu type flows with smart layout
   */
  static createKeyboardMarkup(buttons: string[]): any {
    let keyboard: any[] = [];
    
    // For exactly 4 buttons, create 2x2 layout
    if (buttons.length === 4) {
      keyboard = [
        [{ text: buttons[0] }, { text: buttons[1] }],
        [{ text: buttons[2] }, { text: buttons[3] }]
      ];
    }
    // For 2, 6, 8 buttons, create pairs
    else if (buttons.length % 2 === 0 && buttons.length <= 8) {
      for (let i = 0; i < buttons.length; i += 2) {
        keyboard.push([
          { text: buttons[i] },
          ...(buttons[i + 1] ? [{ text: buttons[i + 1] }] : [])
        ]);
      }
    }
    // For other counts, use single column layout
    else {
      keyboard = buttons.map(button => [{ text: button }]);
    }
    
    return {
      keyboard: keyboard,
      resize_keyboard: true,
      one_time_keyboard: false
    };
  }

  /**
   * Create inline keyboard markup for menu type flows with smart layout
   */
  static createInlineKeyboardMarkup(buttons: string[]): any {
    let keyboard: any[] = [];
    
    // For exactly 4 buttons, create 2x2 layout
    if (buttons.length === 4) {
      keyboard = [
        [
          { text: buttons[0], callback_data: buttons[0] },
          { text: buttons[1], callback_data: buttons[1] }
        ],
        [
          { text: buttons[2], callback_data: buttons[2] },
          { text: buttons[3], callback_data: buttons[3] }
        ]
      ];
    }
    // For 2, 6, 8 buttons, create pairs
    else if (buttons.length % 2 === 0 && buttons.length <= 8) {
      for (let i = 0; i < buttons.length; i += 2) {
        keyboard.push([
          { text: buttons[i], callback_data: buttons[i] },
          ...(buttons[i + 1] ? [{ text: buttons[i + 1], callback_data: buttons[i + 1] }] : [])
        ]);
      }
    }
    // For other counts, use single column layout
    else {
      keyboard = buttons.map(button => [{ text: button, callback_data: button }]);
    }
    
    return {
      inline_keyboard: keyboard
    };
  }

  /**
   * Create inline keyboard from structured button data
   */
  static createInlineKeyboardFromData(buttonRows: { text: string; callback?: string; url?: string; }[][]): any {
    const keyboard = buttonRows.map(row => 
      row.map(button => {
        const inlineButton: any = { text: button.text };
        if (button.url) {
          inlineButton.url = button.url;
        } else if (button.callback) {
          inlineButton.callback_data = button.callback;
        } else {
          inlineButton.callback_data = button.text;
        }
        return inlineButton;
      })
    );
    
    return {
      inline_keyboard: keyboard
    };
  }

  /**
   * Generate webhook URL for bot
   */
  static generateWebhookUrl(botId: number): string {
    const baseUrl = process.env.REPLIT_DEV_DOMAIN 
      ? `https://${process.env.REPLIT_DEV_DOMAIN}` 
      : 'http://localhost:5000';
    return `${baseUrl}/api/webhook/nonai/${botId}`;
  }
}

/**
 * Process incoming webhook messages
 */
export interface WebhookUpdate {
  update_id: number;
  message?: {
    message_id: number;
    from: {
      id: number;
      is_bot: boolean;
      first_name: string;
      username?: string;
      language_code?: string;
    };
    chat: {
      id: number;
      first_name: string;
      username?: string;
      type: string;
    };
    date: number;
    text?: string;
  };
  callback_query?: {
    id: string;
    from: {
      id: number;
      is_bot: boolean;
      first_name: string;
      username?: string;
      language_code?: string;
    };
    message: {
      message_id: number;
      chat: {
        id: number;
        first_name: string;
        username?: string;
        type: string;
      };
      date: number;
    };
    data: string;
  };
}

export class WebhookProcessor {
  /**
   * Extract user input from webhook update
   */
  static extractUserInput(update: WebhookUpdate): { chatId: number; text: string; messageType: 'text' | 'callback' } {
    if (update.message && update.message.text) {
      return {
        chatId: update.message.chat.id,
        text: update.message.text,
        messageType: 'text'
      };
    } else if (update.callback_query) {
      return {
        chatId: update.callback_query.message.chat.id,
        text: update.callback_query.data,
        messageType: 'callback'
      };
    }
    
    throw new Error('Invalid update format');
  }

  /**
   * Answer callback query (for inline keyboards)
   */
  static async answerCallbackQuery(
    token: string,
    callbackQueryId: string,
    text?: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await axios.post<TelegramApiResponse<boolean>>(
        `https://api.telegram.org/bot${token}/answerCallbackQuery`,
        {
          callback_query_id: callbackQueryId,
          text: text || ''
        },
        { timeout: 5000 }
      );

      return { success: response.data.ok };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.description || 'Failed to answer callback query'
      };
    }
  }
}