<template>
  <div class="max-w-6xl mx-auto p-6">
    <div class="my-8 text-center">
      <h1 class="text-4xl font-bold mb-2">My Bookings</h1>
      <p class="text-lg text-gray-600">View and manage your event bookings</p>
    </div>

    <div v-if="!authStore.isAuthenticated" class="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-6">
      <p>Please <NuxtLink to="/login" class="underline font-bold">sign in</NuxtLink> to view your bookings.</p>
    </div>

    <div v-else>
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-10">
        <p class="text-gray-600">Loading your bookings...</p>
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
        <p>{{ error }}</p>
        <button @click="fetchBookings" class="mt-2 text-sm underline">Try Again</button>
      </div>
      
      <!-- Empty State -->
      <div v-else-if="bookings.length === 0" class="text-center py-10 bg-gray-50 rounded-lg">
        <p class="text-gray-600 mb-4">You don't have any bookings yet.</p>
        <NuxtLink to="/booking" class="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded">
          Book an Event
        </NuxtLink>
      </div>
      
      <!-- Bookings List -->
      <div v-else class="space-y-6">
        <div v-for="booking in bookings" :key="booking.id" class="bg-white rounded-lg shadow-md overflow-hidden">
          <!-- Booking Header -->
          <div class="p-4 bg-gray-50 border-b flex flex-col md:flex-row justify-between md:items-center">
            <div>
              <div class="flex items-center gap-3">
                <h3 class="text-xl font-semibold">{{ booking.eventType }} Event</h3>
                <span 
                  :class="[
                    'px-2 py-1 text-xs font-medium rounded-full',
                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  ]"
                >
                  {{ booking.status.charAt(0).toUpperCase() + booking.status.slice(1) }}
                </span>
              </div>
              <p class="text-sm text-gray-500">
                {{ new Date(booking.eventDate).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                }) }}
              </p>
            </div>
            <div class="mt-2 md:mt-0 flex gap-2">
              <span 
                v-if="booking.status === 'pending'"
                @click="cancelBooking(booking.id)" 
                class="text-sm text-red-500 hover:text-red-700 cursor-pointer"
              >
                Cancel
              </span>
            </div>
          </div>
          
          <!-- Booking Details -->
          <div class="p-4">
            <div class="mb-4">
              <h4 class="font-medium text-gray-700 mb-1">Event Details</h4>
              <p class="text-gray-600">{{ booking.description || 'No description provided' }}</p>
              <p class="text-sm text-gray-500 mt-1">Guests: {{ booking.guests }}</p>
            </div>
            
            <!-- Products -->
            <div v-if="booking.items && booking.items.length > 0">
              <h4 class="font-medium text-gray-700 mb-2">Ordered Products</h4>
              <div class="border rounded-md overflow-hidden">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th scope="col" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Details
                      </th>
                      <th scope="col" class="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th scope="col" class="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="item in booking.items" :key="item.id">
                      <td class="px-3 py-3 whitespace-nowrap">
                        <div class="text-sm font-medium text-gray-900">{{ item.product.name }}</div>
                      </td>
                      <td class="px-3 py-3">
                        <div class="text-sm text-gray-500">
                          <p v-if="item.variant">Variant: {{ item.variant.name }}</p>
                          <div v-if="item.customValues && item.customValues.length">
                            <p class="text-xs mt-1">Customizations:</p>
                            <ul class="list-disc list-inside ml-2">
                              <li v-for="custom in item.customValues" :key="custom.id" class="text-xs">
                                {{ custom.option.name }}: {{ custom.value }}
                              </li>
                            </ul>
                          </div>
                        </div>
                      </td>
                      <td class="px-3 py-3 whitespace-nowrap text-right">
                        <div class="text-sm text-gray-900">{{ item.quantity }}</div>
                      </td>
                      <td class="px-3 py-3 whitespace-nowrap text-right">
                        <div class="text-sm text-gray-900">${{ (item.product.price * item.quantity).toFixed(2) }}</div>
                      </td>
                    </tr>
                  </tbody>
                  <tfoot class="bg-gray-50">
                    <tr>
                      <td colspan="3" class="px-3 py-2 text-right text-sm font-medium text-gray-500">
                        Total
                      </td>
                      <td class="px-3 py-2 text-right text-sm font-medium text-gray-900">
                        ${{ booking.total ? booking.total.toFixed(2) : calculateTotal(booking.items).toFixed(2) }}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            
            <!-- Created Date -->
            <div class="mt-4 text-xs text-gray-500">
              <p>Booking created: {{ new Date(booking.createdAt).toLocaleString() }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const bookings = ref([])
const loading = ref(false)
const error = ref(null)

onMounted(() => {
  if (authStore.isAuthenticated) {
    fetchBookings()
  }
})

// Calculate total price for a booking (fallback if total is not stored)
const calculateTotal = (items) => {
  return items.reduce((sum, item) => {
    return sum + (item.product.price * item.quantity)
  }, 0)
}

// Fetch user's bookings
const fetchBookings = async () => {
  if (!authStore.isAuthenticated) return
  
  loading.value = true
  error.value = null
  
  try {
    const response = await fetch('/api/bookings/user', {
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    
    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.message || 'Failed to fetch bookings')
    }
    
    bookings.value = await response.json()
  } catch (err) {
    console.error('Error fetching bookings:', err)
    error.value = err.message || 'An unexpected error occurred'
  } finally {
    loading.value = false
  }
}

// Cancel a booking
const cancelBooking = async (bookingId) => {
  if (!confirm('Are you sure you want to cancel this booking?')) {
    return
  }
  
  try {
    const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })
    
    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.message || 'Failed to cancel booking')
    }
    
    // Update status in local state
    const booking = bookings.value.find(b => b.id === bookingId)
    if (booking) {
      booking.status = 'cancelled'
    }
  } catch (err) {
    console.error('Error cancelling booking:', err)
    alert(err.message || 'An unexpected error occurred')
  }
}
</script> 