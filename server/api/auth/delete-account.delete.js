import prisma from '../../lib/prisma.js'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  try {
    // Get token from cookies
    const token = getCookie(event, 'token')

    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Not authenticated'
      })
    }

    // Verify token
    let decoded
    try {
      decoded = jwt.verify(token, useRuntimeConfig().jwtSecret)
    } catch (err) {
      console.error('Error verifying token:', err.message)
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid or expired token'
      })
    }

    const userId = decoded.id

    // Get request body for confirmation
    const body = await readBody(event)
    
    // Require explicit confirmation
    if (!body.confirmDelete || body.confirmDelete !== true) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Account deletion must be explicitly confirmed'
      })
    }

    // Optional: Require password confirmation for extra security
    if (body.password) {
      const account = await prisma.account.findUnique({
        where: { id: userId }
      })

      if (!account) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Account not found'
        })
      }

      // Verify password if provided
      const bcrypt = await import('bcryptjs')
      const passwordMatch = await bcrypt.compare(body.password, account.password)
      
      if (!passwordMatch) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Invalid password'
        })
      }
    }

    console.log(`Deleting account for user ID: ${userId}`)

    // Use transaction to ensure all related data is deleted properly
    await prisma.$transaction(async (prisma) => {
      // Check if user exists as a customer and get customer ID
      const customer = await prisma.customer.findUnique({
        where: { email: decoded.email }
      })

      if (customer) {
        console.log(`Found customer record: ${customer.id}`)

        // Delete order-related data first (due to foreign key constraints)
        // Delete order item options
        await prisma.orderItemOption.deleteMany({
          where: {
            OrderItem: {
              Order: {
                customerId: customer.id
              }
            }
          }
        })

        // Delete order items
        await prisma.orderItem.deleteMany({
          where: {
            Order: {
              customerId: customer.id
            }
          }
        })

        // Delete order status history
        await prisma.orderStatusHistory.deleteMany({
          where: {
            Order: {
              customerId: customer.id
            }
          }
        })

        // Delete orders
        await prisma.order.deleteMany({
          where: {
            customerId: customer.id
          }
        })

        // Delete event-related data
        // Delete event item options
        await prisma.eventItemOption.deleteMany({
          where: {
            EventItem: {
              Event: {
                customerId: customer.id
              }
            }
          }
        })

        // Delete event items
        await prisma.eventItem.deleteMany({
          where: {
            Event: {
              customerId: customer.id
            }
          }
        })

        // Delete events
        await prisma.event.deleteMany({
          where: {
            customerId: customer.id
          }
        })

        // Delete customer record
        await prisma.customer.delete({
          where: { id: customer.id }
        })

        console.log(`Deleted customer record and all related data for: ${customer.id}`)
      }

      // Finally, delete the account
      await prisma.account.delete({
        where: { id: userId }
      })

      console.log(`Deleted account: ${userId}`)
    })

    // Clear the authentication cookie
    deleteCookie(event, 'token', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      path: '/'
    })

    console.log(`Account deletion completed for user: ${decoded.email}`)

    return {
      success: true,
      message: 'Account and all associated data have been permanently deleted'
    }

  } catch (error) {
    console.error('Error deleting account:', error)
    
    // Don't expose internal errors to the client
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete account. Please try again or contact support.'
    })
  } finally {
    // Disconnect prisma client
    await prisma.$disconnect()
  }
}) 