import { PrismaClient } from "@prisma/client";

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.

let prisma;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({
    // Log only errors and warnings in production
    log: ["error", "warn"],
    // Enable query batching
    __internal: {
      useQueryStringLiteral: true,
    },
  });
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: ["query", "error", "warn"],
      __internal: {
        useQueryStringLiteral: true,
      },
    });
  }
  prisma = global.prisma;
}

// Helper function to handle common DB operations with automatic retries
export const executeQuery = async (queryFn, maxRetries = 3) => {
  let retries = 0;
  let lastError;

  while (retries < maxRetries) {
    try {
      return await queryFn(prisma);
    } catch (error) {
      lastError = error;

      // Only retry on connection errors
      if (error?.code?.startsWith("P1")) {
        retries++;
        console.warn(
          `Database operation failed, retrying (${retries}/${maxRetries})...`,
          error.message
        );

        // Wait before retrying (exponential backoff)
        await new Promise((resolve) =>
          setTimeout(resolve, 200 * Math.pow(2, retries))
        );
      } else {
        // For other errors, don't retry
        throw error;
      }
    }
  }

  // If we've exhausted all retries
  console.error("Database operation failed after multiple retries:", lastError);
  throw lastError;
};

export default prisma;
