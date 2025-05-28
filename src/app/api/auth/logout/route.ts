
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    const cookieStore = cookies()
    cookieStore.delete('user-session')
    
    return NextResponse.json({ message: "Logged out successfully" })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({ message: "Logout failed" }, { status: 500 })
  }
}
