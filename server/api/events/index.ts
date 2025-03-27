import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (eventHandler) => {
  const method = getMethod(eventHandler)

  // GET - Fetch all events
  if (method === 'GET') {
    try {
      const events = await prisma.event.findMany({
        include: {
          client: true,
          staffAssigned: {
            include: {
              staff: true
            }
          },
          tasks: true
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

  // POST - Create a new event
  if (method === 'POST') {
    try {
      const body = await readBody(eventHandler)
      
      const newEvent = await prisma.event.create({
        data: {
          clientId: body.clientId,
          eventName: body.eventName,
          eventType: body.eventType,
          eventDate: new Date(body.eventDate),
          startTime: body.startTime ? new Date(body.startTime) : null,
          endTime: body.endTime ? new Date(body.endTime) : null,
          venue: body.venue,
          venueAddress: body.venueAddress,
          expectedGuests: body.expectedGuests,
          status: body.status || 'Requested'
        },
        include: {
          client: true
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