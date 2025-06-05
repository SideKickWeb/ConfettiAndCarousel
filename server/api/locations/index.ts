import { defineEventHandler, getMethod, readBody } from 'h3'
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const method = getMethod(event)

  // GET - Fetch all locations
  if (method === 'GET') {
    try {
      const locations = await prisma.location.findMany({
        include: {
          Events: true
        }
      })
      return locations
    } catch (error) {
      console.error('Error fetching locations:', error)
      return {
        statusCode: 500,
        message: 'Failed to fetch locations'
      }
    }
  }

  // POST - Create a new location
  if (method === 'POST') {
    try {
      const body = await readBody(event)
      
      const newLocation = await prisma.location.create({
        data: {
          name: body.name,
          address: body.address,
          city: body.city,
          state: body.state,
          zipCode: body.zipCode,
          capacity: body.capacity,
          description: body.description,
          isActive: body.isActive ?? true
        },
        include: {
          Events: true
        }
      })
      
      return newLocation
    } catch (error) {
      console.error('Error creating location:', error)
      return {
        statusCode: 500,
        message: 'Failed to create location'
      }
    }
  }

  return {
    statusCode: 405,
    message: 'Method not allowed'
  }
}) 