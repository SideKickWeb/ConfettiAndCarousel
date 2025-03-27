import { PrismaClient } from '@prisma/client';

export default defineEventHandler(async (event) => {
  // Get the form data from the request
  const { title, description, imageUrl, buttonText, buttonLink, textPosition, isActive } = await readBody(event);

  // Get the Prisma client
  const prisma = new PrismaClient();

  try {
    // Check if we have a hero settings record already
    const existingSettings = await prisma.heroSetting.findFirst();

    let result;

    if (existingSettings) {
      // Update the existing record
      result = await prisma.heroSetting.update({
        where: { id: existingSettings.id },
        data: {
          title,
          description,
          imageUrl,
          buttonText,
          buttonLink,
          textPosition,
          active: isActive === true || isActive === 'true',
        },
      });
    } else {
      // Create a new record
      result = await prisma.heroSetting.create({
        data: {
          title,
          description,
          imageUrl,
          buttonText,
          buttonLink,
          textPosition,
          active: isActive === true || isActive === 'true',
        },
      });
    }

    return { success: true, data: result };
  } catch (error) {
    console.error('Error saving hero settings:', error);
    return { success: false, error: error.message };
  } finally {
    await prisma.$disconnect();
  }
}); 