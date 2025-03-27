import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const method = getMethod(event)
  const params = event.context.params || {}
  const id = parseInt(params.id || '')

  if (isNaN(id)) {
    return {
      statusCode: 400,
      message: 'Invalid booking ID'
    }
  }

  // GET - Fetch a specific booking
  if (method === 'GET') {
    try {
      const booking = await prisma.booking.findUnique({
        where: { id },
        include: {
          product: true,
          location: true
        }
      })

      if (!booking) {
        return {
          statusCode: 404,
          message: 'Booking not found'
        }
      }

      return booking
    } catch (error) {
      console.error('Error fetching booking:', error)
      return {
        statusCode: 500,
        message: 'Failed to fetch booking'
      }
    }
  }

  // PUT - Update a booking
  if (method === 'PUT') {
    try {
      const body = await readBody(event)
      
      const booking = await prisma.booking.update({
        where: { id },
        data: {
          productId: body.productId,
          locationId: body.locationId,
          startTime: body.startTime ? new Date(body.startTime) : undefined,
          endTime: body.endTime ? new Date(body.endTime) : undefined,
          customerName: body.customerName,
          customerEmail: body.customerEmail,
          customerPhone: body.customerPhone,
          status: body.status,
          notes: body.notes
        },
        include: {
          product: true,
          location: true
        }
      })
      
      return booking
    } catch (error) {
      console.error('Error updating booking:', error)
      return {
        statusCode: 500,
        message: 'Failed to update booking'
      }
    }
  }

  // DELETE - Delete a booking
  if (method === 'DELETE') {
    try {
      await prisma.booking.delete({
        where: { id }
      })
      
      return {
        statusCode: 200,
        message: 'Booking deleted successfully'
      }
    } catch (error) {
      console.error('Error deleting booking:', error)
      return {
        statusCode: 500,
        message: 'Failed to delete booking'
      }
    }
  }

  return {
    statusCode: 405,
    message: 'Method not allowed'
  }
}) 