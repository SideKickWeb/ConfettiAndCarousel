import { defineEventHandler, getMethod, readBody } from 'h3'
import { hash } from 'bcrypt'
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const method = getMethod(event)

  // GET - Fetch user profile
  if (method === 'GET') {
    try {
      const userId = event.context.auth?.userId
      if (!userId) {
        return {
          statusCode: 401,
          message: 'Unauthorized'
        }
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          createdAt: true,
          updatedAt: true
        }
      })

      if (!user) {
        return {
          statusCode: 404,
          message: 'User not found'
        }
      }

      return user
    } catch (error) {
      console.error('Error fetching user profile:', error)
      return {
        statusCode: 500,
        message: 'Failed to fetch user profile'
      }
    }
  }

  // PUT - Update user profile
  if (method === 'PUT') {
    try {
      const userId = event.context.auth?.userId
      if (!userId) {
        return {
          statusCode: 401,
          message: 'Unauthorized'
        }
      }

      const body = await readBody(event)
      const updateData: any = {
        firstName: body.firstName,
        lastName: body.lastName
      }

      // Only update password if provided
      if (body.password) {
        updateData.password = await hash(body.password, 10)
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          createdAt: true,
          updatedAt: true
        }
      })

      return updatedUser
    } catch (error) {
      console.error('Error updating user profile:', error)
      return {
        statusCode: 500,
        message: 'Failed to update user profile'
      }
    }
  }

  return {
    statusCode: 405,
    message: 'Method not allowed'
  }
}) 