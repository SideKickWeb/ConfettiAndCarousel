export default defineEventHandler(async (event) => {
  try {
    // Clear the authentication cookie
    setCookie(event, 'token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 0, // Expire immediately
      path: '/',
    })

    return { success: true, message: 'Logged out successfully' }
  } catch (error) {
    console.error('Logout error:', error)
    return createError({
      statusCode: 500,
      message: 'Error logging out'
    })
  }
}) 