// Runtime-only Prisma client loader
let cachedPrismaClient: any = null

// Function to dynamically load Prisma client at runtime
export async function getPrismaClient(): Promise<any> {
  if (cachedPrismaClient) {
    return cachedPrismaClient
  }

  try {
    // Import from the generated TypeScript client
    const { PrismaClient } = await import('../generated/client')
    
    cachedPrismaClient = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    })
    
    return cachedPrismaClient
  } catch (error) {
    console.error('Failed to load Prisma client:', error)
    throw new Error(`Prisma client not available: ${(error as Error).message}`)
  }
}

// Default export for backward compatibility
export default getPrismaClient

// Graceful shutdown
process.on('beforeExit', async () => {
  if (cachedPrismaClient) {
    await cachedPrismaClient.$disconnect()
  }
}) 