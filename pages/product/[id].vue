<template>
  <div class="page-wrapper">
    <TheNavbar />
    <main class="content product-detail-page">
      <!-- Loading State -->
      <div v-if="isLoading" class="loading-container">
        <span class="loading-spinner"></span>
        <p>Loading product details...</p>
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="error-container">
        <h2>Product Not Found</h2>
        <p>{{ error }}</p>
        <NuxtLink to="/products" class="back-link">Back to Products</NuxtLink>
      </div>
      
      <!-- Product Details -->
      <div v-else-if="product" class="product-container">
        <div class="product-header">
          <NuxtLink to="/products" class="back-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"></path>
            </svg>
            Back to Products
          </NuxtLink>
        </div>
        
        <div class="product-details">
          <div class="product-image">
            <img v-if="product.image" :src="product.image" :alt="product.name">
            <div v-else class="no-image">No image available</div>
          </div>
          
          <div class="product-info">
            <h1>{{ product.name }}</h1>
            
            <p v-if="product.categoryName" class="product-category">
              {{ product.categoryName }}
            </p>
            
            <div class="product-price">
              £{{ formatPrice(product.price) }}
            </div>
            
            <div class="product-description" v-if="product.description">
              <p>{{ product.description }}</p>
            </div>
            
            <div class="quantity-selector">
              <label for="quantity">Quantity:</label>
              <div class="quantity-controls">
                <button type="button" @click="decrementQuantity" class="quantity-btn" :disabled="quantity <= 1">-</button>
                <span class="quantity">{{ quantity }}</span>
                <button type="button" @click="incrementQuantity" class="quantity-btn">+</button>
              </div>
            </div>
            
            <div class="product-actions">
              <button v-if="isAuthenticated" @click="addToBooking" class="booking-btn">
                Add to Event Booking
              </button>
              <button @click="addToCart" class="cart-btn">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
        
        <!-- Related Products -->
        <div v-if="relatedProducts.length > 0" class="related-products">
          <h2>You May Also Like</h2>
          <div class="related-products-grid">
            <div 
              v-for="relatedProduct in relatedProducts" 
              :key="relatedProduct.id" 
              class="related-product-card"
              @click="navigateToProduct(relatedProduct.id)"
            >
              <div class="related-product-image">
                <img v-if="relatedProduct.image" :src="relatedProduct.image" :alt="relatedProduct.name">
                <div v-else class="no-image-small"></div>
              </div>
              <div class="related-product-info">
                <h4>{{ relatedProduct.name }}</h4>
                <span class="related-product-price">£{{ formatPrice(relatedProduct.price) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Toast Notifications -->
    <div class="toast-container">
      <div v-for="(toast, index) in toasts" :key="index" class="toast">
        <span class="toast-icon">✓</span>
        <span>{{ toast.message }}</span>
      </div>
    </div>
    
    <TheFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../../stores/auth';
import { useProductsStore } from '../../stores/products';
import { useCartStore } from '../../stores/cart';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const productsStore = useProductsStore();
const cartStore = useCartStore();

// State
const product = ref(null);
const loading = ref(true);
const error = ref(null);
const quantity = ref(1);
const toasts = ref([]);
const relatedProducts = ref([]);

// Check if user is authenticated
const isAuthenticated = computed(() => authStore.isAuthenticated);

// Fetch related products
const fetchRelatedProducts = async () => {
  try {
    const response = await fetch('/api/products');
    if (!response.ok) {
      throw new Error('Failed to fetch related products');
    }
    const data = await response.json();
    // Filter out the current product and get up to 4 related products
    relatedProducts.value = (data.data || data)
      .filter(p => p.id !== product.value.id)
      .slice(0, 4);
  } catch (err) {
    console.error('Error fetching related products:', err);
    relatedProducts.value = [];
  }
};

// Fetch the product data
const fetchProduct = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const productId = route.params.id;
    const response = await fetch(`/api/products/${productId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }
    
    const data = await response.json();
    product.value = data.data || data;
    // Fetch related products after we have the main product
    await fetchRelatedProducts();
  } catch (err) {
    console.error('Error fetching product:', err);
    error.value = 'Failed to load product details';
  } finally {
    loading.value = false;
  }
};

// Add to booking
const addToBooking = () => {
  if (!isAuthenticated.value) {
    router.push('/login');
    return;
  }
  
  router.push({
    path: '/booking',
    query: { product: product.value.id, quantity: quantity.value }
  });
};

// Add to cart
const addToCart = () => {
  if (product.value) {
    cartStore.addToCart(product.value, quantity.value);
    showToast(`${product.value.name} added to your cart`);
  }
};

// Increment quantity
const incrementQuantity = () => {
  quantity.value++;
};

// Decrement quantity
const decrementQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

// Format price
const formatPrice = (price) => {
  return parseFloat(price || 0).toFixed(2);
};

// Display toast notification
const showToast = (message) => {
  const toast = { message };
  toasts.value.push(toast);
  setTimeout(() => {
    const index = toasts.value.indexOf(toast);
    if (index !== -1) {
      toasts.value.splice(index, 1);
    }
  }, 3000);
};

// Fetch product on page load
onMounted(() => {
  fetchProduct();
  cartStore.loadFromLocalStorage();
});
</script>

<style scoped>
.page-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  background-color: var(--bg-primary);
}

.content {
  flex: 1;
  padding-top: 120px;
  width: 100%;
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: 120px 2rem 2rem;
}

/* Loading state */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 0;
  text-align: center;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid var(--border-color);
  border-radius: 50%;
  border-top-color: var(--accent-primary);
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Error state */
.error-container {
  background-color: var(--card-bg);
  border-radius: 12px;
  padding: 2rem;
  margin: 3rem 0;
  text-align: center;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 20px var(--shadow-color);
}

.error-container p {
  color: var(--error-color, #ef4444);
  margin-bottom: 1.5rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  color: var(--accent-primary);
  text-decoration: none;
  font-weight: 500;
  margin: 1rem 0;
}

.back-link svg {
  margin-right: 0.5rem;
}

.back-link:hover {
  text-decoration: underline;
}

/* Product container */
.product-container {
  margin: 2rem 0 4rem;
}

.product-header {
  margin-bottom: 2rem;
}

.product-details {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 768px) {
  .product-details {
    grid-template-columns: minmax(400px, 1fr) 1fr;
  }
}

.product-image {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px var(--shadow-color);
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  position: relative;
  padding: 1rem;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  overflow: hidden;
  border-radius: 8px;
}

.no-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--hover-bg);
  color: var(--text-primary);
  padding: 2rem;
  text-align: center;
}

.product-info {
  background-color: var(--card-bg);
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 20px var(--shadow-color);
}

.product-info h1 {
  font-size: 2rem;
  color: var(--accent-primary);
  margin-bottom: 1rem;
}

.product-category {
  display: inline-block;
  background-color: var(--hover-bg);
  color: var(--text-primary);
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.product-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
}

.product-description {
  margin-bottom: 2rem;
  color: var(--text-primary);
  line-height: 1.6;
}

/* Quantity selector */
.quantity-selector {
  margin-bottom: 2rem;
}

.quantity-selector label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.quantity-controls {
  display: flex;
  align-items: center;
  width: fit-content;
  border: 1px solid var(--border-color);
  border-radius: 4px;
}

.quantity-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-secondary);
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: 1.2rem;
}

.quantity-btn:hover:not(:disabled) {
  background-color: var(--hover-bg);
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity {
  width: 60px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-left: 1px solid var(--border-color);
  border-right: 1px solid var(--border-color);
  font-weight: 500;
}

/* Product actions */
.product-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

@media (min-width: 640px) {
  .product-actions {
    flex-direction: row;
  }
}

.booking-btn, .cart-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
  text-align: center;
}

.booking-btn {
  background: linear-gradient(to right, var(--accent-primary), var(--accent-secondary));
  color: white;
  border: none;
}

.booking-btn:hover {
  background: linear-gradient(to right, var(--accent-secondary), var(--accent-primary));
  transform: translateY(-2px);
}

.cart-btn {
  background-color: var(--bg-secondary);
  color: var(--accent-primary);
  border: 1px solid var(--accent-primary);
}

.cart-btn:hover {
  background-color: rgba(var(--accent-primary-rgb, 184, 134, 11), 0.1);
  transform: translateY(-2px);
}

/* Toast notifications */
.toast-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
}

.toast {
  background-color: var(--accent-primary);
  color: white;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  animation: slideIn 0.3s ease, fadeOut 0.5s ease 2.5s forwards;
  max-width: 300px;
}

.toast-icon {
  margin-right: 10px;
  font-size: 1.2rem;
}

@keyframes slideIn {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; visibility: hidden; }
}

@media (max-width: 480px) {
  .product-info h1 {
    font-size: 1.5rem;
  }
  
  .product-price {
    font-size: 1.25rem;
  }
}

/* Related Products Section */
.related-products {
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
}

.related-products h2 {
  font-size: 1.5rem;
  color: var(--accent-primary);
  margin-bottom: 2rem;
  text-align: center;
}

.related-products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.related-product-card {
  background-color: var(--card-bg);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px var(--shadow-color);
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.related-product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 24px var(--shadow-color);
}

.related-product-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background-color: var(--hover-bg);
}

.related-product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.related-product-card:hover .related-product-image img {
  transform: scale(1.05);
}

.no-image-small {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.related-product-info {
  padding: 1.5rem;
}

.related-product-info h4 {
  font-size: 1.1rem;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.related-product-price {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--accent-primary);
}

@media (max-width: 767px) {
  .product-details {
    grid-template-columns: 1fr;
  }
  
  .product-image {
    aspect-ratio: 1;
    max-width: 500px;
    margin: 0 auto;
  }
}
</style> 