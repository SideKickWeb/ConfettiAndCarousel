<template>
  <div class="page-wrapper">
    <TheNavbar />
    <div class="hero-wrapper">
      <HeroSection />
    </div>

    <main class="main-content">
      <section class="intro-section animate-section" ref="introSection">
        <h2>Welcome to Luxury Event Design</h2>
        <p>
          Transform your special moments into unforgettable memories with our
          premium event decoration and hosting services. We specialize in
          creating bespoke experiences that reflect your unique style and
          vision.
        </p>
      </section>

      <section class="features animate-section" ref="featuresSection">
        <div class="feature-card">
          <div class="icon">✧</div>
          <h3>Luxury Decoration</h3>
          <p>
            Exquisite themes, premium balloon arrangements, elegant table
            settings, and stunning backdrops for sophisticated occasions.
          </p>
        </div>
        <div class="feature-card">
          <div class="icon">✧</div>
          <h3>Event Planning</h3>
          <p>
            Comprehensive event coordination from concept to execution, ensuring
            every detail meets our luxury standards.
          </p>
        </div>
        <div class="feature-card">
          <div class="icon">✧</div>
          <h3>Premium Supplies</h3>
          <p>
            High-end party supplies, custom decorations, and carefully curated
            accessories for your celebration.
          </p>
        </div>
      </section>

      <section class="services-highlight animate-section" ref="productsSection">
        <h2>Our Products</h2>
        <div class="carousel-container">
          <button
            class="carousel-button prev"
            @click="previousProduct"
            :disabled="!products || products.length <= 1"
          >
            <span>❮</span>
          </button>

          <div class="service-carousel" ref="carousel">
            <div
              v-if="!productResponse || productResponse.loading"
              class="service-item active"
            >
              <div class="loading-indicator">
                <span>Loading products...</span>
              </div>
            </div>
            <div
              v-else-if="!products || products.length === 0"
              class="service-item active"
            >
              <h4>Products Coming Soon</h4>
              <p class="service-description">
                Our product catalog is being updated. Please check back soon!
              </p>
            </div>
            <template v-else>
              <div
                class="service-item"
                v-for="(category, index) in products"
                :key="category.id"
                :class="{ active: currentProductIndex === index }"
              >
                <h4>{{ category.title }}</h4>
                <p class="service-description">{{ category.description }}</p>
                <div class="service-items">
                  <div
                    v-for="(item, itemIndex) in category.items?.slice(0, 3) ||
                    []"
                    :key="item.id"
                    class="service-price-item"
                  >
                    <div class="item-header">
                      <span class="item-name">
                        <NuxtLink
                          :to="`/product/${item.id}`"
                          class="product-link"
                          >{{ item.name }}</NuxtLink
                        >
                      </span>
                      <span class="item-price"
                        >£{{
                          typeof item.price === "number"
                            ? item.price.toFixed(2)
                            : item.price
                        }}</span
                      >
                    </div>
                    <p class="item-details">
                      {{ item.description || "Premium quality product" }}
                    </p>
                  </div>
                  <p
                    v-if="category.items && category.items.length > 3"
                    class="more-items"
                  >
                    +{{ category.items.length - 3 }} more items
                  </p>
                </div>
                <NuxtLink
                  :to="`/products#${category.anchor}`"
                  class="service-link-button"
                  >View All {{ category.title }}
                </NuxtLink>
              </div>
            </template>
          </div>

          <button
            class="carousel-button next"
            @click="nextProduct"
            :disabled="!products || products.length <= 1"
          >
            <span>❯</span>
          </button>
        </div>

        <!-- Carousel indicators -->
        <div v-if="products && products.length > 1" class="carousel-indicators">
          <span
            v-for="(_, index) in products"
            :key="index"
            @click="
              currentProductIndex = index;
              centerActiveCard();
            "
            :class="{ active: currentProductIndex === index }"
            class="carousel-dot"
          ></span>
        </div>
      </section>

      <section class="gallery-section">
        <div class="section-header">
          <h2>Our Gallery</h2>
          <p>
            Explore our collection of beautiful balloon arrangements and
            decorations
          </p>
        </div>

        <div class="gallery-stack">
          <button
            class="gallery-nav-button prev"
            @click="scrollGallery('left')"
            aria-label="Previous gallery card"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <div class="gallery-card-wrapper" ref="galleryWrapper">
            <div
              v-for="(item, index) in galleryItems"
              :key="item.id || index"
              class="gallery-card"
              :class="{ active: selectedCard === index }"
            >
              <a
                :href="item.link"
                target="_blank"
                rel="noopener noreferrer"
                v-if="item.link"
                @click.prevent="handleCardClick(index, item)"
              >
                <img :src="item.image" :alt="item.title" />
                <div class="gallery-card-content">
                  <div v-if="item.description" class="gallery-caption">
                    {{ item.description }}
                  </div>
                </div>
              </a>
              <div
                v-else
                class="gallery-card-container"
                @click="handleCardClick(index, item)"
              >
                <img :src="item.image" :alt="item.title" />
                <div class="gallery-card-content">
                  <div v-if="item.description" class="gallery-caption">
                    {{ item.description }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            class="gallery-nav-button next"
            @click="scrollGallery('right')"
            aria-label="Next gallery card"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </section>

      <section class="booking-cta animate-section" ref="bookingSection">
        <div class="booking-content">
          <h2>Ready to Create Your Dream Event?</h2>
          <p>
            Book your consultation now and let our experts help you design the
            perfect experience for your special occasion.
          </p>
          <NuxtLink to="/booking" class="booking-button"
            >Book Your Event</NuxtLink
          >
        </div>
      </section>

      <section class="testimonials animate-section" ref="testimonialsSection">
        <h2>Client Experiences</h2>
        <div class="testimonial-grid">
          <div class="testimonial-card">
            <p>
              "Absolutely exceeded our expectations. Every detail was perfect."
            </p>
            <span class="client-name">— Sarah & James, Wedding</span>
          </div>
          <div class="testimonial-card">
            <p>"The most professional and creative team we've worked with."</p>
            <span class="client-name">— Corporate Solutions Ltd.</span>
          </div>
          <div class="testimonial-card">
            <p>"They transformed our vision into reality, and then some!"</p>
            <span class="client-name">— Emily's Sweet 16</span>
          </div>
        </div>
      </section>

      <section class="cta-section animate-section" ref="ctaSection">
        <h2>Ready to Create Something Extraordinary?</h2>
        <p>
          Let us bring your vision to life with our signature touch of elegance
        </p>
        <NuxtLink to="/contact" class="cta-button"
          >Request a Consultation</NuxtLink
        >
      </section>
    </main>

    <TheFooter />
  </div>
</template>

<script setup>
import { useIntersectionObserver } from "../composables/useIntersectionObserver";

// Fetch products and categories from API
const { data: productResponse } = (await useFetch("/api/products")) || {
  data: ref({}),
};
const { data: categoryResponse } = (await useFetch(
  "/api/products/categories"
)) || { data: ref({}) };

// Fetch Instagram posts
const { data: instagramResponse } = (await useFetch("/api/instagram")) || {
  data: ref({}),
};

// Extract products and categories from API responses
const rawProducts = computed(() => productResponse.value?.data || []);
const categories = computed(() => categoryResponse.value?.data || []);

// Group products by categories
const productsByCategory = computed(() => {
  const grouped = {};

  // Initialize with empty arrays for all categories
  if (categories.value.length > 0) {
    categories.value.forEach((category) => {
      const categoryName =
        category.label || category.name || "Unnamed Category";
      grouped[category.value || category.id] = {
        id: category.value || category.id,
        title: categoryName,
        description:
          category.description || `Browse our ${categoryName} collection`,
        anchor: categoryName.toLowerCase().replace(/\s+/g, "-"),
        items: [],
      };
    });
  }

  // Add products to their respective categories
  rawProducts.value.forEach((product) => {
    if (product.categoryId && grouped[product.categoryId]) {
      grouped[product.categoryId].items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
        image: product.image,
      });
    }
  });

  // Convert to array and filter out empty categories
  return Object.values(grouped).filter((category) => category.items.length > 0);
});

