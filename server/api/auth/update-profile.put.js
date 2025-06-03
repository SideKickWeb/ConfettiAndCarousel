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

    // Apply rate limiting for profile updates
    const clientIP = getClientIP(event) || 'unknown'
    checkRateLimit(`update-profile-${clientIP}`, 5, 15 * 60 * 1000) // 5 updates per 15 minutes

    // Require authentication
    const user = await requireAuth(event)

    // Get request body
    const body = await readBody(event)

    // Validate input with user-friendly messages
    const validatedData = validateInput(body, {
      firstName: { 
        required: true, 
        type: 'string', 
        minLength: 1, 
        maxLength: 50,
        label: 'First name'
      },
      lastName: { 
        required: true, 
        type: 'string', 
        minLength: 1, 
        maxLength: 50,
        label: 'Last name'
      },
      email: { 
        required: true, 
        type: 'email', 
        maxLength: 255,
        label: 'Email address'
      },
      currentPassword: { 
        required: false, 
        type: 'string', 
        minLength: 1,
        label: 'Current password'
      }
    })

    const { firstName, lastName, email, currentPassword } = validatedData

    console.log(`Profile update attempt for user: ${user.email}`)

    // Dynamic Prisma import
    const { getPrismaClient } = await import('../../lib/prisma.js')
    const prisma = await getPrismaClient()

    // Get current account data
    const currentAccount = await prisma.account.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        password: true,
        firstName: true,
        lastName: true
      }
    })

    if (!currentAccount) {
      throw createUserFriendlyError('ACCOUNT_NOT_FOUND', 404, ERROR_CATEGORIES.AUTH, {
        message: 'User account not found.'
      })
    }

    // Check if email is being changed
    const isEmailChanging = email.toLowerCase() !== currentAccount.email.toLowerCase()
    
    if (isEmailChanging) {
      // Require password for email changes
      if (!currentPassword) {
        throw createUserFriendlyError('EMAIL_CHANGE_REQUIRES_PASSWORD', 400, ERROR_CATEGORIES.VALIDATION, {
          message: 'Please enter your current password to change your email address'
        })
      }

      // Verify current password
      const isPasswordValid = await bcrypt.compare(currentPassword, currentAccount.password)
      if (!isPasswordValid) {
        throw createUserFriendlyError('CURRENT_PASSWORD_INCORRECT', 401, ERROR_CATEGORIES.AUTH, {
          message: 'Current password is incorrect.'
        })
      }

      // Check if new email already exists
      const existingAccount = await prisma.account.findUnique({
        where: { email: email.toLowerCase() }
      })

      if (existingAccount && existingAccount.id !== user.id) {
        throw createUserFriendlyError('EMAIL_EXISTS', 409, ERROR_CATEGORIES.VALIDATION, {
          message: 'An account with this email address already exists.'
        })
      }
    }

    // Update account
    const updatedAccount = await prisma.account.update({
      where: { id: user.id },
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.toLowerCase(),
        updatedAt: new Date()
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        accessLevel: true,
        createdAt: true,
        updatedAt: true
      }
    })

    console.log(`Profile updated successfully for user: ${updatedAccount.email}`)

    return {
      success: true,
      data: updatedAccount,
      message: 'Your profile has been updated successfully'
    }

  } catch (error) {
    console.error('Error updating profile:', error)
    
    // Handle different error types with user-friendly messages
    if (error.statusCode) {
      throw error // Re-throw user-friendly errors
    }
    
    throw createUserFriendlyError('SERVER_ERROR', 500, ERROR_CATEGORIES.SERVER, {
      message: 'We are experiencing technical difficulties. Please try again in a few minutes.'
    })
  }
}) 