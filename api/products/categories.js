import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    // Manually defined categories
    const categories = [
      {
        id: 'balloon-displays',
        label: 'Balloon Displays',
        value: 'balloon-displays'
      },
      {
        id: 'event-decorations',
        label: 'Event Decorations',
        value: 'event-decorations'
      }
    ]
    
    return {
      success: true,
      data: categories
    }
  } catch (error) {
    console.error('Error fetching categories:', error)
    return {
      success: false,
      message: 'Failed to fetch categories',
      error: error.message
    }
  }
}) 