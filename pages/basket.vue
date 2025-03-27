<template>
  <div class="page-wrapper">
    <TheNavbar />

    <div class="content">
      <div class="basket-header">
        <div class="header-content">
          <h1>Your Shopping Basket</h1>
          <p>Review and manage the items in your basket</p>
        </div>
      </div>

      <div class="basket-content">
        <!-- Empty state -->
        <div v-if="!cartStore.hasItems" class="empty-basket">
          <div class="empty-basket-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </div>
          <h2>Your basket is empty</h2>
          <p>Looks like you haven't added any items to your basket yet.</p>
          <NuxtLink to="/products" class="primary-button">
            Browse Products
          </NuxtLink>
        </div>

        <!-- Basket items -->
        <div v-else class="basket-items-container">
          <div class="basket-items">
            <div v-for="item in cartStore.items" :key="item.id" class="basket-item">
              <div class="item-image">
                <img v-if="item.product.image" :src="item.product.image" :alt="item.product.name">
                <div v-else class="no-image">
                  <span>No image</span>
                </div>
              </div>

              <div class="item-details">
                <h3>{{ item.product.name }}</h3>
                <p v-if="item.product.categoryName" class="item-category">{{ item.product.categoryName }}</p>
                <p class="item-price">£{{ formatPrice(item.product.price) }}</p>
                
                <div v-if="item.customOptions && item.customOptions.length" class="item-options">
                  <p class="options-title">Options:</p>
                  <ul>
                    <li v-for="option in item.customOptions" :key="option.optionId">
                      {{ option.optionName }}: {{ option.value }}
                    </li>
                  </ul>
                </div>
              </div>

              <div class="item-actions">
                <div class="quantity-selector">
                  <button 
                    type="button" 
                    @click="decrementQuantity(item)" 
                    class="quantity-btn"
                    :disabled="item.quantity <= 1"
                  >-</button>
                  <span class="quantity">{{ item.quantity }}</span>
                  <button 
                    type="button" 
                    @click="incrementQuantity(item)" 
                    class="quantity-btn"
                  >+</button>
                </div>
                <div class="item-total">
                  £{{ formatPrice(item.product.price * item.quantity) }}
                </div>
                <button 
                  type="button" 
                  @click="removeItem(item.id)" 
                  class="remove-btn"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>

          <div class="basket-summary">
            <div class="summary-header">
              <h2>Order Summary</h2>
            </div>
            <div class="summary-body">
              <div class="summary-row">
                <span>Subtotal ({{ cartStore.itemCount }} items)</span>
                <span>£{{ formatPrice(cartStore.totalPrice) }}</span>
              </div>
              <div class="summary-row">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div class="summary-total">
                <span>Total</span>
                <span>£{{ formatPrice(cartStore.totalPrice) }}</span>
              </div>
              <div class="summary-notice">
                <p>Final price and shipping costs will be confirmed at checkout.</p>
              </div>
            </div>
            <div class="summary-actions">
              <button 
                type="button" 
                @click="proceedToCheckout" 
                class="checkout-button"
                :disabled="!cartStore.hasItems"
              >
                Proceed to Checkout
              </button>
              <NuxtLink to="/products" class="continue-shopping">
                Continue Shopping
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notifications -->
    <div class="toast-container">
      <div v-for="(toast, index) in toasts" :key="index" class="toast">
        <span class="toast-icon">{{ toast.type === 'success' ? '✓' : 'ℹ️' }}</span>
        <span>{{ toast.message }}</span>
      </div>
    </div>

    <TheFooter />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useCartStore } from '../stores/cart'
import { useRouter } from 'vue-router'

const router = useRouter()
const cartStore = useCartStore()
const toasts = ref([])

// Load cart data from localStorage on component mount
onMounted(() => {
  cartStore.loadFromLocalStorage()
})

// Format price to show 2 decimal places
const formatPrice = (price) => {
  return parseFloat(price || 0).toFixed(2)
}

// Increase item quantity
const incrementQuantity = (item) => {
  cartStore.updateQuantity(item.id, item.quantity + 1)
  showToast('Item quantity updated', 'success')
}

// Decrease item quantity
const decrementQuantity = (item) => {
  if (item.quantity > 1) {
    cartStore.updateQuantity(item.id, item.quantity - 1)
    showToast('Item quantity updated', 'success')
  }
}

// Remove item from cart
const removeItem = (itemId) => {
  cartStore.removeItem(itemId)
  showToast('Item removed from basket', 'success')
}

