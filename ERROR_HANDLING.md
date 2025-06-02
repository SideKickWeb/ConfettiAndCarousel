# Error Handling System Documentation

## Overview

This application now uses a centralized, user-friendly error handling system that provides clear, actionable error messages to users while maintaining security by not exposing internal system details.

## Key Improvements

### 1. **User-Friendly Error Messages**
- **Before**: "Failed to fetch orders" (technical, unhelpful)
- **After**: "We're having trouble loading your orders right now. Please try again in a few minutes." (clear, actionable)

### 2. **Categorized Error Types**
- `authentication` - Login/logout/session issues
- `validation` - Form input errors
- `permission` - Access denied errors
- `not_found` - Resource not found
- `rate_limit` - Too many requests
- `database` - Database connectivity issues
- `server_error` - General server problems
- `external_service` - Third-party service issues

### 3. **Consistent Error Structure**
All API errors now return:
```json
{
  "statusCode": 400,
  "statusMessage": "Please enter a valid email address",
  "data": {
    "errorCode": "AUTH_INVALID_CREDENTIALS",
    "category": "authentication",
    "timestamp": "2024-01-15T10:30:00Z",
    "fields": ["Email address is required"],
    "waitTime": 5
  }
}
```

## Error Handling Components

### 1. **Centralized Error Utilities** (`server/utils/error-handling.js`)

#### Key Functions:
- `createUserFriendlyError()` - Creates standardized error responses
- `handleDatabaseError()` - Converts Prisma errors to user-friendly messages
- `handleAuthError()` - Authentication-specific error handling
- `handleValidationError()` - Form validation error handling
- `handleRateLimitError()` - Rate limiting error handling
- `handleSafeError()` - Catches any error and ensures user-friendly response

#### Example Usage:
```javascript
// Instead of:
throw createError({
  statusCode: 401,
  statusMessage: 'Authentication required'
})

// Use:
throw handleAuthError('REQUIRED')
```

### 2. **Updated Authentication Utilities** (`server/utils/auth.js`)

Enhanced with better error messages:
- Rate limiting with helpful wait times
- Validation errors with field-specific messages
- User-friendly labels for form fields

### 3. **ErrorDisplay Component** (`components/ErrorDisplay.vue`)

Reusable Vue component for displaying errors:
```vue
<ErrorDisplay 
  :message="error.message"
  :category="error.category"
  :details="error.details"
  :can-retry="true"
  @retry="handleRetry"
/>
```

Features:
- Category-specific icons and colors
- Actionable buttons (Sign In, Go Home, Try Again)
- Detailed validation error lists
- Rate limit wait time display
- Responsive design

## Error Message Examples

### Authentication Errors
- **Login Failed**: "Invalid email address or password"
- **Session Expired**: "Your session has expired. Please sign in again"
- **Account Not Found**: "No account found with this email address"

### Validation Errors
- **Required Field**: "First name is required"
- **Invalid Email**: "Please enter a valid email address"
- **Password Too Short**: "Password must be at least 6 characters long"

### Rate Limiting
- **General**: "You're doing that too quickly. Please wait a moment and try again"
- **Login Attempts**: "Too many login attempts. Please wait 5 minutes before trying again"

### Database Errors
- **Connection Issues**: "We're experiencing technical difficulties. Please try again in a few minutes"
- **Timeout**: "The request is taking longer than expected. Please try again"

## Updated API Endpoints

All API endpoints have been updated with the new error handling:

### Authentication Endpoints
- `/api/auth/login.post.js` - Better login error messages
- `/api/auth/register.post.js` - Improved registration validation
- `/api/auth/change-password.put.js` - Clear password change errors
- `/api/auth/update-profile.put.js` - Profile update validation

### Data Endpoints
- `/api/orders/user.get.js` - Fixed database schema issues
- `/api/bookings/user.get.js` - Fixed database schema issues
- `/api/admin/hero-settings.js` - Admin-specific error handling

