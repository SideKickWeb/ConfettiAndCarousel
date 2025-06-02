<template>
  <div class="page-wrapper">
    <TheNavbar />
    <main class="content product-detail-page">
      <!-- Breadcrumb Navigation -->
      <nav class="breadcrumb" v-if="product">
        <NuxtLink to="/" class="breadcrumb-link">Home</NuxtLink>
        <span class="breadcrumb-separator">/</span>
        <NuxtLink to="/products" class="breadcrumb-link">Products</NuxtLink>
        <span class="breadcrumb-separator">/</span>
        <span v-if="product.category" class="breadcrumb-item">{{ product.category.name }}</span>
        <span v-if="product.category" class="breadcrumb-separator">/</span>
        <span class="breadcrumb-current">{{ product.name }}</span>
      </nav>

      <!-- Product Search Bar -->
      <div class="product-search-section">
        <div class="search-container">
          <div class="search-input-wrapper">
            <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Search other products..." 
              class="search-input"
              @focus="showSearchResults = true"
              @blur="hideSearchResults"
            >
            <button 
              v-if="searchQuery" 
              @click="clearSearch" 
              class="clear-search-btn"
              type="button"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <!-- Search Results Dropdown -->
          <div v-if="showSearchResults && searchQuery && searchResults.length > 0" class="search-dropdown">
            <div 
              v-for="result in searchResults.slice(0, 5)" 
              :key="result.id" 
              class="search-result-item"
              @click="navigateToProduct(result.id)"
            >
              <div class="search-result-image">
                <img v-if="result.image" :src="result.image" :alt="result.name">
                <div v-else class="no-image-small">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21,15 16,10 5,21"/>
                  </svg>
                </div>
              </div>
              <div class="search-result-info">
                <h4>{{ result.name }}</h4>
                <p class="search-result-price">£{{ formatPrice(result.price) }}</p>
                <p v-if="result.category" class="search-result-category">{{ result.category.name }}</p>
              </div>
            </div>
            <div v-if="searchResults.length > 5" class="search-result-more">
              <NuxtLink :to="`/products?search=${encodeURIComponent(searchQuery)}`" class="view-all-link">
                View all {{ searchResults.length }} results
              </NuxtLink>
            </div>
          </div>
          
          <div v-if="showSearchResults && searchQuery && searchResults.length === 0" class="search-no-results">
            No products found for "{{ searchQuery }}"
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading product details...</p>
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="error-container">
        <h2>Product Not Found</h2>
        <p>{{ error }}</p>
        <NuxtLink to="/products" class="btn btn-primary">Back to Products</NuxtLink>
      </div>
      
      <!-- Product Details -->
      <div v-else-if="product" class="product-container">
        <!-- Main Product Section -->
        <div class="product-main">
          <!-- Product Images -->
          <div class="product-images">
            <div class="main-image">
              <img v-if="product.imageUrl" :src="product.imageUrl" :alt="product.name" class="product-image">
              <div v-else class="no-image">
                <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21,15 16,10 5,21"/>
            </svg>
                <span>No image available</span>
        </div>
            </div>
            <!-- Thumbnail gallery would go here for multiple images -->
          </div>
          
          <!-- Product Information -->
          <div class="product-info">
            <!-- Product Title & Category -->
            <div class="product-header">
              <div class="product-category-badge" v-if="product.category">
              {{ product.category.name }}
              </div>
              <h1 class="product-title">{{ product.name }}</h1>
              
              <!-- Availability Status -->
              <div class="availability-status">
                <span v-if="product.canBuy && product.canHire" class="status-badge status-both">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Available for Purchase & Hire
                </span>
                <span v-else-if="product.canBuy" class="status-badge status-buy">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"/>
                  </svg>
                  Available for Purchase
                </span>
                <span v-else-if="product.canHire" class="status-badge status-hire">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Available for Hire
                </span>
                <span v-else class="status-badge status-contact">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  Contact for Availability
                </span>
              </div>
            </div>
            
            <!-- Pricing -->
            <div class="pricing-section">
              <div v-if="product.hasRangePrice && product.minPrice && product.maxPrice" class="price-display">
                <span class="price-range">
                  £{{ formatPrice(product.minPrice) }} - £{{ formatPrice(product.maxPrice) }}
                </span>
                <span class="price-label">Price Range</span>
              </div>
              <div v-else-if="product.hasUnitPrice && product.unitPrice" class="price-display">
                <span class="price-main">£{{ formatPrice(product.unitPrice) }}</span>
                <span class="price-label">per {{ product.unitType }}</span>
              </div>
              <div v-else class="price-display">
                <span class="price-main">£{{ formatPrice(product.price) }}</span>
                <span v-if="product.minQuantity && product.minQuantity > 1" class="price-label">
                  Minimum {{ product.minQuantity }} {{ product.unitType || 'units' }}
                </span>
              </div>
            </div>

            <!-- Product Description -->
            <div class="product-description" v-if="product.description">
              <p>{{ product.description }}</p>
            </div>
            
            <!-- Product Options -->
            <div v-if="product.options && product.options.length > 0" class="product-options">
              <div v-for="option in product.options" :key="option.id" class="option-group">
                <label class="option-label">
                  {{ option.name }}
                  <span v-if="option.required" class="required">*</span>
                </label>
                
                <!-- Color picker for color options -->
                <div v-if="isColorOption(option)" class="color-picker-group">
                  <div class="color-swatches">
                    <label 
                      v-for="value in option.values" 
                      :key="value.id" 
                      class="color-swatch-option"
                      :class="{ 'selected': selectedOptions[option.id] === value.id }"
                    >
                      <input 
                        type="radio" 
                        :name="option.id" 
                        :value="value.id"
                        v-model="selectedOptions[option.id]"
                        :required="option.required"
                        class="color-swatch-input"
                      >
                      <div 
                        class="color-swatch" 
                        :style="{ backgroundColor: getColorFromValue(value.value) }"
                        :title="value.label || value.value"
                      ></div>
                      <span class="color-label">{{ value.label || value.value }}</span>
                      <span v-if="value.priceAdjustment !== 0" class="price-adjustment">
                        ({{ value.priceAdjustment > 0 ? '+' : '' }}£{{ formatPrice(Math.abs(value.priceAdjustment)) }})
                      </span>
                    </label>
                  </div>
                </div>
                
                <!-- Select dropdown for non-color options with multiple values -->
                <select 
                  v-else-if="option.type === 'select' && option.values && option.values.length > 1 && !isColorOption(option)"
                  v-model="selectedOptions[option.id]"
                  class="option-select"
                  :required="option.required"
                >
                  <option value="">Choose {{ option.name }}</option>
                  <option 
                    v-for="value in option.values" 
                    :key="value.id" 
                    :value="value.id"
                  >
                    {{ value.label }}
                    <span v-if="value.priceAdjustment !== 0">
                      ({{ value.priceAdjustment > 0 ? '+' : '' }}£{{ formatPrice(Math.abs(value.priceAdjustment)) }})
                    </span>
                  </option>
                </select>
                
                <!-- Radio buttons for non-color options with few values -->
                <div v-else-if="(option.type === 'radio' || (option.values && option.values.length > 0 && option.values.length <= 4)) && !isColorOption(option)" class="option-radio-group">
                  <label 
                    v-for="value in option.values" 
                    :key="value.id" 
                    class="radio-option"
                  >
                    <input 
                      type="radio" 
                      :name="option.id" 
                      :value="value.id"
                      v-model="selectedOptions[option.id]"
                      :required="option.required"
                    >
                    <span class="radio-label">
                      {{ value.label }}
                      <span v-if="value.priceAdjustment !== 0" class="price-adjustment">
                        ({{ value.priceAdjustment > 0 ? '+' : '' }}£{{ formatPrice(Math.abs(value.priceAdjustment)) }})
                      </span>
                    </span>
                  </label>
                </div>
                
                <!-- Text input for text type options or options with no values -->
                <div v-else>
                  <input 
                    type="text"
                    v-model="selectedOptions[option.id]"
                    :placeholder="'Enter ' + option.name"
                    :required="option.required"
                    class="option-text-input"
                  >
                </div>
              </div>
            </div>

            <!-- Quantity & Add to Cart Section -->
            <div class="purchase-section">
            <div class="quantity-selector">
                <label class="quantity-label">Quantity:</label>
              <div class="quantity-controls">
                  <button type="button" @click="decrementQuantity" class="quantity-btn" :disabled="quantity <= (product.minQuantity || 1)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </button>
                  <span class="quantity-display">{{ quantity }}</span>
                  <button type="button" @click="incrementQuantity" class="quantity-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </button>
              </div>
                <span v-if="product.minQuantity && product.minQuantity > 1" class="quantity-note">
                  Minimum order: {{ product.minQuantity }}
                </span>
            </div>
            
              <!-- Total Price -->
              <div class="total-price">
                <span class="total-label">Total:</span>
                <span class="total-amount">£{{ formatPrice(calculateTotalPrice()) }}</span>
              </div>

              <!-- Action Buttons -->
              <div class="action-buttons">
                <button 
                  v-if="product.canBuy"
                  @click="addToOrder" 
                  class="btn btn-primary btn-large"
                  :disabled="!isValidSelection()"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"></path>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <path d="M16 10a4 4 0 01-8 0"></path>
                  </svg>
                  Add to Order
                </button>
                
                <button 
                  v-if="product.canHire" 
                  @click="addToEvent" 
                  class="btn btn-secondary btn-large"
                  :disabled="!isValidSelection()"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  Add to Event
                </button>
                
                <button 
                  v-if="!product.canBuy && !product.canHire"
                  @click="contactForQuote" 
                  class="btn btn-outline btn-large"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  Contact for Quote
                </button>
              </div>

              <!-- Additional Info -->
              <div class="additional-info">
                <div class="info-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span>Professional event styling</span>
                </div>
                <div class="info-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                  </svg>
                  <span>All orders reviewed personally</span>
                </div>
                <div class="info-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  <span>Collection from Cannock, Staffordshire</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Product Details Tabs -->
        <div class="product-tabs">
          <div class="tab-navigation">
            <button 
              v-for="tab in tabs" 
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="['tab-button', { active: activeTab === tab.id }]"
            >
              {{ tab.label }}
            </button>
          </div>
          
          <div class="tab-content">
            <!-- Description Tab -->
            <div v-if="activeTab === 'description'" class="tab-panel">
              <h3>Product Description</h3>
              <p>{{ product.description || 'No detailed description available.' }}</p>
              
              <h4>Key Features</h4>
              <ul class="feature-list">
                <li v-if="product.canBuy">Available for purchase</li>
                <li v-if="product.canHire">Available for hire</li>
                <li v-if="product.unitType">Sold per {{ product.unitType }}</li>
                <li v-if="product.minQuantity && product.minQuantity > 1">Minimum order: {{ product.minQuantity }}</li>
                <li>Professional quality materials</li>
                <li>Perfect for events and celebrations</li>
              </ul>
            </div>
            
            <!-- Specifications Tab -->
            <div v-if="activeTab === 'specifications'" class="tab-panel">
              <h3>Product Specifications</h3>
              <div class="specs-grid">
                <div class="spec-item">
                  <span class="spec-label">Category:</span>
                  <span class="spec-value">{{ product.category.name }}</span>
                </div>
                <div class="spec-item">
                  <span class="spec-label">Availability:</span>
                  <span class="spec-value">
                    <span v-if="product.canBuy && product.canHire">Purchase or Hire</span>
                    <span v-else-if="product.canBuy">Purchase Only</span>
                    <span v-else-if="product.canHire">Hire Only</span>
                    <span v-else>Contact for Details</span>
                  </span>
                </div>
                <div v-if="product.unitType" class="spec-item">
                  <span class="spec-label">Unit Type:</span>
                  <span class="spec-value">{{ product.unitType }}</span>
                </div>
                <div v-if="product.minQuantity && product.minQuantity > 1" class="spec-item">
                  <span class="spec-label">Minimum Order:</span>
                  <span class="spec-value">{{ product.minQuantity }} {{ product.unitType || 'units' }}</span>
                </div>
                <div class="spec-item">
                  <span class="spec-label">Product ID:</span>
                  <span class="spec-value">{{ product.id.slice(-8).toUpperCase() }}</span>
                </div>
              </div>
            </div>
            
            <!-- Delivery Tab -->
            <div v-if="activeTab === 'delivery'" class="tab-panel">
              <h3>Collection & Services</h3>
              <div class="delivery-info">
                <div class="delivery-option">
                  <h4>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"></path>
                      <line x1="3" y1="6" x2="21" y2="6"></line>
                      <path d="M16 10a4 4 0 01-8 0"></path>
                    </svg>
                    Collection Service (Purchases)
                  </h4>
                  <p><strong>For items you're purchasing:</strong> All purchased products are available for collection from our base in Cannock, Staffordshire. After your order is reviewed and confirmed, we'll arrange a convenient collection time. You own these items and take them with you.</p>
                </div>
                
                <div class="delivery-option">
                  <h4>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    Setup Service (Event Hire)
                  </h4>
                  <p><strong>For items you're hiring for events:</strong> Our experienced staff will attend your venue to professionally setup, maintain throughout your event, and pack up all hired items. This full-service approach ensures everything looks perfect and you can focus on enjoying your event. Available within reasonable distance of Cannock, Staffordshire.</p>
                </div>
                
                <div class="delivery-option">
                  <h4>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    </svg>
                    Order Review Process
                  </h4>
                  <p><strong>All orders and bookings:</strong> Every request is personally reviewed to ensure we can deliver exactly what you need. We may suggest adjustments to enhance your event or ensure the best outcome, which could affect pricing. You'll be contacted to confirm all details before proceeding.</p>
                </div>
              </div>
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
                <img v-if="relatedProduct.imageUrl" :src="relatedProduct.imageUrl" :alt="relatedProduct.name">
                <div v-else class="no-image-small">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21,15 16,10 5,21"/>
                  </svg>
                </div>
              </div>
              <div class="related-product-info">
                <h4>{{ relatedProduct.name }}</h4>
                <div class="related-product-price">£{{ formatPrice(relatedProduct.price) }}</div>
                <div class="related-product-badges">
                  <span v-if="relatedProduct.canBuy" class="mini-badge buy">Buy</span>
                  <span v-if="relatedProduct.canHire" class="mini-badge hire">Hire</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Toast Notifications -->
    <div class="toast-container">
      <div v-for="(toast, index) in toasts" :key="index" class="toast">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <span>{{ toast.message }}</span>
      </div>
    </div>
    
    <TheFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive, watch } from 'vue';
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
const selectedOptions = reactive({});
const activeTab = ref('description');
const searchQuery = ref('');
const showSearchResults = ref(false);
const searchResults = ref([]);

