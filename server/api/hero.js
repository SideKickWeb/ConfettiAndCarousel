import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

// Create a singleton PrismaClient instance
let prisma;

// Only instantiate PrismaClient if it doesn't exist already
if (!global.prisma) {
  global.prisma = new PrismaClient();
}
prisma = global.prisma;

export default defineEventHandler(async (event) => {
  try {
    // Get the active hero settings from the database - use findFirst with select to optimize query
    let heroSettings = await prisma.heroSetting.findFirst({
      where: { active: true },
      select: {
        id: true,
        imageUrl: true,
        title: true,
        description: true,
        buttonText: true,
        buttonLink: true,
        textPosition: true,
        active: true,
        updatedAt: true,
      },
    });

    // If no active settings found, try to get any hero setting
    if (!heroSettings) {
      console.log(
        "No active hero settings found, checking for any hero settings"
      );
      heroSettings = await prisma.heroSetting.findFirst({
        select: {
          id: true,
          imageUrl: true,
          title: true,
          description: true,
          buttonText: true,
          buttonLink: true,
          textPosition: true,
          active: true,
          updatedAt: true,
        },
      });
    }

    // If still no settings, create one
    if (!heroSettings) {
      console.log("No hero settings found, creating default");
      try {
        heroSettings = await prisma.heroSetting.create({
          data: {
            id: randomUUID(),
            imageUrl: "/images/gallery/wedding1.jpg",
            title: "Create Unforgettable Events",
            description:
              "Premium event decorations and equipment to make your special day truly memorable.",
            buttonText: "Browse Products",
            buttonLink: "/products",
            textPosition: "left",
            active: true,
            updatedAt: new Date(),
          },
        });
        console.log("Created default hero settings:", heroSettings);
      } catch (createError) {
        console.error("Error creating hero settings:", createError);
        // Return default values if creation fails
        return {
          imageUrl: "/images/gallery/wedding1.jpg",
          title: "Create Unforgettable Events",
          description:
            "Premium event decorations and equipment to make your special day truly memorable.",
          buttonText: "Browse Products",
          buttonLink: "/products",
          textPosition: "left",
        };
      }
    }

    return heroSettings;
  } catch (error) {
    console.error("Error fetching hero settings:", error);

    // Return fallback content in case of an error
    return {
      imageUrl: "/images/gallery/wedding1.jpg",
      title: "Create Unforgettable Events",
      description:
        "Premium event decorations and equipment to make your special day truly memorable.",
      buttonText: "Browse Products",
      buttonLink: "/products",
      textPosition: "left",
    };
  }
});
