import { defineEventHandler, getMethod, getRouterParam, readBody } from 'h3'
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const method = getMethod(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    return {
      statusCode: 400,
      message: 'Location ID is required'
    }
  }

  if (method === 'GET') {
    try {
      const location = await prisma.location.findUnique({ where: { id } })
      if (!location) {
        return { statusCode: 404, message: 'Location not found' }
      }
      return location
    } catch (error) {
      return { statusCode: 500, message: 'Failed to fetch location' }
    }
  }

  if (method === 'PATCH') {
    try {
      const body = await readBody(event)
      const updated = await prisma.location.update({ where: { id }, data: body })
      return updated
    } catch (error) {
      return { statusCode: 500, message: 'Failed to update location' }
    }
  }

  if (method === 'DELETE') {
    try {
      await prisma.location.delete({ where: { id } })
      return { statusCode: 200, message: 'Location deleted' }
    } catch (error) {
      return { statusCode: 500, message: 'Failed to delete location' }
    }
  }

  return { statusCode: 405, message: 'Method not allowed' }
}) 