// Use the grouped products for the carousel
const products = computed(() => productsByCategory.value);

const currentProductIndex = ref(0);
const carousel = ref(null);

const centerActiveCard = () => {
  if (!carousel.value) return;

  // Determine which index to use based on whether we're showing products
  const currentIndex = currentProductIndex.value;
  const items = products.value;

  if (!items || items.length === 0) return;

  // Find all service items
  const serviceItems = carousel.value.querySelectorAll(".service-item");
  if (!serviceItems || serviceItems.length === 0) return;

  // Get the active service item (accounting for possible empty state placeholder)
  const activeCard = serviceItems[currentIndex];
  if (!activeCard) return;

  const carouselRect = carousel.value.getBoundingClientRect();
  const cardRect = activeCard.getBoundingClientRect();

  // Calculate the scroll position to center the active card
  const scrollLeft =
    activeCard.offsetLeft - carouselRect.width / 2 + cardRect.width / 2;

  // Use smooth scrolling
  carousel.value.scrollTo({
    left: Math.max(0, scrollLeft),
    behavior: "smooth",
  });
};

const selectedCard = ref(null);
const lastTappedCard = ref(null);
const lastTapTime = ref(0);

// Handle click/tap on gallery card
const handleCardClick = (index, item) => {
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

  if (isMobile) {
    const now = Date.now();

    // First tap or tap on different card - show caption
    if (selectedCard.value !== index) {
      selectedCard.value = index;
      lastTappedCard.value = index;
      lastTapTime.value = now;
      return;
    }

    // Second tap on same card - navigate to link
    if (selectedCard.value === index) {
      // If the card has a link, navigate to it
      if (item.link) {
        window.open(item.link, "_blank", "noopener,noreferrer");
      }
      // Reset the selected card
      selectedCard.value = null;
      lastTappedCard.value = null;
    }
  } else {
    // On desktop, just open the link directly if it exists
    if (item.link) {
      window.open(item.link, "_blank", "noopener,noreferrer");
    }
  }
};

