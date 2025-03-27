<!-- HeroSection.vue -->
<script setup>
import { ref, computed, onMounted } from 'vue';

const heroSettings = ref(null);
const isLoading = ref(true);
const error = ref(null);

// Fetch hero settings
const fetchHeroSettings = async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    console.log('Fetching hero settings from API...');
    const response = await $fetch('/api/hero');
    console.log('API response:', response);
    
    if (response && response.id) {
      heroSettings.value = response;
      console.log('Hero settings loaded successfully:', heroSettings.value);
    } else {
      console.warn('API returned empty or invalid data');
      // Use fallback if data is empty or invalid
      heroSettings.value = {
        imageUrl: '/images/gallery/placeholder.jpg',
        title: 'Fallback: API returned empty data',
        description: 'Please check that you have hero settings configured in the database.',
        buttonText: 'Learn More',
        buttonLink: '/contact',
        textPosition: 'left'
      };
    }
  } catch (err) {
    console.error('Error fetching hero settings:', err);
    error.value = err.message || 'Failed to fetch hero settings';
    // Set default hero settings if API fails
    heroSettings.value = {
      imageUrl: '/images/gallery/placeholder.jpg',
      title: 'Error: ' + (err.message || 'Unknown error'),
      description: 'Could not load hero settings from the database.',
      buttonText: 'Learn More',
      buttonLink: '/contact',
      textPosition: 'left'
    };
  } finally {
    isLoading.value = false;
  }
};

// Load hero settings on mount
onMounted(() => {
  console.log('HeroSection component mounted');
  fetchHeroSettings();
});

// Calculate hero content classes based on text position
const heroContentClasses = computed(() => {
  if (!heroSettings.value) return 'hero-content-left';
  
  const position = heroSettings.value.textPosition || 'left';
  console.log('Text position:', position);
  
  switch (position) {
    case 'center': return 'hero-content-center';
    case 'right': return 'hero-content-right';
    case 'left':
    default: return 'hero-content-left';
  }
});
</script>

<template>
  <section class="hero-section">
    <div class="hero-overlay"></div>
    <img 
      :src="heroSettings?.imageUrl || '/images/gallery/placeholder.jpg'" 
      :alt="heroSettings?.title || 'Hero Image'" 
      class="hero-image"
    >
    <div class="hero-content" :class="heroContentClasses">
      <h1>{{ heroSettings?.title || 'Loading...' }}</h1>
      <p>{{ heroSettings?.description || '' }}</p>
      <a :href="heroSettings?.buttonLink || '/contact'" class="hero-button">
        {{ heroSettings?.buttonText || 'Learn More' }}
      </a>
    </div>
  </section>
</template>

<style scoped>
.hero-section {
  position: relative;
  height: 100vh;
  width: 100vw;
  max-width: 100%;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  text-align: left;
  color: #fff;
  overflow: hidden;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--hero-bg, linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)));
  z-index: 1;
}

.hero-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 600px;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  box-shadow: 0 10px 30px var(--shadow-color);
}

.hero-content h1 {
  font-size: clamp(2rem, 6vw, 3rem);
  margin-bottom: 1rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  color: var(--hero-text, #fff);
}

.hero-content p {
  font-size: clamp(1.1rem, 3vw, 1.5rem);
  margin-bottom: 2rem;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
  color: var(--hero-text, #fff);
}

.hero-button {
  display: inline-block;
  padding: 1rem 2rem;
  background: var(--button-gradient);
  color: white;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  text-decoration: none;
}

.hero-button:hover {
  background: var(--button-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

/* Text position variations */
.hero-content-left {
  left: 10%;
  margin-right: auto;
  text-align: left;
}

.hero-content-center {
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
}

.hero-content-right {
  right: 10%;
  margin-left: auto;
  text-align: right;
}

/* Responsive adjustments */
@media (max-width: 1366px) {
  .hero-content {
    max-width: 550px;
  }
}

@media (max-width: 992px) {
  .hero-content {
    max-width: 500px;
  }
}

@media (max-width: 768px) {
  .hero-content {
    max-width: 90%;
    padding: 1.5rem;
  }
  
  .hero-button {
    padding: 0.75rem 1.5rem;
  }
  
  .hero-content-left, .hero-content-right {
    margin: 0 auto;
    left: 5%;
    right: 5%;
    width: 90%;
  }
  
  .hero-content-center {
    width: 90%;
  }
}

@media (max-width: 576px) {
  .hero-section {
    height: 80vh; /* Slightly smaller on mobile */
  }
  
  .hero-content {
    padding: 1.25rem;
    width: 95%;
  }
  
  .hero-content-left, .hero-content-right, .hero-content-center {
    left: 2.5%;
    right: 2.5%;
    width: 95%;
  }
}

/* Handle extra wide screens */
@media (min-width: 2000px) {
  .hero-content {
    max-width: 700px;
  }
}

/* Landscape orientation adjustments */
@media (max-height: 600px) and (orientation: landscape) {
  .hero-section {
    height: 100vh;
  }
  
  .hero-content {
    max-width: 70%;
    padding: 1rem;
  }
  
  .hero-content h1 {
    margin-bottom: 0.5rem;
  }
  
  .hero-content p {
    margin-bottom: 1rem;
  }
  
  .hero-button {
    padding: 0.5rem 1rem;
  }
}
</style> 