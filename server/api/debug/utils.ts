import prisma from '../../utils/prisma'

export interface SystemStats {
  memory: {
    total: number
    used: number
    free: number
  }
  uptime: number
  database: {
    users: number
    events: number
    orders: number
    products: number
    customers: number
  }
}

export async function getSystemStats(): Promise<SystemStats> {
  const [
    userCount,
    eventCount,
    orderCount,
    productCount,
    customerCount
  ] = await Promise.all([
    prisma.user.count(),
    prisma.event.count(),
    prisma.order.count(),
    prisma.product.count(),
    prisma.customer.count()
  ])

  const memoryUsage = process.memoryUsage()
  const totalMemory = require('os').totalmem()
  const freeMemory = require('os').freemem()

  return {
    memory: {
      total: totalMemory,
      used: memoryUsage.heapUsed,
      free: freeMemory
    },
    uptime: process.uptime(),
    database: {
      users: userCount,
      events: eventCount,
      orders: orderCount,
      products: productCount,
      customers: customerCount
    }
  }
}

export async function clearTestData(): Promise<void> {
  // Delete test data in reverse order of dependencies
  await Promise.all([
    prisma.order.deleteMany({
      where: {
        isTest: true
      }
    }),
    prisma.booking.deleteMany({
      where: {
        isTest: true
      }
    }),
    prisma.event.deleteMany({
      where: {
        isTest: true
      }
    }),
    prisma.product.deleteMany({
      where: {
        isTest: true
      }
    }),
    prisma.customer.deleteMany({
      where: {
        isTest: true
      }
    }),
    prisma.user.deleteMany({
      where: {
        isTest: true
      }
    })
  ])
}

export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development'
}

export function formatBytes(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return '0 Byte'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${Math.round(bytes / Math.pow(1024, i))} ${sizes[i]}`
}

export function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / (3600 * 24))
  const hours = Math.floor((seconds % (3600 * 24)) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = Math.floor(seconds % 60)

  const parts = []
  if (days > 0) parts.push(`${days}d`)
  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0) parts.push(`${minutes}m`)
  if (remainingSeconds > 0) parts.push(`${remainingSeconds}s`)

  return parts.join(' ')
} 