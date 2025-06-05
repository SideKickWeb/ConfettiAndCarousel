import { defineEventHandler, getMethod, readBody } from 'h3'
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const method = getMethod(event)

  // GET - Fetch debug information
  if (method === 'GET') {
    try {
      // Get database statistics
      const [
        userCount,
        eventCount,
        orderCount,
        productCount,
        customerCount
      ] = await Promise.all([
        prisma.user.count(),
        prisma.event.count(),
        prisma.order.count(),
        prisma.product.count(),
        prisma.customer.count()
      ])

      return {
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        database: {
          users: userCount,
          events: eventCount,
          orders: orderCount,
          products: productCount,
          customers: customerCount
        },
        system: {
          memory: process.memoryUsage(),
          uptime: process.uptime()
        }
      }
    } catch (error) {
      console.error('Error fetching debug info:', error)
      return {
        statusCode: 500,
        message: 'Failed to fetch debug information'
      }
    }
  }

  // POST - Clear test data
  if (method === 'POST') {
    try {
      const body = await readBody(event)
      
      if (body.action === 'clearTestData') {
        // Only allow in development
        if (process.env.NODE_ENV !== 'development') {
          return {
            statusCode: 403,
            message: 'This action is only allowed in development mode'
          }
        }

        // Delete test data
        await Promise.all([
          prisma.order.deleteMany({
            where: { status: 'test' }
          }),
          prisma.event.deleteMany({
            where: { status: 'test' }
          }),
          prisma.customer.deleteMany({
            where: { email: { contains: '@test.com' } }
          })
        ])

        return {
          message: 'Test data cleared successfully'
        }
      }

      return {
        statusCode: 400,
        message: 'Invalid action'
      }
    } catch (error) {
      console.error('Error clearing test data:', error)
      return {
        statusCode: 500,
        message: 'Failed to clear test data'
      }
    }
  }

  return {
    statusCode: 405,
    message: 'Method not allowed'
  }
}) 