// Transform Instagram data into gallery items
const galleryItems = computed(() => {
  if (!instagramResponse.value?.data) {
    return [
      {
        image: "/images/gallery/sweetsixteen1.jpg",
        title: "Sweet Sixteen Celebration",
        description: "Elegantly modeled '16'large with lights",
      },
      {
        image: "/images/gallery/kidsbday1.jpg",
        title: "Football 5th Birthday Party",
        description: "Aston Villa 5th Birthday Party",
      },
      {
        image: "/images/gallery/adultbday1.jpg",
        title: "40th Birthday Party",
        description: "Glamorous birthday celebration",
      },
      {
        image: "/images/gallery/engagement1.jpg",
        title: "Engagement Party",
        description: "Elegant indoor event",
      },
      {
        image: "/images/gallery/wedding1.jpg",
        title: "Glorious Wedding Day",
        description: "Majestic wedding decoration",
      },
    ];
  }
  return instagramResponse.value.data;
});

const { observeElement } = useIntersectionObserver();

// Create refs for each section
const introSection = ref(null);
const featuresSection = ref(null);
const productsSection = ref(null);
const gallerySection = ref(null);
const testimonialsSection = ref(null);
const ctaSection = ref(null);
const bookingSection = ref(null);

// Function to add animation class
const animateSection = (element) => {
  element.classList.add("visible");
};

// Setup observers on mount
onMounted(() => {
  // Initialize carousel with a slight delay to ensure DOM is ready
  setTimeout(() => {
    // Reset to first slide
    currentProductIndex.value = 0;
    // Center the first card
    centerActiveCard();
  }, 200);

  // Force recalculation of gallery positions on window resize
  const handleResize = () => {
    // Add a small delay to ensure DOM updates
    setTimeout(() => {
      // Force a re-render of gallery cards by triggering state change
      selectedCard.value = null;
      // Recenter product carousel
      centerActiveCard();
    }, 100);
  };

  // Add window event listeners
  window.addEventListener("resize", handleResize);
  window.addEventListener("resize", centerActiveCard);

  // Observe each section for animation
  const sections = [
    introSection.value,
    featuresSection.value,
    productsSection.value,
    gallerySection.value,
    testimonialsSection.value,
    ctaSection.value,
    bookingSection.value,
  ];

  sections.forEach((section) => {
    if (section) {
      observeElement(section, () => animateSection(section));
    }
  });
});

