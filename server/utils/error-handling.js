/**
 * Centralized error handling utility for user-friendly error responses
 */

/**
 * Error categories for better user experience
 */
export const ERROR_CATEGORIES = {
  AUTH: 'authentication',
  VALIDATION: 'validation',
  PERMISSION: 'permission',
  NOT_FOUND: 'not_found',
  RATE_LIMIT: 'rate_limit',
  SERVER: 'server_error',
  DATABASE: 'database',
  EXTERNAL: 'external_service'
}

/**
 * User-friendly error messages mapping
 */
const ERROR_MESSAGES = {
  // Authentication errors
  'AUTH_REQUIRED': 'Please sign in to continue',
  'AUTH_INVALID_TOKEN': 'Your session has expired. Please sign in again',
  'AUTH_INVALID_CREDENTIALS': 'Invalid email address or password',
  'AUTH_ACCOUNT_NOT_FOUND': 'No account found with this email address',
  'AUTH_EMAIL_EXISTS': 'An account with this email address already exists',
  'AUTH_WEAK_PASSWORD': 'Password must be at least 6 characters long',
  'AUTH_PASSWORD_MISMATCH': 'The passwords you entered do not match',
  'AUTH_CURRENT_PASSWORD_INCORRECT': 'Your current password is incorrect',
  
  // Permission errors
  'PERMISSION_DENIED': 'You do not have permission to access this resource',
  'PERMISSION_ADMIN_REQUIRED': 'Administrator privileges are required for this action',
  'PERMISSION_OWNER_REQUIRED': 'You can only access your own data',
  
  // Validation errors
  'VALIDATION_FAILED': 'Please check the information you entered and try again',
  'VALIDATION_MISSING_FIELDS': 'Please fill in all required fields',
  'VALIDATION_INVALID_EMAIL': 'Please enter a valid email address',
  'VALIDATION_INVALID_FORMAT': 'The information you entered is not in the correct format',
  
  // Rate limiting
  'RATE_LIMIT_EXCEEDED': 'You\'re doing that too quickly. Please wait a moment and try again',
  'RATE_LIMIT_LOGIN': 'Too many login attempts. Please wait 5 minutes before trying again',
  'RATE_LIMIT_REGISTRATION': 'Too many registration attempts. Please wait 5 minutes before trying again',
  
  // Resource not found
  'RESOURCE_NOT_FOUND': 'The item you\'re looking for could not be found',
  'ORDER_NOT_FOUND': 'Order not found or you don\'t have permission to view it',
  'BOOKING_NOT_FOUND': 'Booking not found or you don\'t have permission to view it',
  'ACCOUNT_NOT_FOUND': 'Account not found',
  
  // Database errors
  'DATABASE_CONNECTION': 'We\'re experiencing technical difficulties. Please try again in a few minutes',
  'DATABASE_TIMEOUT': 'The request is taking longer than expected. Please try again',
  'DATABASE_CONSTRAINT': 'This action cannot be completed due to existing data relationships',
  
  // Server errors
  'SERVER_ERROR': 'Something went wrong on our end. Please try again later',
  'SERVICE_UNAVAILABLE': 'This service is temporarily unavailable. Please try again later',
  'MAINTENANCE_MODE': 'We\'re currently performing maintenance. Please check back soon',
  
  // Business logic errors
  'ORDER_CANNOT_CANCEL': 'This order cannot be cancelled at this time',
  'BOOKING_CANNOT_CANCEL': 'This booking cannot be cancelled at this time',
  'INSUFFICIENT_STOCK': 'Sorry, this item is currently out of stock',
  'INVALID_DATE': 'Please select a valid date for your booking',
  'EMAIL_CHANGE_REQUIRES_PASSWORD': 'Please enter your current password to change your email address',
  
  // External service errors
  'EMAIL_SERVICE_ERROR': 'We couldn\'t send the email right now. Please try again later',
  'PAYMENT_SERVICE_ERROR': 'Payment processing is temporarily unavailable. Please try again later',
  'FILE_UPLOAD_ERROR': 'File upload failed. Please try again with a smaller file'
}