// Tabs configuration
const tabs = [
  { id: 'description', label: 'Description' },
  { id: 'specifications', label: 'Specifications' },
  { id: 'delivery', label: 'Collection & Services' }
];

// Check if user is authenticated
const isAuthenticated = computed(() => authStore.isAuthenticated);

// Calculate total price including options
const calculateTotalPrice = () => {
  if (!product.value) return 0;
  
  let basePrice = product.value.hasUnitPrice ? product.value.unitPrice : product.value.price;
  let optionsPrice = 0;
  
  // Add price adjustments from selected options
  if (product.value.options) {
    product.value.options.forEach(option => {
      const selectedValueId = selectedOptions[option.id];
      if (selectedValueId) {
        const selectedValue = option.values.find(v => v.id === selectedValueId);
        if (selectedValue && selectedValue.priceAdjustment) {
          optionsPrice += selectedValue.priceAdjustment;
        }
      }
    });
  }
  
  return (basePrice + optionsPrice) * quantity.value;
};

// Check if all required options are selected
const isValidSelection = () => {
  if (!product.value || !product.value.options) return true;
  
  return product.value.options.every(option => {
    if (option.required) {
      const value = selectedOptions[option.id];
      const isValid = value && value !== '';
      return isValid;
    }
    return true;
  });
};

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
    
    // Set minimum quantity if specified
    if (product.value.minQuantity && product.value.minQuantity > 1) {
      quantity.value = product.value.minQuantity;
    }
    
    // Initialize selected options
    if (product.value.options) {
      product.value.options.forEach(option => {
        selectedOptions[option.id] = '';
      });
    }
    
    // Fetch related products after we have the main product
    await fetchRelatedProducts();
  } catch (err) {
    console.error('Error fetching product:', err);
    error.value = 'Failed to load product details';
  } finally {
    loading.value = false;
  }
};

