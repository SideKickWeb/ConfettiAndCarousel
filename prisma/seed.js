import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
const now = new Date();

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Seeding products...");
    // Product data
    const products = [
      {
        id: crypto.randomUUID(),
        name: "Single Balloon Arrangement",
        description: "Premium single balloon arrangement for any occasion",
        price: 15.0,
        imageUrl: "/images/products/balloon-single.jpg",
        active: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: crypto.randomUUID(),
        name: "Balloon Arch Display",
        description:
          "Stunning balloon arch to create a focal point for your event",
        price: 150.0,
        imageUrl: "/images/products/balloon-arch.jpg",
        active: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: crypto.randomUUID(),
        name: "Balloon Column Set",
        description: "Set of 2 elegant balloon columns for entrance decoration",
        price: 100.0,
        imageUrl: "/images/products/balloon-columns.jpg",
        active: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: crypto.randomUUID(),
        name: "Luxury Tablecloth",
        description:
          "Premium tablecloth in various colors for elegant event tables",
        price: 25.0,
        imageUrl: "/images/products/tablecloth.jpg",
        active: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: crypto.randomUUID(),
        name: "Decorative Centerpiece",
        description: "Elegant table centerpiece with fresh flowers and candles",
        price: 45.0,
        imageUrl: "/images/products/centerpiece.jpg",
        active: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: crypto.randomUUID(),
        name: "LED Light Backdrop",
        description: "Stunning LED light backdrop for your event",
        price: 200.0,
        imageUrl: "/images/products/led-backdrop.jpg",
        active: true,
        createdAt: now,
        updatedAt: now,
      },
    ];

    for (const product of products) {
      await prisma.product.upsert({
        where: { id: product.id },
        update: product,
        create: product,
      });
      console.log(`Created/updated product: ${product.name}`);
    }

    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding the database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
