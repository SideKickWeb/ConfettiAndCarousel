import { defineEventHandler, getMethod, readBody } from 'h3'
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const method = getMethod(event)

  // GET - Fetch all users
  if (method === 'GET') {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          role: true,
          firstName: true,
          lastName: true,
          createdAt: true,
          updatedAt: true
        }
      })
      return users
    } catch (error) {
      console.error('Error fetching users:', error)
      return {
        statusCode: 500,
        message: 'Failed to fetch users'
      }
    }
  }

  // PUT - Update user role
  if (method === 'PUT') {
    try {
      const body = await readBody(event)
      
      const updatedUser = await prisma.user.update({
        where: { id: body.userId },
        data: {
          role: body.role
        },
        select: {
          id: true,
          email: true,
          role: true,
          firstName: true,
          lastName: true,
          createdAt: true,
          updatedAt: true
        }
      })
      
      return updatedUser
    } catch (error) {
      console.error('Error updating user:', error)
      return {
        statusCode: 500,
        message: 'Failed to update user'
      }
    }
  }

  // DELETE - Delete user
  if (method === 'DELETE') {
    try {
      const body = await readBody(event)
      
      await prisma.user.delete({
        where: { id: body.userId }
      })
      
      return {
        message: 'User deleted successfully'
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      return {
        statusCode: 500,
        message: 'Failed to delete user'
      }
    }
  }

  return {
    statusCode: 405,
    message: 'Method not allowed'
  }
}) 