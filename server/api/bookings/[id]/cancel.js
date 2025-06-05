import { requireAuth } from "../../../utils/auth";
import prisma from "../../../utils/prisma";

export default defineEventHandler(async (event) => {
  // Only allow POST method
  if (getMethod(event) !== "POST") {
    return createError({
      statusCode: 405,
      message: "Method not allowed",
    });
  }

  // Get booking ID from URL
  const id = event.context.params?.id;
  if (!id) {
    return createError({
      statusCode: 400,
      message: "Booking ID is required",
    });
  }

  try {
    // Require authentication
    const user = await requireAuth(event);

    // Find the booking
    const booking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!booking) {
      return createError({
        statusCode: 404,
        message: "Booking not found",
      });
    }

    // Check if user owns the booking
    if (booking.userId !== user.id) {
      return createError({
        statusCode: 403,
        message: "You can only cancel your own bookings",
      });
    }

    // Check if booking can be cancelled
    if (booking.status !== "PENDING") {
      return createError({
        statusCode: 400,
        message: "Only pending bookings can be cancelled",
      });
    }

    // Update booking status to cancelled
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        status: "CANCELLED",
        cancelledAt: new Date(),
      },
      include: {
        bookingItems: {
          include: {
            product: true,
            customValues: true,
          },
        },
      },
    });

    return updatedBooking;
  } catch (error) {
    console.error("Error cancelling booking:", error);
    return createError({
      statusCode: 500,
      message: "Failed to cancel booking: " + error.message,
    });
  }
});