onBeforeUnmount(() => {
  // Clean up all event listeners
  window.removeEventListener("resize", centerActiveCard);

  // This needs to match the handleResize function defined in onMounted
  const handleResize = () => {
    setTimeout(() => {
      selectedCard.value = null;
    }, 100);
    centerActiveCard();
  };
  window.removeEventListener("resize", handleResize);

  // Reset card selection
  selectedCard.value = null;
});

// Navigation for product carousel
const nextProduct = () => {
  if (!products.value || products.value.length === 0) return;
  if (currentProductIndex.value < products.value.length - 1) {
    currentProductIndex.value++;
  } else {
    currentProductIndex.value = 0;
  }
  centerActiveCard();
};

const previousProduct = () => {
  if (!products.value || products.value.length === 0) return;
  if (currentProductIndex.value > 0) {
    currentProductIndex.value--;
  } else {
    currentProductIndex.value = products.value.length - 1;
  }
  centerActiveCard();
};

// Calculate card position based on screen size
const calculateCardPosition = (index) => {
  // Get viewport width
  const vw = typeof window !== "undefined" ? window.innerWidth : 1200;

  // Adjust spacing based on viewport size
  if (vw <= 576) {
    // Mobile - tighter spacing
    const spacing = 20 + index * 50;
    return `translateX(${spacing}px)`;
  } else if (vw <= 768) {
    // Tablet - medium spacing
    const spacing = 40 + index * 80;
    return `translateX(${spacing}px)`;
  } else if (vw <= 992) {
    // Small desktop - wider spacing with more natural distribution
    const spacing = 80 + index * (vw * 0.09);
    return `translateX(${spacing}px)`;
  } else {
    // Large desktop - original calculation with full span
    const spacing = 80 + index * (vw * 0.15);
    return `translateX(${spacing}px)`;
  }
};

// Add gallery scroll functionality
const galleryWrapper = ref(null);

const scrollGallery = (direction) => {
  if (!galleryWrapper.value) return;

  const scrollAmount = 400; // Width of one card
  const currentScroll = galleryWrapper.value.scrollLeft;
  const newScroll =
    direction === "left"
      ? currentScroll - scrollAmount
      : currentScroll + scrollAmount;

  galleryWrapper.value.scrollTo({
    left: newScroll,
    behavior: "smooth",
  });
};
</script>

<style scoped>
body {
  margin: 0;
}

.page-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  background-color: var(--bg-primary);
}

.hero-wrapper {
  width: 100%;
  position: relative;
  z-index: 1;
}

.main-content {
  flex: 1;
  padding-top: 120px;
  margin: 0 auto;
  width: 100%;
  max-width: var(--content-max-width);
}

.intro-section {
  text-align: center;
  padding: var(--section-padding-md);
  max-width: var(--content-reading-width);
  margin: 0 auto;
}

.intro-section h2 {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  margin-bottom: 1.5rem;
  color: var(--accent-primary);
}

.intro-section p {
  font-size: clamp(1rem, 2vw, 1.2rem);
  line-height: 1.6;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: var(--section-padding-md);
  background-color: var(--bg-secondary);
}

.feature-card {
  background-color: var(--card-bg);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px var(--shadow-color);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid var(--border-color);
  height: 100%;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(184, 134, 11, 0.15);
  background-color: var(--hover-bg);
}

.icon {
  font-size: 2rem;
  color: var(--accent-primary);
  margin-bottom: 1rem;
}

