
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  const cookieStore = cookies()
  cookieStore.delete('user-session')
  return NextResponse.json({ message: "Logged out successfully" })
}
