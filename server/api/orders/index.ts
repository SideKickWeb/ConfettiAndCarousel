import { defineEventHandler, getMethod, readBody } from 'h3'
import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const method = getMethod(event)

  // GET - Fetch all orders
  if (method === 'GET') {
    try {
      const orders = await prisma.order.findMany({
        include: {
          Customer: true,
          OrderItem: true,
        },
      });
      return orders;
    } catch (error) {
      console.error('Error fetching orders:', error)
      return {
        statusCode: 500,
        message: 'Failed to fetch orders'
      }
    }
  }

  // POST - Create a new order
  if (method === 'POST') {
    try {
      const body = await readBody(event)
      
      const newOrder = await prisma.order.create({
        data: {
          id: `ORD-${Date.now()}`,
          customerId: body.customerId,
          status: body.status || 'pending',
          totalAmount: body.totalAmount,
          finalAmount: body.totalAmount,
          paymentStatus: body.paymentStatus || 'pending',
          shippingAddress: body.shippingAddress,
          orderNumber: `ORD-${Date.now()}`,
          updatedAt: new Date(),
          Customer: {
            connect: { id: body.customerId }
          },
          OrderItem: {
            create: body.items.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price
            }))
          }
        },
        include: {
          Customer: true,
          OrderItem: {
            include: {
              Product: true
            }
          }
        }
      })
      
      return newOrder
    } catch (error) {
      console.error('Error creating order:', error)
      return {
        statusCode: 500,
        message: 'Failed to create order'
      }
    }
  }

  return {
    statusCode: 405,
    message: 'Method not allowed'
  }
}) 