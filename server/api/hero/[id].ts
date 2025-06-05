import { defineEventHandler, getMethod, getRouterParam, readBody } from 'h3'
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const method = getMethod(event)
  const id = getRouterParam(event, 'id')

  if (!id) {
    return {
      statusCode: 400,
      message: 'Hero section ID is required'
    }
  }

  // GET - Fetch specific hero section
  if (method === 'GET') {
    try {
      const heroContent = await prisma.heroSection.findUnique({
        where: { id },
        include: {
          images: true,
          buttons: true
        }
      })

      if (!heroContent) {
        return {
          statusCode: 404,
          message: 'Hero section not found'
        }
      }

      return heroContent
    } catch (error) {
      console.error('Error fetching hero content:', error)
      return {
        statusCode: 500,
        message: 'Failed to fetch hero content'
      }
    }
  }

  // PATCH - Update specific hero section
  if (method === 'PATCH') {
    try {
      const body = await readBody(event)
      
      const updatedHero = await prisma.heroSection.update({
        where: { id },
        data: {
          title: body.title,
          subtitle: body.subtitle,
          description: body.description,
          isActive: body.isActive,
          images: {
            deleteMany: {},
            create: body.images.map((image: any) => ({
              url: image.url,
              alt: image.alt
            }))
          },
          buttons: {
            deleteMany: {},
            create: body.buttons.map((button: any) => ({
              text: button.text,
              url: button.url,
              variant: button.variant
            }))
          }
        },
        include: {
          images: true,
          buttons: true
        }
      })

      return updatedHero
    } catch (error) {
      console.error('Error updating hero content:', error)
      return {
        statusCode: 500,
        message: 'Failed to update hero content'
      }
    }
  }

  // DELETE - Remove specific hero section
  if (method === 'DELETE') {
    try {
      await prisma.heroSection.delete({
        where: { id }
      })

      return {
        statusCode: 200,
        message: 'Hero section deleted successfully'
      }
    } catch (error) {
      console.error('Error deleting hero content:', error)
      return {
        statusCode: 500,
        message: 'Failed to delete hero content'
      }
    }
  }

  return {
    statusCode: 405,
    message: 'Method not allowed'
  }
}) 