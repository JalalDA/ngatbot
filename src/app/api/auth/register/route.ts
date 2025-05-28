
import { NextRequest, NextResponse } from 'next/server'
import { storage } from '../../../../../server/storage'
import { scrypt, randomBytes } from 'crypto'
import { promisify } from 'util'
import { cookies } from 'next/headers'

const scryptAsync = promisify(scrypt)

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex')
  const buf = (await scryptAsync(password, salt, 64)) as Buffer
  return `${buf.toString('hex')}.${salt}`
}

export async function POST(request: NextRequest) {
  try {
    const { username, email, password, fullName } = await request.json()
    
    // Check if user already exists
    const existingUser = await storage.getUserByUsername(username)
    if (existingUser) {
      return NextResponse.json({ message: "Username already exists" }, { status: 400 })
    }

    // Create new user
    const hashedPassword = await hashPassword(password)
    const user = await storage.createUser({
      username,
      email,
      password: hashedPassword,
      fullName,
    })

    // Set session cookie
    const cookieStore = cookies()
    cookieStore.set('user-session', JSON.stringify({ id: user.id, username: user.username }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    })

    const { password: _, ...userWithoutPassword } = user
    return NextResponse.json(userWithoutPassword, { status: 201 })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ message: "Registration failed" }, { status: 500 })
  }
}