// Add to event (for hire items)
const addToEvent = () => {
  if (!isValidSelection()) {
    showToast('Please select all required options');
    return;
  }
  
  if (product.value) {
    const eventItem = {
      ...product.value,
      selectedOptions: { ...selectedOptions },
      totalPrice: calculateTotalPrice(),
      quantity: quantity.value
    };
    
    // Store in localStorage for now - we'll create a proper event store later
    const currentEvent = JSON.parse(localStorage.getItem('currentEvent') || '{"items": []}');
    currentEvent.items.push(eventItem);
    localStorage.setItem('currentEvent', JSON.stringify(currentEvent));
    
    showToast(`${product.value.name} added to your event`);
    
    // Navigate to event page
    router.push('/booking');
  }
};

// Add to order (for purchase items)
const addToOrder = () => {
  if (!isValidSelection()) {
    showToast('Please select all required options');
    return;
  }
  
  if (product.value) {
    // Convert selectedOptions to customOptions format for cart
    const customOptions = Object.entries(selectedOptions)
      .filter(([optionId, value]) => value && value !== '')
      .map(([optionId, value]) => {
        const option = product.value.options.find(opt => opt.id === optionId);
        if (!option) return null;
        
        if (option.type === 'text') {
          return {
            optionId,
            optionName: option.name,
            value: value,
            label: value
          };
        } else {
          const selectedValue = option.values.find(v => v.id === value);
          return selectedValue ? {
            optionId,
            optionName: option.name,
            value: selectedValue.value,
            label: selectedValue.label || selectedValue.value,
            priceAdjustment: selectedValue.priceAdjustment || 0
          } : null;
        }
      })
      .filter(option => option !== null);
    
    // Use existing cart store for orders
    cartStore.addToCart(product.value, quantity.value, customOptions);
    showToast(`${product.value.name} added to your order`);
    
    // Navigate to order page (basket)
    router.push('/basket');
  }
};

