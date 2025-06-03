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
    // Apply rate limiting for login attempts
    const clientIP = getClientIP(event) || 'unknown'
    checkRateLimit(`login-${clientIP}`, 5, 15 * 60 * 1000, 'LOGIN') // 5 attempts per 15 minutes

    const body = await readBody(event)
    
    // Validate input with user-friendly messages
    const { email, password } = validateInput(body, {
      email: { 
        required: true, 
        type: 'email',
        label: 'Email address'
      },
      password: { 
        required: true, 
        type: 'string', 
        minLength: 1,
        label: 'Password'
      }
    })

    console.log(`Login attempt for email: ${email}`)

    // Dynamic Prisma import
    const { getPrismaClient } = await import('../../lib/prisma.js')
    const prisma = await getPrismaClient()

    // Find user by email
    const user = await prisma.account.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (!user) {
      throw createUserFriendlyError('INVALID_CREDENTIALS', 401, ERROR_CATEGORIES.AUTH, {
        message: 'Invalid email or password. Please check your credentials and try again.'
      })
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password)
    
    if (!isValidPassword) {
      throw createUserFriendlyError('INVALID_CREDENTIALS', 401, ERROR_CATEGORIES.AUTH, {
        message: 'Invalid email or password. Please check your credentials and try again.'
      })
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        role: user.role,
        accessLevel: user.accessLevel
      },
      process.env.JWT_SECRET || 'development-secret-key',
      { expiresIn: '7d' }
    )

    console.log(`Login successful for user: ${user.email}`)

    return {
      success: true,
      message: 'Login successful! Welcome back.',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        accessLevel: user.accessLevel
      }
    }
  } catch (error) {
    console.error('Login error:', error)
    
    // Handle different error types with user-friendly messages
    if (error.statusCode) {
      throw error // Re-throw user-friendly errors
    }
    
    throw createUserFriendlyError('SERVER_ERROR', 500, ERROR_CATEGORIES.SERVER, {
      message: 'We are experiencing technical difficulties. Please try again in a few minutes.'
    })
  }
}) 