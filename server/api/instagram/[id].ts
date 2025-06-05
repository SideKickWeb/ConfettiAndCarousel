import { defineEventHandler, getMethod, getRouterParam, readBody } from 'h3'
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const method = getMethod(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    return {
      statusCode: 400,
      message: 'Instagram post ID is required'
    }
  }

  // GET - Fetch specific Instagram post
  if (method === 'GET') {
    try {
      const post = await prisma.instagramPost.findUnique({
        where: { id }
      })

      if (!post) {
        return {
          statusCode: 404,
          message: 'Instagram post not found'
        }
      }

      return post
    } catch (error) {
      console.error('Error fetching Instagram post:', error)
      return {
        statusCode: 500,
        message: 'Failed to fetch Instagram post'
      }
    }
  }

  // PATCH - Update specific Instagram post
  if (method === 'PATCH') {
    try {
      const body = await readBody(event)
      
      const updatedPost = await prisma.instagramPost.update({
        where: { id },
        data: {
          imageUrl: body.imageUrl,
          caption: body.caption,
          likes: body.likes,
          comments: body.comments,
          isActive: body.isActive
        }
      })

      return updatedPost
    } catch (error) {
      console.error('Error updating Instagram post:', error)
      return {
        statusCode: 500,
        message: 'Failed to update Instagram post'
      }
    }
  }

  // DELETE - Remove specific Instagram post
  if (method === 'DELETE') {
    try {
      await prisma.instagramPost.delete({
        where: { id }
      })

      return {
        statusCode: 200,
        message: 'Instagram post deleted successfully'
      }
    } catch (error) {
      console.error('Error deleting Instagram post:', error)
      return {
        statusCode: 500,
        message: 'Failed to delete Instagram post'
      }
    }
  }

  return {
    statusCode: 405,
    message: 'Method not allowed'
  }
}) 