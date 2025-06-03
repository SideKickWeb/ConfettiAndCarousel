// Prevent multiple instances of Prisma Client in development
const globalForPrisma = globalThis ?? {}

let prisma = null

// Dynamic import function to handle Prisma client loading
async function createPrismaClient() {
  try {
    const { PrismaClient } = await import('@prisma/client')
    return new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    })
  } catch (error) {
    console.error('Failed to load Prisma client:', error)
    throw new Error(`Prisma client initialization failed: ${error.message}`)
  }
}

// Initialize or get existing client
if (!globalForPrisma.prisma) {
  try {
    const { PrismaClient } = require('@prisma/client')
    prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    })
    globalForPrisma.prisma = prisma
  } catch (error) {
    console.warn('Synchronous Prisma client loading failed, will use async fallback:', error.message)
  }
} else {
  prisma = globalForPrisma.prisma
}

// Fallback to dynamic import if synchronous loading failed
if (!prisma) {
  prisma = {
    async $queryRaw(strings, ...values) {
      const client = await createPrismaClient()
      return client.$queryRaw(strings, ...values)
    },
    async $disconnect() {
      // Graceful disconnect
    }
  }
}

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})

export default prisma 