// Contact for quote
const contactForQuote = () => {
  router.push({
    path: '/contact',
    query: { product: product.value.id, inquiry: 'quote' }
  });
};

// Navigate to product
const navigateToProduct = (productId) => {
  router.push(`/product/${productId}`);
};

// Increment quantity
const incrementQuantity = () => {
  quantity.value++;
};

// Decrement quantity
const decrementQuantity = () => {
  const minQty = product.value?.minQuantity || 1;
  if (quantity.value > minQty) {
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

// Search functionality
const searchProducts = async () => {
  try {
    const response = await fetch(`/api/products?search=${encodeURIComponent(searchQuery.value)}`);
    if (!response.ok) {
      throw new Error('Failed to search products');
    }
    const data = await response.json();
    searchResults.value = data.data || data;
  } catch (err) {
    console.error('Error searching products:', err);
    searchResults.value = [];
  }
};

const clearSearch = () => {
  searchQuery.value = '';
  showSearchResults.value = false;
  searchResults.value = [];
};

const hideSearchResults = () => {
  setTimeout(() => {
    showSearchResults.value = false;
  }, 200);
};

// Add a watcher to trigger search when the user types in the search input
watch(searchQuery, () => {
  if (searchQuery.value) {
    searchProducts();
  }
});

// Helper function to check if an option is a color option
const isColorOption = (option) => {
  const colorKeywords = ['color', 'colour'];
  return colorKeywords.some(keyword => option.name.toLowerCase().includes(keyword));
};

// Helper function to get a color from a value
const getColorFromValue = (value) => {
  // Convert color names to hex values
  const colorMap = {
    'red': '#ef4444',
    'blue': '#3b82f6',
    'yellow': '#eab308',
    'green': '#22c55e',
    'purple': '#a855f7',
    'pink': '#ec4899',
    'orange': '#f97316',
    'black': '#000000',
    'white': '#ffffff',
    'gray': '#6b7280',
    'grey': '#6b7280',
    'brown': '#92400e',
    'navy': '#1e3a8a',
    'teal': '#14b8a6',
    'lime': '#84cc16',
    'indigo': '#6366f1',
    'cyan': '#06b6d4',
    'rose': '#f43f5e',
    'amber': '#f59e0b',
    'emerald': '#10b981',
    'slate': '#475569',
    'zinc': '#71717a',
    'neutral': '#737373',
    'stone': '#78716c'
  };
  
  const normalizedValue = value.toLowerCase().trim();
  
  // Check if it's already a hex color
  if (normalizedValue.startsWith('#')) {
    return normalizedValue;
  }
  
  // Check if it's a CSS color name
  if (colorMap[normalizedValue]) {
    return colorMap[normalizedValue];
  }
  
  // Default to a neutral color if not found
  return '#6b7280';
};
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
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 140px 1rem 2rem;
}

/* Breadcrumb Navigation */
.breadcrumb {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.breadcrumb-link {
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 0.2s ease;
}

.breadcrumb-link:hover {
  color: var(--accent-primary);
}

.breadcrumb-separator {
  margin: 0 0.5rem;
  color: var(--text-secondary);
}

.breadcrumb-current {
  color: var(--text-primary);
  font-weight: 500;
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
  to { transform: rotate(360deg); }
}

/* Error state */
.error-container {
  background-color: var(--card-bg);
  border-radius: 12px;
  padding: 3rem;
  margin: 3rem 0;
  text-align: center;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 20px var(--shadow-color);
}

.error-container h2 {
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.error-container p {
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

/* Product container */
.product-container {
  margin-bottom: 4rem;
}

/* Main product section */
.product-main {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  margin-bottom: 4rem;
}

@media (min-width: 768px) {
  .product-main {
    grid-template-columns: 1fr 1fr;
  }
}

@media (min-width: 1024px) {
  .product-main {
    grid-template-columns: 1.2fr 0.8fr;
  }
}

/* Product Images */
.product-images {
  position: sticky;
  top: 140px;
  height: fit-content;
}

.main-image {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 20px var(--shadow-color);
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-image:hover {
  transform: scale(1.02);
}

.no-image {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: var(--hover-bg);
  color: var(--text-secondary);
  gap: 1rem;
}

.no-image span {
  font-size: 0.9rem;
}

/* Product Info */
.product-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Product Header */
.product-header {
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 1.5rem;
}

.product-category-badge {
  display: inline-block;
  background-color: var(--accent-primary);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 1rem;
}

.product-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 1rem;
  line-height: 1.2;
}

@media (max-width: 768px) {
  .product-title {
    font-size: 1.5rem;
  }
}

/* Availability Status */
.availability-status {
  margin-top: 1rem;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
}

.status-both {
  background-color: #10b981;
  color: white;
}

.status-buy {
  background-color: #3b82f6;
  color: white;
}

.status-hire {
  background-color: #8b5cf6;
  color: white;
}

.status-contact {
  background-color: #6b7280;
  color: white;
}

/* Pricing Section */
.pricing-section {
  padding: 1.5rem 0;
  border-bottom: 1px solid var(--border-color);
}

.price-display {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.price-main, .price-range {
  font-size: 2rem;
  font-weight: 700;
  color: var(--accent-primary);
}

.price-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-weight: 500;
}

/* Product Description */
.product-description {
  padding: 1rem 0;
  border-bottom: 1px solid var(--border-color);
}

.product-description p {
  color: var(--text-primary);
  line-height: 1.6;
  font-size: 1rem;
}

/* Product Options */
.product-options {
  padding: 1rem 0;
  border-bottom: 1px solid var(--border-color);
}

.option-group {
  margin-bottom: 1.5rem;
}

.option-label {
  display: block;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.required {
  color: #ef4444;
  margin-left: 0.25rem;
}

.option-select, .option-text {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--card-bg);
  color: var(--text-primary);
  font-size: 1rem;
  transition: border-color 0.2s ease;
}

.option-select:focus, .option-text:focus {
  outline: none;
  border-color: var(--accent-primary);
}

.option-text-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--card-bg);
  color: var(--text-primary);
  font-size: 1rem;
  font-family: inherit;
  outline: none;
  box-sizing: border-box;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  transition: border-color 0.2s ease;
}

.option-text-input:focus {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(var(--accent-primary-rgb, 184, 134, 11), 0.1);
}

.option-radio-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.75rem;
}

.radio-option {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0.75rem;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--card-bg);
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.radio-option:hover {
  border-color: var(--accent-primary);
  background-color: var(--hover-bg);
}

.radio-option:has(input:checked) {
  border-color: var(--accent-primary);
  background-color: rgba(var(--accent-primary-rgb, 184, 134, 11), 0.1);
}

.radio-option input[type="radio"] {
  margin-right: 0.5rem;
  accent-color: var(--accent-primary);
}

.radio-label {
  flex: 1;
  color: var(--text-primary);
}

.price-adjustment {
  color: var(--accent-primary);
  font-weight: 600;
  font-size: 0.8rem;
}

/* Debug section styles */
.option-debug {
  background-color: #fffbeb;
  border: 2px solid #f59e0b;
  border-radius: 8px;
  padding: 1rem;
  margin: 0.5rem 0;
}

.option-debug p {
  margin: 0.25rem 0;
  font-size: 0.8rem;
  color: #92400e;
}

.option-debug strong {
  color: #f59e0b;
}

/* Purchase Section */
.purchase-section {
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px var(--shadow-color);
  position: sticky;
  top: 140px;
}

/* Quantity Selector */
.quantity-selector {
  margin-bottom: 1.5rem;
}

.quantity-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.quantity-controls {
  display: flex;
  align-items: center;
  width: fit-content;
  border: 2px solid var(--border-color);
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

.quantity-btn {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-secondary);
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
  color: var(--text-primary);
}

.quantity-btn:hover:not(:disabled) {
  background-color: var(--hover-bg);
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-display {
  width: 60px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-left: 2px solid var(--border-color);
  border-right: 2px solid var(--border-color);
  font-weight: 600;
  color: var(--text-primary);
  background-color: var(--card-bg);
}

.quantity-note {
  font-size: 0.8rem;
  color: var(--text-secondary);
  font-style: italic;
}

/* Total Price */
.total-price {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: var(--bg-secondary);
  border-radius: 8px;
  margin-bottom: 1.5rem;
  border: 1px solid var(--border-color);
}

.total-label {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.total-amount {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--accent-primary);
}

/* Action Buttons */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

/* Button Styles */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
  text-align: center;
}

.btn-large {
  padding: 1rem 1.5rem;
  font-size: 1rem;
}

.btn-primary {
  background-color: var(--accent-primary);
  color: white;
  border-color: var(--accent-primary);
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--accent-secondary);
  border-color: var(--accent-secondary);
  transform: translateY(-1px);
}

