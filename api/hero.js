import { PrismaClient } from "@prisma/client";
import { defineEventHandler } from "h3";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    // Get the active hero settings from the database
    const heroSettings = await prisma.heroSetting.findFirst({
      where: { active: true },
    });

    // If no active settings found, return default values
    if (!heroSettings) {
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
  } finally {
    await prisma.$disconnect();
  }
});
