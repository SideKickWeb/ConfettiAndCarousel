import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

// Create a new PrismaClient instance
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    // Get token from cookie
    const token = getCookie(event, 'token')

    if (!token) {
      return createError({
        statusCode: 401,
        message: 'Unauthorized'
      })
    }

    // Verify token
    const decoded = jwt.verify(token, useRuntimeConfig().jwtSecret)

    // Get account from database
    const account = await prisma.account.findUnique({
      where: { id: decoded.id }
    })

    if (!account) {
      return createError({
        statusCode: 401,
        message: 'Account not found'
      })
    }

    // Return account data (excluding password)
    return {
      success: true,
      data: {
        id: account.id,
        email: account.email,
        firstName: account.firstName,
        lastName: account.lastName,
        role: account.role,
        accessLevel: account.accessLevel
      }
    }
  } catch (error) {
    console.error('Error verifying token:', error)
    return createError({
      statusCode: 401,
      message: 'Invalid token'
    })
  } finally {
    await prisma.$disconnect()
  }
}) 