.btn-secondary {
  background-color: var(--bg-secondary);
  color: var(--accent-primary);
  border-color: var(--accent-primary);
}

.btn-secondary:hover:not(:disabled) {
  background-color: rgba(var(--accent-primary-rgb, 184, 134, 11), 0.1);
  transform: translateY(-1px);
}

.btn-outline {
  background-color: transparent;
  color: var(--text-primary);
  border-color: var(--border-color);
}

.btn-outline:hover {
  background-color: var(--hover-bg);
  border-color: var(--accent-primary);
  color: var(--accent-primary);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* Additional Info */
.additional-info {
  border-top: 1px solid var(--border-color);
  padding-top: 1rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.info-item svg {
  color: var(--accent-primary);
  flex-shrink: 0;
}

/* Product Tabs */
.product-tabs {
  background-color: var(--card-bg);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 20px var(--shadow-color);
  margin-bottom: 4rem;
  overflow: hidden;
}

.tab-navigation {
  display: flex;
  border-bottom: 1px solid var(--border-color);
  background-color: var(--bg-secondary);
}

.tab-button {
  flex: 1;
  padding: 1rem 1.5rem;
  background: none;
  border: none;
  font-weight: 600;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 3px solid transparent;
}

.tab-button:hover {
  color: var(--text-primary);
  background-color: var(--hover-bg);
}

.tab-button.active {
  color: var(--accent-primary);
  border-bottom-color: var(--accent-primary);
  background-color: var(--card-bg);
}

.tab-content {
  padding: 2rem;
}

.tab-panel h3 {
  color: var(--accent-primary);
  margin-bottom: 1rem;
  font-size: 1.3rem;
}

.tab-panel h4 {
  color: var(--text-primary);
  margin: 1.5rem 0 0.75rem;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tab-panel p {
  color: var(--text-primary);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-list li {
  padding: 0.5rem 0;
  color: var(--text-primary);
  position: relative;
  padding-left: 1.5rem;
}

.feature-list li::before {
  content: "✓";
  position: absolute;
  left: 0;
  color: var(--accent-primary);
  font-weight: bold;
}

/* Specifications Grid */
.specs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.spec-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: var(--bg-secondary);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.spec-label {
  font-weight: 600;
  color: var(--text-secondary);
}

.spec-value {
  font-weight: 500;
  color: var(--text-primary);
  text-align: right;
}

/* Delivery Info */
.delivery-info {
  display: grid;
  gap: 2rem;
}

@media (min-width: 768px) {
  .delivery-info {
    grid-template-columns: 1fr 1fr;
  }
}

.delivery-option {
  padding: 1.5rem;
  background-color: var(--bg-secondary);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.delivery-option h4 {
  margin-bottom: 1rem;
}

.delivery-option p {
  margin: 0;
}

/* Related Products */
.related-products {
  margin-top: 4rem;
}

.related-products h2 {
  font-size: 1.8rem;
  color: var(--text-primary);
  margin-bottom: 2rem;
  text-align: center;
}

.related-products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
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
  box-shadow: 0 8px 30px var(--shadow-color);
}

.related-product-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background-color: var(--hover-bg);
  position: relative;
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
  color: var(--text-secondary);
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
  margin-bottom: 0.75rem;
}

.related-product-badges {
  display: flex;
  gap: 0.5rem;
}

.mini-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.mini-badge.buy {
  background-color: #3b82f6;
  color: white;
}

.mini-badge.hire {
  background-color: #8b5cf6;
  color: white;
}

/* Toast Notifications */
.toast-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
}

.toast {
  background-color: var(--accent-primary);
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  margin-top: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  animation: slideIn 0.3s ease, fadeOut 0.5s ease 2.5s forwards;
  max-width: 350px;
}

@keyframes slideIn {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; visibility: hidden; }
}

/* Responsive Design */
@media (max-width: 768px) {
  .content {
    padding: 120px 1rem 2rem;
  }
  
  .product-main {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .product-images {
    position: static;
  }
  
  .purchase-section {
    position: static;
  }
  
  .tab-navigation {
    flex-direction: column;
  }
  
  .tab-button {
    text-align: left;
  }
  
  .specs-grid {
    grid-template-columns: 1fr;
  }
  
  .delivery-info {
    grid-template-columns: 1fr;
  }
  
  .option-radio-group {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .breadcrumb {
    font-size: 0.8rem;
  }
  
  .product-title {
    font-size: 1.3rem;
  }
  
  .price-main, .price-range {
    font-size: 1.5rem;
  }
  
  .related-products-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}

/* Product Search Bar */
.product-search-section {
  margin-bottom: 2rem;
}

.search-container {
  position: relative;
  max-width: 500px;
  margin: 0 auto;
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  background-color: var(--card-bg);
  border: 2px solid var(--border-color);
  border-radius: 25px;
  padding: 0.75rem 1rem;
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
  outline: none;
  background: none;
  color: var(--text-primary);
  font-size: 0.95rem;
}

.search-input::placeholder {
  color: var(--text-secondary);
}

.clear-search-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-secondary);
  padding: 0.25rem;
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

.search-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  box-shadow: 0 8px 30px var(--shadow-color);
  z-index: 999;
  max-height: 400px;
  overflow-y: auto;
}

.search-result-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  border-bottom: 1px solid var(--border-color);
}

