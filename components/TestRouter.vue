<template>
  <div class="test-router">
    <h3 class="text-pink-600 font-semibold mb-3">Navigation Links</h3>
    <ul>
      <li><NuxtLink to="/" class="text-pink-500 hover:text-pink-700 transition-colors">Home</NuxtLink></li>
      <li><NuxtLink to="/services" class="text-pink-500 hover:text-pink-700 transition-colors">Services</NuxtLink></li>
      <li><NuxtLink to="/booking" class="text-pink-500 hover:text-pink-700 transition-colors">Booking</NuxtLink></li>
      <li><NuxtLink to="/booking-new" class="text-pink-500 hover:text-pink-700 transition-colors">New Booking Page</NuxtLink></li>
    </ul>
  </div>
</template>

<script setup>
// Nothing needed here
</script>

<style scoped>
.test-router {
  margin: 20px;
  padding: 15px;
  border: 1px solid #fbcfe8; /* pink-200 */
  border-radius: 8px;
  background-color: #fdf2f8; /* pink-50 */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

ul {
  list-style: none;
  padding: 0;
}

li {
  margin: 8px 0;
}

a {
  text-decoration: none;
  font-weight: 500;
}

a:hover {
  text-decoration: underline;
}
</style> 