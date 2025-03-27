import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const method = getMethod(event)

  // GET - Fetch all products
  if (method === 'GET') {
    try {
      console.log('API: Fetching products')
      // Get query parameters
      const query = getQuery(event)
      const category = query.category
      
      // Build filters
      const whereClause = {
        active: true
      }
      
      if (category) {
        whereClause.categoryId = category
        console.log(`API: Filtering by category ID: ${category}`)
      }
      
      // Fetch products with proper category filter
      const products = await prisma.product.findMany({
        where: whereClause,
        include: {
          ProductCategory: {
            select: {
              id: true,
              name: true
            }
          }
        },
        orderBy: {
          name: 'asc'
        }
      })
      
      // Format products to include category information
      const formattedProducts = products.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.imageUrl,
        categoryId: product.categoryId,
        category: product.categoryId, // For backward compatibility
        categoryName: product.ProductCategory?.name || null
      }))
      
      console.log(`API: Successfully fetched ${formattedProducts.length} products from database`)
      
      // Set response headers
      setResponseHeaders(event, {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      })
      
      // Return products as stringified JSON
      return {
        success: true,
        data: formattedProducts,
        count: formattedProducts.length
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      
      // Set response headers
      setResponseHeaders(event, {
        'Content-Type': 'application/json'
      })
      
      // Check for specific database connection errors
      if (error.code === 'P1001') {
        return {
          success: false,
          message: 'Cannot reach database server',
          error: error.message
        }
      } else if (error.code === 'P1003') {
        return {
          success: false,
          message: 'Database does not exist or table not found',
          error: error.message
        }
      } else if (error.code) {
        return {
          success: false,
          message: `Database error: ${error.code}`,
          error: error.message
        }
      }
      
      return {
        success: false,
        message: 'Failed to fetch products',
        error: error.message
      }
    }
  }

  return {
    success: false,
    message: 'Method not allowed'
  }
}) 