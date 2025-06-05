import { PrismaClient } from '../../generated/client'

// Create a singleton instance of PrismaClient
const prisma = new PrismaClient()

// Export the singleton instance
export default prisma

// Optional: Add a function to disconnect from the database
export async function disconnectPrisma() {
  await prisma.$disconnect()
}