.feature-card h3 {
  color: var(--accent-primary);
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.services-highlight {
  margin: 6rem 0 0;
  text-align: center;
  overflow: hidden;
}

.carousel-container {
  position: relative;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  padding: 2rem 3rem;
  overflow: visible;
}

.service-carousel {
  display: flex;
  gap: 2rem;
  padding: 2rem 1rem;
  overflow-x: auto;
  width: 100%;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  /* Firefox */
  -ms-overflow-style: none;
  /* IE and Edge */
  scroll-behavior: smooth;
}

.service-carousel::-webkit-scrollbar {
  display: none;
  /* Chrome, Safari, Opera */
}

.service-item {
  flex: 0 0 auto;
  width: 100%;
  min-width: 280px;
  max-width: 600px;
  padding: 2rem;
  background: var(--card-bg);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  scroll-snap-align: center;
  opacity: 0.7;
  transform: scale(0.95);
  transition: all 0.3s ease;
  margin-right: 0;
}

.service-item.active {
  opacity: 1;
  transform: scale(1);
  box-shadow: 0 4px 12px var(--shadow-color);
}

.carousel-button {
  position: absolute;
  top: 50%;
  background: var(--button-gradient);
  color: var(--button-text);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  z-index: 10;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.carousel-button:hover {
  background: var(--button-hover);
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.carousel-button.prev {
  left: 0;
}

.carousel-button.next {
  right: 0;
}

.carousel-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #aaa;
  box-shadow: none;
}

.carousel-button:disabled:hover {
  transform: translateY(-50%);
  background: #aaa;
}

.gallery-section {
  padding: 6rem 0;
  background: linear-gradient(
    135deg,
    var(--service-card-bg) 0%,
    var(--bg-primary) 100%
  );
  position: relative;
  overflow: hidden;
}

.gallery-section::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: 
    radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 3px, transparent 3px),
    radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 3px, transparent 3px),
    radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.3) 3px, transparent 3px);
  background-size: 50px 50px;
  opacity: 0.05;
  z-index: 0;
}

.gallery-content {
  position: relative;
  z-index: 1;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.gallery-header {
  text-align: center;
  margin-bottom: 4rem;
}

.gallery-header h2 {
  color: var(--accent-primary);
  font-size: 3rem;
  margin-bottom: 1.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.gallery-header p {
  color: var(--text-secondary);
  font-size: 1.25rem;
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.6;
}

.gallery-carousel {
  position: relative;
  padding: 2rem 0;
}

.gallery-card {
  position: relative;
  aspect-ratio: 4/5;
  width: 500px;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 30px var(--shadow-color);
  border: 1px solid var(--border-color);
  background: var(--card-bg);
}

.gallery-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px var(--shadow-color);
}

.gallery-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.gallery-card:hover img {
  transform: scale(1.08);
}

.gallery-card-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2rem;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.4));
  color: white;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.gallery-card:hover .gallery-card-content {
  opacity: 1;
  transform: translateY(0);
}

.gallery-caption {
  font-size: 1.1rem;
  line-height: 1.6;
  margin-top: 1rem;
  color: rgba(255, 255, 255, 0.9);
}

.view-gallery-button {
  display: block;
  margin: 4rem auto 0;
  padding: 1.2rem 3rem;
  background: var(--button-gradient);
  color: var(--button-text);
  border: none;
  border-radius: 30px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px var(--shadow-color);
  text-decoration: none;
  text-align: center;
  max-width: 300px;
}

.view-gallery-button:hover {
  background: var(--button-hover);
  transform: translateY(-3px);
  box-shadow: 0 8px 25px var(--shadow-color);
}

@media (max-width: 768px) {
  .gallery-section {
    padding: 4rem 0;
  }

  .gallery-header h2 {
    font-size: 2.5rem;
  }

  .gallery-header p {
    font-size: 1.1rem;
  }

  .gallery-content {
    padding: 0 1rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .gallery-card,
  .gallery-card-content,
  .view-gallery-button {
    transition: none;
    transform: none;
  }
}

.testimonials {
  margin: 6rem 0 0;
  text-align: center;
}

.testimonials h2 {
  color: var(--accent-primary);
  margin-bottom: 3rem;
  font-size: 2.5rem;
}

.testimonial-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.testimonial-card {
  padding: 2rem;
  background-color: var(--card-bg);
  border-radius: 12px;
  box-shadow: 0 4px 6px var(--shadow-color);
  border: 1px solid var(--border-color);
}

.testimonial-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(184, 134, 11, 0.15);
  background-color: var(--hover-bg);
  transition: all 0.3s ease;
}

