
import { NextRequest, NextResponse } from 'next/server'
import { storage } from '../../../../../server/storage'
import { scrypt, randomBytes, timingSafeEqual } from "crypto"
import { promisify } from "util"

const scryptAsync = promisify(scrypt)

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex")
  const buf = (await scryptAsync(password, salt, 64)) as Buffer
  return `${buf.toString("hex")}.${salt}`
}

export async function POST(request: NextRequest) {
  try {
    const { username, password, email, fullName } = await request.json()
    
    const existingUser = await storage.getUserByUsername(username)
    if (existingUser) {
      return NextResponse.json({ message: "Username already exists" }, { status: 400 })
    }

    const hashedPassword = await hashPassword(password)
    const user = await storage.createUser({
      username,
      password: hashedPassword,
      email,
      fullName,
      level: 'free',
      credits: 100
    })

    const { password: _, ...userWithoutPassword } = user
    return NextResponse.json(userWithoutPassword, { status: 201 })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json({ message: "Registration failed" }, { status: 500 })
  }
}
