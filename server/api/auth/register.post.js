import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'

// Create a new PrismaClient instance
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { email, password, firstName, lastName } = body

    if (!email || !password) {
      return createError({
        statusCode: 400,
        message: 'Email and password are required'
      })
    }

    if (!firstName || !lastName) {
      return createError({
        statusCode: 400,
        message: 'First name and last name are required'
      })
    }

    // Check if account already exists
    const existingAccount = await prisma.account.findUnique({
      where: { email }
    })

    if (existingAccount) {
      return createError({
        statusCode: 400,
        message: 'Account with this email already exists'
      })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new account
    const account = await prisma.account.create({
      data: {
        id: uuidv4(),
        email,
        password: hashedPassword,
        firstName: firstName || '',
        lastName: lastName || '',
        role: 'customer',
        accessLevel: 'standard',
        active: true,
        updatedAt: new Date()
      }
    })

    // Generate JWT token
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
    console.error('Registration error:', error)
    return createError({
      statusCode: 500,
      message: 'Internal server error'
    })
  } finally {
    await prisma.$disconnect()
  }
}) 