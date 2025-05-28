
import { cookies } from 'next/headers'
import { storage } from '../../server/storage'

export async function getCurrentUser() {
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

export function requireAuth(handler: any) {
  return async (request: any, context: any) => {
    const user = await getCurrentUser()
    
    if (!user) {
      return Response.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Add user to request context
    request.user = user
    return handler(request, context)
  }
}
