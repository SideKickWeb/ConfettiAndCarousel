<template>
  <div class="page-wrapper">
    <TheNavbar />

    <div class="content">
      <div class="checkout-header">
        <div class="header-content">
          <h1>Checkout</h1>
          <p>Complete your purchase</p>
        </div>
      </div>

      <div class="checkout-content">
        <!-- Empty cart state -->
        <div v-if="!cartStore.hasItems" class="empty-checkout">
          <h2>Your basket is empty</h2>
          <p>Add some products to your basket before proceeding to checkout.</p>
          <NuxtLink to="/products" class="primary-button">
            Browse Products
          </NuxtLink>
        </div>

        <!-- Checkout form -->
        <form v-else @submit.prevent="submitOrder" class="checkout-form">
          <!-- Order summary -->
          <div class="order-summary">
            <h2>Order Summary</h2>
            <div class="order-items">
              <div v-for="item in cartStore.items" :key="item.id" class="order-item">
                <div class="item-details">
                  <div class="item-name-row">
                    <span class="item-name">{{ item.product.name }}</span>
                    <span class="item-quantity">x{{ item.quantity }}</span>
                  </div>
                  <div v-if="item.customOptions && item.customOptions.length > 0" class="item-options">
                    <div v-for="option in item.customOptions" :key="option.optionId" class="option-detail">
                      <span class="option-name">{{ option.optionName }}:</span>
                      <!-- Color swatch for color options -->
                      <span v-if="isColorOption(option.optionName)" class="option-value color-option">
                        <span class="color-swatch-mini" :style="{ backgroundColor: getColorFromValue(option.value) }"></span>
                        {{ option.label || option.value }}
                      </span>
                      <!-- Regular text for non-color options -->
                      <span v-else class="option-value">{{ option.label || option.value }}</span>
                      <span v-if="option.priceAdjustment && option.priceAdjustment !== 0" class="price-adjustment">
                        ({{ option.priceAdjustment > 0 ? '+' : '' }}£{{ formatPrice(Math.abs(option.priceAdjustment)) }})
                      </span>
                    </div>
                  </div>
                </div>
                <div class="item-price">£{{ formatPrice(calculateItemTotal(item)) }}</div>
              </div>
            </div>
            <div class="order-total">
              <span>Total</span>
              <span>£{{ formatPrice(calculateOrderTotal()) }}</span>
            </div>
          </div>

          <!-- Customer Information -->
          <div class="checkout-section">
            <h2>Your Information</h2>
            <div class="form-grid">
              <div class="form-group">
                <label for="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  v-model="customerInfo.firstName"
                  required
                  placeholder="Your first name"
                />
              </div>
              
              <div class="form-group">
                <label for="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  v-model="customerInfo.lastName"
                  required
                  placeholder="Your last name"
                />
              </div>
            </div>
            
            <div class="form-grid">
              <div class="form-group">
                <label for="email">Email</label>
                <input
                  type="email"
                  id="email"
                  v-model="customerInfo.email"
                  required
                  placeholder="Your email address"
                />
              </div>
              
              <div class="form-group">
                <label for="phone">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  v-model="customerInfo.phone"
                  placeholder="Your phone number (optional)"
                />
              </div>
            </div>
            
            <div class="form-group">
              <label for="notes">Additional Notes (Optional)</label>
              <textarea
                id="notes"
                v-model="customerInfo.notes"
                rows="3"
                placeholder="Any special requests or notes about your order..."
              ></textarea>
            </div>
          </div>

          <!-- Collection Information -->
          <div class="checkout-section">
            <h2>Collection Information</h2>
            <div class="collection-info">
              <p><strong>Collection Location:</strong> Cannock, Staffordshire</p>
              <p><strong>Collection Process:</strong> After your order is reviewed and confirmed, we'll contact you to arrange a convenient collection time.</p>
              <p><strong>Order Review:</strong> All orders are personally reviewed to ensure we can meet your requirements and provide the best service.</p>
            </div>
          </div>

          <!-- Payment Information -->
          <div class="checkout-section">
            <h2>Order Process</h2>
            <div class="process-info">
              <div class="process-step">
                <span class="step-number">1</span>
                <div class="step-content">
                  <h4>Submit Order Request</h4>
                  <p>Complete this form to submit your order request</p>
                </div>
              </div>
              <div class="process-step">
                <span class="step-number">2</span>
                <div class="step-content">
                  <h4>Order Review</h4>
                  <p>We'll review your order and contact you within 24 hours</p>
                </div>
              </div>
              <div class="process-step">
                <span class="step-number">3</span>
                <div class="step-content">
                  <h4>Confirmation & Payment</h4>
                  <p>Finalize details and arrange payment & collection</p>
                </div>
              </div>
            </div>
            
            <!-- Comprehensive disclaimer -->
            <div class="disclaimer-box">
              <h4>Important Information</h4>
              <ul>
                <li><strong>Prices shown are not final.</strong> Customizations and additional requirements might change the total price.</li>
                <li><strong>Availability is not guaranteed.</strong> Your order is subject to product availability and will be reviewed.</li>
                <li><strong>Confirmation process:</strong> After submitting this request, our team will review your order, confirm availability, and contact you for payment arrangements.</li>
                <li><strong>Your order is only guaranteed</strong> after payment is received and confirmed by our team.</li>
                <li><strong>Collection only:</strong> All items must be collected from our location in Cannock, Staffordshire.</li>
              </ul>
            </div>
            
            <!-- Acknowledgment checkbox -->
            <div class="acknowledgment-wrapper">
              <label class="checkbox-container">
                <input type="checkbox" v-model="acknowledgmentChecked" required>
                <span class="checkmark"></span>
                <span class="acknowledgment-text">I have read and acknowledge the <strong>important information</strong> above regarding pricing, availability, confirmation process, collection requirements, and that my order is only guaranteed after payment is received and confirmed.</span>
              </label>
            </div>
          </div>

          <!-- Order Actions -->
          <div class="checkout-actions">
            <button type="submit" class="place-order-btn" :disabled="isProcessing || !acknowledgmentChecked">
              {{ isProcessing ? 'Submitting Order...' : 'Submit Order Request' }}
            </button>
            <NuxtLink to="/basket" class="back-to-basket">
              Back to Your Order
            </NuxtLink>
          </div>
        </form>

        <!-- Order confirmation (after successful submission) -->
        <div v-if="orderComplete" class="order-confirmation">
          <div class="confirmation-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <h2>Order Request Submitted!</h2>
          <p v-if="orderMessage">{{ orderMessage }}</p>
          <p>Order reference: <strong>{{ orderReference }}</strong></p>
          <p>A confirmation email will be sent to <strong>{{ customerInfo.email }}</strong> once your order has been reviewed.</p>
          <div class="confirmation-actions">
            <NuxtLink to="/products" class="primary-button">
              Continue Shopping
            </NuxtLink>
            <NuxtLink to="/" class="secondary-button">
              Return Home
            </NuxtLink>
          </div>
        </div>

        <!-- Error state -->
        <div v-if="orderError" class="order-error">
          <div class="error-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
          </div>
          <h3>Unable to Submit Order</h3>
          <p>{{ orderError }}</p>
          <button @click="resetOrderState" class="retry-button">
            Try Again
          </button>
        </div>
      </div>
    </div>

    <TheFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()

