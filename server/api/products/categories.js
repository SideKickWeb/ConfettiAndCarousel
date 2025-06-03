export default defineEventHandler(async (event) => {
  const method = getMethod(event)

  // GET - Fetch all categories
  if (method === 'GET') {
    try {
      console.log('API: Fetching product categories')
      
      // Dynamic Prisma import
      const { getPrismaClient } = await import('../../../lib/prisma.js')
      const prisma = await getPrismaClient()
      
      // Fetch all categories
      const categories = await prisma.productCategory.findMany({
        where: {
          active: true
        },
        orderBy: {
          name: 'asc'
        },
        select: {
          id: true,
          name: true,
          description: true,
          active: true,
          createdAt: true,
          updatedAt: true
        }
      })
      
      console.log(`API: Successfully fetched ${categories.length} categories from database`)
      
      // Set response headers
      setResponseHeaders(event, {
        'Content-Type': 'application/json',
        'Cache-Control': 'max-age=300' // Cache for 5 minutes
      })
      
      return {
        success: true,
        data: categories,
        count: categories.length
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      
      return {
        success: false,
        message: 'Failed to fetch categories',
        error: error.message
      }
    }
  }

  return {
    success: false,
    message: 'Method not allowed'
  }
}) 