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
          <!-- Search Bar -->
          <div class="search-section">
            <div class="search-container">
              <div class="search-input-wrapper">
                <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                <input 
                  type="text" 
                  v-model="searchQuery" 
                  placeholder="Search products..." 
                  class="search-input"
                >
                <button 
                  v-if="searchQuery" 
                  @click="clearSearch" 
                  class="clear-search-btn"
                  type="button"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              <div v-if="searchQuery && filteredProducts.length > 0" class="search-results-count">
                {{ filteredProducts.length }} product{{ filteredProducts.length !== 1 ? 's' : '' }} found
              </div>
              <div v-if="searchQuery && filteredProducts.length === 0" class="no-search-results">
                No products found for "{{ searchQuery }}"
              </div>
            </div>
          </div>

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
                    <img v-if="product.imageUrl" :src="product.imageUrl" :alt="product.name">
                    <div v-else class="no-image">
                      <span>No image available</span>
                    </div>
                  </div>
                  <div class="product-info">
                    <h3>{{ product.name }}</h3>
                    <span class="price">£{{ formatPrice(product.price) }}</span>
                    <p v-if="product.category" class="category-tag">{{ product.category.name }}</p>
                    <p class="description">{{ product.description }}</p>

                    <div class="product-features" v-if="product.customizable">
                      <span class="feature-badge">Customizable</span>
                    </div>
                    
                    <!-- Customization Required Indicator -->
                    <div v-if="hasRequiredCustomization(product)" class="customization-notice">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                      <span>Customization required</span>
                    </div>
                  </div>
                </NuxtLink>
                
                <!-- Product Actions -->
                <div class="product-actions">
                  <button 
                    v-if="product.canBuy"
                    @click="addToOrder(product)" 
                    class="order-button"
                  >
                    {{ hasRequiredCustomization(product) ? 'Customize & Order' : 'Add to Order' }}
                  </button>
                  
                  <button 
                    v-if="product.canHire"
                    @click="addToEvent(product)" 
                    class="event-button"
                  >
                    {{ hasRequiredCustomization(product) ? 'Customize & Add to Event' : 'Add to Event' }}
                  </button>
                  
                  <button 
                    v-if="!product.canBuy && !product.canHire"
                    @click="contactForQuote(product)" 
                    class="contact-button"
                  >
                    Contact for Quote
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
      <div v-for="(toast, index) in toasts" :key="index" :class="['toast', `toast-${toast.type}`]">
        <span class="toast-icon">
          <svg v-if="toast.type === 'redirect'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12,6 12,12 16,14"></polyline>
          </svg>
          <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20,6 9,17 4,12"></polyline>
          </svg>
        </span>
        <span>{{ toast.message }}</span>
      </div>
    </div>

    <TheFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import { useProductsStore } from '../stores/products';
import { useAuthStore } from '../stores/auth';
import { useCartStore } from '../stores/cart';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const productsStore = useProductsStore();
const authStore = useAuthStore();
const cartStore = useCartStore();

const isAuthenticated = computed(() => authStore.isAuthenticated);
const selectedCategory = ref('');
const toasts = ref([]);
const searchQuery = ref('');

// Available product categories
const availableCategories = computed(() => {
  console.log('Available categories:', productsStore.categories);
  return productsStore.categories || [];
});