// Order state
const customerInfo = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  notes: ''
})

const isProcessing = ref(false)
const acknowledgmentChecked = ref(false)
const orderComplete = ref(false)
const orderError = ref(null)
const orderReference = ref('')
const orderMessage = ref('')

// Load cart data on mount
onMounted(() => {
  cartStore.loadFromLocalStorage()
})

// Format price
const formatPrice = (price) => {
  return parseFloat(price || 0).toFixed(2)
}

// Reset order state
const resetOrderState = () => {
  orderError.value = null
  orderComplete.value = false
  isProcessing.value = false
}

// Submit order
const submitOrder = async () => {
  if (!acknowledgmentChecked.value) {
    orderError.value = 'Please acknowledge the important information before proceeding.'
    return
  }

  if (!cartStore.hasItems) {
    orderError.value = 'Your basket is empty.'
    return
  }

  isProcessing.value = true
  orderError.value = null

  try {
    // Prepare order data
    const orderData = {
      customerInfo: {
        firstName: customerInfo.value.firstName,
        lastName: customerInfo.value.lastName,
        email: customerInfo.value.email,
        phone: customerInfo.value.phone
      },
      items: cartStore.items,
      notes: customerInfo.value.notes,
      totalAmount: cartStore.totalPrice
    }

    console.log('Submitting order:', orderData)

    // Submit to API
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData)
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.statusMessage || 'Failed to submit order')
    }

    if (result.success) {
      // Order submitted successfully
      orderComplete.value = true
      orderReference.value = result.data.orderNumber
      orderMessage.value = result.data.message
      
      // Clear the cart
      cartStore.clearCart()
      
      console.log('Order submitted successfully:', result.data)
    } else {
      throw new Error(result.message || 'Failed to submit order')
    }

  } catch (error) {
    console.error('Error submitting order:', error)
    orderError.value = error.message || 'An unexpected error occurred. Please try again.'
  } finally {
    isProcessing.value = false
  }
}

