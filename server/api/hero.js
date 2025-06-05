import prisma from "../utils/prisma";

export default defineEventHandler(async (event) => {
  try {
    const method = getMethod(event);

    // GET - Fetch active hero settings
    if (method === "GET") {
      console.log("Fetching hero settings");
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
          updatedAt: true,
        },
      });
      return { success: true, data: settings };
    }
    return { success: false, message: "Method not allowed" };
  } catch (error) {
    console.error("Error with hero settings:", error);
    return {
      success: false,
      message: "Failed to fetch hero settings",
      error: error.message,
    };
  }
});
