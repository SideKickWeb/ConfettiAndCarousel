import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const method = getMethod(event);

  if (method === 'GET') {
    try {
      const orders = await prisma.order.findMany({
        include: {
          Customer: true,
          OrderItem: {
            include: {
              Product: true,
              OrderItemOption: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return {
        success: true,
        data: orders
      };
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch orders'
      });
    }
  }

  if (method === 'POST') {
    try {
      const body = await readBody(event);
      console.log('API: Creating order with data:', body);

      // Validate required fields
      if (!body.customerInfo || !body.items || body.items.length === 0) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Missing required order information'
        });
      }

      // Generate order number
      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

      const result = await prisma.$transaction(async (prisma) => {
        // Create or find customer
        let customer = await prisma.customer.findUnique({
          where: { email: body.customerInfo.email }
        });

        if (!customer) {
          customer = await prisma.customer.create({
            data: {
              id: randomUUID(),
              email: body.customerInfo.email,
              firstName: body.customerInfo.firstName,
              lastName: body.customerInfo.lastName,
              phone: body.customerInfo.phone || null,
              updatedAt: new Date()
            }
          });
        }

        // Calculate totals
        const subtotal = body.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        const finalAmount = subtotal; // Add tax/shipping calculations if needed

        // Create order
        const order = await prisma.order.create({
          data: {
            id: randomUUID(),
            customerId: customer.id,
            orderNumber: orderNumber,
            totalAmount: subtotal,
            finalAmount: finalAmount,
            status: 'pending',
            stage: 'pending_review',
            paymentStatus: 'unpaid',
            customerNotes: body.notes || null,
            updatedAt: new Date()
          }
        });

        // Create order items with their custom options
        for (const item of body.items) {
          const orderItem = await prisma.orderItem.create({
            data: {
              orderId: order.id,
              productId: item.product.id,
              quantity: item.quantity,
              unitPrice: item.product.price,
              totalPrice: item.quantity * item.product.price,
              notes: item.notes || null
            }
          });

          // Create order item options for custom fields
          if (item.customOptions && Array.isArray(item.customOptions) && item.customOptions.length > 0) {
            for (const customOption of item.customOptions) {
              await prisma.orderItemOption.create({
                data: {
                  orderItemId: orderItem.id,
                  optionId: customOption.optionId,
                  optionName: customOption.optionName,
                  value: customOption.value,
                  label: customOption.label || customOption.value,
                  priceAdjustment: customOption.priceAdjustment || 0
                }
              });
            }
          }
        }

        // Create order status history
        await prisma.orderStatusHistory.create({
          data: {
            id: randomUUID(),
            orderId: order.id,
            fromStatus: null,
            toStatus: 'pending',
            fromStage: null,
            toStage: 'pending_review',
            notes: 'Order submitted by customer',
            changedBy: customer.id,
            changedAt: new Date()
          }
        });

        return order;
      });

      console.log('API: Order created successfully:', result.id);

      return {
        success: true,
        data: {
          orderId: result.id,
          orderNumber: orderNumber,
          message: 'Order submitted successfully! You will be contacted within 24 hours to confirm details and arrange collection.'
        }
      };

    } catch (error) {
      console.error('Error creating order:', error);
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to create order'
      });
    }
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed'
  });
}); 