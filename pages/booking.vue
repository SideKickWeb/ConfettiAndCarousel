<template>
  <div class="page-wrapper">
    <TheNavbar />
    
    <div class="content">
      <div class="booking-header">
        <div class="header-content">
          <h1>Book Your Event</h1>
          <p>Tell us about your event, and we'll make it special!</p>
        </div>
      </div>

      <div class="booking-content">
        <div v-if="submitted" class="success-message">
          <p>Thank you for your booking request! We'll contact you soon to confirm the details.</p>
          <button @click="resetForm" class="primary-button">
            Book Another Event
          </button>
        </div>

        <div v-else-if="!authStore.isAuthenticated" class="info-message">
          <p>Please <NuxtLink to="/login" class="link">sign in</NuxtLink> or <NuxtLink to="/register" class="link">create an account</NuxtLink> to book an event.</p>
        </div>

        <form v-else @submit.prevent="submitBooking" class="booking-form">
          <!-- Event Details Section -->
          <div class="form-section">
            <h2>Event Details</h2>
            <div class="form-grid">
              <div class="form-group">
                <label for="eventType">Event Type</label>
                <select id="eventType" v-model="booking.eventType" required>
                  <option value="" disabled>Select event type</option>
                  <option value="birthday">Birthday Party</option>
                  <option value="wedding">Wedding</option>
                  <option value="corporate">Corporate Event</option>
                  <option value="babyShower">Baby Shower</option>
                  <option value="graduation">Graduation</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div class="form-group">
                <label for="eventDate">Event Date</label>
                <input type="date" id="eventDate" v-model="booking.eventDate" :min="minDate" required>
              </div>

              <div class="form-group">
                <label for="guests">Expected Number of Guests</label>
                <input type="number" id="guests" v-model="booking.guests" min="1" required>
              </div>

              <div class="form-group">
                <label for="description">Event Description</label>
                <textarea id="description" v-model="booking.description" rows="3" placeholder="Tell us more about your event..."></textarea>
              </div>
            </div>
          </div>

          <!-- Products Section -->
          <div class="form-section">
            <h2>Select Products</h2>
            
            <!-- Loading State -->
            <div v-if="productsStore.loading" class="loading-container">
              <span class="loading-spinner"></span>
              <p>Loading products...</p>
            </div>
            
            <!-- Error State -->
            <div v-else-if="productsStore.error" class="error-message">
              <p>{{ productsStore.error }}</p>
              <button @click="productsStore.clearError" class="text-link">Try Again</button>
            </div>
            
            <!-- Categories -->
            <div v-else class="product-selection">
              <div class="category-filters">
                <button 
                  type="button"
                  @click="currentCategory = null"
                  :class="['filter-btn', currentCategory === null ? 'active' : '']"
                >
                  All Products
                </button>
                <button 
                  v-for="category in productsStore.categories" 
                  :key="category.value" 
                  type="button"
                  @click="currentCategory = category.value"
                  :class="['filter-btn', currentCategory === category.value ? 'active' : '']"
                >
                  {{ category.label || 'Category' }}
                </button>
              </div>
              
              <!-- Product List -->
              <div class="product-grid">
                <div 
                  v-for="product in filteredProducts" 
                  :key="product.id" 
                  class="product-card"
                >
                  <div class="product-image">
                    <img 
                      v-if="product.image" 
                      :src="product.image" 
                      :alt="product.name"
                    >
                    <div v-else class="no-image">
                      <span>No image available</span>
                    </div>
                  </div>
                  
                  <div class="product-info">
                    <div class="product-header">
                      <h3>{{ product.name }}</h3>
                      <span class="price">£{{ formatPrice(product.price) }}</span>
                    </div>
                    <p class="description">{{ product.description }}</p>
                    
                    <!-- Add to Booking Button -->
                    <div class="product-actions">
                      <button 
                        type="button"
                        @click="selectProduct(product)"
                        class="book-button"
                      >
                        Add to Booking
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Selected Products -->
            <div v-if="selectedProducts.length > 0" class="selected-products" ref="selectedProductsSection">
              <h3>Your Selected Products <span class="product-count">{{ selectedProducts.length }}</span></h3>
              <div class="selected-products-list">
                <div v-for="(item, index) in selectedProducts" :key="index" 
                  class="selected-product-item"
                  :class="{ 'highlight-animation': item.isNewlyAdded }">
                  <div class="product-details">
                    <h4>{{ item.product.name }}</h4>
                    <div class="product-options">
                      <p v-if="item.variant">Variant: {{ item.variant.name }}</p>
                      <div v-if="item.customValues && item.customValues.length">
                        <p class="options-title">Customizations:</p>
                        <ul class="options-list">
                          <li v-for="custom in item.customValues" :key="custom.optionId">
                            {{ custom.optionName }}: {{ custom.value }}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div class="product-controls">
                    <div class="quantity-control">
                      <button 
                        type="button"
                        @click="decrementQuantity(index)"
                        class="quantity-btn"
                      >-</button>
                      <span class="quantity">{{ item.quantity }}</span>
                      <button 
                        type="button"
                        @click="incrementQuantity(index)"
                        class="quantity-btn"
                      >+</button>
                    </div>
                    
                    <div class="price-controls">
                      <div class="total-price">£{{ (item.quantity * item.product.price).toFixed(2) }}</div>
                      <button 
                        type="button"
                        @click="removeProduct(index)"
                        class="remove-btn"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
                
                <div class="booking-total">
                  <p>Total: £{{ totalPrice.toFixed(2) }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Submission Section -->
          <div class="form-actions">
            <!-- Disclaimer -->
            <div class="disclaimer-box">
              <h4>Important Information</h4>
              <ul>
                <li><strong>Prices shown are not final.</strong> Additional admin fees or service charges may apply based on your specific requirements.</li>
                <li><strong>Date selection is not guaranteed.</strong> Your requested date will be reviewed for availability.</li>
                <li><strong>Confirmation process:</strong> After submitting this request, our team will review your details, confirm availability, and contact you for payment.</li>
                <li><strong>Your booking is only guaranteed</strong> after payment is received and confirmed by our team.</li>
              </ul>
            </div>
            
            <!-- Acknowledgment checkbox -->
            <div class="acknowledgment-wrapper">
              <label class="checkbox-container">
                <input type="checkbox" v-model="acknowledgmentChecked" required>
                <span class="checkmark"></span>
                <span class="acknowledgment-text">I have read and acknowledge the <strong>important information</strong> above regarding pricing, date availability, confirmation process, and that my booking is only guaranteed after payment is received and confirmed.</span>
              </label>
            </div>
            
            <button 
              type="submit" 
              class="submit-button"
              :disabled="isLoading || productsStore.loading || selectedProducts.length === 0 || !acknowledgmentChecked"
            >
              <span v-if="isLoading">Submitting...</span>
              <span v-else>Submit Booking Request</span>
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Product Customization Modal -->
    <div v-if="modalProduct" class="modal-overlay">
      <div class="modal-container">
        <div class="modal-header">
          <h3>Customize {{ modalProduct.name }}</h3>
          <button @click="closeModal" class="close-button">&times;</button>
        </div>
        
        <div class="modal-content">
          <!-- Variant Selection -->
          <div v-if="modalProduct.variants && modalProduct.variants.length > 0" class="form-group">
            <label>Variant</label>
            <div class="select-wrapper">
              <select v-model="selectedVariant">
                <option v-for="variant in modalProduct.variants" :key="variant.id" :value="variant">
                  {{ variant.name }} {{ variant.price ? `(+£${formatPrice(variant.price)})` : '' }}
                </option>
              </select>
            </div>
          </div>
          
          <!-- Custom Options -->
          <div v-if="modalProduct.customizable && modalProduct.customOptions && modalProduct.customOptions.length > 0">
            <div v-for="option in modalProduct.customOptions" :key="option.id" class="form-group">
              <label>{{ option.name }}</label>
              
              <!-- Text input for text options -->
              <input 
                v-if="option.type === 'text'" 
                type="text" 
                v-model="customValues[option.id]" 
                :placeholder="option.description"
              >
              
              <!-- Select for dropdown options -->
              <select 
                v-else-if="option.type === 'select'" 
                v-model="customValues[option.id]"
              >
                <option value="" disabled>Choose an option</option>
                <option 
                  v-for="choice in option.choices ? option.choices.split(',') : []" 
                  :key="choice" 
                  :value="choice.trim()"
                >
                  {{ choice.trim() }}
                </option>
              </select>
              
              <!-- Color picker -->
              <input 
                v-else-if="option.type === 'color'" 
                type="color" 
                v-model="customValues[option.id]"
                class="color-picker"
              >
              
              <p class="option-description">{{ option.description }}</p>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button @click="closeModal" class="cancel-button">Cancel</button>
          <button @click="addToBooking" class="confirm-button">Add to Booking</button>
        </div>
      </div>
    </div>

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
import { ref, computed, onMounted, nextTick } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useProductsStore } from '../stores/products'
import { useBookingStore } from '../stores/booking'
import { useRouter } from 'vue-router'
import BookingConfirmation from '../components/BookingConfirmation.vue'

