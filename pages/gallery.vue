<template>
  <div class="page-wrapper">
    <TheNavbar />
    <main class="content">
      <div class="gallery-header">
        <div class="header-content">
          <h1>Our Gallery</h1>
          <p>Explore our collection of magical moments and creative designs</p>
        </div>
      </div>

      <div class="gallery-grid">
        <div 
          v-for="(row, rowIndex) in visibleRows" 
          :key="rowIndex"
          class="gallery-row animate-section"
          ref="galleryRows"
        >
          <div 
            v-for="(image, index) in row" 
            :key="index"
            class="gallery-card-wrapper"
          >
            <div class="gallery-card">
              <div class="gallery-card-container">
                <img :src="image.url || image.image" :alt="image.title || image.description">
                <div class="gallery-card-content">
                  <div v-if="image.description" class="gallery-caption">{{ image.description }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button 
        v-if="hasMoreImages" 
        @click="loadMore" 
        class="load-more-button"
      >
        Show More
      </button>
    </main>
    <TheFooter />
  </div>
</template>

<script setup>
import { useIntersectionObserver } from '../composables/useIntersectionObserver';

// Fetch Instagram posts
const { data: instagramResponse } = await useFetch('/api/instagram') || { data: ref({}) };

// Base gallery images - as fallback if no Instagram data
const baseImages = [
  {
    id: 1,
    url: '/images/gallery/sweetsixteen1.jpg',
    title: 'Sweet Sixteen Celebration',
    description: 'elegantly modeled \'16\' large with lights',
  },
  {
    id: 2,
    url: '/images/gallery/kidsbday1.jpg',
    title: 'Football 5th Birthday Party',
    description: 'Aston Villa 5th Birthday Party',
  },
  {
    id: 3,
    url: '/images/gallery/adultbday1.jpg',
    title: '40th Birthday Party',
    description: 'Glamorous birthday celebration',
  },
  {
    id: 4,
    url: '/images/gallery/engagement1.jpg',
    title: 'Engagement Party',
    description: 'Elegant indoor event',
  },
  {
    id: 5,
    url: '/images/gallery/wedding1.jpg',
    title: 'Glorious Wedding Day',
    description: 'Majestic wedding decoration',
  },
  {
    id: 6,
    url: '/images/gallery/wedding1.jpg',
    title: 'Glorious Wedding Day',
    description: 'Majestic wedding decoration',
  }
];

// Use Instagram data if available, otherwise use base images
const galleryImages = computed(() => {
  if (instagramResponse.value?.data && instagramResponse.value.data.length > 0) {
    return instagramResponse.value.data;
  }
  
  // Create a larger array with placeholder images after first 6 as fallback
  return [...Array(4)].flatMap((_, i) => 
    baseImages.map((img, index) => {
      const position = index + (i * baseImages.length);
      return {
        ...img,
        id: img.id + (i * baseImages.length),
        url: position < 5 ? img.url : '/images/gallery/placeholder.jpg',
        title: position < 5 ? img.title : 'Sample Title',
        description: position < 5 ? img.description : 'Sample Description'
      };
    })
  );
});

// State
const visibleRows = ref([]);
const rowSize = 3; // Images per row
const initialRows = 2; // Initial number of rows to show
const galleryRows = ref([]);

// Calculate total number of rows
const totalRows = computed(() => Math.ceil(galleryImages.value.length / rowSize));
const currentRow = ref(initialRows);

// Computed property to check if there are more images to load
const hasMoreImages = computed(() => currentRow.value * rowSize < galleryImages.value.length);

// Function to load more images
const loadMore = () => {
  const newRows = getRows(currentRow.value, currentRow.value + 2);
  visibleRows.value = [...visibleRows.value, ...newRows];
  currentRow.value += 2;

  // Setup animation for new rows
  nextTick(() => {
    const newElements = galleryRows.value.slice(visibleRows.value.length - newRows.length);
    newElements.forEach(row => {
      if (row) {
        observeElement(row, () => {
          row.classList.add('visible');
        });
      }
    });
  });
};

// Function to get rows of images
const getRows = (start, end) => {
  const rows = [];
  for (let i = start; i < end && i < totalRows.value; i++) {
    const startIndex = i * rowSize;
    rows.push(galleryImages.value.slice(startIndex, startIndex + rowSize));
  }
  return rows;
};

let observeElement; // Declare outside onMounted to use in loadMore

// Initialize visible rows
onMounted(() => {
  visibleRows.value = getRows(0, initialRows);
  
  // Setup intersection observer for animation
  const { observeElement: observe } = useIntersectionObserver();
  observeElement = observe; // Store for use in loadMore
  
  nextTick(() => {
    galleryRows.value.forEach(row => {
      if (row) {
        observeElement(row, () => {
          row.classList.add('visible');
        });
      }
    });
  });
});
</script>

<style scoped>
.page-wrapper {
  min-height: 100vh;
  background-color: var(--bg-primary);
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  overflow-x: clip;
}

.content {
  flex: 1;
  padding-top: 80px;
  width: 100%;
  max-width: var(--content-max-width);
  margin: 0 auto;
  position: relative;
  overflow-x: clip;
}

.gallery-header {
  text-align: center;
  padding: 4rem 0;
  background: var(--service-card-bg);
  margin-bottom: 3rem;
  position: relative;
  width: 100vw;
  left: calc(-50vw + 50%);
  right: calc(-50vw + 50%);
  overflow: hidden;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  text-align: center;
}

.gallery-header h1 {
  color: var(--accent-primary);
  font-size: 3rem;
  margin-bottom: 1rem;
}

.gallery-grid {
  max-width: min(1400px, 100%);
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

.gallery-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-bottom: 2rem;
  width: 100%;
  box-sizing: border-box;
}

.gallery-card-wrapper {
  aspect-ratio: 4/5;
  width: 100%;
}

.gallery-card {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px var(--shadow-color);
  border: 1px solid var(--border-color);
}

.gallery-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 24px var(--shadow-color);
}

