<template>
  <div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6">Admin Dashboard</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <NuxtLink to="/admin/products" class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <h3 class="text-xl font-semibold text-brand mb-2">Products</h3>
        <p class="text-gray-600">Manage and update your inventory</p>
      </NuxtLink>
      
      <NuxtLink to="/admin/bookings" class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <h3 class="text-xl font-semibold text-brand mb-2">Bookings</h3>
        <p class="text-gray-600">View and manage customer bookings</p>
      </NuxtLink>
      
      <NuxtLink to="/admin/hero-settings" class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
        <h3 class="text-xl font-semibold text-brand mb-2">Hero Settings</h3>
        <p class="text-gray-600">Customize the homepage hero section</p>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
// Check if user is admin and redirect if not
</script>

<style scoped>
/* Add any additional styling here */
</style> 