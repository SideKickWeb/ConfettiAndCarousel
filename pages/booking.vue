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

        <form v-else @submit.prevent="submitBooking" class="booking-form">
          <!-- Event Details Section -->
          <div class="form-section">
            <h2>Event Details</h2>
            <div class="form-grid">
              <div class="form-group">
                <label for="eventType">Event Type</label>
                <input type="text" id="eventType" v-model="booking.eventType" required placeholder="e.g., Birthday Party, Wedding, Corporate Event">
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
                <label for="eventLocation">Event Location</label>
                <input type="text" id="eventLocation" v-model="booking.location" placeholder="Where will your event be held?" required>
              </div>
            </div>
            
            <!-- Description field outside grid -->
            <div class="description-field" style="margin-top: 1.5rem; width: 100%; max-width: 100%; box-sizing: border-box;">
              <label for="description" style="display: block; font-weight: 500; margin-bottom: 0.5rem; color: var(--text-primary);">Event Description (Optional)</label>
              <textarea id="description" v-model="booking.description" rows="3" placeholder="Tell us more about your event..." style="width: 100%; max-width: 100%; box-sizing: border-box; margin: 0; padding: 0.75rem; border: 1px solid var(--border-color); border-radius: 8px; background-color: var(--bg-secondary); color: var(--text-primary); resize: vertical; min-height: 80px; font-family: inherit; line-height: 1.4;"></textarea>
            </div>
          </div>

          <!-- Customer Information Section -->
          <div class="form-section">
            <h2>Your Information</h2>
            <div class="form-grid">
              <div class="form-group">
                <label for="firstName">First Name</label>
                <input type="text" id="firstName" v-model="customerInfo.firstName" required placeholder="Your first name">
              </div>
              
              <div class="form-group">
                <label for="lastName">Last Name</label>
                <input type="text" id="lastName" v-model="customerInfo.lastName" required placeholder="Your last name">
              </div>
              
              <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" v-model="customerInfo.email" required placeholder="Your email address">
              </div>
              
              <div class="form-group">
                <label for="phone">Phone</label>
                <input type="tel" id="phone" v-model="customerInfo.phone" placeholder="Your phone number (optional)">
              </div>
            </div>
          </div>

          <!-- Products Section -->
          <div class="form-section">
            <h2>Event Items</h2>
            
            <!-- Selected Products -->
            <div v-if="selectedProducts.length > 0" class="selected-products" ref="selectedProductsSection">
              <h3>Your Selected Items <span class="product-count">{{ selectedProducts.length }}</span></h3>
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
                            <span class="option-info">
                              {{ custom.optionName }}: 
                              <!-- Color swatch for color options -->
                              <span v-if="isColorOption(custom.optionName)" class="color-option">
                                <span class="color-swatch-mini" :style="{ backgroundColor: getColorFromValue(custom.value) }"></span>
                                {{ custom.value }}
                              </span>
                              <!-- Regular text for non-color options -->
                              <span v-else>{{ custom.value }}</span>
                            </span>
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

            <!-- Add More Items Section -->
            <div class="add-items-section">
              <h3>{{ selectedProducts.length > 0 ? 'Add More Items' : 'Add Items to Your Event' }}</h3>
              <p>Browse our products and add items to your event directly from the product pages.</p>
              <NuxtLink to="/products" class="browse-products-btn">
                Browse All Products
              </NuxtLink>
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
              :disabled="isLoading || productsStore.loading || selectedProducts.length === 0 || !acknowledgmentChecked || !isCustomerInfoValid"
            >
              <span v-if="isLoading">Submitting...</span>
              <span v-else>Submit Booking Request</span>
            </button>
          </div>
        </form>
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
import { ref, computed, onMounted, nextTick, watch } from 'vue'
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
  location: '',
  description: '',
  guests: 1
})

// Product selection state
const selectedProducts = ref([])
const selectedProductsSection = ref(null)
const toasts = ref([])

// Form submission state
const isLoading = ref(false)
const submitted = ref(false)

// Acknowledgment checkbox state
const acknowledgmentChecked = ref(false)

// Customer information state
const customerInfo = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: ''
})

// Get today's date for min attribute
const minDate = computed(() => {
  const today = new Date()
  return today.toISOString().split('T')[0]
})

// Calculate total price
const totalPrice = computed(() => {
  return selectedProducts.value.reduce((total, item) => {
    const productPrice = Number(item.product.price || 0)
    return total + (productPrice * (item.quantity || 1))
  }, 0)
})

// Fetch any initial data on component mount
onMounted(async () => {
  // Load any items added from product pages
  loadEventItemsFromStorage();
  // Load saved form data
  loadSavedFormData();
})

// Watch for changes in form data and save automatically
watch(booking, () => {
  saveFormData();
}, { deep: true });

watch(customerInfo, () => {
  saveFormData();
}, { deep: true });

watch(acknowledgmentChecked, () => {
  saveFormData();
});

