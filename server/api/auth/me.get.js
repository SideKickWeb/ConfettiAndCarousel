import prisma from '../../lib/prisma.js'
import { requireAuth, checkRateLimit, getClientIP } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  try {
    // Apply rate limiting for authentication checks
    const clientIP = getClientIP(event) || 'unknown'
    checkRateLimit(`auth-me-${clientIP}`, 30, 60000) // 30 requests per minute per IP

    // Only allow GET method
    if (getMethod(event) !== 'GET') {
      throw createError({
        statusCode: 405,
        statusMessage: 'Method not allowed'
      })
    }

    // Require authentication using centralized utility
    const user = await requireAuth(event)

    console.log(`Auth check successful for user: ${user.email}`)

    // Return account data (excluding password)
    return {
      success: true,
      data: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        accessLevel: user.accessLevel,
        createdAt: user.createdAt
      }
    }
  } catch (error) {
    console.error('Error verifying token:', error)
    
    // Don't expose internal errors to client
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid token'
    })
  } finally {
    await prisma.$disconnect()
  }
}) 