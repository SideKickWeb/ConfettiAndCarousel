import {
  requireAuth,
  validateInput,
  checkRateLimit,
  getClientIP,
} from "../../utils/auth";
import {
  handleSafeError,
  handleMethodNotAllowed,
  createUserFriendlyError,
  ERROR_CATEGORIES,
} from "../../utils/error-handling";
import { getMethod, readBody, getQuery, getCookie } from "h3";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import prisma from "../../utils/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "development-secret-key";

export default defineEventHandler(async (event) => {
  try {
    const method = getMethod(event);

    // Apply rate limiting
    const clientIP = getClientIP(event) || "unknown";
    checkRateLimit(`bookings-${clientIP}`, 10, 60000); // 10 requests per minute

    // GET - Fetch bookings
    if (method === "GET") {
      console.log("Fetching all bookings");

      const bookings = await prisma.booking.findMany({
        include: {
          Customer: true,
          Event: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return {
        success: true,
        data: bookings,
        count: bookings.length,
      };
    }

    // POST - Create new booking
    if (method === "POST") {
      // Require authentication for creating bookings
      const user = await requireAuth(event);

      const body = await readBody(event);

      // Validate input
      const validatedData = validateInput(body, {
        eventId: {
          required: true,
          type: "string",
          label: "Event",
        },
        numberOfGuests: {
          required: true,
          type: "number",
          label: "Number of guests",
        },
        specialRequests: {
          required: false,
          type: "string",
          maxLength: 500,
          label: "Special requests",
        },
        contactPhone: {
          required: false,
          type: "string",
          maxLength: 20,
          label: "Contact phone",
        },
      });

      // Check if event exists and is available
      const event = await prisma.event.findUnique({
        where: { id: validatedData.eventId },
      });

      if (!event) {
        throw createUserFriendlyError(
          "EVENT_NOT_FOUND",
          404,
          ERROR_CATEGORIES.VALIDATION,
          {
            message: "The selected event is no longer available.",
          }
        );
      }

      // Check if event is still available for booking
      if (!event.active) {
        throw createUserFriendlyError(
          "EVENT_UNAVAILABLE",
          400,
          ERROR_CATEGORIES.VALIDATION,
          {
            message: "This event is no longer available for booking.",
          }
        );
      }

      // Find or create customer record
      let customer = await prisma.customer.findUnique({
        where: { email: user.email },
      });

      if (!customer) {
        customer = await prisma.customer.create({
          data: {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: validatedData.contactPhone || "",
          },
        });
      }

      // Create the booking
      const booking = await prisma.booking.create({
        data: {
          customerId: customer.id,
          eventId: validatedData.eventId,
          numberOfGuests: validatedData.numberOfGuests,
          specialRequests: validatedData.specialRequests || "",
          status: "pending",
          totalAmount: event.price * validatedData.numberOfGuests,
        },
        include: {
          Customer: true,
          Event: true,
        },
      });

      console.log(
        `Booking created: ${booking.id} for customer: ${customer.email}`
      );

      return {
        success: true,
        data: booking,
        message:
          "Your booking has been submitted successfully! We will contact you shortly to confirm the details.",
      };
    }

    // Method not allowed
    throw handleMethodNotAllowed(method, ["GET", "POST"]);
  } catch (error) {
    console.error("Bookings API error:", error);
    handleSafeError(error, "SERVER_ERROR");
  }
});
