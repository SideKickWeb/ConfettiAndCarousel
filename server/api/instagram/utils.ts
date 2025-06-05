import prisma from '../../utils/prisma'

export interface InstagramPost {
  id: string
  imageUrl: string
  caption: string
  postedAt: Date
  likes: number
  comments: number
  isActive: boolean
}

export async function validateInstagramPost(data: Partial<InstagramPost>): Promise<string[]> {
  const errors: string[] = []

  if (data.imageUrl && !data.imageUrl.startsWith('http')) {
    errors.push('Image URL must be a valid HTTP URL')
  }

  if (data.caption && data.caption.length > 2200) {
    errors.push('Caption must be less than 2200 characters')
  }

  if (data.likes && data.likes < 0) {
    errors.push('Likes count cannot be negative')
  }

  if (data.comments && data.comments < 0) {
    errors.push('Comments count cannot be negative')
  }

  return errors
}

export async function getRecentPosts(limit: number = 12): Promise<InstagramPost[]> {
  return prisma.instagramPost.findMany({
    where: {
      isActive: true
    },
    orderBy: {
      postedAt: 'desc'
    },
    take: limit
  })
}

export async function cacheInstagramPosts(posts: InstagramPost[]): Promise<void> {
  // First, deactivate all existing posts
  await prisma.instagramPost.updateMany({
    where: { isActive: true },
    data: { isActive: false }
  })

  // Then create new posts
  await prisma.instagramPost.createMany({
    data: posts
  })
}

export async function getPostStats(): Promise<{ total: number; active: number }> {
  const [total, active] = await Promise.all([
    prisma.instagramPost.count(),
    prisma.instagramPost.count({
      where: { isActive: true }
    })
  ])

  return { total, active }
} 