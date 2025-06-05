import prisma from "../utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const debug = {
      status: "ok",
      timestamp: new Date().toISOString(),
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      env: {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL: process.env.VERCEL,
        VERCEL_ENV: process.env.VERCEL_ENV,
        hasDbUrl: !!process.env.DATABASE_URL,
        hasJwtSecret: !!process.env.JWT_SECRET,
        dbUrlPreview: process.env.DATABASE_URL
          ? process.env.DATABASE_URL.substring(0, 20) + "..."
          : "none",
      },
      memory: process.memoryUsage(),
      uptime: process.uptime(),
    };

    // Test basic imports
    try {
      const crypto = await import("crypto");
      debug.cryptoAvailable = true;
    } catch (err) {
      debug.cryptoAvailable = false;
      debug.cryptoError = err.message;
    }

    // Example debug endpoint
    const userCount = await prisma.user.count();
    debug.users = userCount;

    return debug;
  } catch (error) {
    console.error("Debug endpoint error:", error);
    return {
      status: "error",
      error: error.message,
      stack: error.stack,
    };
  }
});
