
import { NextRequest, NextResponse } from 'next/server'
import { storage } from '../../../../../server/storage'
import { telegramBotManager } from '../../../../../server/telegram'
import { getCurrentUser } from '../../../../lib/auth'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const botId = parseInt(params.id)
    const bot = await storage.getBot(botId)

    if (!bot) {
      return NextResponse.json({ message: "Bot not found" }, { status: 404 })
    }

    if (bot.userId !== user.id) {
      return NextResponse.json({ message: "Not authorized to delete this bot" }, { status: 403 })
    }

    // Stop the bot
    await telegramBotManager.stopBot(bot.token)

    // Delete from storage
    await storage.deleteBot(botId)

    return NextResponse.json({ message: "Bot deleted successfully" })
  } catch (error) {
    console.error("Delete bot error:", error)
    return NextResponse.json({ message: "Failed to delete bot" }, { status: 500 })
  }
}
