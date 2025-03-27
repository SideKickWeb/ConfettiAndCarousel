<template>
  <div class="product-item">
    <h3>{{ product.name }}</h3>
    <p>${{ formatPrice(product.price) }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  product: Object
})

const formatPrice = (price) => {
  if (price === undefined || price === null) return '0.00'
  return Number(price).toFixed(2)
}
</script> 