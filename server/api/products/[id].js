import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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

    // Fetch the specific product with all relations
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        ProductCategory: true,
        ProductOption: {
          include: {
            ProductOptionValue: {
              orderBy: {
                sortOrder: 'asc'
              }
            }
          },
          orderBy: {
            sortOrder: 'asc'
          }
        }
      }
    })

    if (!product) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Product not found'
      })
    }

    // Format the product data with all custom fields
    const formattedProduct = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      imageUrl: product.imageUrl,
      active: product.active,
      canBuy: product.canBuy,
      canHire: product.canHire,
      hasRangePrice: product.hasRangePrice,
      hasUnitPrice: product.hasUnitPrice,
      maxPrice: product.maxPrice,
      minPrice: product.minPrice,
      minQuantity: product.minQuantity,
      unitPrice: product.unitPrice,
      unitType: product.unitType,
      category: product.ProductCategory ? {
        id: product.ProductCategory.id,
        name: product.ProductCategory.name,
        description: product.ProductCategory.description
      } : null,
      options: product.ProductOption.map(option => ({
        id: option.id,
        name: option.name,
        type: option.type,
        required: option.required,
        sortOrder: option.sortOrder,
        values: option.ProductOptionValue.map(value => ({
          id: value.id,
          value: value.value,
          label: value.label || value.value,
          priceAdjustment: value.priceAdjustment || 0,
          sortOrder: value.sortOrder
        }))
      })),
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    }

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