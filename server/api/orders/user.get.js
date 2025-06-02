import { PrismaClient } from '@prisma/client'
import { requireAuth, checkRateLimit, getClientIP } from '../../utils/auth'
import { handleSafeError, handleMethodNotAllowed } from '../../utils/error-handling'

// Initialize Prisma client properly
const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    // Only allow GET method
    if (getMethod(event) !== 'GET') {
      throw handleMethodNotAllowed(getMethod(event), ['GET'])
    }

    // Apply rate limiting to prevent abuse
    const clientIP = getClientIP(event) || 'unknown'
    checkRateLimit(`orders-${clientIP}`, 20, 60000) // 20 requests per minute

    // Require authentication using centralized utility
    const user = await requireAuth(event)

    console.log(`Fetching orders for user: ${user.email}`)

    // Get user orders - only for the authenticated user
    const orders = await prisma.order.findMany({
      where: {
        customerId: user.id // Ensure users can only see their own orders
      },
      include: {
        Customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
            // Exclude sensitive data
          }
        },
        OrderItem: {
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
                // Remove 'category' field that doesn't exist
              }
            },
            OrderItemOption: {
              select: {
                id: true,
                optionName: true,
                value: true,
                label: true,
                priceAdjustment: true
                // Exclude sensitive option data
              }
            }
          }
        },
        OrderStatusHistory: {
          select: {
            id: true,
            fromStatus: true,
            toStatus: true,
            fromStage: true,
            toStage: true,
            notes: true,
            changedAt: true,
            changedBy: true
          },
          orderBy: {
            changedAt: 'desc'
          },
          take: 1
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log(`Found ${orders.length} orders for user: ${user.email}`)

    return {
      success: true,
      data: orders
    }
  } catch (error) {
    console.error('Error fetching user orders:', error)
    
    // Use centralized error handling
    handleSafeError(error, 'SERVER_ERROR')
  } finally {
    // Disconnect prisma client
    await prisma.$disconnect()
  }
}) 