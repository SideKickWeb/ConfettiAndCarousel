import prisma from '../../lib/prisma.js'
import { randomUUID } from 'crypto'

export default defineEventHandler(async (event) => {
  const method = getMethod(event)

  // GET - Fetch all customers
  if (method === 'GET') {
    try {
      const customers = await prisma.customer.findMany({
        include: {
          Event: true,
          Order: true
        }
      })
      return customers
    } catch (error) {
      console.error('Error fetching customers:', error)
      return {
        statusCode: 500,
        message: 'Failed to fetch customers'
      }
    }
  }

  // POST - Create a new customer
  if (method === 'POST') {
    try {
      const body = await readBody(event)
      
      const customer = await prisma.customer.create({
        data: {
          id: body.id || randomUUID(),
          firstName: body.firstName,
          lastName: body.lastName,
          email: body.email,
          phone: body.phone,
          updatedAt: new Date()
        }
      })
      
      return customer
    } catch (error) {
      console.error('Error creating customer:', error)
      return {
        statusCode: 500,
        message: 'Failed to create customer'
      }
    }
  }

  return {
    statusCode: 405,
    message: 'Method not allowed'
  }
}) 