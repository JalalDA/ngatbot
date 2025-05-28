
import { NextRequest, NextResponse } from 'next/server'
import { storage } from '../../../../server/storage'
import { cookies } from 'next/headers'

async function getCurrentUser() {
  const cookieStore = cookies()
  const sessionCookie = cookieStore.get('user-session')
  
  if (!sessionCookie) {
    return null
  }

  try {
    const session = JSON.parse(sessionCookie.value)
    const user = await storage.getUser(session.id)
    return user
  } catch {
    return null
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { password: _, ...userWithoutPassword } = user
    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json({ message: "Failed to get user" }, { status: 500 })
  }
}