// Calculate item total
const calculateItemTotal = (item) => {
  let basePrice = item.product.price;
  let optionsPrice = 0;
  
  if (item.customOptions && item.customOptions.length > 0) {
    optionsPrice = item.customOptions.reduce((sum, option) => {
      return sum + (option.priceAdjustment || 0);
    }, 0);
  }
  
  return (basePrice + optionsPrice) * item.quantity;
}

// Calculate order total
const calculateOrderTotal = () => {
  return cartStore.items.reduce((sum, item) => sum + calculateItemTotal(item), 0)
}

// Check if an option is a color option
const isColorOption = (optionName) => {
  const colorKeywords = ['color', 'colour'];
  return colorKeywords.some(keyword => optionName.toLowerCase().includes(keyword));
};

// Get color from value
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
  padding-top: 80px;
  width: 100%;
  max-width: var(--content-max-width);
  margin: 0 auto;
}

.checkout-header {
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

.checkout-content {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 2rem 4rem;
  width: 100%;
}

/* Empty checkout state */
.empty-checkout {
  background-color: var(--card-bg);
  border-radius: 12px;
  padding: 3rem;
  text-align: center;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 20px var(--shadow-color);
}

.empty-checkout h2 {
  font-size: 1.8rem;
  color: var(--accent-primary);
  margin-bottom: 1rem;
}

.empty-checkout p {
  color: var(--text-primary);
  margin-bottom: 2rem;
}

.primary-button {
  display: inline-block;
  background: linear-gradient(to right, var(--accent-primary), var(--accent-secondary));
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
  text-decoration: none;
}

.primary-button:hover {
  background: linear-gradient(to right, var(--accent-secondary), var(--accent-primary));
  transform: translateY(-2px);
}

/* Checkout form */
.checkout-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.order-summary {
  background-color: var(--card-bg);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 20px var(--shadow-color);
  padding: 1.5rem;
  margin-bottom: 1rem;
}

.order-summary h2 {
  font-size: 1.5rem;
  color: var(--accent-primary);
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--border-color);
}

.order-items {
  margin-bottom: 1.5rem;
}

.order-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px dashed var(--border-color);
}

.order-item:last-child {
  border-bottom: none;
}

.item-details {
  display: flex;
  align-items: center;
}

.item-name-row {
  display: flex;
  align-items: center;
}

.item-name {
  font-weight: 600;
}

.item-quantity {
  margin-left: 0.5rem;
  background-color: var(--hover-bg);
  color: var(--text-primary);
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.item-options {
  margin-left: 0.5rem;
  background-color: var(--hover-bg);
  color: var(--text-primary);
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.option-detail {
  margin-bottom: 0.25rem;
}

.option-name {
  font-weight: 500;
}

.option-value {
  margin-left: 0.5rem;
}

.price-adjustment {
  margin-left: 0.5rem;
  font-size: 0.8rem;
}

.item-price {
  font-weight: 600;
}

.order-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 1.1rem;
  color: var(--accent-primary);
  border-top: 1px solid var(--border-color);
  padding-top: 1rem;
  margin-top: 1rem;
}

.checkout-section {
  background-color: var(--card-bg);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 20px var(--shadow-color);
  padding: 1.5rem;
}

.checkout-section h2 {
  font-size: 1.5rem;
  color: var(--accent-primary);
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--border-color);
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

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

input:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(var(--accent-primary-rgb, 184, 134, 11), 0.2);
}