// Load event items from localStorage
const loadEventItemsFromStorage = () => {
  try {
    const currentEvent = JSON.parse(localStorage.getItem('currentEvent') || '{"items": []}');
    if (currentEvent.items && currentEvent.items.length > 0) {
      // Convert the stored items to the format expected by the booking page
      for (const item of currentEvent.items) {
        const existingIndex = selectedProducts.value.findIndex(selected => 
          selected.product.id === item.id
        );
        
        if (existingIndex >= 0) {
          // Increment quantity if already exists
          selectedProducts.value[existingIndex].quantity += item.quantity;
        } else {
          // Add as new item with proper custom options format
          selectedProducts.value.push({
            product: item,
            quantity: item.quantity,
            selectedOptions: item.selectedOptions || {},
            customValues: item.selectedOptions ? Object.entries(item.selectedOptions).map(([optionId, valueId]) => {
              // Find the option in the product to get the proper name and value
              const option = item.options?.find(opt => opt.id === optionId);
              if (option) {
                if (option.type === 'text') {
                  return {
                    optionId,
                    optionName: option.name,
                    value: valueId
                  };
                } else {
                  const selectedValue = option.values?.find(v => v.id === valueId);
                  return {
                    optionId,
                    optionName: option.name,
                    value: selectedValue ? selectedValue.label || selectedValue.value : valueId
                  };
                }
              }
              return {
                optionId,
                optionName: `Option ${optionId}`,
                value: valueId
              };
            }) : [],
            isNewlyAdded: true
          });
        }
      }
      
      // Clear the localStorage after loading
      localStorage.removeItem('currentEvent');
      
      // Remove highlight animations after a delay
      setTimeout(() => {
        selectedProducts.value.forEach(item => {
          item.isNewlyAdded = false;
        });
      }, 1500);
      
      // Show notification if items were loaded
      if (currentEvent.items.length > 0) {
        showToast(`${currentEvent.items.length} item(s) loaded from your previous selection`);
      }
    }
  } catch (error) {
    console.error('Error loading event items from storage:', error);
  }
};

// Load saved form data from localStorage
const loadSavedFormData = () => {
  try {
    const savedBookingData = localStorage.getItem('bookingFormData');
    const savedCustomerData = localStorage.getItem('customerFormData');
    const savedAcknowledgment = localStorage.getItem('bookingAcknowledgment');
    
    if (savedBookingData) {
      const parsedBookingData = JSON.parse(savedBookingData);
      booking.value = { ...booking.value, ...parsedBookingData };
    }
    
    if (savedCustomerData) {
      const parsedCustomerData = JSON.parse(savedCustomerData);
      customerInfo.value = { ...customerInfo.value, ...parsedCustomerData };
    }
    
    if (savedAcknowledgment) {
      acknowledgmentChecked.value = JSON.parse(savedAcknowledgment);
    }
    
    console.log('Loaded saved form data from localStorage');
  } catch (error) {
    console.error('Error loading saved form data:', error);
  }
};

// Save form data to localStorage
const saveFormData = () => {
  try {
    localStorage.setItem('bookingFormData', JSON.stringify(booking.value));
    localStorage.setItem('customerFormData', JSON.stringify(customerInfo.value));
    localStorage.setItem('bookingAcknowledgment', JSON.stringify(acknowledgmentChecked.value));
  } catch (error) {
    console.error('Error saving form data:', error);
  }
};

// Clear saved form data from localStorage
const clearSavedFormData = () => {
  try {
    localStorage.removeItem('bookingFormData');
    localStorage.removeItem('customerFormData');
    localStorage.removeItem('bookingAcknowledgment');
    console.log('Cleared saved form data from localStorage');
  } catch (error) {
    console.error('Error clearing saved form data:', error);
  }
};

// Reset form after submission
const resetForm = () => {
  booking.value = {
    eventType: '',
    eventDate: '',
    location: '',
    description: '',
    guests: 1
  }
  customerInfo.value = {
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  }
  selectedProducts.value = []
  submitted.value = false
  acknowledgmentChecked.value = false
  
  // Clear saved form data from localStorage
  clearSavedFormData()
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
  if (!acknowledgmentChecked.value) {
    showToast('Please acknowledge the important information before proceeding.');
    return;
  }

  if (selectedProducts.value.length === 0) {
    showToast('Please add at least one item to your event.');
    return;
  }
  
  isLoading.value = true
  
  try {
    // Prepare event data
    const eventData = {
      customerInfo: {
        firstName: customerInfo.value.firstName,
        lastName: customerInfo.value.lastName,
        email: customerInfo.value.email,
        phone: customerInfo.value.phone
      },
      eventType: booking.value.eventType,
      eventDate: booking.value.eventDate,
      location: booking.value.location,
      guests: booking.value.guests,
      description: booking.value.description,
      items: selectedProducts.value.map(item => ({
        product: item.product,
        quantity: item.quantity,
        selectedOptions: item.selectedOptions || {}
      }))
    }
    
    console.log('Submitting event booking:', eventData)
    
    const response = await fetch('/api/events/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(eventData)
    })
    
    const result = await response.json()
    
    if (!response.ok) {
      throw new Error(result.statusMessage || 'Failed to submit event booking')
    }
    
    if (result.success) {
      // Clear saved form data since submission was successful
      clearSavedFormData()
      
      // Clear the form and selected products
      resetForm()
      submitted.value = true
      showToast(result.data.message || 'Event booking submitted successfully!')
      console.log('Event booking submitted successfully:', result.data)
    } else {
      throw new Error(result.message || 'Failed to submit event booking')
    }
    
  } catch (error) {
    console.error('Error submitting event booking:', error)
    showToast(error.message || 'An unexpected error occurred. Please try again.')
  } finally {
    isLoading.value = false
  }
}

