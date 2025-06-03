export default defineEventHandler(async (event) => {
  // Dynamic Prisma import
  const { getPrismaClient } = await import('../../../lib/prisma.js')
  const prisma = await getPrismaClient()

  try {
    // Since there's no location table in the schema, return a mock response
    // This can be updated later when locations are added to the schema
    return [
      {
        id: '1',
        name: 'Main Venue',
        address: '123 Main St, City, State',
        capacity: 100
      },
      {
        id: '2', 
        name: 'Outdoor Space',
        address: '456 Park Ave, City, State',
        capacity: 200
      }
    ]
  } catch (error) {
    console.error('Error fetching locations:', error)
    return {
      statusCode: 500,
      message: 'Failed to fetch locations'
    }
  }
}) 