import { defineEventHandler, getMethod, readBody } from 'h3'
import { compare, hash } from 'bcrypt'
import jwt from 'jsonwebtoken'
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const method = getMethod(event)

  // POST - Login
  if (method === 'POST') {
    try {
      const body = await readBody(event)
      
      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email: body.email }
      })

      if (!user) {
        return {
          statusCode: 401,
          message: 'Invalid credentials'
        }
      }

      // Verify password
      const isValid = await compare(body.password, user.password)
      if (!isValid) {
        return {
          statusCode: 401,
          message: 'Invalid credentials'
        }
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.id,
          email: user.email,
          role: user.role
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      )

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        }
      }
    } catch (error) {
      console.error('Error during login:', error)
      return {
        statusCode: 500,
        message: 'Failed to login'
      }
    }
  }

  // PUT - Register new user
  if (method === 'PUT') {
    try {
      const body = await readBody(event)
      
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: body.email }
      })

      if (existingUser) {
        return {
          statusCode: 400,
          message: 'User already exists'
        }
      }

      // Hash password
      const hashedPassword = await hash(body.password, 10)

      // Create new user
      const newUser = await prisma.user.create({
        data: {
          email: body.email,
          password: hashedPassword,
          role: body.role || 'user',
          firstName: body.firstName,
          lastName: body.lastName
        }
      })

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: newUser.id,
          email: newUser.email,
          role: newUser.role
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      )

      return {
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          role: newUser.role
        }
      }
    } catch (error) {
      console.error('Error during registration:', error)
      return {
        statusCode: 500,
        message: 'Failed to register'
      }
    }
  }

  return {
    statusCode: 405,
    message: 'Method not allowed'
  }
}) 