const authStore = useAuthStore()
const productsStore = useProductsStore()
const bookingStore = useBookingStore()
const router = useRouter()

// Booking form state
const booking = ref({
  eventType: '',
  eventDate: '',
  description: '',
  guests: 1
})

// Product selection state
const selectedProducts = ref([])
const currentCategory = ref(null)
const modalProduct = ref(null)
const currentVariant = ref(null)
const customValues = ref({})
const modalQuantity = ref(1)
const selectedProductsSection = ref(null)
const toasts = ref([])

// Form submission state
const isLoading = ref(false)
const submitted = ref(false)

// Acknowledgment checkbox state
const acknowledgmentChecked = ref(false)

// Get today's date for min attribute
const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

// Filter products by category
const filteredProducts = computed(() => {
  if (!currentCategory.value) {
    return productsStore.products;
  }
  return productsStore.products.filter(p => 
    p.categoryId === currentCategory.value || p.category === currentCategory.value
  );
})

// Calculate total price
const totalPrice = computed(() => {
  return selectedProducts.value.reduce((total, item) => {
    const productPrice = Number(item.product.price || 0)
    return total + (productPrice * (item.quantity || 1))
  }, 0)
})

// Fetch products and categories on component mount
onMounted(async () => {
  await productsStore.fetchCategories();
  await productsStore.fetchProducts();
  console.log('Categories loaded in booking page:', productsStore.categories);
})

