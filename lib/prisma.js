import { PrismaClient } from '@prisma/client'

// Prevent multiple instances of Prisma Client in development
// and ensure it's server-side only

// Simplified Prisma client for Vercel compatibility
const globalForPrisma = globalThis ?? {}

const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})

export default prisma 