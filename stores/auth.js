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
      if (this.user) return this.user
      
      this.loading = true
      this.error = null
      
      try {
        const response = await fetch('/api/auth/me')
        if (!response.ok) {
          if (response.status !== 401) {
            const data = await response.json()
            this.error = data.message || 'Failed to fetch user'
          }
          this.user = null
          return null
        }
        
        const userData = await response.json()
        this.user = userData
        return userData
      } catch (error) {
        console.error('Error fetching user:', error)
        this.error = 'An unexpected error occurred'
        this.user = null
        return null
      } finally {
        this.loading = false
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
        
        const userData = await response.json()
        this.user = userData
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