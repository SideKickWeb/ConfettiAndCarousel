import prisma from '../../lib/prisma.js'

export default defineEventHandler(async (event) => {
  try {
    const locations = await prisma.location.findMany()
    return locations
  } catch (error) {
    console.error('Error fetching locations:', error)
    return {
      statusCode: 500,
      message: 'Failed to fetch locations'
    }
  }
}) 