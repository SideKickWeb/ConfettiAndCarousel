import prisma from '../../../lib/prisma'
import bcrypt from 'bcryptjs'
import { requireAuth, validateInput, checkRateLimit, getClientIP } from '../../utils/auth'
import { 
  handleSafeError, 
  handleMethodNotAllowed, 
  handleAuthError,
  createUserFriendlyError,
  ERROR_CATEGORIES 
} from '../../utils/error-handling'

export default defineEventHandler(async (event) => {
  try {
    // Only allow PUT method
    if (getMethod(event) !== 'PUT') {
      throw handleMethodNotAllowed(getMethod(event), ['PUT'])
    }

    // Apply rate limiting for password changes
    const clientIP = getClientIP(event) || 'unknown'
    checkRateLimit(`change-password-${clientIP}`, 3, 300000) // 3 password changes per 5 minutes per IP

    // Require authentication using centralized utility
    const user = await requireAuth(event)

    // Get request body
    const body = await readBody(event)

    // Validate input with user-friendly messages
    const validatedData = validateInput(body, {
      currentPassword: { 
        required: true, 
        type: 'string', 
        minLength: 1,
        label: 'Current password'
      },
      newPassword: { 
        required: true, 
        type: 'string', 
        minLength: 6,
        label: 'New password'
      },
      confirmPassword: { 
        required: true, 
        type: 'string', 
        minLength: 6,
        label: 'Password confirmation'
      }
    })

    const { currentPassword, newPassword, confirmPassword } = validatedData

    // Check if new passwords match
    if (newPassword !== confirmPassword) {
      throw handleAuthError('PASSWORD_MISMATCH')
    }

    // Check if new password is different from current
    if (currentPassword === newPassword) {
      throw createUserFriendlyError('PASSWORD_SAME_AS_CURRENT', 400, ERROR_CATEGORIES.VALIDATION, {
        message: 'Your new password must be different from your current password'
      })
    }

    console.log(`Password change attempt for user: ${user.email}`)

    // Get current account data with password
    const account = await prisma.account.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        password: true
      }
    })

    if (!account) {
      throw handleAuthError('ACCOUNT_NOT_FOUND')
    }

    // Apply additional rate limiting per user email
    checkRateLimit(`change-password-user-${account.email}`, 2, 300000) // 2 attempts per 5 minutes per user

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, account.password)
    if (!isCurrentPasswordValid) {
      console.log(`Password change failed: Invalid current password for user: ${account.email}`)
      throw handleAuthError('CURRENT_PASSWORD_INCORRECT')
    }

    // Hash new password with secure salt rounds
    const saltRounds = 12
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds)

    // Update password in database
    await prisma.account.update({
      where: { id: user.id },
      data: {
        password: hashedNewPassword,
        updatedAt: new Date()
      }
    })

    console.log(`Password changed successfully for user: ${account.email}`)

    return {
      success: true,
      message: 'Your password has been changed successfully'
    }

  } catch (error) {
    console.error('Error changing password:', error)
    
    // Use centralized error handling
    handleSafeError(error, 'SERVER_ERROR')
  } finally {
    await prisma.$disconnect()
  }
}) 