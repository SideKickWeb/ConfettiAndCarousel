export default defineEventHandler(async (event) => {
  try {
    // Basic health check
    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      hasDbUrl: !!process.env.DATABASE_URL,
      dbUrlLength: process.env.DATABASE_URL ? process.env.DATABASE_URL.length : 0,
      hasJwtSecret: !!process.env.JWT_SECRET,
      runtime: 'Node.js ' + process.version
    }

    // Test database connection if available
    if (process.env.DATABASE_URL) {
      try {
        const { PrismaClient } = await import('@prisma/client')
        const prisma = new PrismaClient()
        
        // Test connection with a simple query
        await prisma.$queryRaw`SELECT 1 as test`
        health.database = 'connected'
        
        await prisma.$disconnect()
      } catch (dbError) {
        console.error('Database connection error:', dbError)
        health.database = 'error'
        health.databaseError = dbError.message
      }
    } else {
      health.database = 'no_url'
    }

    return health
  } catch (error) {
    console.error('Health check error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Health check failed',
      data: {
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    })
  }
}) 