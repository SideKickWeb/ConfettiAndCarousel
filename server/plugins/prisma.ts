// Import the singleton prisma instance instead of creating a new one
import prisma from '../../lib/prisma'
import { defineNitroPlugin } from 'nitropack/runtime'

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