// Reset form after submission
const resetForm = () => {
  booking.value = {
    eventType: '',
    eventDate: '',
    description: '',
    guests: 1
  }
  selectedProducts.value = []
  submitted.value = false
}

// Handle product selection
const selectProduct = (product) => {
  // For products that don't need customization
  if (!product.customizable && (!product.variants || product.variants.length === 0)) {
    // Check if product already exists in the selection
    const existingIndex = selectedProducts.value.findIndex(item => 
      item.product.id === product.id && !item.variant
    )
    
    if (existingIndex >= 0) {
      // Increment quantity if already selected
      selectedProducts.value[existingIndex].quantity++
      selectedProducts.value[existingIndex].isNewlyAdded = true
      
      // Remove the highlight after animation completes
      setTimeout(() => {
        if (selectedProducts.value[existingIndex]) {
          selectedProducts.value[existingIndex].isNewlyAdded = false
        }
      }, 1500)
      
      // Show toast notification
      showToast(`${product.name} quantity increased to ${selectedProducts.value[existingIndex].quantity}`)
    } else {
      // Add as new selection
      selectedProducts.value.push({
        product,
        quantity: 1,
        customValues: [],
        isNewlyAdded: true
      })
      
      // Remove the highlight after animation completes
      const newIndex = selectedProducts.value.length - 1
      setTimeout(() => {
        if (selectedProducts.value[newIndex]) {
          selectedProducts.value[newIndex].isNewlyAdded = false
        }
      }, 1500)
      
      // Show toast notification
      showToast(`${product.name} added to your booking`)
    }
    
    // Scroll to the selected products section
    scrollToSelectedProducts()
  } else {
    // Open modal for customization
    modalProduct.value = product
    currentVariant.value = product.variants && product.variants.length ? product.variants[0] : null
    customValues.value = {}
    modalQuantity.value = 1
  }
}