.testimonial-card p {
  font-style: italic;
  margin-bottom: 1rem;
  color: var(--text-secondary);
}

.client-name {
  color: var(--accent-primary);
  font-weight: 500;
}

.cta-section {
  text-align: center;
  margin: 6rem 0 0;
  padding: 4rem;
  background: var(--cta-bg);
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.cta-button {
  display: inline-block;
  padding: 1.2rem 2.5rem;
  background: var(--button-gradient);
  color: var(--button-text);
  border-radius: 30px;
  font-weight: bold;
  margin-top: 2rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(184, 134, 11, 0.2);
}

.cta-button:hover {
  background: var(--button-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(184, 134, 11, 0.3);
}

.booking-cta {
  background: var(--cta-bg);
  border-radius: 12px;
  padding: 4rem 2rem;
  margin: 4rem 0;
  text-align: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--border-color);
}

.booking-cta::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url("/images/gallery/placeholder.jpg") center/cover no-repeat;
  opacity: 0.1;
  z-index: 0;
}

.booking-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
  margin: 0 auto;
}

.booking-cta h2 {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  color: var(--accent-primary);
}

.booking-cta p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.booking-button {
  display: inline-block;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  background: var(--button-gradient);
  color: var(--button-text);
  border-radius: 50px;
  text-decoration: none;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
}

.booking-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  background: var(--button-hover);
}

/* Update media queries for responsive design */
@media (max-width: 576px) {
  .main-content {
    padding-top: 100px;
  }
  .features,
  .services-highlight,
  .booking-cta,
  .testimonials,
  .cta-section {
    padding: var(--section-padding-xs);
  }

  .feature-card {
    padding: 1.5rem;
  }

  .gallery-stack {
    flex-direction: row;
    padding: 1rem 0;
    gap: 0;
    position: relative;
    width: 100%;
    overflow: hidden;
  }

  .gallery-card-wrapper {
    flex-direction: row;
    padding: 0;
    width: 100%;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
  }

  .gallery-card {
    width: 85vw;
    max-width: 300px;
    aspect-ratio: 4/5;
    flex: 0 0 auto;
    margin: 0 auto;
    scroll-snap-align: center;
  }

  /* Make nav buttons more visible on small screens */
  .gallery-nav-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    background-color: rgba(var(--card-bg-rgb, 255, 255, 255), 0.7);
    width: 36px;
    height: 36px;
  }

  .gallery-nav-button.prev {
    left: 5px;
  }

  .gallery-nav-button.next {
    right: 5px;
  }

  .testimonial-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .gallery-indicator {
    width: 8px;
    height: 8px;
  }

  .gallery-controls {
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }

  .carousel-container {
    padding: 1rem 2rem;
  }

  .service-carousel {
    padding: 1rem 0.5rem;
    gap: 1rem;
  }

  .service-item {
    min-width: 250px;
    padding: 1.5rem;
  }
}

@media (min-width: 577px) and (max-width: 768px) {
  .features,
  .services-highlight,
  .booking-cta,
  .testimonials,
  .cta-section {
    padding: var(--section-padding-sm);
  }

  .carousel-container {
    padding: 1.5rem 2.5rem;
  }

  .service-carousel {
    padding: 1.5rem 0.5rem;
    gap: 1.5rem;
  }

  .service-item {
    min-width: 300px;
    max-width: 400px;
    padding: 1.5rem;
  }

  .gallery-stack {
    flex-direction: row;
    padding: 0 1rem;
    overflow: hidden;
    position: relative;
    width: 100%;
  }

  .gallery-card-wrapper {
    flex-direction: row;
    overflow-x: auto;
    width: 100%;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
    padding: 1rem 0;
  }

  .gallery-card {
    width: 85vw;
    max-width: 400px;
    aspect-ratio: 4/5;
    flex: 0 0 auto;
    margin: 0 auto;
    scroll-snap-align: center;
  }

  /* Make nav buttons more visible on small screens */
  .gallery-nav-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    background-color: rgba(var(--card-bg-rgb, 255, 255, 255), 0.7);
    width: 36px;
    height: 36px;
  }

  .gallery-nav-button.prev {
    left: 10px;
  }

  .gallery-nav-button.next {
    right: 10px;
  }

  .testimonial-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
}

