import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Get query parameters
      const { category, limit, offset } = req.query
      
      // Build query filter
      const filter = {}
      if (category) {
        filter.category = category
      }
      
      // Get products with pagination
      const products = await prisma.product.findMany({
        where: filter,
        include: {
          images: {
            orderBy: {
              sortOrder: 'asc'
            }
          }
        },
        skip: offset ? parseInt(offset) : 0,
        take: limit ? parseInt(limit) : 10,
        orderBy: {
          createdAt: 'desc'
        }
      })
      
      // Get total count for pagination
      const totalCount = await prisma.product.count({
        where: filter
      })
      
      // Return products and count
      return res.status(200).json({
        products,
        totalCount
      })
    } catch (error) {
      console.error('Error fetching products:', error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  } else if (req.method === 'POST') {
    // Check authentication and admin status using middleware
    const { authMiddleware } = await import('../../../lib/authMiddleware')
    const user = await authMiddleware(req, res, true) // requireAdmin = true
    if (!user) return // authMiddleware already sent response
    
    try {
      const { 
        name, 
        description, 
        category, 
        subcategory, 
        purchasePrice, 
        width, 
        height, 
        depth, 
        weight, 
        color, 
        tags, 
        images 
      } = req.body
      
      // Create product
      const product = await prisma.product.create({
        data: {
          name,
          description,
          category,
          subcategory,
          purchasePrice: parseFloat(purchasePrice),
          width: width ? parseFloat(width) : null,
          height: height ? parseFloat(height) : null,
          depth: depth ? parseFloat(depth) : null,
          weight: weight ? parseFloat(weight) : null,
          color,
          tags: Array.isArray(tags) ? tags : [],
          images: {
            create: images?.map((image, index) => ({
              url: image.url,
              isPrimary: index === 0, // First image is primary
              sortOrder: index
            })) || []
          }
        },
        include: {
          images: true
        }
      })
      
      return res.status(201).json(product)
    } catch (error) {
      console.error('Error creating product:', error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' })
  }
} 