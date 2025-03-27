import { PrismaClient } from '@prisma/client'
import { defineNitroPlugin } from 'nitropack/runtime'

// Create a singleton Prisma instance
const prisma = new PrismaClient()

export default defineNitroPlugin(async () => {
  // Connect to the database when the server starts
  try {
    await prisma.$connect()
    console.log('Connected to database')
  } catch (e) {
    console.error('Failed to connect to database', e)
  }
})

// Make prisma available globally
export { prisma } 