.gallery-card-wrapper {
  width: 100%;
}

@media (min-width: 769px) and (max-width: 991px) {
  .features,
  .services-highlight,
  .booking-cta,
  .testimonials,
  .cta-section {
    padding: var(--section-padding-md);
  }

  .testimonial-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }

  .gallery-stack {
    flex-direction: column;
    overflow: visible;
  }
  .gallery-card-wrapper {
    flex-direction: column;
  }
  .gallery-card {
    width: 400px;
    aspect-ratio: 4/5;
  }
  .carousel-container {
    padding: 2rem 3rem;
  }

  .service-item {
    min-width: 350px;
    max-width: 450px;
  }
}

@media (min-width: 992px) {
  .features,
  .services-highlight,
  .booking-cta,
  .testimonials,
  .cta-section {
    padding: var(--section-padding-lg);
  }

  .features {
    grid-template-columns: repeat(3, 1fr);
  }

  .gallery-stack {
    display: flex;
    flex-direction: row;
    overflow: hidden;
  }
}

/* Replace the specific 1024-1130px viewport media query with more generic ones */
@media (min-width: 1024px) and (max-width: 1279px) {
  .main-content {
    padding: 0 2rem;
  }

  .service-carousel {
    max-width: calc(100% - 3rem);
  }
}

@media (min-width: 1280px) and (max-width: 1440px) {
  .service-carousel {
    max-width: calc(100% - 4rem);
  }
}

@media (min-width: 1441px) {
  .feature-card {
    padding: 2.5rem;
  }

  .service-carousel {
    max-width: calc(100% - 5rem);
  }
}

/* Landscape-specific adjustments */
@media (max-height: 600px) and (orientation: landscape) {
  .main-content {
    padding-top: 90px;
  }

  .intro-section {
    padding-top: 2rem;
    padding-bottom: 2rem;
  }

  .feature-card {
    padding: 1.25rem;
  }
}

/* Ensure smooth scrolling */
html {
  scroll-behavior: smooth;
}

@media (prefers-reduced-motion: reduce) {
  .animate-section {
    transition: none;
    transform: none;
    opacity: 1;
  }

  html {
    scroll-behavior: auto;
  }
}

/* Update these specific styles */
.service-item {
  background: var(--service-card-bg);
}

.cta-section {
  background: var(--cta-bg);
}

.cta-button,
.view-more {
  background: var(--button-gradient);
  color: var(--button-text);
}

.cta-button:hover,
.view-more:hover {
  background: var(--button-hover);
}

.carousel-button {
  background: var(--button-gradient);
  color: var(--button-text);
}

.carousel-button:hover {
  background: var(--button-hover);
}

.gallery-card {
  background-color: var(--card-bg);
}

.gallery-overlay {
  background: linear-gradient(to top, var(--overlay-bg), transparent);
}

.testimonial-card {
  background-color: var(--card-bg);
}

/* Add hover states */
.feature-card:hover {
  background-color: var(--hover-bg);
}

.nav-links a:hover {
  color: var(--accent-secondary);
}

.service-description {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  font-style: italic;
}

.service-items {
  flex: 1;
  margin-bottom: 1rem;
}

.service-price-item {
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.5rem;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
}

.item-name {
  font-weight: 500;
  color: var(--text-primary);
}

.item-price {
  color: var(--accent-primary);
  font-weight: 600;
}

.item-details {
  font-size: 0.9rem;
  color: var(--text-secondary);
  line-height: 1.4;
}

.service-link-button {
  display: inline-block;
  margin-top: 1.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--button-gradient);
  color: var(--button-text);
  border-radius: 25px;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  text-decoration: none;
  box-shadow: 0 2px 4px var(--shadow-color);
}

