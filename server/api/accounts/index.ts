import prisma from '../../lib/prisma.js'

export default defineEventHandler(async (event) => {
  const method = getMethod(event)

  // GET - Fetch all accounts (admin only)
  if (method === 'GET') {
    try {
      const accounts = await prisma.account.findMany({
        select: {
          id: true,
          email: true,
          type: true,
          createdAt: true,
          updatedAt: true
        }
      })
      return accounts
    } catch (error) {
      console.error('Error fetching accounts:', error)
      return {
        statusCode: 500,
        message: 'Failed to fetch accounts'
      }
    }
  }

  // POST - Create a new account
  if (method === 'POST') {
    try {
      const body = await readBody(event)
      
      // Check if account already exists
      const existingAccount = await prisma.account.findUnique({
        where: { email: body.email }
      })
      
      if (existingAccount) {
        return {
          statusCode: 400,
          message: 'An account with this email already exists'
        }
      }
      
      const account = await prisma.account.create({
        data: {
          email: body.email,
          password: body.password, // In a real app, this should be hashed
          type: body.type || 'Client'
        }
      })
      
      // Remove password from response
      const { password, ...accountWithoutPassword } = account
      
      return accountWithoutPassword
    } catch (error) {
      console.error('Error creating account:', error)
      return {
        statusCode: 500,
        message: 'Failed to create account'
      }
    }
  }

  return {
    statusCode: 405,
    message: 'Method not allowed'
  }
}) 