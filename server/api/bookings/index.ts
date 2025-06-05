import { defineEventHandler, getMethod, readBody } from 'h3'
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const method = getMethod(event)

  // GET - Fetch all bookings
  if (method === 'GET') {
    try {
      const bookings = await prisma.booking.findMany({
        include: {
          Customer: true,
          Location: true,
          Event: true
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
      
      const newBooking = await prisma.booking.create({
        data: {
          customerId: body.customerId,
          locationId: body.locationId,
          eventId: body.eventId,
          startDate: new Date(body.startDate),
          endDate: new Date(body.endDate),
          status: body.status || 'pending',
          notes: body.notes,
          totalAmount: body.totalAmount,
          depositAmount: body.depositAmount,
          isConfirmed: body.isConfirmed ?? false
        },
        include: {
          Customer: true,
          Location: true,
          Event: true
        }
      })
      
      return newBooking
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