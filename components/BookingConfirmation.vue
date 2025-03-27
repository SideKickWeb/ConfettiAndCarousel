<template>
  <div class="booking-confirmation">
    <div class="bg-white p-6 rounded-lg shadow-lg border border-pink-100">
      <div class="text-center mb-6">
        <h2 class="text-2xl font-bold text-pink-600 mb-2">Booking Confirmation</h2>
        <p class="text-gray-600">Thank you for your booking request!</p>
      </div>

      <div class="mb-6">
        <h3 class="text-lg font-semibold text-pink-500 mb-2">Event Details</h3>
        <div class="bg-pink-50 p-4 rounded-md">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-500">Event Type</p>
              <p class="font-medium">{{ booking.eventType }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Date</p>
              <p class="font-medium">{{ formatDate(booking.date) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Time</p>
              <p class="font-medium">{{ booking.time }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500">Location</p>
              <p class="font-medium">{{ booking.location }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-6">
        <h3 class="text-lg font-semibold text-pink-500 mb-2">Selected Items</h3>
        <div class="border border-pink-100 rounded-md divide-y divide-pink-100">
          <div v-for="(item, index) in booking.items" :key="index" class="p-4 hover:bg-pink-50 transition-colors">
            <div class="flex justify-between mb-2">
              <p class="font-medium">{{ item.name }}</p>
              <p class="font-medium text-pink-600">${{ formatPrice(item.price) }} × {{ item.quantity }}</p>
            </div>
            <div v-if="item.customValues && Object.keys(item.customValues).length > 0" class="mt-2 text-sm text-gray-600">
              <div v-for="(value, key) in item.customValues" :key="key" class="flex">
                <span class="w-24 text-pink-400">{{ key }}:</span>
                <span>{{ value }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-between font-semibold text-lg border-t border-pink-100 pt-4">
        <span>Total:</span>
        <span class="text-pink-600">${{ formatPrice(calculateTotal()) }}</span>
      </div>

      <div class="mt-6 text-center">
        <p class="text-gray-600 mb-4">
          We'll review your booking details and contact you shortly to confirm your reservation.
        </p>
        <button @click="$emit('close')" class="bg-pink-500 hover:bg-pink-600 text-white py-2 px-6 rounded-lg transition shadow-md hover:shadow-lg">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  booking: {
    type: Object,
    required: true
  }
})

defineEmits(['close'])

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

// Format price
const formatPrice = (price) => {
  return Number(price || 0).toFixed(2)
}

// Calculate total price
const calculateTotal = () => {
  if (!props.booking.items || !props.booking.items.length) return 0
  
  return props.booking.items.reduce((total, item) => {
    return total + (Number(item.price || 0) * Number(item.quantity || 1))
  }, 0)
}
</script>

<style scoped>
.booking-confirmation {
  max-width: 680px;
  margin: 0 auto;
}
</style> 