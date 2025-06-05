import { defineEventHandler } from 'h3'
import prisma from '../../utils/prisma'

export default defineEventHandler(async () => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`
    
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected'
      }
    }
  } catch (error) {
    console.error('Health check failed:', error)
    return {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'disconnected'
      },
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}) 