/**
 * Create a user-friendly error response
 * @param {string} errorCode - The error code to look up
 * @param {number} statusCode - HTTP status code
 * @param {string} category - Error category
 * @param {Object} details - Additional error details
 * @returns {Object} - Formatted error response
 */
export const createUserFriendlyError = (errorCode, statusCode = 500, category = ERROR_CATEGORIES.SERVER, details = {}) => {
  const message = ERROR_MESSAGES[errorCode] || ERROR_MESSAGES.SERVER_ERROR
  
  return createError({
    statusCode,
    statusMessage: message,
    data: {
      errorCode,
      category,
      timestamp: new Date().toISOString(),
      ...details
    }
  })
}

/**
 * Handle database errors and convert them to user-friendly messages
 * @param {Error} error - The database error
 * @returns {Object} - User-friendly error response
 */
export const handleDatabaseError = (error) => {
  console.error('Database error:', error)
  
  // Prisma error codes
  if (error.code) {
    switch (error.code) {
      case 'P1001':
        return createUserFriendlyError('DATABASE_CONNECTION', 503, ERROR_CATEGORIES.DATABASE)
      case 'P1003':
        return createUserFriendlyError('DATABASE_CONNECTION', 503, ERROR_CATEGORIES.DATABASE)
      case 'P2002':
        // Unique constraint violation
        if (error.meta?.target?.includes('email')) {
          return createUserFriendlyError('AUTH_EMAIL_EXISTS', 400, ERROR_CATEGORIES.VALIDATION)
        }
        return createUserFriendlyError('DATABASE_CONSTRAINT', 400, ERROR_CATEGORIES.DATABASE)
      case 'P2025':
        return createUserFriendlyError('RESOURCE_NOT_FOUND', 404, ERROR_CATEGORIES.NOT_FOUND)
      case 'P1008':
        return createUserFriendlyError('DATABASE_TIMEOUT', 408, ERROR_CATEGORIES.DATABASE)
      default:
        return createUserFriendlyError('DATABASE_CONNECTION', 503, ERROR_CATEGORIES.DATABASE)
    }
  }
  
  // Generic database error
  return createUserFriendlyError('SERVER_ERROR', 500, ERROR_CATEGORIES.SERVER)
}

/**
 * Handle authentication errors
 * @param {string} type - Type of auth error
 * @param {Object} details - Additional details
 * @returns {Object} - User-friendly error response
 */
export const handleAuthError = (type, details = {}) => {
  switch (type) {
    case 'REQUIRED':
      return createUserFriendlyError('AUTH_REQUIRED', 401, ERROR_CATEGORIES.AUTH, details)
    case 'INVALID_TOKEN':
      return createUserFriendlyError('AUTH_INVALID_TOKEN', 401, ERROR_CATEGORIES.AUTH, details)
    case 'INVALID_CREDENTIALS':
      return createUserFriendlyError('AUTH_INVALID_CREDENTIALS', 401, ERROR_CATEGORIES.AUTH, details)
    case 'ACCOUNT_NOT_FOUND':
      return createUserFriendlyError('AUTH_ACCOUNT_NOT_FOUND', 404, ERROR_CATEGORIES.AUTH, details)
    case 'EMAIL_EXISTS':
      return createUserFriendlyError('AUTH_EMAIL_EXISTS', 400, ERROR_CATEGORIES.AUTH, details)
    case 'WEAK_PASSWORD':
      return createUserFriendlyError('AUTH_WEAK_PASSWORD', 400, ERROR_CATEGORIES.AUTH, details)
    case 'PASSWORD_MISMATCH':
      return createUserFriendlyError('AUTH_PASSWORD_MISMATCH', 400, ERROR_CATEGORIES.AUTH, details)
    case 'CURRENT_PASSWORD_INCORRECT':
      return createUserFriendlyError('AUTH_CURRENT_PASSWORD_INCORRECT', 400, ERROR_CATEGORIES.AUTH, details)
    default:
      return createUserFriendlyError('AUTH_REQUIRED', 401, ERROR_CATEGORIES.AUTH, details)
  }
}

