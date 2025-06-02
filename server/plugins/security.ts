import { getClientIP } from '../utils/auth'

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('render:response', (response, { event }) => {
    // Add security headers to all responses
    const securityHeaders = {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'X-DNS-Prefetch-Control': 'off',
      'X-Download-Options': 'noopen',
      'X-Permitted-Cross-Domain-Policies': 'none'
    }

    // Add security headers
    for (const [key, value] of Object.entries(securityHeaders)) {
      setHeader(event, key, value)
    }

    // Add CSP header for extra security
    if (process.env.NODE_ENV === 'production') {
      setHeader(
        event,
        'Content-Security-Policy',
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline'; " +
        "style-src 'self' 'unsafe-inline' https:; " +
        "img-src 'self' data: https:; " +
        "font-src 'self' https: data:; " +
        "connect-src 'self'; " +
        "media-src 'self'; " +
        "object-src 'none'; " +
        "child-src 'none'; " +
        "worker-src 'none'; " +
        "frame-ancestors 'none'; " +
        "form-action 'self'; " +
        "base-uri 'self'; " +
        "manifest-src 'self'"
      )
    }
  })

  nitroApp.hooks.hook('request', (event) => {
    // Log security-related information for API requests
    if (event.node.req.url?.startsWith('/api/')) {
      const clientIP = getClientIP(event)
      const userAgent = getHeader(event, 'user-agent') || 'unknown'
      const method = getMethod(event)
      
      console.log(`API Request: ${method} ${event.node.req.url} from ${clientIP}`)
      
      // Block requests with suspicious user agents
      if (userAgent.toLowerCase().includes('bot') && !userAgent.toLowerCase().includes('googlebot')) {
        throw createError({
          statusCode: 403,
          statusMessage: 'Access denied'
        })
      }
    }
  })
}) 