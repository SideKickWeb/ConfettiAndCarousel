import { defineEventHandler, getMethod, getRouterParam, readBody } from 'h3'
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const method = getMethod(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    return {
      statusCode: 400,
      message: 'Product ID is required'
    }
  }

  if (method === 'GET') {
    try {
      const product = await prisma.product.findUnique({ where: { id } })
      if (!product) {
        return { statusCode: 404, message: 'Product not found' }
      }
      return product
    } catch (error) {
      return { statusCode: 500, message: 'Failed to fetch product' }
    }
  }

  if (method === 'PATCH') {
    try {
      const body = await readBody(event)
      const updated = await prisma.product.update({ where: { id }, data: body })
      return updated
    } catch (error) {
      return { statusCode: 500, message: 'Failed to update product' }
    }
  }

  if (method === 'DELETE') {
    try {
      await prisma.product.delete({ where: { id } })
      return { statusCode: 200, message: 'Product deleted' }
    } catch (error) {
      return { statusCode: 500, message: 'Failed to delete product' }
    }
  }

  return { statusCode: 405, message: 'Method not allowed' }
}) 