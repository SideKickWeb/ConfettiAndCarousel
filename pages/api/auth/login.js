import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import cookie from 'cookie'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin
      },
      process.env.JWT_SECRET || 'development-secret-key',
      { expiresIn: '7d' }
    )

    // Set HTTP-only cookie
    res.setHeader('Set-Cookie', cookie.serialize('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    }))

    // Return user data (excluding password)
    return res.status(200).json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isAdmin: user.isAdmin,
    })
  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
} 