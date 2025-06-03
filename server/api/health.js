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

    // Test Prisma client availability and database connection
    if (process.env.DATABASE_URL) {
      try {
        // Try to import the dynamic Prisma client loader
        const { getPrismaClient } = await import('~/lib/prisma')
        const prisma = await getPrismaClient()
        
        // Test connection with a simple query
        await prisma.$queryRaw`SELECT 1 as test`
        health.database = 'connected'
        health.prismaClient = 'available'
        
      } catch (dbError) {
        console.error('Database/Prisma error:', dbError)
        health.database = 'error'
        health.prismaClient = 'error'
        health.databaseError = dbError.message
        
        // Additional debug info for Prisma issues
        if (dbError.message.includes('Cannot find package')) {
          health.prismaIssue = 'module_not_found'
        } else if (dbError.message.includes('ECONNREFUSED')) {
          health.prismaIssue = 'connection_refused'
        } else if (dbError.message.includes('Prisma client not available')) {
          health.prismaIssue = 'client_unavailable'
        }
      }
    } else {
      health.database = 'no_url'
      health.prismaClient = 'no_database_url'
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