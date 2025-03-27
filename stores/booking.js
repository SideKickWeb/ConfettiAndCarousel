import { defineStore } from 'pinia'

export const useBookingStore = defineStore('booking', {
  state: () => ({
    bookings: [],
    currentBooking: null,
    loading: false,
    error: null
  }),
  
  getters: {
    getUserBookings: (state) => {
      return state.bookings
    }
  },
  
  actions: {
    async createBooking(bookingData) {
      this.loading = true
      this.error = null
      
      try {
        const response = await fetch('/api/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(bookingData)
        })
        
        if (!response.ok) {
          const data = await response.json()
          this.error = data.message || 'Failed to create booking'
          return null
        }
        
        const booking = await response.json()
        this.bookings.unshift(booking)
        return booking
      } catch (error) {
        console.error('Error creating booking:', error)
        this.error = 'An unexpected error occurred'
        return null
      } finally {
        this.loading = false
      }
    },
    
    async fetchUserBookings() {
      this.loading = true
      this.error = null
      
      try {
        const response = await fetch('/api/bookings/user')
        
        if (!response.ok) {
          const data = await response.json()
          this.error = data.message || 'Failed to fetch bookings'
          return
        }
        
        this.bookings = await response.json()
      } catch (error) {
        console.error('Error fetching user bookings:', error)
        this.error = 'An unexpected error occurred'
      } finally {
        this.loading = false
      }
    },
    
    async cancelBooking(bookingId) {
      this.loading = true
      this.error = null
      
      try {
        const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
          method: 'POST'
        })
        
        if (!response.ok) {
          const data = await response.json()
          this.error = data.message || 'Failed to cancel booking'
          return false
        }
        
        // Update the booking status in our store
        const index = this.bookings.findIndex(b => b.id === bookingId)
        if (index !== -1) {
          this.bookings[index].status = 'CANCELLED'
        }
        
        return true
      } catch (error) {
        console.error('Error cancelling booking:', error)
        this.error = 'An unexpected error occurred'
        return false
      } finally {
        this.loading = false
      }
    }
  }
}) 