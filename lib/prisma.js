const { PrismaClient } = require('@prisma/client')

// Prevent multiple instances of Prisma Client in development
// and ensure it's server-side only

// Simplified Prisma client for Vercel compatibility
const prisma = global.__globalPrisma__ || new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  global.__globalPrisma__ = prisma
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})

module.exports = prisma 