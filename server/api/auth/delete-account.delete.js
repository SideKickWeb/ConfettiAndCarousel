import bcrypt from 'bcrypt'
import { requireAuth, validateInput, checkRateLimit, getClientIP } from '../../utils/auth'
import { 
  handleSafeError, 
  handleMethodNotAllowed,
  createUserFriendlyError,
  ERROR_CATEGORIES 
} from '../../utils/error-handling'

export default defineEventHandler(async (event) => {
  try {
    // Only allow DELETE method
    if (getMethod(event) !== 'DELETE') {
      throw handleMethodNotAllowed(getMethod(event), ['DELETE'])
    }

    // Apply rate limiting
    const clientIP = getClientIP(event) || 'unknown'
    checkRateLimit(`delete-account-${clientIP}`, 2, 60 * 60 * 1000) // 2 attempts per hour

    // Require authentication
    const user = await requireAuth(event)
    
    const body = await readBody(event)
    
    // Validate input
    const { password, confirmDelete } = validateInput(body, {
      password: { 
        required: true, 
        type: 'string',
        minLength: 1,
        label: 'Password'
      },
      confirmDelete: { 
        required: true, 
        type: 'string',
        label: 'Confirmation'
      }
    })

    // Check confirmation
    if (confirmDelete !== 'DELETE') {
      throw createUserFriendlyError('INVALID_CONFIRMATION', 400, ERROR_CATEGORIES.VALIDATION, {
        message: 'Please type "DELETE" to confirm account deletion.'
      })
    }

    // Dynamic Prisma import
    const { getPrismaClient } = await import('../../lib/prisma.js')
    const prisma = await getPrismaClient()

    // Get current user with password
    const currentUser = await prisma.account.findUnique({
      where: { id: user.id }
    })

    if (!currentUser) {
      throw createUserFriendlyError('USER_NOT_FOUND', 404, ERROR_CATEGORIES.AUTH, {
        message: 'User account not found.'
      })
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, currentUser.password)
    
    if (!isPasswordValid) {
      throw createUserFriendlyError('INVALID_PASSWORD', 401, ERROR_CATEGORIES.AUTH, {
        message: 'Password is incorrect.'
      })
    }

    // Delete account
    await prisma.account.delete({
      where: { id: user.id }
    })

    console.log(`Account deleted successfully for user: ${user.email}`)

    return {
      success: true,
      message: 'Your account has been deleted successfully.'
    }

  } catch (error) {
    console.error('Delete account error:', error)
    
    // Handle different error types with user-friendly messages
    if (error.statusCode) {
      throw error // Re-throw user-friendly errors
    }
    
    throw createUserFriendlyError('SERVER_ERROR', 500, ERROR_CATEGORIES.SERVER, {
      message: 'We are experiencing technical difficulties. Please try again in a few minutes.'
    })
  }
}) 