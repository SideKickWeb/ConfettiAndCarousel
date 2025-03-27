import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const method = getMethod(event)

  // GET - Fetch all clients
  if (method === 'GET') {
    try {
      const clients = await prisma.client.findMany({
        include: {
          events: true
        }
      })
      return clients
    } catch (error) {
      console.error('Error fetching clients:', error)
      return {
        statusCode: 500,
        message: 'Failed to fetch clients'
      }
    }
  }

  // POST - Create a new client
  if (method === 'POST') {
    try {
      const body = await readBody(event)
      
      const client = await prisma.client.create({
        data: {
          firstName: body.firstName,
          lastName: body.lastName,
          email: body.email,
          phone: body.phone,
          address: body.address,
          Account: body.accountId ? {
            connect: {
              id: body.accountId
            }
          } : undefined
        }
      })
      
      return client
    } catch (error) {
      console.error('Error creating client:', error)
      return {
        statusCode: 500,
        message: 'Failed to create client'
      }
    }
  }

  return {
    statusCode: 405,
    message: 'Method not allowed'
  }
}) 