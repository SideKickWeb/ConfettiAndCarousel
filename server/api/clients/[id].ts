import { defineEventHandler, getMethod, getRouterParam, readBody } from 'h3'
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const method = getMethod(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    return {
      statusCode: 400,
      message: 'Client ID is required'
    }
  }

  if (method === 'GET') {
    try {
      const client = await prisma.client.findUnique({ where: { id } })
      if (!client) {
        return { statusCode: 404, message: 'Client not found' }
      }
      return client
    } catch (error) {
      return { statusCode: 500, message: 'Failed to fetch client' }
    }
  }

  if (method === 'PATCH') {
    try {
      const body = await readBody(event)
      const updated = await prisma.client.update({ where: { id }, data: body })
      return updated
    } catch (error) {
      return { statusCode: 500, message: 'Failed to update client' }
    }
  }

  if (method === 'DELETE') {
    try {
      await prisma.client.delete({ where: { id } })
      return { statusCode: 200, message: 'Client deleted' }
    } catch (error) {
      return { statusCode: 500, message: 'Failed to delete client' }
    }
  }

  return { statusCode: 405, message: 'Method not allowed' }
}) 