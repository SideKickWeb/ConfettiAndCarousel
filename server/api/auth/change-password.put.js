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
    // Only allow PUT method
    if (getMethod(event) !== 'PUT') {
      throw handleMethodNotAllowed(getMethod(event), ['PUT'])
    }

    // Apply rate limiting
    const clientIP = getClientIP(event) || 'unknown'
    checkRateLimit(`change-password-${clientIP}`, 5, 15 * 60 * 1000) // 5 attempts per 15 minutes

    // Require authentication
    const user = await requireAuth(event)
    
    const body = await readBody(event)
    
    // Validate input
    const { currentPassword, newPassword } = validateInput(body, {
      currentPassword: { 
        required: true, 
        type: 'string',
        minLength: 1,
        label: 'Current password'
      },
      newPassword: { 
        required: true, 
        type: 'string',
        minLength: 8,
        label: 'New password'
      }
    })

    // Dynamic Prisma import
    const { getPrismaClient } = await import('../../../lib/prisma.js')
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

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, currentUser.password)
    
    if (!isCurrentPasswordValid) {
      throw createUserFriendlyError('INVALID_PASSWORD', 401, ERROR_CATEGORIES.AUTH, {
        message: 'Current password is incorrect.'
      })
    }

    // Check if new password is different from current
    const isSamePassword = await bcrypt.compare(newPassword, currentUser.password)
    
    if (isSamePassword) {
      throw createUserFriendlyError('SAME_PASSWORD', 400, ERROR_CATEGORIES.VALIDATION, {
        message: 'New password must be different from your current password.'
      })
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12)

    // Update password
    await prisma.account.update({
      where: { id: user.id },
      data: {
        password: hashedNewPassword,
        updatedAt: new Date()
      }
    })

    console.log(`Password changed successfully for user: ${user.email}`)

    return {
      success: true,
      message: 'Password changed successfully!'
    }

  } catch (error) {
    console.error('Change password error:', error)
    
    // Handle different error types with user-friendly messages
    if (error.statusCode) {
      throw error // Re-throw user-friendly errors
    }
    
    throw createUserFriendlyError('SERVER_ERROR', 500, ERROR_CATEGORIES.SERVER, {
      message: 'We are experiencing technical difficulties. Please try again in a few minutes.'
    })
  }
}) 