export default defineEventHandler(async (event) => {
  try {
    // Basic health check
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      hasDbUrl: !!process.env.DATABASE_URL,
      dbUrlLength: process.env.DATABASE_URL ? process.env.DATABASE_URL.length : 0
    }
  } catch (error) {
    console.error('Health check error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Health check failed'
    })
  }
}) 