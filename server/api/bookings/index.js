import prisma from '../../lib/prisma.js'
import { getMethod, readBody, getQuery, getCookie } from 'h3'
import jwt from 'jsonwebtoken'
import { randomUUID } from 'crypto'

const JWT_SECRET = process.env.JWT_SECRET || 'development-secret-key'

export default defineEventHandler(async (event) => {
  const method = getMethod(event)

  // Get user from token
  const token = getCookie(event, 'token')
  if (!token) {
    return createError({
      statusCode: 401,
      message: 'Unauthorized: No token provided'
    })
  }

  let userId
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    userId = decoded.userId
  } catch (error) {
    return createError({
      statusCode: 401,
      message: 'Unauthorized: Invalid token'
    })
  }

  // GET - Retrieve events (bookings) for the user
  if (method === 'GET') {
    try {
      const query = getQuery(event)
      const limit = parseInt(query.limit) || 10
      const offset = parseInt(query.offset) || 0
      
      // Find customer by user account
      const customer = await prisma.customer.findFirst({
        where: {
          // Assuming there's a relationship between account and customer
          // For now, we'll just return events without filtering by user
        }
      })
      
      const events = await prisma.event.findMany({
        include: {
          Customer: true,
          EventItem: {
            include: {
              Product: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip: offset,
        take: limit
      })
      
      return events
    } catch (error) {
      console.error('Error retrieving events:', error)
      return createError({
        statusCode: 500,
        message: 'Failed to retrieve events'
      })
    }
  }
  
  // POST - Create a new event (booking)
  if (method === 'POST') {
    try {
      const data = await readBody(event)
      
      // Validate required fields
      if (!data.eventType || !data.date || !data.location) {
        return createError({
          statusCode: 400,
          message: 'Missing required booking information'
        })
      }
      
      // Create event and items in a transaction
      const event = await prisma.$transaction(async (prisma) => {
        // Create the event
        const newEvent = await prisma.event.create({
          data: {
            id: randomUUID(),
            title: data.eventType,
            startDate: new Date(data.date),
            startTime: data.time || '',
            location: data.location,
            description: data.additionalInfo,
            status: 'pending',
            totalAmount: data.items ? data.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) : 0,
            updatedAt: new Date()
          }
        })
        
        // Create event items if provided
        if (data.items && data.items.length > 0) {
          for (const item of data.items) {
            await prisma.eventItem.create({
              data: {
                id: randomUUID(),
                eventId: newEvent.id,
                productId: item.id,
                quantity: item.quantity,
                unitPrice: item.price,
                totalPrice: item.price * item.quantity
              }
            })
          }
        }
        
        return prisma.event.findUnique({
          where: {
            id: newEvent.id
          },
          include: {
            Customer: true,
            EventItem: {
              include: {
                Product: true
              }
            }
          }
        })
      })
      
      return event
    } catch (error) {
      console.error('Error creating event:', error)
      return createError({
        statusCode: 500,
        message: 'Failed to create event: ' + error.message
      })
    }
  }
  
  // Method not allowed
  return createError({
    statusCode: 405,
    message: 'Method not allowed'
  })
}) 