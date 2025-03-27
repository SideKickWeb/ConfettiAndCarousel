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
                <div class="item-name">
                  <span>{{ item.product.name }}</span>
                  <span class="item-quantity">x{{ item.quantity }}</span>
                </div>
                <div class="item-price">£{{ formatPrice(item.product.price * item.quantity) }}</div>
              </div>
            </div>
            <div class="order-total">
              <span>Total</span>
              <span>£{{ formatPrice(cartStore.totalPrice) }}</span>
            </div>
          </div>

          <!-- Customer Information -->
          <div class="checkout-section">
            <h2>Your Information</h2>
            <div class="form-group">
              <label for="name">Full Name</label>
              <input
                type="text"
                id="name"
                v-model="customerInfo.name"
                required
                placeholder="Your full name"
              />
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
                  required
                  placeholder="Your phone number"
                />
              </div>
            </div>
          </div>

          <!-- Shipping Information -->
          <div class="checkout-section">
            <h2>Shipping Address</h2>
            <div class="form-group">
              <label for="address">Street Address</label>
              <input
                type="text"
                id="address"
                v-model="shippingInfo.address"
                required
                placeholder="Street address"
              />
            </div>
            
            <div class="form-grid">
              <div class="form-group">
                <label for="city">City</label>
                <input
                  type="text"
                  id="city"
                  v-model="shippingInfo.city"
                  required
                  placeholder="City"
                />
              </div>
              
              <div class="form-group">
                <label for="postalCode">Postal Code</label>
                <input
                  type="text"
                  id="postalCode"
                  v-model="shippingInfo.postalCode"
                  required
                  placeholder="Postal code"
                />
              </div>
            </div>
          </div>

          <!-- Payment Method -->
          <div class="checkout-section">
            <h2>Payment Method</h2>
            <p class="payment-info">
              Payment will be collected after your order has been reviewed and confirmed by our team. We'll contact you with payment instructions once your order is approved.
            </p>
            
            <!-- Comprehensive disclaimer -->
            <div class="disclaimer-box">
              <h4>Important Information</h4>
              <ul>
                <li><strong>Prices shown are not final.</strong> Customizations and additional product additions might change the total price based on your specific requirements.</li>
                <li><strong>Availability is not guaranteed.</strong> Your order is subject to product availability and will be reviewed.</li>
                <li><strong>Confirmation process:</strong> After submitting this request, our team will review your order, confirm availability, and contact you for payment.</li>
                <li><strong>Your order is only guaranteed</strong> after payment is received and confirmed by our team.</li>
              </ul>
            </div>
            
            <!-- Acknowledgment checkbox -->
            <div class="acknowledgment-wrapper">
              <label class="checkbox-container">
                <input type="checkbox" v-model="acknowledgmentChecked" required>
                <span class="checkmark"></span>
                <span class="acknowledgment-text">I have read and acknowledge the <strong>important information</strong> above regarding pricing, availability, confirmation process, and that my order is only guaranteed after payment is received and confirmed.</span>
              </label>
            </div>
          </div>

          <!-- Order Actions -->
          <div class="checkout-actions">
            <button type="submit" class="place-order-btn" :disabled="isProcessing || !acknowledgmentChecked">
              {{ isProcessing ? 'Processing...' : 'Place Order' }}
            </button>
            <NuxtLink to="/basket" class="back-to-basket">
              Back to Basket
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
          <h2>Thank You For Your Order!</h2>
          <p>Your order has been received and is being processed.</p>
          <p>Order reference: <strong>{{ orderReference }}</strong></p>
          <p>A confirmation email has been sent to <strong>{{ customerInfo.email }}</strong>.</p>
          <NuxtLink to="/products" class="primary-button">
            Continue Shopping
          </NuxtLink>
        </div>
      </div>
    </div>

    <TheFooter />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCartStore } from '../stores/cart'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()

// Order state
const customerInfo = ref({
  name: '',
  email: '',
  phone: ''
})

const shippingInfo = ref({
  address: '',
  city: '',
  postalCode: ''
})

const isProcessing = ref(false)
const orderComplete = ref(false)
const orderReference = ref('')
const acknowledgmentChecked = ref(false)

// If user is logged in, pre-fill their information
onMounted(() => {
  if (authStore.isAuthenticated) {
    customerInfo.value.name = `${authStore.firstName || ''} ${authStore.lastName || ''}`.trim()
    customerInfo.value.email = authStore.email || ''
  }
  
  // Load cart items
  cartStore.loadFromLocalStorage()
  
  // If cart is empty, redirect to products
  if (!cartStore.hasItems) {
    router.push('/products')
  }
})

// Format price to show 2 decimal places
const formatPrice = (price) => {
  return parseFloat(price || 0).toFixed(2)
}

// Generate a random order reference
const generateOrderReference = () => {
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `ORD-${timestamp}-${random}`
}

// Submit the order
const submitOrder = async () => {
  if (!cartStore.hasItems) return
  
  isProcessing.value = true
  
  try {
    // In a real app, you would send this data to your backend
    const orderData = {
      customer: customerInfo.value,
      shipping: shippingInfo.value,
      items: cartStore.items,
      total: cartStore.totalPrice,
      date: new Date()
    }
    
    console.log('Order submitted:', orderData)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Generate order reference
    orderReference.value = generateOrderReference()
    
    // Clear cart after successful order
    cartStore.clearCart()
    
    // Show confirmation
    orderComplete.value = true
  } catch (error) {
    console.error('Error submitting order:', error)
    alert('There was an error processing your order. Please try again.')
  } finally {
    isProcessing.value = false
  }
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

.item-name {
  display: flex;
  align-items: center;
}

.item-quantity {
  margin-left: 0.5rem;
  background-color: var(--hover-bg);
  color: var(--text-primary);
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.item-price {
  font-weight: 600;
}

.order-total {
  display: flex;
  justify-content: space-between;
  font-weight: 700;
  font-size: 1.1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
  color: var(--accent-primary);
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
</style> 