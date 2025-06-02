import { PrismaClient } from '@prisma/client';
import { requireAdmin, validateInput, checkRateLimit, getClientIP } from '../../utils/auth';
import { 
  handleSafeError, 
  handleMethodNotAllowed,
  createUserFriendlyError,
  ERROR_CATEGORIES 
} from '../../utils/error-handling';

export default defineEventHandler(async (event) => {
  const prisma = new PrismaClient();
  
  try {
    // Apply rate limiting for admin operations
    const clientIP = getClientIP(event) || 'unknown';
    checkRateLimit(`admin-hero-${clientIP}`, 5, 60000); // 5 requests per minute for admin operations

    const method = getMethod(event);

    // GET - Fetch current hero settings
    if (method === 'GET') {
      console.log('Fetching hero settings');
      
      const settings = await prisma.heroSetting.findFirst({
        where: { active: true },
        select: {
          id: true,
          title: true,
          description: true,
          imageUrl: true,
          buttonText: true,
          buttonLink: true,
          textPosition: true,
          active: true,
          createdAt: true,
          updatedAt: true
        }
      });
      
      return { 
        success: true, 
        data: settings 
      };
    }

    // POST/PUT - Update hero settings (admin only)
    if (method === 'POST' || method === 'PUT') {
      // Require admin authentication
      const admin = await requireAdmin(event);
      
      console.log(`Admin ${admin.email} updating hero settings`);

      // Get and validate request data
      const body = await readBody(event);
      
      const validatedData = validateInput(body, {
        title: { 
          required: true, 
          type: 'string', 
          minLength: 1, 
          maxLength: 200,
          label: 'Title'
        },
        description: { 
          required: true, 
          type: 'string', 
          minLength: 1, 
          maxLength: 500,
          label: 'Description'
        },
        imageUrl: { 
          required: true, 
          type: 'string', 
          minLength: 1,
          label: 'Image URL'
        },
        buttonText: { 
          required: false, 
          type: 'string', 
          maxLength: 50,
          label: 'Button text'
        },
        buttonLink: { 
          required: false, 
          type: 'string', 
          maxLength: 500,
          label: 'Button link'
        },
        textPosition: { 
          required: false, 
          type: 'string',
          label: 'Text position'
        },
        isActive: { 
          required: false,
          label: 'Active status'
        }
      });

      // Check for existing settings
      const existingSettings = await prisma.heroSetting.findFirst();

      let result;

      if (existingSettings) {
        // Update the existing record
        result = await prisma.heroSetting.update({
          where: { id: existingSettings.id },
          data: {
            title: validatedData.title,
            description: validatedData.description,
            imageUrl: validatedData.imageUrl,
            buttonText: validatedData.buttonText,
            buttonLink: validatedData.buttonLink,
            textPosition: validatedData.textPosition,
            active: validatedData.isActive === true || validatedData.isActive === 'true',
            updatedAt: new Date()
          }
        });
        console.log(`Hero settings updated by admin: ${admin.email}`);
      } else {
        // Create a new record
        result = await prisma.heroSetting.create({
          data: {
            id: 'hero-1', // Default ID for first record
            title: validatedData.title,
            description: validatedData.description,
            imageUrl: validatedData.imageUrl,
            buttonText: validatedData.buttonText,
            buttonLink: validatedData.buttonLink,
            textPosition: validatedData.textPosition,
            active: validatedData.isActive === true || validatedData.isActive === 'true'
          }
        });
        console.log(`Hero settings created by admin: ${admin.email}`);
      }

      return { 
        success: true, 
        data: result,
        message: 'Hero settings have been saved successfully'
      };
    }

    // Method not allowed
    throw handleMethodNotAllowed(method, ['GET', 'POST', 'PUT']);
    
  } catch (error) {
    console.error('Error with hero settings:', error);
    
    // Use centralized error handling
    handleSafeError(error, 'SERVER_ERROR');
  } finally {
    await prisma.$disconnect();
  }
}); 