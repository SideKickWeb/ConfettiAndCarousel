import prisma from '../../lib/prisma.js'
import { randomUUID } from 'crypto'

export default defineEventHandler(async (eventHandler) => {
  const method = getMethod(eventHandler)

  // GET - Fetch all events
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

  // POST - Create a new event
  if (method === 'POST') {
    try {
      const body = await readBody(eventHandler)
      
      const newEvent = await prisma.event.create({
        data: {
          id: body.id || randomUUID(),
          customerId: body.customerId,
          title: body.eventName || body.title,
          description: body.eventType || body.description,
          location: body.venue || body.venueAddress || body.location,
          startDate: new Date(body.eventDate || body.startDate || body.startTime),
          endDate: new Date(body.endTime || body.endDate || body.eventDate),
          status: body.status || 'requested',
          staffNotes: body.notes || body.staffNotes,
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