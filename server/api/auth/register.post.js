import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { 
  handleAuthError, 
  handleValidationError, 
  handleRateLimitError,
  createUserFriendlyError,
  ERROR_CATEGORIES 
} from '../../utils/error-handling'
import { validateInput, checkRateLimit, getClientIP } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  try {
    // Apply rate limiting for registration attempts
    const clientIP = getClientIP(event) || 'unknown'
    checkRateLimit(`register-${clientIP}`, 3, 60 * 60 * 1000, 'REGISTRATION') // 3 attempts per hour

    const body = await readBody(event)
    
    // Validate input with user-friendly messages
    const { email, password, firstName, lastName } = validateInput(body, {
      email: { 
        required: true, 
        type: 'email',
        label: 'Email address'
      },
      password: { 
        required: true, 
        type: 'string', 
        minLength: 8,
        patternMessage: 'Password must be at least 8 characters long',
        label: 'Password'
      },
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
      }
    })

    console.log(`Registration attempt for email: ${email}`)

    // Dynamic Prisma import
    const { getPrismaClient } = await import('../../../lib/prisma.js')
    const prisma = await getPrismaClient()

    // Check if user already exists
    const existingUser = await prisma.account.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (existingUser) {
      throw createUserFriendlyError('EMAIL_EXISTS', 409, ERROR_CATEGORIES.VALIDATION, {
        message: 'An account with this email address already exists. Please try logging in instead.'
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create new user
    const newUser = await prisma.account.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        role: 'user',
        accessLevel: 1
      }
    })

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: newUser.id,
        email: newUser.email,
        role: newUser.role,
        accessLevel: newUser.accessLevel
      },
      process.env.JWT_SECRET || 'development-secret-key',
      { expiresIn: '7d' }
    )

    console.log(`Registration successful for user: ${newUser.email}`)

    return {
      success: true,
      message: 'Account created successfully! Welcome!',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
        accessLevel: newUser.accessLevel
      }
    }
  } catch (error) {
    console.error('Registration error:', error)
    
    // Handle different error types with user-friendly messages
    if (error.statusCode) {
      throw error // Re-throw user-friendly errors
    }
    
    throw createUserFriendlyError('SERVER_ERROR', 500, ERROR_CATEGORIES.SERVER, {
      message: 'We are experiencing technical difficulties. Please try again in a few minutes.'
    })
  }
}) 