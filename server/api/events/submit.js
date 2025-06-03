import { requireAuth, validateInput, checkRateLimit, getClientIP } from '../../utils/auth'
import { 
  handleSafeError, 
  handleMethodNotAllowed,
  createUserFriendlyError,
  ERROR_CATEGORIES 
} from '../../utils/error-handling'

export default defineEventHandler(async (event) => {
  try {
    // Only allow POST method
    if (getMethod(event) !== 'POST') {
      throw handleMethodNotAllowed(getMethod(event), ['POST'])
    }

    // Apply rate limiting
    const clientIP = getClientIP(event) || 'unknown'
    checkRateLimit(`event-submit-${clientIP}`, 5, 60000) // 5 requests per minute

    // Require authentication
    const user = await requireAuth(event)
    
    const body = await readBody(event)
    
    // Validate input
    const validatedData = validateInput(body, {
      title: { 
        required: true, 
        type: 'string',
        minLength: 1,
        maxLength: 200,
        label: 'Event title'
      },
      eventDate: { 
        required: true, 
        type: 'string',
        label: 'Event date'
      },
      eventTime: { 
        required: false, 
        type: 'string',
        label: 'Event time'
      },
      location: { 
        required: true, 
        type: 'string',
        minLength: 1,
        maxLength: 500,
        label: 'Location'
      },
      description: { 
        required: false, 
        type: 'string',
        maxLength: 1000,
        label: 'Description'
      },
      numberOfGuests: { 
        required: true, 
        type: 'number',
        label: 'Number of guests'
      },
      contactPhone: {
        required: false,
        type: 'string',
        maxLength: 20,
        label: 'Contact phone'
      }
    })

    // Dynamic Prisma import
    const { getPrismaClient } = await import('../../../lib/prisma.js')
    const prisma = await getPrismaClient()

    // Find or create customer record
    let customer = await prisma.customer.findUnique({
      where: { email: user.email }
    })

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: validatedData.contactPhone || ''
        }
      })
    }

    // Create the event
    const newEvent = await prisma.event.create({
      data: {
        title: validatedData.title,
        description: validatedData.description || '',
        startDate: new Date(validatedData.eventDate),
        startTime: validatedData.eventTime || '',
        location: validatedData.location,
        numberOfGuests: validatedData.numberOfGuests,
        customerId: customer.id,
        status: 'pending',
        active: true
      },
      include: {
        Customer: true
      }
    })

    console.log(`Event submitted: ${newEvent.id} by customer: ${customer.email}`)

    return {
      success: true,
      data: newEvent,
      message: 'Your event has been submitted successfully! We will contact you shortly to discuss the details.'
    }

  } catch (error) {
    console.error('Event submission error:', error)
    handleSafeError(error, 'SERVER_ERROR')
  }
}) 