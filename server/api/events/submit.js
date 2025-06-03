import prisma from '../../lib/prisma.js'
import { randomUUID } from 'crypto';

export default defineEventHandler(async (event) => {
  const method = getMethod(event);

  if (method === 'POST') {
    try {
      const body = await readBody(event);
      console.log('API: Creating event booking with data:', body);

      // Validate required fields
      if (!body.customerInfo || !body.eventType || !body.eventDate || !body.items || body.items.length === 0) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Missing required event information'
        });
      }

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

        // Calculate total amount
        const totalAmount = body.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

        // Create event
        const newEvent = await prisma.event.create({
          data: {
            id: randomUUID(),
            customerId: customer.id,
            title: `${body.eventType} Event`,
            description: body.description || `${body.eventType} event for ${body.guests || 'TBD'} guests`,
            location: body.location || 'Location TBD',
            startDate: new Date(body.eventDate),
            endDate: body.endDate ? new Date(body.endDate) : new Date(body.eventDate),
            startTime: body.startTime || '12:00',
            endTime: body.endTime,
            status: 'quote_requested',
            stage: 'pending_review',
            totalAmount: totalAmount,
            customerNotes: body.notes || null,
            updatedAt: new Date()
          }
        });

        // Create event items with their custom options
        for (const item of body.items) {
          const eventItem = await prisma.eventItem.create({
            data: {
              eventId: newEvent.id,
              productId: item.product.id,
              quantity: item.quantity,
              unitPrice: item.product.price,
              totalPrice: item.quantity * item.product.price,
              notes: null
            }
          });

          // Create event item options for custom fields
          if (item.selectedOptions && typeof item.selectedOptions === 'object') {
            for (const [optionId, valueId] of Object.entries(item.selectedOptions)) {
              if (valueId) {
                // Get the option and value details
                const option = await prisma.productOption.findUnique({
                  where: { id: optionId },
                  include: {
                    ProductOptionValue: {
                      where: { id: valueId }
                    }
                  }
                });

                if (option) {
                  let optionValue = '';
                  let optionLabel = '';
                  let priceAdjustment = 0;

                  if (option.type === 'text') {
                    // For text options, the value is the actual text
                    optionValue = valueId;
                    optionLabel = valueId;
                  } else if (option.ProductOptionValue.length > 0) {
                    // For select/radio options, get the value details
                    const selectedValue = option.ProductOptionValue[0];
                    optionValue = selectedValue.value;
                    optionLabel = selectedValue.label || selectedValue.value;
                    priceAdjustment = selectedValue.priceAdjustment || 0;
                  }

                  await prisma.eventItemOption.create({
                    data: {
                      eventItemId: eventItem.id,
                      optionId: optionId,
                      optionName: option.name,
                      value: optionValue,
                      label: optionLabel,
                      priceAdjustment: priceAdjustment
                    }
                  });
                }
              }
            }
          }
        }

        // Create event status history
        await prisma.eventStatusHistory.create({
          data: {
            id: randomUUID(),
            eventId: newEvent.id,
            fromStatus: null,
            toStatus: 'quote_requested',
            fromStage: null,
            toStage: 'pending_review',
            notes: 'Event booking submitted by customer',
            changedBy: customer.id,
            changedAt: new Date()
          }
        });

        return newEvent;
      });

      console.log('API: Event booking created successfully:', result.id);

      return {
        success: true,
        data: {
          eventId: result.id,
          message: 'Event booking submitted successfully! We will review your request and contact you within 24 hours to discuss availability and finalize details.'
        }
      };

    } catch (error) {
      console.error('Error creating event booking:', error);
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to create event booking'
      });
    }
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed'
  });
}); 