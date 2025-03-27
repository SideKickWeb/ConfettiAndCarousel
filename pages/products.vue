<template>
  <div class="page-wrapper">
    <TheNavbar />
    <main class="content">
      <div class="products-header">
        <div class="header-content">
          <h1>Our Products</h1>
          <p>Discover our range of premium event decoration products</p>
        </div>
      </div>

      <div class="products-content">
        <div class="content-wrapper">
          <!-- Category filter -->
          <div class="category-filters">
            <button 
              @click="selectedCategory = ''"
              :class="['filter-btn', !selectedCategory ? 'active' : '']"
            >
              All Products
            </button>
            <button 
              v-for="category in availableCategories" 
              :key="category.value"
              @click="selectedCategory = category.value"
              :class="['filter-btn', selectedCategory === category.value ? 'active' : '']"
            >
              {{ category.label || 'Category' }}
            </button>
          </div>

          <!-- Loading indicator -->
          <div v-if="productsStore.loading" class="loading-container">
            <span class="loading-spinner"></span>
            <p>Loading products...</p>
          </div>

          <!-- Error message -->
          <div v-else-if="productsStore.error" class="error-container">
            <p>{{ productsStore.error }}</p>
            <button @click="loadProducts" class="retry-button">Retry</button>
          </div>

          <!-- Products display -->
          <div v-else>
            <div class="product-grid">
              <div v-for="product in filteredProducts" :key="product.id" class="product-card">
                <NuxtLink :to="`/product/${product.id}`" class="product-link">
                  <div class="product-image">
                    <img v-if="product.image" :src="product.image" :alt="product.name">
                    <div v-else class="no-image">
                      <span>No image available</span>
                    </div>
                  </div>
                  <div class="product-info">
                    <h3>{{ product.name }}</h3>
                    <span class="price">£{{ formatPrice(product.price) }}</span>
                    <p v-if="product.categoryName" class="category-tag">{{ product.categoryName }}</p>
                    <p class="description">{{ product.description }}</p>

                    <div class="product-features" v-if="product.customizable">
                      <span class="feature-badge">Customizable</span>
                    </div>
                  </div>
                </NuxtLink>
                <div v-if="isAuthenticated" class="product-actions">
                  <button @click="bookProduct(product)" class="book-button">
                    Add to Booking
                  </button>
                </div>
                <div class="product-actions">
                  <button @click="addToCart(product)" class="cart-button">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>

            <!-- Empty state -->
            <div v-if="filteredProducts.length === 0" class="empty-products">
              <p>No products available in this category.</p>
              <button @click="selectedCategory = ''" class="retry-button">View All Products</button>
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
import { ref, computed, onMounted, nextTick } from 'vue';
import { useProductsStore } from '../stores/products';
import { useAuthStore } from '../stores/auth';
import { useCartStore } from '../stores/cart';
import { useRouter } from 'vue-router';

const router = useRouter();
const productsStore = useProductsStore();
const authStore = useAuthStore();
const cartStore = useCartStore();

const isAuthenticated = computed(() => authStore.isAuthenticated);
const selectedCategory = ref('');
const toasts = ref([]);

// Available product categories
const availableCategories = computed(() => {
  console.log('Available categories:', productsStore.categories);
  return productsStore.categories || [];
});

// Filtered products based on selected category
const filteredProducts = computed(() => {
  if (!selectedCategory.value) {
    return productsStore.products;
  }
  return productsStore.products.filter(product => 
    product.categoryId === selectedCategory.value || product.category === selectedCategory.value
  );
});

// Format price to show 2 decimal places
const formatPrice = (price) => {
  return parseFloat(price || 0).toFixed(2);
};

// Load products from the API
const loadProducts = async () => {
  console.log('Loading products from Prisma database via store...');
  await productsStore.fetchProducts();
  console.log('Products loaded:', productsStore.products.length);
  console.log('Categories loaded:', productsStore.categories.length);
};

// Navigate to booking page with selected product
const bookProduct = (product) => {
  if (!isAuthenticated.value) {
    router.push('/login');
    return;
  }
  
  router.push({
    path: '/booking',
    query: { product: product.id }
  });
};

