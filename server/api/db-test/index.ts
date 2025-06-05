import { defineEventHandler, getMethod, readBody } from 'h3'
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const method = getMethod(event)

  // GET - Run basic database tests
  if (method === 'GET') {
    try {
      // Test database connection
      await prisma.$queryRaw`SELECT 1`

      // Test basic CRUD operations
      const testUser = await prisma.user.create({
        data: {
          email: 'test@example.com',
          password: 'test123',
          role: 'user',
          firstName: 'Test',
          lastName: 'User'
        }
      })

      const updatedUser = await prisma.user.update({
        where: { id: testUser.id },
        data: { firstName: 'Updated' }
      })

      await prisma.user.delete({
        where: { id: testUser.id }
      })

      return {
        status: 'success',
        message: 'Database tests completed successfully',
        tests: {
          connection: 'passed',
          create: 'passed',
          update: 'passed',
          delete: 'passed'
        }
      }
    } catch (error) {
      console.error('Database test failed:', error)
      return {
        status: 'error',
        message: 'Database tests failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // POST - Run custom database test
  if (method === 'POST') {
    try {
      const body = await readBody(event)
      
      if (!body.query) {
        return {
          statusCode: 400,
          message: 'Query is required'
        }
      }

      // Execute custom query
      const result = await prisma.$queryRawUnsafe(body.query)

      return {
        status: 'success',
        result
      }
    } catch (error) {
      console.error('Custom database test failed:', error)
      return {
        status: 'error',
        message: 'Custom database test failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  return {
    statusCode: 405,
    message: 'Method not allowed'
  }
}) 