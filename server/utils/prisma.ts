// Server utility for Prisma client access using runtime imports
export async function getPrisma() {
  const { getPrismaClient } = await import('../../lib/prisma')
  return getPrismaClient()
} 