import { PrismaClient } from '@prisma/client'
import { getMethod, readBody, getQuery, getCookie } from 'h3'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()
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

  // GET - Retrieve bookings
  if (method === 'GET') {
    try {
      const query = getQuery(event)
      const limit = parseInt(query.limit) || 10
      const offset = parseInt(query.offset) || 0
      
      const bookings = await prisma.booking.findMany({
        where: {
          userId
        },
        include: {
          bookingItems: {
            include: {
              product: true,
              customValues: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip: offset,
        take: limit
      })
      
      return bookings
    } catch (error) {
      console.error('Error retrieving bookings:', error)
      return createError({
        statusCode: 500,
        message: 'Failed to retrieve bookings'
      })
    }
  }
  
  // POST - Create a new booking
  if (method === 'POST') {
    try {
      const data = await readBody(event)
      
      // Validate required fields
      if (!data.eventType || !data.date || !data.location || !data.items || !data.items.length) {
        return createError({
          statusCode: 400,
          message: 'Missing required booking information'
        })
      }
      
      // Create booking and items in a transaction
      const booking = await prisma.$transaction(async (prisma) => {
        // Create the booking
        const newBooking = await prisma.booking.create({
          data: {
            userId,
            eventType: data.eventType,
            eventDate: new Date(data.date),
            eventTime: data.time,
            location: data.location,
            guestCount: data.guestCount || 0,
            additionalInfo: data.additionalInfo,
            status: 'PENDING',
            totalAmount: data.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
          }
        })
        
        // Create booking items
        for (const item of data.items) {
          const bookingItem = await prisma.bookingItem.create({
            data: {
              bookingId: newBooking.id,
              productId: item.id,
              quantity: item.quantity,
              price: item.price,
              variantName: item.variant?.name || null
            }
          })
          
          // Create custom values if any
          if (item.customValues) {
            for (const [key, value] of Object.entries(item.customValues)) {
              await prisma.bookingItemCustomValue.create({
                data: {
                  bookingItemId: bookingItem.id,
                  name: key,
                  value: value
                }
              })
            }
          }
        }
        
        return prisma.booking.findUnique({
          where: {
            id: newBooking.id
          },
          include: {
            bookingItems: {
              include: {
                product: true,
                customValues: true
              }
            }
          }
        })
      })
      
      return booking
    } catch (error) {
      console.error('Error creating booking:', error)
      return createError({
        statusCode: 500,
        message: 'Failed to create booking: ' + error.message
      })
    }
  }
  
  // Method not allowed
  return createError({
    statusCode: 405,
    message: 'Method not allowed'
  })
}) 