.gallery-card-container {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
}

.gallery-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  display: block;
}

.gallery-card:hover img {
  transform: scale(1.05);
}

.gallery-caption {
  font-size: 1rem;
  color: white;
  line-height: 1.5;
  max-height: 150px;
  overflow-y: auto;
  word-break: break-word;
  padding-right: 10px;
  scrollbar-width: thin;
  scrollbar-color: var(--accent-primary, #b8860b) rgba(0, 0, 0, 0.2);
}

/* Custom scrollbar for WebKit browsers */
.gallery-caption::-webkit-scrollbar {
  width: 6px;
}

.gallery-caption::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
}

.gallery-caption::-webkit-scrollbar-thumb {
  background: var(--accent-primary, #b8860b);
  border-radius: 10px;
}

.gallery-caption::-webkit-scrollbar-thumb:hover {
  background: var(--accent-secondary, #daa520);
}

.gallery-card-content {
  padding: 1.5rem;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  opacity: 0;
  transition: opacity 0.3s ease;
  transform: translateY(0);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  text-align: left;
  max-height: 70%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.gallery-card:hover .gallery-card-content {
  opacity: 1;
}

.load-more-button {
  display: block;
  margin: 3rem auto;
  padding: 1rem 2.5rem;
  background: var(--button-gradient);
  color: var(--button-text);
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.load-more-button:hover {
  background: var(--button-hover);
  transform: translateY(-2px);
}

.animate-section {
  opacity: 0;
  transform: translateY(50px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.animate-section.visible {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 1024px) {
  .gallery-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .gallery-row {
    grid-template-columns: 1fr;
  }

  .gallery-header {
    padding: 3rem 1rem;
  }

  .gallery-grid {
    padding: 0 1rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .animate-section {
    transition: none;
    transform: none;
    opacity: 1;
  }
}
</style> 