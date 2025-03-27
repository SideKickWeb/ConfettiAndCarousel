import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  const { id } = req.query

  if (!id) {
    return res.status(400).json({ message: 'Product ID is required' })
  }

  // GET specific product
  if (req.method === 'GET') {
    try {
      const product = await prisma.product.findUnique({
        where: { id },
        include: {
          images: {
            orderBy: {
              sortOrder: 'asc'
            }
          }
        }
      })

      if (!product) {
        return res.status(404).json({ message: 'Product not found' })
      }

      return res.status(200).json(product)
    } catch (error) {
      console.error('Error fetching product:', error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  } 
  
  // For PUT and DELETE, check authentication and admin status
  const { authMiddleware } = await import('../../../lib/authMiddleware')
  const user = await authMiddleware(req, res, true) // requireAdmin = true
  if (!user) return // authMiddleware already sent response
  
  // PUT/UPDATE specific product
  if (req.method === 'PUT') {
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

      // First, check if product exists
      const existingProduct = await prisma.product.findUnique({
        where: { id }
      })

      if (!existingProduct) {
        return res.status(404).json({ message: 'Product not found' })
      }

      // Update the product
      const updatedProduct = await prisma.product.update({
        where: { id },
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
        },
        include: {
          images: true
        }
      })

      // If there are new images, handle them
      if (Array.isArray(images) && images.length > 0) {
        // Delete existing images
        await prisma.productImage.deleteMany({
          where: { productId: id }
        })

        // Create new images
        await Promise.all(
          images.map(async (image, index) => {
            await prisma.productImage.create({
              data: {
                productId: id,
                url: image.url,
                isPrimary: index === 0,
                sortOrder: index
              }
            })
          })
        )
      }

      // Fetch updated product with images
      const finalProduct = await prisma.product.findUnique({
        where: { id },
        include: {
          images: {
            orderBy: {
              sortOrder: 'asc'
            }
          }
        }
      })

      return res.status(200).json(finalProduct)
    } catch (error) {
      console.error('Error updating product:', error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }

  // DELETE specific product
  if (req.method === 'DELETE') {
    try {
      // Check if product exists
      const existingProduct = await prisma.product.findUnique({
        where: { id }
      })

      if (!existingProduct) {
        return res.status(404).json({ message: 'Product not found' })
      }

      // Delete the product (this will cascade delete images due to the relation in schema)
      await prisma.product.delete({
        where: { id }
      })

      return res.status(200).json({ message: 'Product deleted successfully' })
    } catch (error) {
      console.error('Error deleting product:', error)
      return res.status(500).json({ message: 'Internal server error' })
    }
  }

  // Handle any other HTTP method
  return res.status(405).json({ message: 'Method not allowed' })
} 