// Handle adding customized product to booking
const addToBooking = () => {
  if (!modalProduct.value) return
  
  // Convert customValues object to array format for storage
  const customValuesArray = []
  
  if (modalProduct.value.customizable && modalProduct.value.customOptions) {
    for (const option of modalProduct.value.customOptions) {
      const value = customValues.value[option.id]
      if (value) {
        customValuesArray.push({
          optionId: option.id,
          optionName: option.name,
          value
        })
      }
    }
  }
  
  // Add to selectedProducts
  selectedProducts.value.push({
    product: modalProduct.value,
    variant: currentVariant.value,
    quantity: modalQuantity.value,
    customValues: customValuesArray,
    isNewlyAdded: true
  })
  
  // Remove the highlight after animation completes
  const newIndex = selectedProducts.value.length - 1
  setTimeout(() => {
    if (selectedProducts.value[newIndex]) {
      selectedProducts.value[newIndex].isNewlyAdded = false
    }
  }, 1500)
  
  // Show toast notification
  showToast(`${modalProduct.value.name} added to your booking`)
  
  // Close modal
  closeModal()
  
  // Scroll to the selected products section
  scrollToSelectedProducts()
}

// Display toast notification
const showToast = (message) => {
  const toast = { message }
  toasts.value.push(toast)
  setTimeout(() => {
    const index = toasts.value.indexOf(toast)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
  }, 3000)
}

// Scroll to the selected products section
const scrollToSelectedProducts = () => {
  if (selectedProductsSection.value) {
    nextTick(() => {
      selectedProductsSection.value.scrollIntoView({ behavior: 'smooth' })
    })
  }
}

// Close product customization modal
const closeModal = () => {
  modalProduct.value = null
  currentVariant.value = null
  customValues.value = {}
  modalQuantity.value = 1
}

// Remove a product from selection
const removeProduct = (index) => {
  selectedProducts.value.splice(index, 1)
}

// Increment product quantity
const incrementQuantity = (index) => {
  selectedProducts.value[index].quantity++
}

// Decrement product quantity
const decrementQuantity = (index) => {
  if (selectedProducts.value[index].quantity > 1) {
    selectedProducts.value[index].quantity--
  }
}

