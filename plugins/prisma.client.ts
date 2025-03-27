export default defineNuxtPlugin(() => {
  if (process.client) {
    // Create a mock PrismaClient for the client
    const mockPrisma = new Proxy({}, {
      get() {
        throw new Error('PrismaClient is not available on the client-side')
      }
    })
    
    return {
      provide: {
        prisma: mockPrisma
      }
    }
  }
  
  // Server-side logic will be handled in server/plugins/prisma.ts
  return {}
}) 