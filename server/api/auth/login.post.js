import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Create a new PrismaClient instance
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email, password } = body

    if (!email || !password) {
      return createError({
        statusCode: 400,
        message: 'Email and password are required'
      })
    }

    // Find account by email
    const account = await prisma.account.findUnique({
      where: { email }
    })

    if (!account) {
      return createError({
        statusCode: 401,
        message: 'Invalid email or password'
      })
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, account.password)
    
    if (!isPasswordValid) {
      return createError({
        statusCode: 401,
        message: 'Invalid email or password'
      })
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        id: account.id,
        email: account.email,
        role: account.role,
        accessLevel: account.accessLevel
      },
      useRuntimeConfig().jwtSecret,
      { expiresIn: '7d' }
    )

    // Set HTTP-only cookie
    setCookie(event, 'token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    })

    // Return account data (excluding password)
    return {
      id: account.id,
      email: account.email,
      firstName: account.firstName,
      lastName: account.lastName,
      role: account.role,
      accessLevel: account.accessLevel
    }
  } catch (error) {
    console.error('Login error:', error)
    return createError({
      statusCode: 500,
      message: 'Internal server error'
    })
  } finally {
    await prisma.$disconnect()
  }
}) 