.search-result-item:last-child {
  border-bottom: none;
}

.search-result-item:hover {
  background-color: var(--hover-bg);
}

.search-result-image {
  width: 60px;
  height: 60px;
  overflow: hidden;
  border-radius: 8px;
  background-color: var(--hover-bg);
  flex-shrink: 0;
}

.search-result-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image-small {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
}

.search-result-info {
  flex: 1;
  min-width: 0;
}

.search-result-info h4 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.search-result-price {
  margin: 0 0 0.25rem 0;
  font-weight: 600;
  color: var(--accent-primary);
  font-size: 0.9rem;
}

.search-result-category {
  margin: 0;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.search-result-more {
  padding: 1rem;
  text-align: center;
  border-top: 1px solid var(--border-color);
}

.view-all-link {
  color: var(--accent-primary);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
}

.view-all-link:hover {
  text-decoration: underline;
}

.search-no-results {
  padding: 2rem;
  text-align: center;
  color: var(--text-secondary);
  font-style: italic;
}

/* Color Picker Styles */
.color-picker-group {
  margin-top: 0.5rem;
}

.color-swatches {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}

.color-swatch-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
  padding: 0.5rem;
  border-radius: 8px;
  border: 2px solid transparent;
  background-color: var(--card-bg);
}

.color-swatch-option:hover {
  background-color: var(--hover-bg);
  transform: translateY(-2px);
}

