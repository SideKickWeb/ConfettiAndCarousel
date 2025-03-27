import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    // Fetch products from database
    const products = await prisma.product.findMany({
      where: {
        active: true
      },
      orderBy: {
        name: 'asc'
      }
    })
    
    console.log(`API: Fetched ${products.length} products from Prisma database`)
    
    // Group products into categories for the UI
    const categories = [
      {
        title: 'Balloon Displays',
        description: 'Premium balloon arrangements for all occasions',
        anchor: 'balloon-displays',
        items: products
          .filter(p => p.name.toLowerCase().includes('balloon'))
          .map(p => ({
            id: p.id,
            name: p.name,
            price: p.price,
            description: p.description || 'Premium balloon arrangement'
          }))
      },
      {
        title: 'Event Decorations',
        description: 'Elegant decorations to transform your event space',
        anchor: 'event-decorations',
        items: products
          .filter(p => !p.name.toLowerCase().includes('balloon'))
          .map(p => ({
            id: p.id,
            name: p.name,
            price: p.price,
            description: p.description || 'Premium event decoration'
          }))
      }
    ]
    
    // Filter out any categories with empty items
    const finalCategories = categories.filter(category => category.items.length > 0)
    
    console.log('API: Returning categories:', finalCategories.map(c => `${c.title} (${c.items.length} items)`))
    return finalCategories
  } catch (error) {
    console.error('Error fetching products:', error)
    return createError({
      statusCode: 500,
      statusMessage: 'Error fetching products',
    })
  }
}) 