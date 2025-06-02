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

    // Apply rate limiting for profile updates
    const clientIP = getClientIP(event) || 'unknown'
    checkRateLimit(`update-profile-${clientIP}`, 5, 300000) // 5 updates per 5 minutes per IP

    // Require authentication using centralized utility
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
      throw handleAuthError('ACCOUNT_NOT_FOUND')
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
        throw handleAuthError('CURRENT_PASSWORD_INCORRECT')
      }

      // Check if new email already exists
      const existingAccount = await prisma.account.findUnique({
        where: { email: email.toLowerCase() }
      })

      if (existingAccount && existingAccount.id !== user.id) {
        throw handleAuthError('EMAIL_EXISTS')
      }
    }

    // Apply additional rate limiting per user
    checkRateLimit(`update-profile-user-${user.id}`, 3, 300000) // 3 updates per 5 minutes per user

    // Update account and customer records in transaction
    const updatedAccount = await prisma.$transaction(async (prisma) => {
      // Update account
      const account = await prisma.account.update({
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

      // Update corresponding customer record if it exists
      const existingCustomer = await prisma.customer.findUnique({
        where: { id: user.id }
      })

      if (existingCustomer) {
        await prisma.customer.update({
          where: { id: user.id },
          data: {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.toLowerCase(),
            updatedAt: new Date()
          }
        })
      }

      return account
    })

    console.log(`Profile updated successfully for user: ${updatedAccount.email}`)

    return {
      success: true,
      data: updatedAccount,
      message: 'Your profile has been updated successfully'
    }

  } catch (error) {
    console.error('Error updating profile:', error)
    
    // Use centralized error handling
    handleSafeError(error, 'SERVER_ERROR')
  }
}) 