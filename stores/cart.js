import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    loading: false,
    error: null
  }),
  
  getters: {
    itemCount: (state) => {
      return state.items.reduce((count, item) => count + item.quantity, 0)
    },
    
    totalPrice: (state) => {
      return state.items.reduce((total, item) => {
        let basePrice = Number(item.product.price) * item.quantity;
        let optionsPrice = 0;
        
        if (item.customOptions && Array.isArray(item.customOptions)) {
          optionsPrice = item.customOptions.reduce((sum, option) => {
            return sum + ((option.priceAdjustment || 0) * item.quantity);
          }, 0);
        }
        
        return total + basePrice + optionsPrice;
      }, 0)
    },
    
    hasItems: (state) => {
      return state.items.length > 0
    }
  },
  
  actions: {
    addToCart(product, quantity = 1, customOptions = []) {
      // Check if product is already in cart
      const existingItemIndex = this.items.findIndex(item => 
        item.product.id === product.id && 
        JSON.stringify(item.customOptions) === JSON.stringify(customOptions)
      )
      
      if (existingItemIndex !== -1) {
        // Update quantity if already in cart
        this.items[existingItemIndex].quantity += quantity
      } else {
        // Add new item to cart
        this.items.push({
          id: Date.now().toString(), // Generate temporary unique ID
          product,
          quantity,
          customOptions,
          addedAt: new Date()
        })
      }
      
      // Save to local storage
      this.saveToLocalStorage()
    },
    
    updateQuantity(itemId, quantity) {
      const itemIndex = this.items.findIndex(item => item.id === itemId)
      if (itemIndex !== -1) {
        this.items[itemIndex].quantity = quantity
        this.saveToLocalStorage()
      }
    },
    
    removeItem(itemId) {
      this.items = this.items.filter(item => item.id !== itemId)
      this.saveToLocalStorage()
    },
    
    clearCart() {
      this.items = []
      localStorage.removeItem('cartItems')
    },
    
    saveToLocalStorage() {
      localStorage.setItem('cartItems', JSON.stringify(this.items))
    },
    
    loadFromLocalStorage() {
      const savedCart = localStorage.getItem('cartItems')
      if (savedCart) {
        try {
          this.items = JSON.parse(savedCart)
        } catch (e) {
          console.error('Failed to parse cart from localStorage', e)
          this.items = []
        }
      }
    }
  }
}) 