import { defineEventHandler, getMethod, readBody } from 'h3'
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const method = getMethod(event)

  // GET - Fetch all clients
  if (method === 'GET') {
    try {
      const clients = await prisma.customer.findMany({
        include: {
          Events: true,
          Orders: true
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
      
      const newClient = await prisma.customer.create({
        data: {
          firstName: body.firstName,
          lastName: body.lastName,
          email: body.email,
          phone: body.phone,
          address: body.address,
          city: body.city,
          state: body.state,
          zipCode: body.zipCode,
          notes: body.notes,
          isActive: body.isActive ?? true
        },
        include: {
          Events: true,
          Orders: true
        }
      })
      
      return newClient
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