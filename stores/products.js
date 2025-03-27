import { defineStore } from 'pinia'

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: [],
    categories: [],
    totalCount: 0,
    loading: false,
    error: null,
    currentProduct: null,
    filters: {
      category: null,
      limit: 10,
      offset: 0
    }
  }),
  
  getters: {
    getProductById: (state) => (id) => {
      return state.products.find(product => product.id === id)
    },
    
    getProductsByCategory: (state) => (category) => {
      if (!category) return state.products
      return state.products.filter(product => product.category === category)
    },
    
    hasMoreProducts: (state) => {
      return state.offset + state.limit < state.totalCount
    }
  },
  
  actions: {
    async fetchProducts(category = null) {
      this.loading = true;
      this.error = null;

      try {
        const url = new URL('/api/products', window.location.origin);
        if (category) {
          url.searchParams.append('category', category);
        }

        console.log('Fetching products from:', url.toString());
        const response = await fetch(url, {
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
          }
        });
        
        if (!response.ok) {
          throw new Error(`API returned status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Response data:', data);

        if (data.success === false) {
          console.error('API error:', data.message);
          this.error = data.message || 'Failed to fetch products';
          return;
        }

        // Handle the API response format and ensure backward compatibility with category data
        this.products = (data.data || []).map(product => ({
          ...product,
          // Ensure we have both category and categoryId for compatibility
          category: product.categoryId || product.category,
          categoryId: product.categoryId || product.category
        }));
        console.log('Products fetched successfully:', this.products.length);
        
        // Fetch categories after products
        await this.fetchCategories();
      } catch (error) {
        console.error('Error fetching products:', error);
        this.error = 'Failed to fetch products: ' + (error.message || error);
      } finally {
        this.loading = false;
      }
    },
    
    async fetchCategories() {
      this.loading = true
      this.error = null
      
      try {
        console.log('Fetching categories')
        const response = await fetch('/api/products/categories', {
          headers: {
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
          }
        })
        
        if (!response.ok) {
          throw new Error(`API returned status: ${response.status}`);
        }
        
        const data = await response.json()
        console.log('Categories response:', data)
        
        if (data.success === false) {
          console.error('API error:', data.message)
          this.error = data.message || 'Failed to fetch categories'
          return
        }
        
        // Ensure the categories are properly formatted
        if (Array.isArray(data.data)) {
          this.categories = data.data.map(cat => ({
            value: cat.value || cat.id || '',
            label: cat.label || cat.name || 'Unnamed Category',
            description: cat.description || ''
          }))
        } else {
          this.categories = []
        }
        
        console.log('Categories processed:', this.categories)
      } catch (error) {
        console.error('Error fetching categories:', error)
        this.error = 'An unexpected error occurred: ' + (error.message || error)
      } finally {
        this.loading = false
      }
    },
    
    async fetchProductById(id) {
      this.loading = true
      this.error = null
      this.currentProduct = null
      
      try {
        const response = await fetch(`/api/products/${id}`)
        
        if (!response.ok) {
          const data = await response.json()
          this.error = data.message || 'Failed to fetch product'
          return null
        }
        
        const product = await response.json()
        this.currentProduct = product
        return product
      } catch (error) {
        console.error('Error fetching product:', error)
        this.error = 'An unexpected error occurred'
        return null
      } finally {
        this.loading = false
      }
    },
    
    async createProduct(productData) {
      this.loading = true
      this.error = null
      
      try {
        const response = await fetch('/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(productData)
        })
        
        if (!response.ok) {
          const data = await response.json()
          this.error = data.message || 'Failed to create product'
          return null
        }
        
        const product = await response.json()
        // Add the new product to the list
        this.products.unshift(product)
        this.totalCount++
        return product
      } catch (error) {
        console.error('Error creating product:', error)
        this.error = 'An unexpected error occurred'
        return null
      } finally {
        this.loading = false
      }
    },
    
    async updateProduct(id, productData) {
      this.loading = true
      this.error = null
      
      try {
        const response = await fetch(`/api/products/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(productData)
        })
        
        if (!response.ok) {
          const data = await response.json()
          this.error = data.message || 'Failed to update product'
          return null
        }
        
        const updatedProduct = await response.json()
        
        // Update the product in the list
        const index = this.products.findIndex(p => p.id === id)
        if (index !== -1) {
          this.products[index] = updatedProduct
        }
        
        // Update current product if it's the same one
        if (this.currentProduct?.id === id) {
          this.currentProduct = updatedProduct
        }
        
        return updatedProduct
      } catch (error) {
        console.error('Error updating product:', error)
        this.error = 'An unexpected error occurred'
        return null
      } finally {
        this.loading = false
      }
    },
    
    async deleteProduct(id) {
      this.loading = true
      this.error = null
      
      try {
        const response = await fetch(`/api/products/${id}`, {
          method: 'DELETE'
        })
        
        if (!response.ok) {
          const data = await response.json()
          this.error = data.message || 'Failed to delete product'
          return false
        }
        
        // Remove the product from the list
        this.products = this.products.filter(p => p.id !== id)
        this.totalCount--
        
        // Reset current product if it's the same one
        if (this.currentProduct?.id === id) {
          this.currentProduct = null
        }
        
        return true
      } catch (error) {
        console.error('Error deleting product:', error)
        this.error = 'An unexpected error occurred'
        return false
      } finally {
        this.loading = false
      }
    },
    
    setFilters(filters) {
      this.filters = { ...this.filters, ...filters }
      // Reset offset when changing filters
      if ('category' in filters) {
        this.filters.offset = 0
      }
    },
    
    nextPage() {
      this.filters.offset += this.filters.limit
      return this.fetchProducts()
    },
    
    previousPage() {
      this.filters.offset = Math.max(0, this.filters.offset - this.filters.limit)
      return this.fetchProducts()
    },
    
    clearError() {
      this.error = null
    }
  }
}) 