import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const productId = event.context.params.id;
    console.log(`API: Fetching product with ID: ${productId}`);
    
    if (!productId) {
      return {
        success: false,
        message: 'Product ID is required'
      };
    }

    // Fetch the product with category information
    const product = await prisma.product.findUnique({
      where: {
        id: productId
      },
      include: {
        ProductCategory: true
      }
    });

    if (!product) {
      return {
        success: false,
        message: 'Product not found'
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
      active: product.active
    };

    // Set response headers
    setResponseHeaders(event, {
      'Content-Type': 'application/json',
      'Cache-Control': 'max-age=60'
    });

    return {
      success: true,
      data: formattedProduct
    };
  } catch (error) {
    console.error('API Error fetching product details:', error);
    
    // Set response headers
    setResponseHeaders(event, {
      'Content-Type': 'application/json'
    });

    return {
      success: false,
      message: 'Failed to fetch product details',
      error: error.message
    };
  }
}); 