import { PrismaClient } from '@prisma/client'

// Create a single Prisma client instance for Vercel serverless functions
// Global variable approach doesn't work well in serverless environments
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})

export default prisma 