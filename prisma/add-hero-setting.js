import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";

async function main() {
  const prisma = new PrismaClient();

  try {
    // Check if there's already a hero setting
    const existingHero = await prisma.heroSetting.findFirst();

    if (existingHero) {
      console.log("Hero setting already exists:");
      console.log(existingHero);

      // Update it to be active
      const updated = await prisma.heroSetting.update({
        where: { id: existingHero.id },
        data: { active: true },
      });

      console.log("Updated hero setting to be active.");
      return;
    }

    // Create a new hero setting
    const heroSetting = await prisma.heroSetting.create({
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

    console.log("Created new hero setting:");
    console.log(heroSetting);
  } catch (error) {
    console.error("Error creating hero setting:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