## Database Schema Fixes

Fixed critical database query issues:
- Removed non-existent `category` field from Product queries
- Updated to use correct field names (`categoryId`, `imageUrl`, etc.)
- Proper field selection to avoid exposing sensitive data

## Rate Limiting Improvements

Enhanced rate limiting with user-friendly messages:
- **Login**: 5 attempts per 5 minutes per IP + 3 per email
- **Registration**: 3 attempts per 5 minutes per IP
- **Password Changes**: 3 attempts per 5 minutes per IP + 2 per user
- **General API**: 20 requests per minute per IP

## Frontend Error Handling

### Using the ErrorDisplay Component

```vue
<template>
  <div>
    <ErrorDisplay 
      v-if="error"
      :message="error.statusMessage"
      :category="error.data?.category || 'server_error'"
      :details="error.data"
      :can-retry="isRetryable"
      @retry="retryAction"
    />
  </div>
</template>

<script setup>
const error = ref(null)
const isRetryable = computed(() => 
  error.value?.data?.category !== 'validation'
)

const retryAction = () => {
  error.value = null
  // Retry the failed operation
}
</script>
```

### Error Categories in Frontend

```javascript
// Check error category for specific handling
if (error.data?.category === 'authentication') {
  // Redirect to login
  navigateTo('/login')
} else if (error.data?.category === 'rate_limit') {
  // Show wait time
  const waitTime = error.data.waitTime || 1
  showMessage(`Please wait ${waitTime} minute(s) before trying again`)
}
```

## Security Considerations

### What We Hide
- Internal error stack traces
- Database connection details
- File paths and system information
- Detailed technical error messages

### What We Show
- Clear, actionable error messages
- Validation errors for user input
- Rate limiting information
- General service status

### Best Practices
1. **Never expose internal errors** - Use `handleSafeError()` for catch blocks
2. **Provide actionable feedback** - Tell users what they can do to fix the issue
3. **Use appropriate status codes** - 400 for validation, 401 for auth, 500 for server errors
4. **Log detailed errors server-side** - For debugging while showing simple messages to users

## Testing Error Scenarios

### Manual Testing
1. **Invalid Login**: Try wrong email/password
2. **Rate Limiting**: Make multiple rapid requests
3. **Validation**: Submit forms with invalid data
4. **Network Issues**: Test with slow/interrupted connections

### Expected Behaviors
- Users see helpful, non-technical error messages
- Rate limited users get clear wait times
- Validation errors highlight specific fields
- Server errors suggest trying again later

## Monitoring and Logging

All errors are logged server-side with:
- Full error details for debugging
- User ID (if authenticated)
- Request IP and timestamp
- Error category and code

Example log entry:
```
[2024-01-15T10:30:00Z] ERROR: Authentication failed
User: user@example.com
IP: 192.168.1.100
Error Code: AUTH_INVALID_CREDENTIALS
Category: authentication
Details: Invalid password attempt
```

## Future Improvements

1. **Error Analytics**: Track error patterns to identify common issues
2. **Internationalization**: Support multiple languages for error messages
3. **Error Recovery**: Automatic retry with exponential backoff
4. **User Feedback**: Allow users to report unclear error messages
5. **A/B Testing**: Test different error message wordings for clarity

## Maintenance

### Adding New Error Types
1. Add error code to `ERROR_MESSAGES` in `error-handling.js`
2. Create appropriate handler function if needed
3. Update `ErrorDisplay.vue` if new category needed
4. Document new error type in this file

### Updating Error Messages
1. Modify messages in `ERROR_MESSAGES` object
2. Test with real users for clarity
3. Ensure messages are actionable and helpful
4. Update documentation

### Debugging Errors
1. Check server logs for detailed error information
2. Use error codes to trace specific error types
3. Monitor error frequency to identify systemic issues
4. User error category to understand error distribution 