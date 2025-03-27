import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const method = getMethod(event)

  // GET - Fetch all bookings
  if (method === 'GET') {
    try {
      const bookings = await prisma.booking.findMany({
        include: {
          product: true,
          location: true
        }
      })
      return bookings
    } catch (error) {
      console.error('Error fetching bookings:', error)
      return {
        statusCode: 500,
        message: 'Failed to fetch bookings'
      }
    }
  }

  // POST - Create a new booking
  if (method === 'POST') {
    try {
      const body = await readBody(event)
      
      const booking = await prisma.booking.create({
        data: {
          productId: body.productId,
          locationId: body.locationId,
          startTime: new Date(body.startTime),
          endTime: new Date(body.endTime),
          customerName: body.customerName,
          customerEmail: body.customerEmail,
          customerPhone: body.customerPhone,
          notes: body.notes
        },
        include: {
          product: true,
          location: true
        }
      })
      
      return booking
    } catch (error) {
      console.error('Error creating booking:', error)
      return {
        statusCode: 500,
        message: 'Failed to create booking'
      }
    }
  }

  return {
    statusCode: 405,
    message: 'Method not allowed'
  }
}) 