import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const method = getMethod(event)
  const params = event.context.params || {}
  const id = params.id

  if (!id) {
    return {
      statusCode: 400,
      message: 'Invalid event ID'
    }
  }

  // GET - Fetch a specific event
  if (method === 'GET') {
    try {
      const eventData = await prisma.event.findUnique({
        where: { id },
        include: {
          Customer: true
        }
      })

      if (!eventData) {
        return {
          statusCode: 404,
          message: 'Event not found'
        }
      }

      return eventData
    } catch (error) {
      console.error('Error fetching event:', error)
      return {
        statusCode: 500,
        message: 'Failed to fetch event'
      }
    }
  }

  // PUT - Update an event
  if (method === 'PUT') {
    try {
      const body = await readBody(event)
      
      const updatedEvent = await prisma.event.update({
        where: { id },
        data: {
          title: body.title,
          description: body.description,
          location: body.location,
          startDate: body.startDate ? new Date(body.startDate) : undefined,
          endDate: body.endDate ? new Date(body.endDate) : undefined,
          startTime: body.startTime,
          status: body.status,
          customerNotes: body.notes,
          updatedAt: new Date()
        },
        include: {
          Customer: true
        }
      })
      
      return updatedEvent
    } catch (error) {
      console.error('Error updating event:', error)
      return {
        statusCode: 500,
        message: 'Failed to update event'
      }
    }
  }

  // DELETE - Delete an event
  if (method === 'DELETE') {
    try {
      await prisma.event.delete({
        where: { id }
      })
      
      return {
        statusCode: 200,
        message: 'Event deleted successfully'
      }
    } catch (error) {
      console.error('Error deleting event:', error)
      return {
        statusCode: 500,
        message: 'Failed to delete event'
      }
    }
  }

  return {
    statusCode: 405,
    message: 'Method not allowed'
  }
}) 