.color-swatch-option.selected {
  border-color: var(--accent-primary);
  background-color: rgba(var(--accent-primary-rgb, 184, 134, 11), 0.1);
  box-shadow: 0 0 0 2px rgba(var(--accent-primary-rgb, 184, 134, 11), 0.2);
}

.color-swatch-input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
  width: 0;
  height: 0;
}

.color-swatch {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 3px solid #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.1);
  margin-bottom: 0.5rem;
  transition: all 0.2s ease;
  position: relative;
}

.color-swatch-option:hover .color-swatch {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.1);
}

.color-swatch-option.selected .color-swatch {
  transform: scale(1.15);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25), 0 0 0 3px var(--accent-primary);
}

.color-swatch-option.selected .color-swatch::after {
  content: '✓';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-weight: bold;
  font-size: 14px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.color-label {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--text-primary);
  text-align: center;
  margin-bottom: 0.25rem;
  text-transform: capitalize;
}

.color-swatch-option .price-adjustment {
  font-size: 0.7rem;
  color: var(--accent-primary);
  font-weight: 600;
  text-align: center;
}

/* Handle white color visibility */
.color-swatch[style*="rgb(255, 255, 255)"],
.color-swatch[style*="#ffffff"],
.color-swatch[style*="#fff"] {
  border-color: #e5e7eb;
}

/* Responsive adjustments for color picker */
@media (max-width: 768px) {
  .color-swatches {
    gap: 0.75rem;
  }
  
  .color-swatch {
    width: 35px;
    height: 35px;
  }
  
  .color-label {
    font-size: 0.75rem;
  }
  
  .color-swatch-option .price-adjustment {
    font-size: 0.65rem;
  }
}

@media (max-width: 480px) {
  .color-swatches {
    gap: 0.5rem;
    justify-content: center;
  }
  
  .color-swatch {
    width: 30px;
    height: 30px;
  }
  
  .color-swatch-option {
    padding: 0.25rem;
  }
}
</style> 