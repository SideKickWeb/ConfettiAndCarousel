import { requireAuth } from "../../utils/auth";
import { getCookie } from "h3";
import jwt from "jsonwebtoken";
import prisma from "../../utils/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "development-secret-key";

export default defineEventHandler(async (event) => {
  try {
    // Require authentication
    const user = await requireAuth(event);

    // Get user from token
    const token = getCookie(event, "token");
    if (!token) {
      return createError({
        statusCode: 401,
        message: "Unauthorized: No token provided",
      });
    }

    let userId;
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      userId = decoded.userId;
    } catch (error) {
      return createError({
        statusCode: 401,
        message: "Unauthorized: Invalid token",
      });
    }

    try {
      const bookings = await prisma.booking.findMany({
        where: {
          userId,
        },
        include: {
          bookingItems: {
            include: {
              product: true,
              customValues: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return bookings;
    } catch (error) {
      console.error("Error retrieving user bookings:", error);
      return createError({
        statusCode: 500,
        message: "Failed to retrieve bookings",
      });
    }
  } catch (error) {
    console.error("Error retrieving user bookings:", error);
    return createError({
      statusCode: 500,
      message: "Failed to retrieve bookings",
    });
  }
});