// Format price
const formatPrice = (price) => {
  if (price === undefined || price === null) return '0.00'
  return Number(price).toFixed(2)
}

// Check if customer information is valid
const isCustomerInfoValid = computed(() => {
  return customerInfo.value.firstName && customerInfo.value.lastName && customerInfo.value.email && customerInfo.value.phone;
})

// Helper function to check if an option is a color option
const isColorOption = (optionName) => {
  const colorKeywords = ['color', 'colour'];
  return colorKeywords.some(keyword => optionName.toLowerCase().includes(keyword));
};

// Helper function to get color from a value
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
  overflow-x: hidden !important;
  background-color: var(--bg-primary);
  box-sizing: border-box;
}

.content {
  flex: 1;
  padding-top: 80px;
  width: 100%;
  max-width: var(--content-max-width);
  margin: 0 auto;
  overflow-x: hidden !important;
  box-sizing: border-box;
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
  overflow-x: hidden;
  box-sizing: border-box;
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
  overflow-x: hidden;
  box-sizing: border-box;
  width: 100%;
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
  width: 100% !important;
  max-width: 100% !important;
  box-sizing: border-box !important;
  overflow-x: hidden !important;
  margin: 0 !important;
  padding: 0 !important;
}

.form-group {
  display: flex;
  flex-direction: column;
  min-width: 0 !important;
  max-width: 100% !important;
  box-sizing: border-box !important;
  overflow-x: hidden !important;
  margin: 0 !important;
  padding: 0 !important;
}

.form-group.full-width {
  grid-column: 1 / -1;
  width: 100% !important;
  max-width: 100% !important;
  box-sizing: border-box !important;
  overflow-x: hidden !important;
  margin: 0 !important;
  padding: 0 !important;
}

.form-group.full-width textarea {
  width: 100% !important;
  max-width: 100% !important;
  box-sizing: border-box !important;
  margin: 0 !important;
  padding: 0.75rem !important;
  border: 1px solid var(--border-color) !important;
  border-radius: 8px !important;
  background-color: var(--bg-secondary) !important;
  color: var(--text-primary) !important;
  resize: vertical !important;
  min-height: 80px !important;
  font-family: inherit !important;
  line-height: 1.4 !important;
}

/* Additional constraint for the textarea element specifically */
#description {
  width: calc(100% - 2px) !important;
  max-width: calc(100% - 2px) !important;
  min-width: 0 !important;
  display: block !important;
  box-sizing: border-box !important;
  margin: 0 !important;
  padding: 0.75rem !important;
  border: 1px solid var(--border-color) !important;
  border-radius: 8px !important;
  background-color: var(--bg-secondary) !important;
  color: var(--text-primary) !important;
  resize: vertical !important;
  min-height: 80px !important;
  font-family: inherit !important;
  line-height: 1.4 !important;
  outline: none !important;
  overflow-x: hidden !important;
  word-wrap: break-word !important;
  white-space: pre-wrap !important;
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
  box-sizing: border-box;
  margin: 0;
}

textarea {
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
  line-height: 1.4;
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

/* Add Items Section */
.add-items-section {
  padding: 2rem;
  background-color: var(--bg-secondary);
  border: 2px dashed var(--border-color);
  border-radius: 12px;
  text-align: center;
  margin-top: 2rem;
}

.add-items-section h3 {
  color: var(--accent-primary);
  margin-bottom: 1rem;
}

.add-items-section p {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

.browse-products-btn {
  display: inline-block;
  background: linear-gradient(to right, var(--accent-primary), var(--accent-secondary));
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.browse-products-btn:hover {
  background: linear-gradient(to right, var(--accent-secondary), var(--accent-primary));
  transform: translateY(-2px);
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
  
  .form-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .booking-content {
    padding: 0 1rem 4rem;
  }
}

@media (max-width: 480px) {
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
  
  .form-section {
    padding: 1rem;
    margin: 0 -0.5rem;
  }
  
  .booking-content {
    padding: 0 0.5rem 4rem;
  }
  
  input, select, textarea {
    padding: 0.5rem;
  }
}

/* Color option styles for booking page */
.color-option {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.color-swatch-mini {
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

/* Handle white color visibility in mini swatches */
.color-swatch-mini[style*="rgb(255, 255, 255)"],
.color-swatch-mini[style*="#ffffff"],
.color-swatch-mini[style*="#fff"] {
  border-color: #e5e7eb;
}

.option-info {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.options-list {
  margin: 0.5rem 0;
  padding-left: 1rem;
}

.options-list li {
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
}
</style> 