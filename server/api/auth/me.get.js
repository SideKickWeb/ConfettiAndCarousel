import { requireAuth } from "../../utils/auth";
import { handleSafeError } from "../../utils/error-handling";
import prisma from "../../utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    // Require authentication
    const user = await requireAuth(event);

    // Get fresh user data from database
    const currentUser = await prisma.account.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        accessLevel: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!currentUser) {
      throw createError({
        statusCode: 404,
        statusMessage: "User not found",
      });
    }

    return {
      success: true,
      data: currentUser,
    };
  } catch (error) {
    console.error("Get user profile error:", error);
    handleSafeError(error, "SERVER_ERROR");
  }
});
