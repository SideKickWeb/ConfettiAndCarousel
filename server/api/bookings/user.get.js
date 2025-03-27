import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    // Get token from cookies
    const token = getCookie(event, 'token')

    if (!token) {
      return createError({
        statusCode: 401,
        message: 'Not authenticated'
      })
    }

    // Verify token
    let decoded
    try {
      decoded = jwt.verify(token, useRuntimeConfig().jwtSecret)
    } catch (err) {
      console.error('Error verifying token:', err.message)
      return createError({
        statusCode: 401,
        message: 'Invalid or expired token'
      })
    }

    // Get user bookings
    const bookings = await prisma.booking.findMany({
      where: {
        userId: decoded.id
      },
      orderBy: {
        eventDate: 'desc'
      }
    })

    return bookings
  } catch (error) {
    console.error('Error fetching user bookings:', error)
    return createError({
      statusCode: 500,
      message: 'Failed to fetch bookings'
    })
  }
}) 