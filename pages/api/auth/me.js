import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    // Get token from cookies
    const { token } = req.cookies

    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' })
    }

    // Verify token
    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'development-secret-key')
    } catch (err) {
      console.error('Error verifying token:', err.message)
      return res.status(401).json({ message: 'Invalid or expired token' })
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id }
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Return user information (excluding password)
    return res.status(200).json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isAdmin: user.isAdmin,
    })
  } catch (error) {
    console.error('Get user error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
} 