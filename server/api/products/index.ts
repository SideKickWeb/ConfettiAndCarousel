import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
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