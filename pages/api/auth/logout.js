import cookie from 'cookie'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }
  
  // Clear the authentication cookie
  res.setHeader('Set-Cookie', cookie.serialize('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    expires: new Date(0), // Set expiration to the past
    sameSite: 'strict',
    path: '/',
  }))
  
  res.status(200).json({ message: 'Logged out successfully' })
} 