// Proceed to checkout
const proceedToCheckout = () => {
  if (cartStore.hasItems) {
    router.push('/checkout')
  }
}

// Display toast notification
const showToast = (message, type = 'success') => {
  const toast = { message, type }
  toasts.value.push(toast)
  setTimeout(() => {
    const index = toasts.value.indexOf(toast)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
  }, 3000)
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

.basket-header {
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

.basket-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem 4rem;
  width: 100%;
}

/* Empty basket styling */
.empty-basket {
  background-color: var(--card-bg);
  border-radius: 12px;
  padding: 3rem;
  text-align: center;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 20px var(--shadow-color);
}

.empty-basket-icon {
  color: var(--accent-primary);
  margin-bottom: 1.5rem;
}

.empty-basket h2 {
  font-size: 1.8rem;
  color: var(--accent-primary);
  margin-bottom: 1rem;
}

.empty-basket p {
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

/* Basket items styling */
.basket-items-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 1024px) {
  .basket-items-container {
    grid-template-columns: 2fr 1fr;
  }
}

.basket-items {
  background-color: var(--card-bg);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 20px var(--shadow-color);
  overflow: hidden;
}

.basket-item {
  display: grid;
  grid-template-columns: 100px 1fr auto;
  gap: 1rem;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.basket-item:last-child {
  border-bottom: none;
}

.item-image {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--hover-bg);
  color: var(--text-primary);
  font-size: 0.8rem;
}

.item-details {
  display: flex;
  flex-direction: column;
}

.item-details h3 {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: var(--accent-primary);
}

.item-category {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.item-price {
  font-weight: 600;
  color: var(--text-primary);
}

.item-options {
  margin-top: 0.5rem;
  font-size: 0.9rem;
}

.options-title {
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.item-options ul {
  list-style-type: none;
  padding-left: 0;
}

.item-options li {
  color: var(--text-secondary);
  margin-bottom: 0.2rem;
}

.item-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.75rem;
}

.quantity-selector {
  display: flex;
  align-items: center;
  border: 1px solid var(--border-color);
  border-radius: 4px;
}

.quantity-btn {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-secondary);
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.quantity-btn:hover:not(:disabled) {
  background-color: var(--hover-bg);
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity {
  width: 40px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-left: 1px solid var(--border-color);
  border-right: 1px solid var(--border-color);
}

.item-total {
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--text-primary);
}

.remove-btn {
  background: none;
  border: none;
  color: var(--error-color, #ef4444);
  cursor: pointer;
  font-size: 0.9rem;
  padding: 0;
}

.remove-btn:hover {
  text-decoration: underline;
}

/* Basket summary styling */
.basket-summary {
  background-color: var(--card-bg);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 20px var(--shadow-color);
  overflow: hidden;
  height: fit-content;
  position: sticky;
  top: 100px;
}

.summary-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.summary-header h2 {
  font-size: 1.5rem;
  color: var(--accent-primary);
  margin: 0;
}

.summary-body {
  padding: 1.5rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.summary-total {
  display: flex;
  justify-content: space-between;
  padding-top: 1rem;
  margin-top: 1rem;
  border-top: 1px solid var(--border-color);
  font-weight: 700;
  font-size: 1.2rem;
  color: var(--text-primary);
}

.summary-notice {
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.summary-actions {
  padding: 1.5rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.checkout-button {
  width: 100%;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(to right, var(--accent-primary), var(--accent-secondary));
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;
}

.checkout-button:hover:not(:disabled) {
  background: linear-gradient(to right, var(--accent-secondary), var(--accent-primary));
  transform: translateY(-2px);
}

.checkout-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.continue-shopping {
  display: block;
  text-align: center;
  color: var(--accent-primary);
  text-decoration: none;
  font-weight: 500;
}

.continue-shopping:hover {
  text-decoration: underline;
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

/* Responsive adjustments */
@media (max-width: 768px) {
  .basket-item {
    grid-template-columns: 80px 1fr;
    grid-template-rows: auto auto;
  }
  
  .item-image {
    width: 80px;
    height: 80px;
    grid-row: span 2;
  }
  
  .item-actions {
    grid-column: 2;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-top: 1rem;
  }
}

@media (max-width: 480px) {
  .basket-header {
    padding: 3rem 0;
  }
  
  .header-content h1 {
    font-size: 2.5rem;
  }
  
  .item-actions {
    flex-wrap: wrap;
  }
}
</style> 