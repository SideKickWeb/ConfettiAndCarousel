import prisma from '../../../lib/prisma.js'
import { requireAuth, checkRateLimit, getClientIP } from '../../utils/auth'
import { handleSafeError, handleMethodNotAllowed } from '../../utils/error-handling'

export default defineEventHandler(async (event) => {
  try {
    // Only allow GET method
    if (getMethod(event) !== 'GET') {
      throw handleMethodNotAllowed(getMethod(event), ['GET'])
    }

    // Apply rate limiting to prevent abuse
    const clientIP = getClientIP(event) || 'unknown'
    checkRateLimit(`bookings-${clientIP}`, 20, 60000) // 20 requests per minute

    // Require authentication using centralized utility
    const user = await requireAuth(event)

    console.log(`Fetching bookings for user: ${user.email}`)

    // Get user events/bookings - only for the authenticated user
    const bookings = await prisma.event.findMany({
      where: {
        customerId: user.id // Ensure users can only see their own bookings
      },
      include: {
        Customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        EventItem: {
          include: {
            Product: {
              select: {
                id: true,
                name: true,
                description: true,
                price: true,
                imageUrl: true,
                active: true,
                categoryId: true,
                canBuy: true,
                canHire: true
              }
            },
            EventItemOption: {
              select: {
                id: true,
                optionName: true,
                value: true,
                label: true,
                priceAdjustment: true
              }
            }
          }
        }
      },
      orderBy: {
        startDate: 'desc'
      }
    })

    console.log(`Found ${bookings.length} bookings for user: ${user.email}`)

    return {
      success: true,
      data: bookings
    }
  } catch (error) {
    console.error('Error fetching user bookings:', error)
    
    // Use centralized error handling
    handleSafeError(error, 'SERVER_ERROR')
  }
}) 