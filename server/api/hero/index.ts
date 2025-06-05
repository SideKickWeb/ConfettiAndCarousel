import { defineEventHandler, getMethod, readBody } from 'h3'
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const method = getMethod(event)

  // GET - Fetch hero section content
  if (method === 'GET') {
    try {
      const heroContent = await prisma.heroSection.findFirst({
        where: {
          isActive: true
        },
        include: {
          images: true,
          buttons: true
        }
      })

      if (!heroContent) {
        // Return default content if none exists
        return {
          title: 'Welcome to Our Event Planning Service',
          subtitle: 'Creating Unforgettable Moments',
          description: 'We specialize in crafting perfect events that leave lasting memories. From weddings to corporate gatherings, we handle every detail with precision and care.',
          images: [
            {
              url: '/images/hero-default-1.jpg',
              alt: 'Elegant event setup'
            },
            {
              url: '/images/hero-default-2.jpg',
              alt: 'Wedding ceremony'
            }
          ],
          buttons: [
            {
              text: 'Book Now',
              url: '/contact',
              variant: 'primary'
            },
            {
              text: 'Learn More',
              url: '/about',
              variant: 'secondary'
            }
          ]
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

  // PUT - Update hero section content
  if (method === 'PUT') {
    try {
      const body = await readBody(event)
      
      // Deactivate all existing hero sections
      await prisma.heroSection.updateMany({
        where: { isActive: true },
        data: { isActive: false }
      })

      // Create new hero section
      const newHero = await prisma.heroSection.create({
        data: {
          title: body.title,
          subtitle: body.subtitle,
          description: body.description,
          isActive: true,
          images: {
            create: body.images.map((image: any) => ({
              url: image.url,
              alt: image.alt
            }))
          },
          buttons: {
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

      return newHero
    } catch (error) {
      console.error('Error updating hero content:', error)
      return {
        statusCode: 500,
        message: 'Failed to update hero content'
      }
    }
  }

  return {
    statusCode: 405,
    message: 'Method not allowed'
  }
}) 