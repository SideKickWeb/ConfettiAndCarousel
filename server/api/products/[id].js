import prisma, { executeQuery } from "../../utils/dbClient";

export default defineEventHandler(async (event) => {
  try {
    const productId = event.context.params.id;
    console.log(`API: Fetching product with ID: ${productId}`);

    if (!productId) {
      return {
        success: false,
        message: "Product ID is required",
      };
    }

    // Fetch the product with category information using executeQuery helper
    const product = await executeQuery(async (prisma) => {
      return prisma.product.findUnique({
        where: {
          id: productId,
        },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          imageUrl: true,
          categoryId: true,
          active: true,
          ProductCategory: {
            select: {
              name: true,
            },
          },
        },
      });
    });

    if (!product) {
      return {
        success: false,
        message: "Product not found",
      };
    }

    // Format the product data
    const formattedProduct = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.imageUrl,
      categoryId: product.categoryId,
      categoryName: product.ProductCategory?.name || null,
      active: product.active,
    };

    // Set response headers with longer cache time for individual products
    setResponseHeaders(event, {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=300, s-maxage=600",
    });

    return {
      success: true,
      data: formattedProduct,
    };
  } catch (error) {
    console.error("API Error fetching product details:", error);

    // Set response headers
    setResponseHeaders(event, {
      "Content-Type": "application/json",
    });

    return {
      success: false,
      message: "Failed to fetch product details",
      error: error.message,
    };
  }
});
