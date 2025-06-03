export default defineEventHandler(async (event) => {
  // Dynamic Prisma import
  const { getPrismaClient } = await import('../../../lib/prisma.js')
  const prisma = await getPrismaClient()

  try {
    const products = await prisma.product.findMany({
      include: {
        ProductCategory: true
      }
    })
    return products
  } catch (error) {
    console.error('Error fetching products:', error)
    return {
      statusCode: 500,
      message: 'Failed to fetch products'
    }
  }
}) 