
import { NextRequest, NextResponse } from 'next/server'
import { storage } from '../../../../../server/storage'
import { scrypt, timingSafeEqual } from "crypto"
import { promisify } from "util"
import { cookies } from 'next/headers'

const scryptAsync = promisify(scrypt)

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".")
  const hashedBuf = Buffer.from(hashed, "hex")
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer
  return timingSafeEqual(hashedBuf, suppliedBuf)
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()
    
    const user = await storage.getUserByUsername(username)
    if (!user || !(await comparePasswords(password, user.password))) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    // Set session cookie
    const cookieStore = cookies()
    cookieStore.set('user-session', JSON.stringify({ id: user.id, username: user.username }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    })

    const { password: _, ...userWithoutPassword } = user
    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ message: "Login failed" }, { status: 500 })
  }
}
