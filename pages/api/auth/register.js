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
    const { email, password, firstName, lastName } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    if (!firstName || !lastName) {
      return res.status(400).json({ message: 'First name and last name are required' })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        isAdmin: false,
      }
    })

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
    return res.status(201).json({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isAdmin: user.isAdmin,
    })
  } catch (error) {
    console.error('Registration error:', error)
    return res.status(500).json({ message: 'Internal server error' })
  }
} 