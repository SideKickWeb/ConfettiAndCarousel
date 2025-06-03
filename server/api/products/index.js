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
      
      // Dynamic Prisma import
      const { getPrismaClient } = await import('../../lib/prisma.js')
      const prisma = await getPrismaClient()
      
      // Fetch products with proper category filter
      const products = await prisma.product.findMany({
        where: whereClause,
        include: {
          ProductCategory: true,
          ProductOption: {
            include: {
              ProductOptionValue: {
                orderBy: {
                  sortOrder: 'asc'
                }
              }
            },
            orderBy: {
              sortOrder: 'asc'
            }
          }
        },
        orderBy: {
          name: 'asc'
        }
      })
      
      // Format products to include all relevant information including custom fields
      const formattedProducts = products.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        imageUrl: product.imageUrl,
        active: product.active,
        canBuy: product.canBuy,
        canHire: product.canHire,
        hasRangePrice: product.hasRangePrice,
        hasUnitPrice: product.hasUnitPrice,
        maxPrice: product.maxPrice,
        minPrice: product.minPrice,
        minQuantity: product.minQuantity,
        unitPrice: product.unitPrice,
        unitType: product.unitType,
        category: product.ProductCategory ? {
          id: product.ProductCategory.id,
          name: product.ProductCategory.name,
          description: product.ProductCategory.description
        } : null,
        options: product.ProductOption.map(option => ({
          id: option.id,
          name: option.name,
          type: option.type,
          required: option.required,
          sortOrder: option.sortOrder,
          values: option.ProductOptionValue.map(value => ({
            id: value.id,
            value: value.value,
            label: value.label || value.value,
            priceAdjustment: value.priceAdjustment || 0,
            sortOrder: value.sortOrder
          }))
        })),
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
      }))
      
      console.log(`API: Successfully fetched ${formattedProducts.length} products from database`)
      
      // Set response headers
      setResponseHeaders(event, {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      })
      
      // Return products as JSON
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