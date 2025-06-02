# Security Implementation

This document outlines the comprehensive security measures implemented to protect the application from unauthorized access and data breaches.

## 🔐 Authentication & Authorization

### JWT Token Security
- **Secure Storage**: JWT tokens stored in HTTP-only cookies (prevents XSS)
- **Token Validation**: Centralized token verification with proper error handling
- **Fresh Data**: User data fetched from database on each request to ensure account validity
- **Limited Payload**: JWT contains minimal data (id, email, role, iat)
- **Expiration**: 7-day token expiration with automatic refresh

### Role-Based Access Control (RBAC)
- **User Isolation**: Users can only access their own data (orders, bookings, profile)
- **Admin Protection**: Admin endpoints require admin role verification
- **Resource Ownership**: `canAccessUserResource()` utility ensures data access control

### Authentication Utilities
```javascript
// Centralized authentication functions
- requireAuth(event)      // Requires valid authentication
- requireAdmin(event)     // Requires admin role
- getAuthenticatedUser(event) // Gets user safely
- canAccessUserResource(user, resourceId) // Checks ownership
```

## 🛡️ Input Validation & Sanitization

### Comprehensive Validation
- **Type Checking**: Email, string, number validation
- **Length Limits**: Min/max length validation for all inputs
- **Email Validation**: Proper email format validation
- **Data Sanitization**: Automatic trimming and cleaning of input data

### Validation Schema Example
```javascript
const schema = {
  email: { required: true, type: 'email', maxLength: 255 },
  password: { required: true, type: 'string', minLength: 6, maxLength: 255 },
  firstName: { required: true, type: 'string', minLength: 1, maxLength: 100 }
}
```

## 🚦 Rate Limiting

### Multi-Level Protection
- **IP-Based Limiting**: Protects against IP-based attacks
- **Email-Based Limiting**: Prevents account enumeration
- **Endpoint-Specific Limits**: Different limits for different operations

### Rate Limit Configuration
- **Login**: 5 attempts per 5 minutes per IP, 3 attempts per email
- **Registration**: 3 registrations per 5 minutes per IP
- **User Data**: 20 requests per minute for orders/bookings
- **Admin Operations**: 5 requests per minute for admin functions

## 🔒 Password Security

### Strong Password Handling
- **Bcrypt Hashing**: 12 salt rounds for secure password storage
- **Password Requirements**: Minimum 6 characters (configurable)
- **Password Verification**: Current password required for changes
- **No Password Exposure**: Passwords never returned in API responses

## 🌐 Network Security

### Security Headers
```http
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

### Content Security Policy (CSP)
- **Strict CSP**: Only allows trusted sources
- **No Inline Scripts**: Prevents XSS attacks
- **HTTPS Enforcement**: Secure transport in production

## 🗄️ Database Security

### Query Protection
- **Prisma ORM**: Prevents SQL injection automatically
- **Selective Fields**: Only required fields returned in queries
- **Transaction Support**: Atomic operations for data consistency
- **Connection Management**: Proper database connection cleanup

### Data Exposure Prevention
```javascript
// Good: Selective field querying
select: {
  id: true,
  email: true,
  firstName: true,
  lastName: true
  // password field excluded
}
```

## 🔍 API Endpoint Security

### Secured Endpoints

#### Authentication Endpoints
- `POST /api/auth/login` - Rate limited, input validated
- `POST /api/auth/register` - Rate limited, email uniqueness
- `PUT /api/auth/change-password` - Current password verification
- `DELETE /api/auth/delete-account` - Multi-step confirmation
- `GET /api/auth/me` - Token verification

#### User Data Endpoints
- `GET /api/orders/user` - User-specific data only
- `GET /api/bookings/user` - User-specific data only
- `PUT /api/auth/update-profile` - Email change protection

#### Admin Endpoints
- `POST /api/admin/hero-settings` - Admin role required

### Method Validation
- **HTTP Method Checking**: Only allowed methods accepted
- **CORS Protection**: Proper cross-origin request handling

## 🚨 Error Handling

### Secure Error Messages
- **No Internal Exposure**: Internal errors not exposed to clients
- **Consistent Responses**: Prevents information leakage
- **Proper Status Codes**: Appropriate HTTP status codes
- **Logging**: Security events logged for monitoring

### Example Error Handling
```javascript
// Bad: Exposes internal information
throw new Error(error.message)

// Good: Safe error response
throw createError({
  statusCode: 500,
  statusMessage: 'Internal server error'
})
```

## 📊 Security Monitoring

### Request Logging
- **API Request Tracking**: All API requests logged with IP
- **Security Events**: Failed authentication attempts logged
- **User Activity**: Login/logout events tracked
- **Admin Operations**: All admin actions logged

### Suspicious Activity Detection
- **Bot Detection**: Blocks suspicious user agents
- **Rate Limit Violations**: Tracks and blocks excessive requests
- **Failed Auth Attempts**: Monitors authentication failures

## 🔧 Configuration Security

### Environment Variables
```env
JWT_SECRET=your-strong-secret-key-here
NODE_ENV=production
DATABASE_URL=your-secure-database-connection
```

### Security Best Practices
- **Secret Management**: JWT secrets stored securely
- **Environment Separation**: Different configs for dev/prod
- **HTTPS Enforcement**: Secure transport in production
- **Cookie Security**: HTTP-only, secure, SameSite cookies

## 🚀 Production Security Checklist

### Before Deployment
- [ ] Change default JWT secret
- [ ] Enable HTTPS/SSL certificates
- [ ] Configure proper CORS settings
- [ ] Set up security monitoring
- [ ] Review and test all endpoints
- [ ] Enable production security headers
- [ ] Configure rate limiting
- [ ] Set up proper logging

### Regular Security Maintenance
- [ ] Review access logs regularly
- [ ] Update dependencies for security patches
- [ ] Monitor for suspicious activity
- [ ] Test authentication flows
- [ ] Verify input validation
- [ ] Check for unauthorized data access

## 🛠️ Security Utilities

### Available Security Functions
```javascript
// Authentication
requireAuth(event)
requireAdmin(event)
getAuthenticatedUser(event)

// Validation
validateInput(data, schema)

// Rate Limiting
checkRateLimit(identifier, limit, windowMs)

// Resource Access
canAccessUserResource(user, resourceId)

// Client Information
getClientIP(event)
```

## 📋 Security Features Summary

✅ **Authentication & Authorization**
- JWT token-based authentication
- Role-based access control
- User data isolation
- Admin privilege verification

✅ **Input Security**
- Comprehensive input validation
- Data sanitization
- Type checking
- Length validation

✅ **Network Security**
- Security headers implementation
- Content Security Policy
- CORS protection
- HTTPS enforcement

✅ **Rate Limiting**
- IP-based rate limiting
- Email-based rate limiting
- Endpoint-specific limits
- Anti-abuse protection

✅ **Password Security**
- Bcrypt password hashing
- Strong password requirements
- Current password verification
- No password exposure

✅ **Database Security**
- SQL injection prevention
- Selective field querying
- Transaction support
- Connection management

✅ **Error Handling**
- Secure error messages
- No internal data exposure
- Consistent error responses
- Security event logging

✅ **Monitoring & Logging**
- Request logging
- Security event tracking
- Suspicious activity detection
- Admin operation logging

This comprehensive security implementation ensures that the application is protected against common web vulnerabilities including OWASP Top 10 threats. 