// Server-only Prisma composable using runtime imports
export const usePrisma = () => {
  // Only available on server-side
  if (process.client) {
    throw new Error('Prisma is only available on the server side')
  }
  
  // Return the async Prisma client loader
  return import('../lib/prisma').then(module => module.getPrismaClient())
} 