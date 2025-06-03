import { requireAuth } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  try {
    // Require authentication
    const user = await requireAuth(event)
    
    // Dynamic Prisma import
    const { getPrismaClient } = await import('../../../../lib/prisma.js')
    const prisma = await getPrismaClient()

    // Get token from cookies
    const token = getCookie(event, 'token')

    if (!token) {
      return createError({
        statusCode: 401,
        message: 'Not authenticated'
      })
    }

    // Verify token
    let decoded
    try {
      decoded = jwt.verify(token, useRuntimeConfig().jwtSecret)
    } catch (err) {
      console.error('Error verifying token:', err.message)
      return createError({
        statusCode: 401,
        message: 'Invalid or expired token'
      })
    }

    // Get booking ID from route params
    const bookingId = event.context.params.id

    // Find the booking
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId }
    })

    if (!booking) {
      return createError({
        statusCode: 404,
        message: 'Booking not found'
      })
    }

    // Check if this booking belongs to the authenticated user
    if (booking.userId !== decoded.id) {
      return createError({
        statusCode: 403,
        message: 'You do not have permission to cancel this booking'
      })
    }

    // Update the booking status to cancelled
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'cancelled' }
    })

    return updatedBooking
  } catch (error) {
    console.error('Error cancelling booking:', error)
    return createError({
      statusCode: 500,
      message: 'Failed to cancel booking'
    })
  }
}) 