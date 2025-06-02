import prisma from '../../../lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { validateInput, checkRateLimit, getClientIP } from '../../utils/auth'
import { 
  handleSafeError, 
  handleMethodNotAllowed, 
  handleAuthError,
  createUserFriendlyError,
  ERROR_CATEGORIES 
} from '../../utils/error-handling'

export default defineEventHandler(async (event) => {
  try {
    // Only allow POST method
    if (getMethod(event) !== 'POST') {
      throw handleMethodNotAllowed(getMethod(event), ['POST'])
    }

    // Apply strict rate limiting for login attempts
    const clientIP = getClientIP(event) || 'unknown'
    checkRateLimit(`login-${clientIP}`, 5, 300000, 'LOGIN') // 5 attempts per 5 minutes per IP

    // Get request body
    const body = await readBody(event)

    // Validate input with user-friendly messages
    const validatedData = validateInput(body, {
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

    const { email, password } = validatedData

    console.log(`Login attempt for email: ${email}`)

    // Find user account
    const account = await prisma.account.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (!account) {
      // Apply rate limiting per email address for invalid login attempts
      checkRateLimit(`login-email-${email}`, 3, 300000, 'LOGIN') // 3 attempts per 5 minutes per email
      console.log(`Login failed: No account found for email: ${email}`)
      throw handleAuthError('INVALID_CREDENTIALS')
    }

    // Apply rate limiting per email address
    checkRateLimit(`login-email-${email}`, 3, 300000, 'LOGIN') // 3 attempts per 5 minutes per email

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, account.password)
    if (!isPasswordValid) {
      console.log(`Login failed: Invalid password for email: ${email}`)
      throw handleAuthError('INVALID_CREDENTIALS')
    }

    // Check if account is active (if you have an active field)
    // if (!account.active) {
    //   throw createUserFriendlyError('ACCOUNT_SUSPENDED', 403, ERROR_CATEGORIES.AUTH, {
    //     message: 'Your account has been suspended. Please contact support.'
    //   })
    // }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: account.id, 
        email: account.email,
        role: account.role,
        firstName: account.firstName,
        lastName: account.lastName
      },
      useRuntimeConfig().jwtSecret,
      { expiresIn: '7d' } // 7 days expiration
    )

    // Set secure HTTP-only cookie
    setCookie(event, 'token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 7 days in seconds
    })

    console.log(`Login successful for user: ${account.email}`)

    // Return account data (excluding password)
    return {
      success: true,
      data: {
        id: account.id,
        email: account.email,
        firstName: account.firstName,
        lastName: account.lastName,
        role: account.role,
        accessLevel: account.accessLevel,
        isAdmin: account.role === 'admin',
        createdAt: account.createdAt
      },
      message: 'Login successful'
    }
  } catch (error) {
    console.error('Login error:', error)
    
    // Use centralized error handling
    handleSafeError(error, 'SERVER_ERROR')
  } finally {
    await prisma.$disconnect()
  }
}) 