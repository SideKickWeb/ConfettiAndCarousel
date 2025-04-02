import prisma, { executeQuery } from "../../utils/dbClient";

export default defineEventHandler(async (event) => {
  try {
    console.log("API: Fetching product categories");

    // Get categories from the ProductCategory model using executeQuery helper
    const categories = await executeQuery(async (prisma) => {
      return prisma.productCategory.findMany({
        where: {
          active: true,
        },
        select: {
          id: true,
          name: true,
          description: true,
        },
        orderBy: {
          name: "asc",
        },
      });
    });

    // Format categories for the frontend
    const formattedCategories = categories.map((category) => ({
      value: category.id,
      label: category.name,
      description: category.description,
    }));

    console.log(
      `API: Successfully fetched ${formattedCategories.length} categories`
    );

    // Set response headers with caching
    setResponseHeaders(event, {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=300, s-maxage=600",
    });

    return {
      success: true,
      data: formattedCategories,
      count: formattedCategories.length,
    };
  } catch (error) {
    console.error("API Error fetching product categories:", error);

    // Set response headers
    setResponseHeaders(event, {
      "Content-Type": "application/json",
    });

    return {
      success: false,
      message: "Failed to fetch product categories",
      error: error.message,
    };
  }
});
