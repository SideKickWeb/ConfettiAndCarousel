import prisma from "../server/utils/prisma";

// Runtime-only auth middleware
export default async function authMiddleware(event) {
  try {
    const token =
      getCookie(event, "token") ||
      getHeader(event, "authorization")?.replace("Bearer ", "");

    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: "No token provided",
      });
    }

    const { verify } = await import("jsonwebtoken");
    const decoded = verify(token, process.env.JWT_SECRET);

    const user = await prisma.account.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        accessLevel: true,
      },
    });

    if (!user) {
      throw createError({ statusCode: 401, statusMessage: "User not found" });
    }

    event.context.user = user;
    return user;
  } catch (error) {
    console.error("Auth middleware error:", error);
    throw createError({ statusCode: 401, statusMessage: "Invalid token" });
  }
}