/**
 * Handle permission errors
 * @param {string} type - Type of permission error
 * @param {Object} details - Additional details
 * @returns {Object} - User-friendly error response
 */
export const handlePermissionError = (type, details = {}) => {
  switch (type) {
    case 'ADMIN_REQUIRED':
      return createUserFriendlyError('PERMISSION_ADMIN_REQUIRED', 403, ERROR_CATEGORIES.PERMISSION, details)
    case 'OWNER_REQUIRED':
      return createUserFriendlyError('PERMISSION_OWNER_REQUIRED', 403, ERROR_CATEGORIES.PERMISSION, details)
    default:
      return createUserFriendlyError('PERMISSION_DENIED', 403, ERROR_CATEGORIES.PERMISSION, details)
  }
}

/**
 * Handle validation errors
 * @param {Array|string} errors - Validation errors
 * @returns {Object} - User-friendly error response
 */
export const handleValidationError = (errors) => {
  if (Array.isArray(errors)) {
    return createUserFriendlyError('VALIDATION_FAILED', 400, ERROR_CATEGORIES.VALIDATION, {
      fields: errors
    })
  }
  
  return createUserFriendlyError('VALIDATION_FAILED', 400, ERROR_CATEGORIES.VALIDATION, {
    message: errors
  })
}

/**
 * Handle rate limiting errors
 * @param {string} type - Type of rate limit
 * @param {Object} details - Additional details
 * @returns {Object} - User-friendly error response
 */
export const handleRateLimitError = (type = 'GENERAL', details = {}) => {
  switch (type) {
    case 'LOGIN':
      return createUserFriendlyError('RATE_LIMIT_LOGIN', 429, ERROR_CATEGORIES.RATE_LIMIT, details)
    case 'REGISTRATION':
      return createUserFriendlyError('RATE_LIMIT_REGISTRATION', 429, ERROR_CATEGORIES.RATE_LIMIT, details)
    default:
      return createUserFriendlyError('RATE_LIMIT_EXCEEDED', 429, ERROR_CATEGORIES.RATE_LIMIT, details)
  }
}

/**
 * Handle method not allowed errors
 * @param {string} method - The HTTP method used
 * @param {Array} allowedMethods - Array of allowed methods
 * @returns {Object} - User-friendly error response
 */
export const handleMethodNotAllowed = (method, allowedMethods = []) => {
  return createError({
    statusCode: 405,
    statusMessage: `Method ${method} is not allowed for this endpoint`,
    data: {
      errorCode: 'METHOD_NOT_ALLOWED',
      category: ERROR_CATEGORIES.VALIDATION,
      allowedMethods,
      timestamp: new Date().toISOString()
    }
  })
}

/**
 * Safely handle any error and ensure user-friendly response
 * @param {Error} error - The error to handle
 * @param {string} fallbackMessage - Fallback error code
 * @returns {Object} - User-friendly error response
 */
export const handleSafeError = (error, fallbackMessage = 'SERVER_ERROR') => {
  // If it's already a formatted error, throw it as is
  if (error.statusCode) {
    throw error
  }
  
  // Handle specific error types
  if (error.code && error.code.startsWith('P')) {
    throw handleDatabaseError(error)
  }
  
  // Handle Prisma client errors
  if (error.message?.includes('Prisma') || error.message?.includes('schema')) {
    throw handleDatabaseError(error)
  }
  
  // Generic server error
  throw createUserFriendlyError(fallbackMessage, 500, ERROR_CATEGORIES.SERVER)
} 