.payment-info {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

.disclaimer-box {
  background-color: rgba(var(--accent-secondary-rgb, 218, 165, 32), 0.1);
  border: 1px solid var(--accent-secondary);
  border-radius: 8px;
  padding: 1.5rem;
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

.acknowledgment-wrapper {
  margin-top: 1.5rem;
  text-align: center;
}

.checkbox-container {
  display: inline-block;
  position: relative;
  padding-left: 30px;
  cursor: pointer;
  font-size: 16px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
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
  top: 0;
  left: 0;
  height: 20px;
  width: 20px;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
}

.checkbox-container:hover input ~ .checkmark {
  background-color: var(--hover-bg);
}

.checkbox-container input:checked ~ .checkmark {
  background-color: var(--accent-primary);
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.checkbox-container input:checked ~ .checkmark:after {
  display: block;
}

.checkbox-container .checkmark:after {
  left: 5px;
  top: 1px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}

.checkbox-container .acknowledgment-text {
  margin-left: 10px;
  color: var(--text-primary);
}

.checkout-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.place-order-btn {
  background: linear-gradient(to right, var(--accent-primary), var(--accent-secondary));
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
}

.place-order-btn:hover:not(:disabled) {
  background: linear-gradient(to right, var(--accent-secondary), var(--accent-primary));
  transform: translateY(-2px);
}

.place-order-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.back-to-basket {
  display: block;
  text-align: center;
  color: var(--accent-primary);
  text-decoration: none;
  font-weight: 500;
}

.back-to-basket:hover {
  text-decoration: underline;
}

/* Order confirmation */
.order-confirmation {
  background-color: var(--card-bg);
  border-radius: 12px;
  padding: 3rem;
  text-align: center;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 20px var(--shadow-color);
}

.confirmation-icon {
  color: var(--accent-primary);
  margin-bottom: 1.5rem;
}

.order-confirmation h2 {
  font-size: 1.8rem;
  color: var(--accent-primary);
  margin-bottom: 1rem;
}

.order-confirmation p {
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.order-confirmation .primary-button {
  margin-top: 1.5rem;
}

.confirmation-actions {
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.secondary-button {
  background: linear-gradient(to right, var(--accent-primary), var(--accent-secondary));
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
}

.secondary-button:hover {
  background: linear-gradient(to right, var(--accent-secondary), var(--accent-primary));
  transform: translateY(-2px);
}

/* Error state */
.order-error {
  background-color: var(--card-bg);
  border-radius: 12px;
  padding: 3rem;
  text-align: center;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 20px var(--shadow-color);
}

.error-icon {
  color: var(--accent-primary);
  margin-bottom: 1.5rem;
}

.order-error h3 {
  font-size: 1.8rem;
  color: var(--accent-primary);
  margin-bottom: 1rem;
}

.order-error p {
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.retry-button {
  background: linear-gradient(to right, var(--accent-primary), var(--accent-secondary));
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
}

.retry-button:hover {
  background: linear-gradient(to right, var(--accent-secondary), var(--accent-primary));
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .checkout-header {
    padding: 3rem 0;
  }
  
  .header-content h1 {
    font-size: 2.5rem;
  }
  
  .order-item {
    font-size: 0.9rem;
  }
  
  .order-total {
    font-size: 1rem;
  }
}

.collection-info {
  background-color: var(--bg-secondary);
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.collection-info p {
  margin: 0.5rem 0;
  color: var(--text-primary);
}

.collection-info strong {
  color: var(--accent-primary);
}

.process-info {
  margin-bottom: 2rem;
}

.process-step {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: var(--bg-secondary);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.step-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background-color: var(--accent-primary);
  color: white;
  border-radius: 50%;
  font-weight: 600;
  flex-shrink: 0;
}

.step-content h4 {
  margin: 0 0 0.5rem 0;
  color: var(--accent-primary);
  font-size: 1.1rem;
}

.step-content p {
  margin: 0;
  color: var(--text-primary);
  opacity: 0.8;
}

/* Color swatch styles for checkout */
.color-option {
  display: flex;
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
</style> 