import { defineEventHandler, getMethod, getRouterParam, readBody } from 'h3'
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const method = getMethod(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    return {
      statusCode: 400,
      message: 'Order ID is required'
    }
  }

  if (method === 'GET') {
    try {
      const order = await prisma.order.findUnique({ where: { id } })
      if (!order) {
        return { statusCode: 404, message: 'Order not found' }
      }
      return order
    } catch (error) {
      return { statusCode: 500, message: 'Failed to fetch order' }
    }
  }

  if (method === 'PATCH') {
    try {
      const body = await readBody(event)
      const updated = await prisma.order.update({ where: { id }, data: body })
      return updated
    } catch (error) {
      return { statusCode: 500, message: 'Failed to update order' }
    }
  }

  if (method === 'DELETE') {
    try {
      await prisma.order.delete({ where: { id } })
      return { statusCode: 200, message: 'Order deleted' }
    } catch (error) {
      return { statusCode: 500, message: 'Failed to delete order' }
    }
  }

  return { statusCode: 405, message: 'Method not allowed' }
}) 