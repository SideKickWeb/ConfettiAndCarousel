import { defineEventHandler, getMethod, readBody } from 'h3'
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const method = getMethod(event)

  // GET - Fetch all products
  if (method === 'GET') {
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
  }

  // POST - Create a new product
  if (method === 'POST') {
    try {
      const body = await readBody(event)
      
      const newProduct = await prisma.product.create({
        data: {
          id: `PROD-${Date.now()}`,
          name: body.name,
          description: body.description,
          price: body.price,
          categoryId: body.categoryId,
          imageUrl: body.imageUrl,
          active: body.active ?? true,
          updatedAt: new Date()
        },
        include: {
          ProductCategory: true
        }
      })
      
      return newProduct
    } catch (error) {
      console.error('Error creating product:', error)
      return {
        statusCode: 500,
        message: 'Failed to create product'
      }
    }
  }

  return {
    statusCode: 405,
    message: 'Method not allowed'
  }
}) 