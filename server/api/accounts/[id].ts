import { defineEventHandler, getMethod, getRouterParam, readBody } from 'h3'
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const method = getMethod(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    return {
      statusCode: 400,
      message: 'Account ID is required'
    }
  }

  if (method === 'GET') {
    try {
      const account = await prisma.account.findUnique({ where: { id } })
      if (!account) {
        return { statusCode: 404, message: 'Account not found' }
      }
      return account
    } catch (error) {
      return { statusCode: 500, message: 'Failed to fetch account' }
    }
  }

  if (method === 'PATCH') {
    try {
      const body = await readBody(event)
      const updated = await prisma.account.update({ where: { id }, data: body })
      return updated
    } catch (error) {
      return { statusCode: 500, message: 'Failed to update account' }
    }
  }

  if (method === 'DELETE') {
    try {
      await prisma.account.delete({ where: { id } })
      return { statusCode: 200, message: 'Account deleted' }
    } catch (error) {
      return { statusCode: 500, message: 'Failed to delete account' }
    }
  }

  return { statusCode: 405, message: 'Method not allowed' }
}) 