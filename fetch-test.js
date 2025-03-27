import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('Connecting to database...')
    
    // Test database connection
    await prisma.$connect()
    console.log('Database connection successful')
    
    // Try to query products
    console.log('Fetching products...')
    const products = await prisma.product.findMany({
      include: {
        variants: true,
        customOptions: true
      }
    })
    
    console.log(`Found ${products.length} products:`)
    products.forEach(product => {
      console.log(`- ${product.name} ($${product.price}) - Category: ${product.category}`)
    })
    
    console.log('Test completed successfully')
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main() 