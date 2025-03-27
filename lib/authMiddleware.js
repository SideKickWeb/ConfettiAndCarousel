import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Authentication middleware for API routes
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {boolean} requireAdmin - Whether admin privileges are required
 * @returns {Promise<Object|null>} - Returns the authenticated user or null
 */
export async function authMiddleware(req, res, requireAdmin = false) {
  try {
    // Get token from cookies
    const { token } = req.cookies

    if (!token) {
      res.status(401).json({ message: 'Not authenticated' })
      return null
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
      res.status(404).json({ message: 'User not found' })
      return null
    }

    // Check admin status if required
    if (requireAdmin && !user.isAdmin) {
      res.status(403).json({ message: 'Admin privileges required' })
      return null
    }

    // Add user to request object
    req.user = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isAdmin: user.isAdmin,
    }

    return req.user
  } catch (error) {
    console.error('Auth middleware error:', error)
    res.status(500).json({ message: 'Internal server error' })
    return null
  }
} 