// Singleton Prisma Client for Serverless Environments
class PrismaClientSingleton {
  constructor() {
    this.client = null
    this.isConnecting = false
    this.connectionPromise = null
  }

  async getInstance() {
    // Return existing client if available
    if (this.client) {
      return this.client
    }

    // If already connecting, wait for that connection
    if (this.isConnecting && this.connectionPromise) {
      return await this.connectionPromise
    }

    // Start new connection
    this.isConnecting = true
    this.connectionPromise = this.createClient()

    try {
      this.client = await this.connectionPromise
      return this.client
    } finally {
      this.isConnecting = false
      this.connectionPromise = null
    }
  }

  async createClient() {
    try {
      console.log('Creating Prisma client instance...')
      
      // For now, always use mock client to avoid bundling issues
      // TODO: Enable real Prisma client once bundling is resolved
      console.warn('Using mock Prisma client to avoid bundling issues')
      return this.createMockClient()
      
      // Commented out until bundling issues are resolved
      /*
      // Dynamic import to avoid bundling issues
      const { PrismaClient } = await import('@prisma/client')
      
      const client = new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
        datasources: {
          db: {
            url: process.env.DATABASE_URL
          }
        }
      })

      console.log('Prisma client created successfully')
      return client
      */
      
    } catch (error) {
      console.error('Failed to create Prisma client:', error)
      
      // Fallback to mock client for development/debugging
      if (error.message.includes('Cannot find package') || error.message.includes('.prisma')) {
        console.warn('Prisma client not available, using mock client for development')
        return this.createMockClient()
      }
      
      throw new Error(`Prisma client initialization failed: ${error.message}`)
    }
  }

  createMockClient() {
    console.log('Creating mock Prisma client...')
    return {
      $connect: async () => { 
        console.log('Mock Prisma: Connected') 
      },
      $disconnect: async () => { 
        console.log('Mock Prisma: Disconnected') 
      },
      $queryRaw: async () => { 
        console.log('Mock Prisma: Raw query executed')
        return [{ test: 1 }]
      },
      account: {
        findUnique: async (query) => { 
          console.log('Mock account.findUnique:', query?.where)
          return null 
        },
        create: async (data) => { 
          console.log('Mock account.create:', data?.data?.email)
          throw new Error('Database not available - using mock client') 
        },
        update: async (query) => { 
          console.log('Mock account.update:', query?.where)
          throw new Error('Database not available - using mock client') 
        },
        delete: async (query) => { 
          console.log('Mock account.delete:', query?.where)
          throw new Error('Database not available - using mock client') 
        },
        findMany: async () => { 
          console.log('Mock account.findMany')
          return [] 
        }
      },
      product: {
        findMany: async (query) => { 
          console.log('Mock product.findMany:', query?.where)
          return [] 
        },
        findUnique: async (query) => { 
          console.log('Mock product.findUnique:', query?.where)
          return null 
        }
      },
      productCategory: {
        findMany: async (query) => { 
          console.log('Mock productCategory.findMany:', query?.where)
          return [] 
        }
      },
      event: {
        findMany: async (query) => { 
          console.log('Mock event.findMany:', query?.where)
          return [] 
        },
        findUnique: async (query) => { 
          console.log('Mock event.findUnique:', query?.where)
          return null 
        },
        create: async (data) => { 
          console.log('Mock event.create:', data?.data?.title)
          throw new Error('Database not available - using mock client') 
        },
        update: async (query) => { 
          console.log('Mock event.update:', query?.where)
          throw new Error('Database not available - using mock client') 
        },
        delete: async (query) => { 
          console.log('Mock event.delete:', query?.where)
          throw new Error('Database not available - using mock client') 
        }
      },
      customer: {
        findUnique: async (query) => { 
          console.log('Mock customer.findUnique:', query?.where)
          return null 
        },
        create: async (data) => { 
          console.log('Mock customer.create:', data?.data?.email)
          throw new Error('Database not available - using mock client') 
        }
      },
      order: {
        findMany: async (query) => { 
          console.log('Mock order.findMany:', query?.where)
          return [] 
        },
        create: async (data) => { 
          console.log('Mock order.create')
          throw new Error('Database not available - using mock client') 
        }
      },
      orderItem: {
        create: async (data) => { 
          console.log('Mock orderItem.create')
          throw new Error('Database not available - using mock client') 
        }
      },
      orderItemOption: {
        create: async (data) => { 
          console.log('Mock orderItemOption.create')
          throw new Error('Database not available - using mock client') 
        }
      },
      orderStatusHistory: {
        create: async (data) => { 
          console.log('Mock orderStatusHistory.create')
          throw new Error('Database not available - using mock client') 
        }
      },
      booking: {
        findMany: async (query) => { 
          console.log('Mock booking.findMany:', query?.where)
          return [] 
        },
        findUnique: async (query) => { 
          console.log('Mock booking.findUnique:', query?.where)
          return null 
        },
        create: async (data) => { 
          console.log('Mock booking.create')
          throw new Error('Database not available - using mock client') 
        },
        update: async (query) => { 
          console.log('Mock booking.update:', query?.where)
          throw new Error('Database not available - using mock client') 
        },
        delete: async (query) => { 
          console.log('Mock booking.delete:', query?.where)
          throw new Error('Database not available - using mock client') 
        }
      },
      heroSettings: {
        findUnique: async (query) => { 
          console.log('Mock heroSettings.findUnique:', query?.where)
          // Return mock hero settings
          return {
            id: 'default',
            title: 'Welcome to Confetti & Carousel',
            subtitle: 'Creating magical moments for your special events',
            backgroundImage: '/images/hero-bg.jpg',
            textPosition: 'left',
            active: true,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        }
      },
      $transaction: async (callback) => {
        console.log('Mock transaction')
        throw new Error('Database not available - using mock client')
      }
    }
  }

  async disconnect() {
    if (this.client && typeof this.client.$disconnect === 'function') {
      await this.client.$disconnect()
      this.client = null
    }
  }
}

// Create singleton instance
const prismaClientSingleton = new PrismaClientSingleton()

// Export function to get the singleton instance
export async function getPrismaClient() {
  return await prismaClientSingleton.getInstance()
}

// Export disconnect function
export async function disconnectPrisma() {
  return await prismaClientSingleton.disconnect()
}

// Default export for backward compatibility
export default getPrismaClient 