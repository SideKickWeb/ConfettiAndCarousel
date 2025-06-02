import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: false,
    error: null
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.user,
    isAdmin: (state) => state.user?.role === 'admin' || false,
    firstName: (state) => state.user?.firstName || '',
    lastName: (state) => state.user?.lastName || '',
    fullName: (state) => {
      if (!state.user) return ''
      return `${state.user.firstName} ${state.user.lastName}`
    }
  },
  
  actions: {
    async fetchUser() {
      console.log('AuthStore: fetchUser called')
      console.log('AuthStore: Current user state:', this.user)
      
      if (this.user) {
        console.log('AuthStore: User already exists in store, returning:', this.user)
        return this.user
      }
      
      this.loading = true
      this.error = null
      
      try {
        console.log('AuthStore: Making API request to /api/auth/me')
        const response = await fetch('/api/auth/me')
        
        console.log('AuthStore: Response status:', response.status)
        console.log('AuthStore: Response ok:', response.ok)
        
        if (!response.ok) {
          if (response.status !== 401) {
            const data = await response.json()
            console.log('AuthStore: Error response data:', data)
            this.error = data.message || 'Failed to fetch user'
          }
          this.user = null
          return null
        }
        
        const result = await response.json()
        console.log('AuthStore: API response:', result)
        
        // Handle the API response structure { success: true, data: {...} }
        if (result.success && result.data) {
          console.log('AuthStore: Setting user from result.data:', result.data)
          this.user = result.data
          return result.data
        } else {
          // Fallback for different response structures
          console.log('AuthStore: Setting user from result:', result)
          this.user = result
          return result
        }
      } catch (error) {
        console.error('AuthStore: Error fetching user:', error)
        this.error = 'An unexpected error occurred'
        this.user = null
        return null
      } finally {
        this.loading = false
        console.log('AuthStore: fetchUser completed, final user state:', this.user)
      }
    },
    
    async login(email, password) {
      this.loading = true
      this.error = null
      
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        })
        
        if (!response.ok) {
          const data = await response.json()
          this.error = data.message || 'Login failed'
          return false
        }
        
        const result = await response.json()
        
        // Handle the API response structure { success: true, data: {...} }
        if (result.success && result.data) {
          this.user = result.data
        } else {
          // Fallback for different response structures
          this.user = result
        }
        
        return true
      } catch (error) {
        console.error('Login error:', error)
        this.error = 'An unexpected error occurred'
        return false
      } finally {
        this.loading = false
      }
    },
    
    async register(userData) {
      this.loading = true
      this.error = null
      
      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        })
        
        if (!response.ok) {
          const data = await response.json()
          this.error = data.message || 'Registration failed'
          return false
        }
        
        const user = await response.json()
        this.user = user
        return true
      } catch (error) {
        console.error('Registration error:', error)
        this.error = 'An unexpected error occurred'
        return false
      } finally {
        this.loading = false
      }
    },
    
    async logout() {
      this.loading = true
      
      try {
        const response = await fetch('/api/auth/logout', {
          method: 'POST'
        })
        
        if (!response.ok) {
          const data = await response.json()
          this.error = data.message || 'Logout failed'
          return false
        }
        
        this.user = null
        return true
      } catch (error) {
        console.error('Logout error:', error)
        this.error = 'An unexpected error occurred'
        return false
      } finally {
        this.loading = false
      }
    },
    
    clearError() {
      this.error = null
    }
  }
}) 