import prisma from '../lib/prisma.js'

export default defineEventHandler(async (event) => {
  try {
    // Test database connection
    await prisma.$connect()
    console.log('Database connection successful')
    
    // Try to query the product count
    const productCount = await prisma.product.count()
    
    return {
      status: 'ok',
      message: 'Database connection successful',
      productCount,
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error('Database connection error:', error)
    
    return createError({
      statusCode: 500,
      message: `Database connection failed: ${error.message}`,
      error: {
        code: error.code,
        meta: error.meta
      }
    })
  } finally {
    await prisma.$disconnect()
  }
}) 