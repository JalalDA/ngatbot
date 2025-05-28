
import { NextRequest, NextResponse } from 'next/server'
import { storage } from '../../../../server/storage'
import { telegramBotManager } from '../../../../server/telegram'
import { getCurrentUser } from '../../../lib/auth'
import { z } from 'zod'

const createBotSchema = z.object({
  token: z.string().min(1),
  systemPrompt: z.string().optional(),
})

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const bots = await storage.getBotsByUserId(user.id)
    return NextResponse.json(bots)
  } catch (error) {
    console.error('Get bots error:', error)
    return NextResponse.json({ message: "Failed to retrieve bots" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createBotSchema.parse(body)

    // Validate bot token with Telegram
    const validation = await telegramBotManager.validateBotToken(validatedData.token)
    if (!validation.valid) {
      return NextResponse.json({ message: "Invalid bot token" }, { status: 400 })
    }

    // Check if bot token already exists
    const existingBot = await storage.getBotByToken(validatedData.token)
    if (existingBot) {
      return NextResponse.json({ message: "Bot token already in use" }, { status: 400 })
    }

    // Create bot
    const bot = await storage.createBot({
      ...validatedData,
      userId: user.id,
      botName: validation.botInfo.first_name,
      botUsername: validation.botInfo.username,
    })

    // Auto-create system prompt as first knowledge item
    if (validatedData.systemPrompt) {
      await storage.createKnowledge({
        botId: bot.id,
        type: "text",
        content: validatedData.systemPrompt,
      })
    }

    // Start the bot
    await telegramBotManager.startBot(bot.token, bot.id)

    return NextResponse.json(bot, { status: 201 })
  } catch (error) {
    console.error("Create bot error:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Invalid input", errors: error.errors }, { status: 400 })
    }
    return NextResponse.json({ message: "Failed to create bot" }, { status: 500 })
  }
}