// Filtered products based on selected category and search query
const filteredProducts = computed(() => {
  let products = productsStore.products;
  
  // Filter by category if selected
  if (selectedCategory.value) {
    products = products.filter(product => 
      product.categoryId === selectedCategory.value || product.category === selectedCategory.value
    );
  }
  
  // Filter by search query if provided
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase().trim();
    products = products.filter(product => 
      product.name.toLowerCase().includes(query) ||
      (product.description && product.description.toLowerCase().includes(query)) ||
      (product.category && product.category.name && product.category.name.toLowerCase().includes(query))
    );
  }
  
  return products;
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

// Add product to order (for purchases)
const addToOrder = (product) => {
  // Check if product has custom options that need to be filled
  if (hasRequiredCustomization(product)) {
    // Redirect to product detail page for customization
    router.push(`/product/${product.id}`);
    showToast(`${product.name} requires customization - redirecting to product page`, 'redirect');
    return;
  }
  
  cartStore.addToCart(product);
  showToast(`${product.name} added to your order`);
  router.push('/basket');
};

// Add product to event (for hire)
const addToEvent = (product) => {
  // Check if product has custom options that need to be filled
  if (hasRequiredCustomization(product)) {
    // Redirect to product detail page for customization
    router.push(`/product/${product.id}`);
    showToast(`${product.name} requires customization - redirecting to product page`, 'redirect');
    return;
  }
  
  // Store in localStorage for event booking
  const currentEvent = JSON.parse(localStorage.getItem('currentEvent') || '{"items": []}');
  currentEvent.items.push({
    ...product,
    quantity: 1,
    selectedOptions: {}
  });
  localStorage.setItem('currentEvent', JSON.stringify(currentEvent));
  
  showToast(`${product.name} added to your event`);
  router.push('/booking');
};

// Check if product has required customization
const hasRequiredCustomization = (product) => {
  // Check if product has custom options
  if (product.options && product.options.length > 0) {
    // Check if any option is required
    return product.options.some(option => option.required);
  }
  
  return false;
};

// Contact for quote
const contactForQuote = (product) => {
  router.push({
    path: '/contact',
    query: { product: product.id, inquiry: 'quote' }
  });
};

// Display toast notification
const showToast = (message, type = 'success') => {
  const toast = { message, type };
  toasts.value.push(toast);
  setTimeout(() => {
    const index = toasts.value.indexOf(toast);
    if (index !== -1) {
      toasts.value.splice(index, 1);
    }
  }, type === 'redirect' ? 4000 : 3000); // Show redirect messages longer
};

// Clear search
const clearSearch = () => {
  searchQuery.value = '';
};

onMounted(async () => {
  // Load cart from localStorage
  cartStore.loadFromLocalStorage();
  
  // Check for search query in URL parameters
  if (route.query.search) {
    searchQuery.value = route.query.search;
  }
  
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

.search-section {
  margin-bottom: 2rem;
}

.search-container {
  max-width: 600px;
  margin: 0 auto;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background-color: var(--card-bg);
  border: 2px solid var(--border-color);
  border-radius: 50px;
  padding: 0.75rem 1.25rem;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.search-input-wrapper:focus-within {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(var(--accent-primary-rgb, 184, 134, 11), 0.1);
}

.search-icon {
  color: var(--text-secondary);
  margin-right: 0.75rem;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  border: none;
  background: none;
  outline: none;
  font-size: 1rem;
  color: var(--text-primary);
  padding: 0;
}

.search-input::placeholder {
  color: var(--text-secondary);
}

.clear-search-btn {
  background: none;
  border: none;
  padding: 0.25rem;
  margin-left: 0.5rem;
  cursor: pointer;
  color: var(--text-secondary);
  border-radius: 50%;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-search-btn:hover {
  background-color: var(--hover-bg);
  color: var(--text-primary);
}

.search-results-count {
  text-align: center;
  margin-top: 1rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.no-search-results {
  text-align: center;
  margin-top: 1rem;
  color: var(--text-secondary);
  font-style: italic;
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

.customization-notice {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.75rem;
  padding: 0.5rem;
  background-color: rgba(var(--accent-primary-rgb, 184, 134, 11), 0.1);
  border: 1px solid var(--accent-primary);
  border-radius: 6px;
  font-size: 0.8rem;
  color: var(--accent-primary);
  font-weight: 500;
}

.customization-notice svg {
  flex-shrink: 0;
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

.order-button, .event-button, .contact-button {
  width: 100%;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.order-button {
  background: linear-gradient(to right, var(--accent-primary), var(--accent-secondary));
  color: white;
}

.event-button {
  background-color: var(--bg-secondary);
  color: var(--accent-primary);
  border: 2px solid var(--accent-primary);
}

.contact-button {
  background-color: transparent;
  color: var(--text-primary);
  border: 2px solid var(--border-color);
}

.order-button:hover {
  background: linear-gradient(to right, var(--accent-secondary), var(--accent-primary));
  transform: translateY(-2px);
}

.event-button:hover {
  background-color: rgba(var(--accent-primary-rgb, 184, 134, 11), 0.1);
  transform: translateY(-2px);
}

.contact-button:hover {
  background-color: var(--hover-bg);
  border-color: var(--accent-primary);
  color: var(--accent-primary);
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

.toast-redirect {
  background-color: #3b82f6;
  animation: slideIn 0.3s ease, fadeOut 0.5s ease 3.5s forwards;
}

.toast-icon {
  margin-right: 10px;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
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