.service-link-button:hover {
  background: var(--button-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px var(--shadow-color);
}

.service-title {
  display: none;
}

.more-items {
  margin-top: 0.75rem;
  color: var(--accent-primary);
  font-size: 0.9rem;
  font-style: italic;
  text-align: right;
}

/* Add specific styles for 1024-1130px viewport width */
@media (min-width: 1024px) and (max-width: 1130px) and (min-height: 1280px) {
  .main-content {
    padding: 0 1rem;
  }

  .intro-section {
    padding: 3rem 1rem;
  }

  .intro-section h2 {
    font-size: 2rem;
  }

  .features {
    gap: 1rem;
    padding: 2rem 1rem;
  }

  .feature-card {
    padding: 1.5rem;
  }

  .feature-card h3 {
    font-size: 1.2rem;
  }

  .services-highlight {
    padding: 3rem 1rem;
  }

  .service-carousel {
    max-width: calc(100% - 2rem);
  }

  .service-item {
    padding: 1.5rem;
  }

  .gallery-section {
    padding: 3rem 1rem;
  }

  .gallery-card {
    width: 280px;
    aspect-ratio: 4/5;
  }

  .booking-cta {
    padding: 3rem 1rem;
  }

  .testimonials {
    padding: 3rem 1rem;
  }

  .testimonial-grid {
    gap: 1rem;
  }

  .testimonial-card {
    padding: 1.5rem;
  }

  .cta-section {
    padding: 3rem 1rem;
  }
}

.gallery-controls {
  display: flex;
  justify-content: center;
  margin: 0 0 2rem;
  gap: 0.8rem;
  position: relative;
  z-index: 5;
}

.gallery-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: var(--border-color);
  cursor: pointer;
  transition: all 0.3s ease;
}

.gallery-indicator.active {
  background-color: var(--accent-primary);
  transform: scale(1.2);
}

.gallery-more {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-left: 0.5rem;
}

.carousel-indicators {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 1.5rem;
}

.carousel-dot {
  width: 10px;
  height: 10px;
  background-color: var(--border-color);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.carousel-dot.active {
  background-color: var(--accent-primary);
  transform: scale(1.2);
}

.carousel-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading-indicator {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 150px;
  color: var(--text-secondary);
  font-style: italic;
}

.product-link {
  color: var(--text-primary);
  text-decoration: none;
  transition: color 0.2s ease;
}

.product-link:hover {
  color: var(--accent-primary);
  text-decoration: underline;
}

.gallery-nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 102;
  transition: all 0.3s ease;
  color: var(--text-primary);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.gallery-nav-button:hover {
  background-color: var(--hover-bg);
  color: var(--accent-primary);
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.gallery-nav-button.prev {
  left: 1rem;
}

.gallery-nav-button.next {
  right: 1rem;
}

@media (max-width: 768px) {
  .gallery-stack {
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
  }

  .gallery-card-wrapper {
    padding: 0 0.5rem;
  }

  .gallery-card {
    width: 300px;
  }

  .gallery-nav-button {
    display: none;
  }
}

.gallery-card-container {
  position: relative;
  display: block;
}

.gallery-card:hover img {
  transform: scale(1.05);
}

/* Gallery card content styling */
.gallery-card-content {
  padding: 1.5rem;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.8); /* Slightly darker background */
  color: white;
  opacity: 0;
  transition: opacity 0.3s ease;
  transform: translateY(0);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
    Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  text-align: left;
  max-height: 70%; /* Limit to 70% of card height */
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.gallery-card:hover .gallery-card-content {
  opacity: 1;
}

/* Add mobile-specific tap feedback */
@media (max-width: 768px) {
  .gallery-card a,
  .gallery-card-container {
    cursor: pointer;
    -webkit-tap-highlight-color: transparent; /* Remove default mobile tap highlight */
  }

  .gallery-card.active {
    transform: scale(1.02);
    box-shadow: 0 8px 24px var(--shadow-color);
  }

  .gallery-card-content {
    background: rgba(
      0,
      0,
      0,
      0.85
    ); /* Darker background for better readability on mobile */
  }
}
</style>
