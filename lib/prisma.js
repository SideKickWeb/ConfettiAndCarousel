// Runtime-only Prisma client loader - no build-time imports
let cachedPrismaClient = null

// Function to dynamically load Prisma client at runtime
export async function getPrismaClient() {
  if (cachedPrismaClient) {
    return cachedPrismaClient
  }

  try {
    // Dynamic import to avoid build-time bundling issues
    const prismaModule = await import('@prisma/client')
    const { PrismaClient } = prismaModule
    
    cachedPrismaClient = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    })
    
    return cachedPrismaClient
  } catch (error) {
    console.error('Failed to load Prisma client:', error)
    throw new Error(`Prisma client not available: ${error.message}`)
  }
}

// Default export for backward compatibility
export default getPrismaClient 