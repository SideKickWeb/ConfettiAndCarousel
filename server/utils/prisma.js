import { PrismaClient } from '@prisma/client'

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = global

// Create a mock PrismaClient for build-time when DATABASE_URL is not available
const createMockPrismaClient = () => {
  console.warn('DATABASE_URL not available. Using mock Prisma client')
  return new Proxy({}, {
    get: (target, prop) => {
      if (prop === '$disconnect') {
        return () => Promise.resolve()
      }
      return new Proxy({}, {
        get: () => {
          return () => Promise.resolve([])
        }
      })
    }
  })
}

// Determine if we're in a build/prerender context without DATABASE_URL
const isBuildWithoutDb = process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL

// Create prisma client or mock if DATABASE_URL is not available during build
let prisma

try {
  prisma = isBuildWithoutDb 
    ? createMockPrismaClient()
    : (globalForPrisma.prisma || new PrismaClient())
} catch (error) {
  console.warn('Error initializing Prisma client, using mock instead', error)
  prisma = createMockPrismaClient()
}

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma 