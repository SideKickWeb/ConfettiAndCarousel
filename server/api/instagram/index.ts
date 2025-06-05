import { defineEventHandler, getMethod } from 'h3'
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const method = getMethod(event)

  // GET - Fetch Instagram posts
  if (method === 'GET') {
    try {
      // First try to get cached posts
      const cachedPosts = await prisma.instagramPost.findMany({
        where: {
          isActive: true
        },
        orderBy: {
          postedAt: 'desc'
        },
        take: 12 // Limit to 12 most recent posts
      })

      if (cachedPosts.length > 0) {
        return {
          posts: cachedPosts,
          source: 'cache'
        }
      }

      // If no cached posts, fetch from Instagram API
      // Note: In a real implementation, you would need to:
      // 1. Set up Instagram Basic Display API or Graph API
      // 2. Store credentials securely
      // 3. Implement proper OAuth flow
      // 4. Handle rate limiting and caching

      // For now, return mock data
      const mockPosts = [
        {
          id: '1',
          imageUrl: 'https://example.com/post1.jpg',
          caption: 'Beautiful event setup',
          postedAt: new Date(),
          likes: 120,
          comments: 15,
          isActive: true
        },
        {
          id: '2',
          imageUrl: 'https://example.com/post2.jpg',
          caption: 'Wedding ceremony',
          postedAt: new Date(),
          likes: 85,
          comments: 8,
          isActive: true
        }
      ]

      // Cache the mock posts
      await prisma.instagramPost.createMany({
        data: mockPosts
      })

      return {
        posts: mockPosts,
        source: 'api'
      }
    } catch (error) {
      console.error('Error fetching Instagram posts:', error)
      return {
        statusCode: 500,
        message: 'Failed to fetch Instagram posts'
      }
    }
  }

  return {
    statusCode: 405,
    message: 'Method not allowed'
  }
}) 