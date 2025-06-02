import prisma from '../../../lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
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

    // Apply rate limiting for registration attempts
    const clientIP = getClientIP(event) || 'unknown'
    checkRateLimit(`register-${clientIP}`, 3, 300000, 'REGISTRATION') // 3 registrations per 5 minutes per IP

    // Get request body
    const body = await readBody(event)

    // Validate and sanitize input with user-friendly messages
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
      password: { 
        required: true, 
        type: 'string', 
        minLength: 6, 
        maxLength: 255,
        label: 'Password'
      },
      confirmPassword: { 
        required: true, 
        type: 'string', 
        minLength: 6,
        label: 'Password confirmation'
      }
    })

    const { firstName, lastName, email, password, confirmPassword } = validatedData

    // Check if passwords match
    if (password !== confirmPassword) {
      throw handleAuthError('PASSWORD_MISMATCH')
    }

    console.log(`Registration attempt for email: ${email}`)

    // Check if account already exists
    const existingAccount = await prisma.account.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (existingAccount) {
      console.log(`Registration failed: Email already exists: ${email}`)
      throw handleAuthError('EMAIL_EXISTS')
    }

    // Hash password with secure salt rounds
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Create account in transaction to ensure data consistency
    const account = await prisma.$transaction(async (prisma) => {
      // Create the account
      const newAccount = await prisma.account.create({
        data: {
          id: uuidv4(),
          email: email.toLowerCase(),
          password: hashedPassword,
          firstName,
          lastName,
          role: 'customer', // Default role
          accessLevel: 'standard',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })

      // Also create a Customer record for orders/bookings
      await prisma.customer.create({
        data: {
          id: newAccount.id, // Use same ID for consistency
          email: newAccount.email,
          firstName: newAccount.firstName,
          lastName: newAccount.lastName,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })

      return newAccount
    })

    console.log(`Account created successfully for user: ${account.email}`)

    // Generate JWT token for immediate login
    const token = jwt.sign(
      { 
        id: account.id, 
        email: account.email,
        role: account.role,
        firstName: account.firstName,
        lastName: account.lastName
      },
      useRuntimeConfig().jwtSecret,
      { expiresIn: '7d' }
    )

    // Set secure HTTP-only cookie
    setCookie(event, 'token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 7 days in seconds
    })

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
        createdAt: account.createdAt
      },
      message: 'Account created successfully! Welcome to Confetti and Carousel.'
    }
  } catch (error) {
    console.error('Registration error:', error)
    
    // Use centralized error handling
    handleSafeError(error, 'SERVER_ERROR')
  } finally {
    await prisma.$disconnect()
  }
}) 