import { PrismaClient } from '@prisma/client'

// Create a global singleton instance that can be reused
// This prevents multiple connections in serverless environments
let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
  // In production, create a new instance
  prisma = new PrismaClient()
} else {
  // In development, reuse the same instance to prevent too many connections
  // @ts-ignore - global is not typed
  if (!global.prisma) {
    // @ts-ignore - global is not typed
    global.prisma = new PrismaClient({
      log: ['query', 'error', 'warn']
    })
  }
  // @ts-ignore - global is not typed
  prisma = global.prisma
}

export default prisma 