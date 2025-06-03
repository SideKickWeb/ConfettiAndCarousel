import { randomUUID } from 'crypto'

export default defineEventHandler(async (event) => {
  const method = getMethod(event)

  // Dynamic Prisma import
  const { getPrismaClient } = await import('../../../lib/prisma.js')
  const prisma = await getPrismaClient()

  // GET - Fetch all events (bookings)
  if (method === 'GET') {
    try {
      const events = await prisma.event.findMany({
        include: {
          Customer: true
        }
      })
      return events
    } catch (error) {
      console.error('Error fetching events:', error)
      return {
        statusCode: 500,
        message: 'Failed to fetch events'
      }
    }
  }

  // POST - Create a new event (booking)
  if (method === 'POST') {
    try {
      const body = await readBody(event)
      
      const newEvent = await prisma.event.create({
        data: {
          id: body.id || randomUUID(),
          title: body.title || 'New Event',
          description: body.description,
          location: body.location || '',
          startDate: new Date(body.startDate),
          endDate: body.endDate ? new Date(body.endDate) : null,
          startTime: body.startTime || '',
          customerId: body.customerId,
          customerNotes: body.notes,
          updatedAt: new Date()
        },
        include: {
          Customer: true
        }
      })
      
      return newEvent
    } catch (error) {
      console.error('Error creating event:', error)
      return {
        statusCode: 500,
        message: 'Failed to create event'
      }
    }
  }

  return {
    statusCode: 405,
    message: 'Method not allowed'
  }
}) 