// Add product to cart
const addToCart = (product) => {
  cartStore.addToCart(product);
  showToast(`${product.name} added to your cart`);
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

onMounted(async () => {
  // Load cart from localStorage
  cartStore.loadFromLocalStorage();
  
  // Load products
  await loadProducts();
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
  padding-top: 80px;
  width: 100%;
  max-width: var(--content-max-width);
  margin: 0 auto;
}

.products-header {
  text-align: center;
    padding: 4rem 0;
    background: var(--service-card-bg);
    margin-bottom: 3rem;
    position: relative;
    width: 100vw;
    left: calc(-50vw + 50%);
    right: calc(-50vw + 50%);
    overflow: hidden;
}

.header-content {
  max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    text-align: center;
}

.header-content h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.header-content p {
  font-size: 1.2rem;
  opacity: 0.9;
}

.products-content {
  padding: 4rem 2rem;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}

.category-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
  justify-content: center;
}

.filter-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  background-color: var(--card-bg);
  color: var(--accent-primary);
  border-radius: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn:hover {
  background-color: var(--hover-bg);
}

.filter-btn.active {
  background-color: var(--accent-primary);
  color: white;
  border-color: var(--accent-secondary);
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.product-card {
  background: var(--card-bg);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px var(--shadow-color);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px var(--shadow-color);
}

.product-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.no-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--hover-bg);
  color: var(--text-primary);
}

.product-info {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.product-card h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: var(--accent-primary);
}

.price {
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.description {
  color: var(--text-primary);
  opacity: 0.7;
  margin-bottom: 1rem;
  flex-grow: 1;
}

.category-tag {
  display: inline-block;
  background-color: var(--hover-bg, #f0f0f0);
  color: var(--accent-primary, #3b82f6);
  font-size: 0.8rem;
  padding: 0.3rem 0.6rem;
  border-radius: 2rem;
  margin-bottom: 0.5rem;
  border: 1px solid var(--border-color, #e5e7eb);
}

.product-features {
  margin-bottom: 1rem;
}

.feature-badge {
  display: inline-block;
  background-color: var(--hover-bg);
  color: var(--accent-primary);
  font-size: 0.8rem;
  padding: 0.3rem 0.6rem;
  border-radius: 2rem;
  border: 1px solid var(--border-color);
}

.product-link {
  display: block;
  text-decoration: none;
  color: inherit;
  transition: transform 0.3s ease;
}

.product-card:hover .product-link {
  transform: translateY(-5px);
}

.product-actions {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.book-button {
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(to right, var(--accent-primary), var(--accent-secondary));
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
}

.book-button:hover {
  background: linear-gradient(to right, var(--accent-secondary), var(--accent-primary));
  transform: translateY(-2px);
}

.cart-button {
  width: 100%;
  padding: 0.75rem;
  background-color: var(--bg-secondary);
  color: var(--accent-primary);
  border: 1px solid var(--accent-primary);
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
  margin-top: 0.5rem;
}

.cart-button:hover {
  background-color: rgba(var(--accent-primary-rgb, 184, 134, 11), 0.1);
  transform: translateY(-2px);
}

.loading-container, .error-container, .empty-products {
  text-align: center;
  padding: 3rem;
}

.loading-spinner {
  display: inline-block;
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

.error-container {
  color: var(--error-color, #ef4444);
}

.empty-products {
  color: var(--text-primary);
  opacity: 0.7;
}

.retry-button {
  background: linear-gradient(to right, var(--accent-primary), var(--accent-secondary));
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  margin-top: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.retry-button:hover {
  background: linear-gradient(to right, var(--accent-secondary), var(--accent-primary));
}

@media (max-width: 768px) {
  .products-header {
    padding: 4rem 1rem;
  }

  .header-content h1 {
    font-size: 2.5rem;
  }

  .products-content {
    padding: 2rem 1rem;
  }

  .product-grid {
    grid-template-columns: 1fr;
  }
}

/* Add specific styles for 1024-1130px viewport width */
@media (min-width: 1024px) and (max-width: 1130px) and (min-height: 1280px) {
  .products-header {
    padding: 3rem 0;
  }

  .header-content {
    padding: 0 1rem;
  }

  .header-content h1 {
    font-size: 2.5rem;
  }

  .products-content {
    padding: 2rem 1rem;
  }

  .content-wrapper {
    max-width: 100%;
  }

  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  .product-card {
    max-width: 100%;
  }

  .product-image {
    height: 180px;
  }

  .product-info {
    padding: 1.25rem;
  }

  .product-info h3 {
    font-size: 1.25rem;
  }

  .category-filters {
    gap: 0.4rem;
  }

  .filter-btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.9rem;
  }
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
</style> 