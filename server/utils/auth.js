import jwt from 'jsonwebtoken'
import prisma from '../lib/prisma.js'
import { 
  handleAuthError, 
  handlePermissionError, 
  handleValidationError, 
  handleRateLimitError,
  createUserFriendlyError,
  ERROR_CATEGORIES 
} from './error-handling'

/**
 * Get client IP address from request
 * @param {Object} event - Nuxt event object
 * @returns {string} - Client IP address
 */
export const getClientIP = (event) => {
  // Try multiple headers and sources to get real client IP
  const forwarded = getHeader(event, 'x-forwarded-for')
  const realIP = getHeader(event, 'x-real-ip')
  const socketIP = event.node.req.socket?.remoteAddress
  
  if (forwarded) {
    // X-Forwarded-For can contain multiple IPs, take the first one
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  return socketIP || 'unknown'
}

/**
 * Verify JWT token and return decoded user data
 * @param {string} token - JWT token
 * @returns {Object|null} - Decoded user data or null if invalid
 */
export const verifyToken = (token) => {
  if (!token) return null
  
  try {
    const decoded = jwt.verify(token, useRuntimeConfig().jwtSecret)
    return decoded
  } catch (error) {
    console.error('Token verification failed:', error.message)
    return null
  }
}

/**
 * Get authenticated user from request
 * @param {Object} event - Nuxt event object
 * @returns {Object|null} - User data or null if not authenticated
 */
export const getAuthenticatedUser = async (event) => {
  try {
    // Get token from cookie
    const token = getCookie(event, 'token')
    
    if (!token) {
      return null
    }

    // Verify token
    const decoded = verifyToken(token)
    if (!decoded || !decoded.id) {
      return null
    }

    // Get fresh user data from database to ensure account still exists and is valid
    const user = await prisma.account.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        accessLevel: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return user
  } catch (error) {
    console.error('Error getting authenticated user:', error)
    return null
  }
}

/**
 * Require authentication middleware
 * @param {Object} event - Nuxt event object
 * @returns {Object} - User data
 * @throws {Error} - If not authenticated
 */
export const requireAuth = async (event) => {
  const user = await getAuthenticatedUser(event)
  
  if (!user) {
    throw handleAuthError('REQUIRED')
  }
  
  return user
}

/**
 * Require admin privileges
 * @param {Object} event - Nuxt event object
 * @returns {Object} - Admin user data
 * @throws {Error} - If not authenticated or not admin
 */
export const requireAdmin = async (event) => {
  const user = await requireAuth(event)
  
  if (user.role !== 'admin') {
    throw handlePermissionError('ADMIN_REQUIRED')
  }
  
  return user
}

/**
 * Check if user owns resource
 * @param {Object} user - Authenticated user
 * @param {string} resourceUserId - User ID associated with the resource
 * @returns {boolean} - True if user owns resource or is admin
 */
export const canAccessUserResource = (user, resourceUserId) => {
  if (!user || !resourceUserId) return false
  
  // Admins can access any resource
  if (user.role === 'admin') return true
  
  // Users can only access their own resources
  return user.id === resourceUserId
}

/**
 * Validate and sanitize input data with user-friendly error messages
 * @param {Object} data - Input data to validate
 * @param {Object} schema - Validation schema
 * @returns {Object} - Validated and sanitized data
 * @throws {Error} - If validation fails
 */
export const validateInput = (data, schema) => {
  const sanitized = {}
  const errors = []

  for (const [key, rules] of Object.entries(schema)) {
    const value = data[key]
    
    // Convert field names to user-friendly labels
    const fieldLabel = rules.label || key.replace(/([A-Z])/g, ' $1').toLowerCase().replace(/^./, str => str.toUpperCase())

    // Check required fields
    if (rules.required && (!value || (typeof value === 'string' && !value.trim()))) {
      errors.push(`${fieldLabel} is required`)
      continue
    }

    // Skip validation for optional empty fields
    if (!rules.required && (!value || (typeof value === 'string' && !value.trim()))) {
      continue
    }

    // Type validation
    if (rules.type === 'string' && typeof value !== 'string') {
      errors.push(`${fieldLabel} must be text`)
      continue
    }

    if (rules.type === 'number' && (typeof value !== 'number' || isNaN(value))) {
      errors.push(`${fieldLabel} must be a valid number`)
      continue
    }

    if (rules.type === 'email' && typeof value === 'string') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value.trim())) {
        errors.push(`Please enter a valid email address`)
        continue
      }
    }

    // Length validation
    if (rules.minLength && value.length < rules.minLength) {
      errors.push(`${fieldLabel} must be at least ${rules.minLength} characters long`)
      continue
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      errors.push(`${fieldLabel} must be no more than ${rules.maxLength} characters long`)
      continue
    }

    // Custom validation messages
    if (rules.pattern && !rules.pattern.test(value)) {
      errors.push(rules.patternMessage || `${fieldLabel} format is invalid`)
      continue
    }

    // Sanitize string values
    if (typeof value === 'string') {
      sanitized[key] = value.trim()
    } else {
      sanitized[key] = value
    }
  }

  if (errors.length > 0) {
    throw createUserFriendlyError('VALIDATION_FAILED', 400, ERROR_CATEGORIES.VALIDATION, {
      fields: errors
    })
  }

  return sanitized
}

/**
 * Rate limiting utility with user-friendly error messages
 */
const rateLimitStore = new Map()

export const checkRateLimit = (identifier, limit = 10, windowMs = 60000, type = 'GENERAL') => {
  const now = Date.now()
  const windowStart = now - windowMs
  
  // Clean old entries
  for (const [key, timestamps] of rateLimitStore.entries()) {
    const validTimestamps = timestamps.filter(time => time > windowStart)
    if (validTimestamps.length === 0) {
      rateLimitStore.delete(key)
    } else {
      rateLimitStore.set(key, validTimestamps)
    }
  }
  
  // Check current user's rate limit
  const userRequests = rateLimitStore.get(identifier) || []
  const recentRequests = userRequests.filter(time => time > windowStart)
  
  if (recentRequests.length >= limit) {
    const waitTime = Math.ceil((windowStart + windowMs - now + recentRequests[0]) / 1000 / 60)
    throw handleRateLimitError(type, { 
      waitTime: waitTime > 0 ? waitTime : 1,
      limit,
      windowMinutes: Math.ceil(windowMs / 60000)
    })
  }
  
  // Add current request
  recentRequests.push(now)
  rateLimitStore.set(identifier, recentRequests)
  
  return true
} 