// Submit booking
const submitBooking = async () => {
  if (!authStore.isAuthenticated) return
  
  isLoading.value = true
  
  try {
    // Transform selectedProducts into format expected by API
    const bookingItems = selectedProducts.value.map(item => ({
      productId: item.product.id,
      variantId: item.variant?.id || null,
      quantity: item.quantity,
      customValues: item.customValues.map(cv => ({
        optionId: cv.optionId,
        value: cv.value
      }))
    }))
    
    // Calculate total price
    const total = selectedProducts.value.reduce((sum, item) => {
      // Variant price or product price
      const price = item.product.price
      return sum + (price * item.quantity)
    }, 0)
    
    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authStore.token}`
      },
      body: JSON.stringify({
        ...booking.value,
        total,
        items: bookingItems
      })
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to submit booking')
    }
    
    submitted.value = true
  } catch (error) {
    console.error('Error submitting booking:', error)
    alert(error.message || 'An unexpected error occurred')
  } finally {
    isLoading.value = false
  }
}

// Format price
const formatPrice = (price) => {
  if (price === undefined || price === null) return '0.00'
  return Number(price).toFixed(2)
}
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

.booking-header {
  text-align: center;
  padding: 4rem 0;
  background: var(--service-card-bg);
  margin-bottom: 3rem;
  position: relative;
  width: 100vw;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
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
  color: var(--accent-primary);
}

.header-content p {
  font-size: 1.2rem;
  color: var(--text-primary);
  opacity: 0.9;
}

.booking-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem 4rem;
  width: 100%;
}

.success-message {
  background-color: rgba(var(--accent-primary-rgb, 184, 134, 11), 0.1);
  border: 1px solid var(--accent-primary);
  color: var(--text-primary);
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  text-align: center;
}

.info-message {
  background-color: rgba(var(--accent-secondary-rgb, 218, 165, 32), 0.1);
  border: 1px solid var(--accent-secondary);
  color: var(--text-primary);
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  text-align: center;
}

.error-message {
  background-color: rgba(var(--error-color-rgb, 239, 68, 68), 0.1);
  border: 1px solid var(--error-color, #ef4444);
  color: var(--error-color, #ef4444);
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.link {
  color: var(--accent-primary);
  text-decoration: underline;
  font-weight: 600;
}

.text-link {
  color: var(--accent-primary);
  text-decoration: underline;
  background: none;
  border: none;
  padding: 0;
  font-size: 0.9rem;
  cursor: pointer;
}

.booking-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-section {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px var(--shadow-color);
  border: 1px solid var(--border-color);
}

.form-section h2 {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: var(--accent-primary);
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--border-color);
}

.form-section h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--accent-primary);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

input, select, textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(var(--accent-primary-rgb, 184, 134, 11), 0.2);
}

.option-description {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-top: 0.5rem;
}

.primary-button {
  background: var(--button-gradient);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
}

.primary-button:hover {
  background: var(--button-hover);
  transform: translateY(-2px);
}

/* Category filters styling */
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

/* Product grid styling */
.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 2.5rem;
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

.product-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.product-info h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: var(--accent-primary);
}

.price {
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text-primary);
}

.description {
  color: var(--text-primary);
  opacity: 0.7;
  margin-bottom: 1rem;
  flex-grow: 1;
}

.product-actions {
  margin-top: auto;
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

/* Selected products styling */
.selected-products {
  margin-top: 2.5rem;
  padding-top: 2.5rem;
  border-top: 1px solid var(--border-color);
  scroll-margin-top: 100px;
}

.product-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: var(--accent-primary);
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  font-size: 0.9rem;
  margin-left: 8px;
}

.selected-products-list {
  background-color: var(--bg-secondary);
  border-radius: 8px;
  border: 1px solid var(--border-color);
  overflow: hidden;
}

.selected-product-item {
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  transition: background-color 0.5s ease;
}

@media (min-width: 768px) {
  .selected-product-item {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.highlight-animation {
  animation: highlightItem 1.5s ease;
}

@keyframes highlightItem {
  0% { background-color: rgba(var(--accent-primary-rgb, 184, 134, 11), 0.3); }
  100% { background-color: transparent; }
}

/* Toast notification */
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

.product-details {
  flex-grow: 1;
  margin-bottom: 1rem;
}

@media (min-width: 768px) {
  .product-details {
    margin-bottom: 0;
    margin-right: 1rem;
  }
}

.product-details h4 {
  font-weight: 600;
  font-size: 1.1rem;
  color: var(--accent-primary);
}

.product-options {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-top: 0.5rem;
}

.options-title {
  font-weight: 500;
  margin-top: 0.5rem;
  font-size: 0.85rem;
}

.options-list {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin-top: 0.25rem;
  font-size: 0.85rem;
}

.product-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.quantity-control {
  display: flex;
  align-items: center;
}

.quantity-btn {
  background-color: var(--hover-bg);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.quantity-btn:first-child {
  border-radius: 4px 0 0 4px;
}

.quantity-btn:last-child {
  border-radius: 0 4px 4px 0;
}

.quantity-btn:hover {
  background-color: var(--border-color);
}

.quantity {
  padding: 0 0.75rem;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
  background-color: var(--bg-secondary);
  min-width: 40px;
  text-align: center;
}

.price-controls {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.total-price {
  font-weight: 600;
  font-size: 1.1rem;
  color: var(--text-primary);
}

.remove-btn {
  background: none;
  border: none;
  color: var(--error-color, #ef4444);
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0;
  margin-top: 0.25rem;
}

.remove-btn:hover {
  text-decoration: underline;
}

.booking-total {
  padding: 1.5rem;
  text-align: right;
  font-weight: 700;
  font-size: 1.25rem;
  color: var(--text-primary);
}

/* Form actions */
.form-actions {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1rem;
}

/* Disclaimer box */
.disclaimer-box {
  background-color: rgba(var(--accent-secondary-rgb, 218, 165, 32), 0.1);
  border: 1px solid var(--accent-secondary);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
}

.disclaimer-box h4 {
  color: var(--accent-primary);
  font-size: 1.2rem;
  margin-top: 0;
  margin-bottom: 1rem;
}

.disclaimer-box ul {
  margin: 0;
  padding-left: 1.5rem;
}

.disclaimer-box li {
  margin-bottom: 0.75rem;
  color: var(--text-primary);
  line-height: 1.4;
}

.disclaimer-box li:last-child {
  margin-bottom: 0;
}

.disclaimer-box strong {
  color: var(--accent-primary);
}

.submit-button {
  background: linear-gradient(to right, var(--accent-primary), var(--accent-secondary));
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
  align-self: flex-end;
}

.submit-button:hover:not(:disabled) {
  background: linear-gradient(to right, var(--accent-secondary), var(--accent-primary));
  transform: translateY(-2px);
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Loading spinner */
.loading-container {
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

/* Modal styling */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--overlay-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-container {
  background-color: var(--card-bg);
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px var(--shadow-color);
  border: 1px solid var(--border-color);
}

.modal-header {
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h3 {
  font-size: 1.5rem;
  color: var(--accent-primary);
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-primary);
}

.modal-content {
  padding: 1.5rem;
}

.modal-footer {
  padding: 1.5rem;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  border-top: 1px solid var(--border-color);
}

.cancel-button {
  padding: 0.75rem 1.5rem;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.cancel-button:hover {
  background-color: var(--hover-bg);
}

.confirm-button {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(to right, var(--accent-primary), var(--accent-secondary));
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
}

.confirm-button:hover {
  background: linear-gradient(to right, var(--accent-secondary), var(--accent-primary));
}

.color-picker {
  height: 40px;
  padding: 5px;
}

.select-wrapper {
  position: relative;
}

/* Acknowledgment checkbox styling */
.acknowledgment-wrapper {
  margin-bottom: 1.5rem;
  background-color: rgba(var(--accent-primary-rgb, 184, 134, 11), 0.05);
  padding: 1rem;
  border-radius: 8px;
  border: 1px dashed var(--accent-primary);
}

.checkbox-container {
  display: flex;
  align-items: flex-start;
  position: relative;
  cursor: pointer;
  padding-left: 30px;
  user-select: none;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  position: absolute;
  top: 2px;
  left: 0;
  height: 20px;
  width: 20px;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  transition: all 0.2s ease;
}

.checkbox-container:hover input ~ .checkmark {
  background-color: var(--hover-bg);
}

.checkbox-container input:checked ~ .checkmark {
  background-color: var(--accent-primary);
  border-color: var(--accent-primary);
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
  left: 7px;
  top: 3px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-container input:checked ~ .checkmark:after {
  display: block;
}

.acknowledgment-text {
  font-size: 0.95rem;
  color: var(--text-primary);
  line-height: 1.4;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .booking-header {
    padding: 3rem 0;
  }

  .header-content h1 {
    font-size: 2.5rem;
  }

  .form-section {
    padding: 1.5rem;
  }

  .product-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
  }
}

@media (max-width: 480px) {
  .product-grid {
    grid-template-columns: 1fr;
  }

  .product-controls {
    flex-direction: column;
    align-items: flex-start;
  }

  .quantity-control {
    margin-bottom: 0.5rem;
  }

  .price-controls {
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .remove-btn {
    margin-top: 0;
  }
}
</style> 