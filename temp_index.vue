<template>
  <div class="container">
    <TheNavbar />
    <HeroSection />
    
    <main class="main-content">
      <section class="intro-section animate-section" ref="introSection">
        <h2>Welcome to Luxury Event Design</h2>
        <p>Transform your special moments into unforgettable memories with our premium event decoration and hosting services. We specialize in creating bespoke experiences that reflect your unique style and vision.</p>
      </section>
      
      <section class="features animate-section" ref="featuresSection">
        <div class="feature-card">
          <div class="icon">âœ§</div>
          <h3>Luxury Decoration</h3>
          <p>Exquisite themes, premium balloon arrangements, elegant table settings, and stunning backdrops for sophisticated occasions.</p>
        </div>
        <div class="feature-card">
          <div class="icon">âœ§</div>
          <h3>Event Planning</h3>
          <p>Comprehensive event coordination from concept to execution, ensuring every detail meets our luxury standards.</p>
        </div>
        <div class="feature-card">
          <div class="icon">âœ§</div>
          <h3>Premium Supplies</h3>
          <p>High-end party supplies, custom decorations, and carefully curated accessories for your celebration.</p>
        </div>
      </section>

      <section class="products-highlight animate-section" ref="servicesSection">
        <h2>Our Premium Products</h2>
        <div class="carousel-container">
          <button class="carousel-button prev" @click="previousService">
            <span>â®</span>
          </button>
          
          <div class="service-carousel" ref="carousel">
            <div class="service-item" v-for="(service, index) in services" :key="index"
                 :class="{ 'active': currentServiceIndex === index }">
              <h4>{{ service.title }}</h4>
              <p class="service-description">{{ service.description }}</p>
              <div class="service-items">
                <div v-for="(item, itemIndex) in service.items.slice(0, 3)" :key="itemIndex" class="service-price-item">
                  <div class="item-header">
                    <span class="item-name">{{ item.name }}</span>
                    <span class="item-price">{{ item.price }}</span>
                  </div>
                  <p v-if="item.details" class="item-details">{{ item.details }}</p>
                </div>
                <p v-if="service.items.length > 3" class="more-items">
                  +{{ service.items.length - 3 }} more items available
                </p>
              </div>
              <NuxtLink :to="`/services#${service.anchor}`" class="service-link-button">
                Find Out More
              </NuxtLink>
            </div>
          </div>

          <button class="carousel-button next" @click="nextService">
            <span>â¯</span>
          </button>
        </div>
      </section>

      <section class="gallery-preview animate-section" ref="gallerySection">
        <h2>Our Magical Moments</h2>
        <div class="gallery-stack">
          <div class="gallery-card-wrapper" 
               v-for="(image, index) in galleryImages" 
               :key="index"
               :style="{ 
                 transform: `translateX(calc(${index * (95 / (galleryImages.length - 1))}vw))`,
                 zIndex: selectedCard === index ? 100 : (galleryImages.length - index)
               }"
               @mouseenter="selectCard(index)"
               @mouseleave="selectCard(null)">
            <div class="gallery-card"
                 :class="{ 'active': selectedCard === index }">
              <img :src="image.url" :alt="image.description">
              <div class="gallery-overlay"
                   :style="{ zIndex: selectedCard === index ? 101 : 1 }">
                <h3>{{ image.title }}</h3>
                <p>{{ image.description }}</p>
              </div>
            </div>
          </div>
        </div>
        <NuxtLink to="/gallery" class="view-more">View Full Gallery</NuxtLink>
      </section>
      
      <section class="booking-cta animate-section" ref="bookingSection">
        <div class="booking-content">
          <h2>Ready to Create Your Dream Event?</h2>
          <p>Book your consultation now and let our experts help you design the perfect experience for your special occasion.</p>
          <NuxtLink to="/booking" class="booking-button">Book Your Event</NuxtLink>
        </div>
      </section>

      <section class="testimonials animate-section" ref="testimonialsSection">
        <h2>Client Experiences</h2>
        <div class="testimonial-grid">
          <div class="testimonial-card">
            <p>"Absolutely exceeded our expectations. Every detail was perfect."</p>
            <span class="client-name">â€” Sarah & James, Wedding</span>
          </div>
          <div class="testimonial-card">
            <p>"The most professional and creative team we've worked with."</p>
            <span class="client-name">â€” Corporate Solutions Ltd.</span>
          </div>
          <div class="testimonial-card">
            <p>"They transformed our vision into reality, and then some!"</p>
            <span class="client-name">â€” Emily's Sweet 16</span>
          </div>
        </div>
      </section>

      <section class="cta-section animate-section" ref="ctaSection">
        <h2>Ready to Create Something Extraordinary?</h2>
        <p>Let us bring your vision to life with our signature touch of elegance</p>
        <NuxtLink to="/contact" class="cta-button">Request a Consultation</NuxtLink>
      </section>
    </main>

    <TheFooter />
  </div>
</template>

<script setup>
import { useIntersectionObserver } from '../composables/useIntersectionObserver';

const services = ref([
  {
    title: 'Sailboard Displays',
    description: 'Premium backdrop displays with balloon artistry',
    anchor: 'sailboard-displays',
    items: [
      { name: 'Single Sailboard', price: 'Â£200', details: 'Includes flat vinyl signage, custom paint colour and 3 custom colour balloons' },
      { name: 'Double Sailboard', price: 'Â£300', details: 'Includes flat vinyl signage, custom paint colour and 3 custom colour balloons' },
      { name: 'Triple Sailboard', price: 'Â£350', details: 'Includes flat vinyl signage, custom paint colour and 3 custom colour balloons' }
    ]
  },
  {
    title: 'Helium Balloons',
    description: 'Premium balloon arrangements for all occasions',
    anchor: 'helium-balloons',
    items: [
      { name: '15 Inch Orb Balloon', price: 'Â£15.00', details: 'Dressed in a vinyl message with a satin ribbon bow' },
      { name: '36 Inch Giant Heart', price: 'Â£28.00', details: 'Dressed in a vinyl message with a satin ribbon bow' },
      { name: 'Bubble Balloon', price: 'Â£30.00', details: 'Filled with your choice of coloured balloons, short vinyl message and satin ribbon bow' },
      { name: 'Number Balloons', price: 'Â£15.00', details: 'With a vinyl name and a satin ribbon bow' },
      { name: 'Cluster of 3', price: 'Â£10.00', details: 'Three helium filled treated latex balloons on a weight' },
      { name: 'Cluster of 5', price: 'Â£15.00', details: 'Five helium filled treated latex balloons on a weight' }
    ]
  },
  {
    title: 'Air Filled Displays',
    description: 'Custom number and themed displays',
    anchor: 'air-filled-displays',
    items: [
      { name: 'Number Stack', price: 'Â£40.00', details: 'Single digit on a small stack base with 2 added themed foil balloons, small pieces of balloon artistry and vinyl name' },
      { name: 'Deluxe Number Stack', price: 'Â£70.00', details: 'Single digit on a wide stack base with 2 small 1 large added themed foil balloons, large pieces of balloon artistry and vinyl name' }
    ]
  },
  {
    title: 'Floral Displays',
    description: 'Bespoke floral arrangements and hat boxes',
    anchor: 'floral-displays',
    items: [
      { name: 'Small Hat Box', price: 'Â£30.00', details: 'Floral display with artificial, dried or fresh flowers' },
      { name: 'Medium Hat Box', price: 'Â£40.00', details: 'Floral display with artificial, dried or fresh flowers' },
      { name: 'Large Hat Box', price: 'Â£55.00', details: 'Floral display with artificial, dried or fresh flowers' }
    ]
  },
  {
    title: 'Additional Props',
    description: 'Extra items to enhance your event',
    anchor: 'additional-props',
    items: [
      { name: 'Cake plinth', price: 'Â£30' },
      { name: 'Easel and welcome sign', price: 'Â£30' },
      { name: 'Light up numbers', price: 'Â£40' },
      { name: 'Gold mirror numbers', price: 'Â£30' },
      { name: 'Hot air balloons', price: 'Â£40' },
      { name: 'Bespoke florals', price: 'Â£30' },
      { name: 'Cheesecloth drapes x5', price: 'Â£10' },
      { name: 'Candle arbors with led real wax candles x12', price: 'Â£15' },
      { name: 'Set of 10 disco balls all varied in size', price: 'Â£20' },
      { name: 'Large Teddy and 5 small teddys in baskets', price: 'Â£30' }
    ]
  }
]);

const currentServiceIndex = ref(0);
const carousel = ref(null);

const previousService = () => {
  currentServiceIndex.value = (currentServiceIndex.value - 1 + services.value.length) % services.value.length;
  centerActiveCard();
};

const nextService = () => {
  currentServiceIndex.value = (currentServiceIndex.value + 1) % services.value.length;
  centerActiveCard();
};

const centerActiveCard = () => {
  if (!carousel.value) return;
  
  const activeCard = carousel.value.children[currentServiceIndex.value];
  if (!activeCard) return;

  const carouselRect = carousel.value.getBoundingClientRect();
  const cardRect = activeCard.getBoundingClientRect();
  
  const scrollLeft = activeCard.offsetLeft - (carouselRect.width / 2) + (cardRect.width / 2);
  
  carousel.value.scrollTo({
    left: scrollLeft,
    behavior: 'smooth'
  });
};

const selectedCard = ref(null);

const selectCard = (index) => {
  selectedCard.value = selectedCard.value === index ? null : index;
};

const hoverCard = (index) => {
  if (selectedCard.value === null) {
    selectedCard.value = index;
  }
};

const galleryImages = ref([
  {
    url: '/images/gallery/sweetsixteen1.jpg',
    title: 'Sweet Sixteen Celebration',
    description: 'Elegantly modeled \'16\'large with lights',
  },
  {
    url: '/images/gallery/kidsbday1.jpg',
    title: 'Football 5th Birthday Party',
    description: 'Aston Villa 5th Birthday Party',
  },
  {
    url: '/images/gallery/adultbday1.jpg',
    title: '40th Birthday Party',
    description: 'Glamorous birthday celebration',
  },
  {
    url: '/images/gallery/engagement1.jpg',
    title: 'Engagement Party',
    description: 'Elegant indoor event',
  },
  {
    url: '/images/gallery/wedding1.jpg',
    title: 'Glorious Wedding Day',
    description: 'Majestic wedding decoration',
  },
    {
        url: '/images/gallery/placeholder.jpg',
        title: 'Sample Title',
        description: 'Sample Description',
    },
    {
        url: '/images/gallery/placeholder.jpg',
        title: 'Sample Title',
        description: 'Sample Description',
    },
    {
        url: '/images/gallery/placeholder.jpg',
        title: 'Sample Title',
        description: 'Sample Description',
    },
    {
        url: '/images/gallery/placeholder.jpg',
        title: 'Sample Title',
        description: 'Sample Description',
    },
    {
        url: '/images/gallery/placeholder.jpg',
        title: 'Sample Title',
        description: 'Sample Description',
    },
    {
        url: '/images/gallery/placeholder.jpg',
        title: 'Sample Title',
        description: 'Sample Description',
    },
    {
        url: '/images/gallery/placeholder.jpg',
        title: 'Sample Title',
        description: 'Sample Description',
    },
    {
        url: '/images/gallery/placeholder.jpg',
        title: 'Sample Title',
        description: 'Sample Description',
    },
]);

const { observeElement } = useIntersectionObserver();

// Create refs for each section
const introSection = ref(null);
const featuresSection = ref(null);
const servicesSection = ref(null);
const gallerySection = ref(null);
const testimonialsSection = ref(null);
const ctaSection = ref(null);
const bookingSection = ref(null);

// Function to add animation class
const animateSection = (element) => {
  element.classList.add('visible');
};

// Setup observers on mount
onMounted(() => {
  centerActiveCard();
  
  // Optional: Re-center on window resize
  window.addEventListener('resize', centerActiveCard);
  
  // Observe each section
  const sections = [
    introSection.value,
    featuresSection.value,
    servicesSection.value,
    gallerySection.value,
    testimonialsSection.value,
    ctaSection.value,
    bookingSection.value
  ];

  sections.forEach(section => {
    if (section) {
      observeElement(section, () => animateSection(section));
    }
  });
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', centerActiveCard);
});
</script>

<style scoped>
body {
 margin: 0;
}

.container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  background-color: var(--bg-primary);
}

.main-content {
  flex: 1;
  width: 100%;
  margin: 0 0;
  padding: 0rem;
  overflow: hidden;
  max-width: 100%;
  overflow-x: hidden;
}

.intro-section {
  text-align: center;
  margin: 4rem 0;
  padding: 2rem;
}

.intro-section h2 {
  color: var(--accent-primary);
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 4rem 0;
}

.feature-card {
  padding: 2.5rem;
  border-radius: 12px;
  background-color: var(--bg-secondary);
  box-shadow: 0 4px 6px var(--shadow-color);
  text-align: center;
  border: 1px solid var(--border-color);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
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

.products-highlight {
  margin: 6rem 0 0;
  text-align: center;
  overflow: hidden;
}

.carousel-container {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  padding: 2rem 4rem;
  overflow: hidden;
}

.service-carousel {
  display: flex;
  gap: 2rem;
  padding: 2rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scroll-behavior: smooth;
}

.service-carousel::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.service-item {
  flex: 0 0 auto;
  width: calc(100% - 4rem);
  max-width: 600px;
  padding: 2rem;
  background: var(--card-bg);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  scroll-snap-align: center;
  opacity: 0.7;
  transform: scale(0.95);
  transition: all 0.3s ease;
}

.service-item.active {
  opacity: 1;
  transform: scale(1);
  box-shadow: 0 4px 12px var(--shadow-color);
}

.carousel-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
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
  z-index: 2;
  transition: all 0.3s ease;
}

.carousel-button:hover {
  background: var(--button-hover);
  transform: translateY(-50%) scale(1.1);
}

.carousel-button.prev {
  left: 1rem;
}

.carousel-button.next {
  right: 1rem;
}

.gallery-preview {
  margin: 0 0;
  text-align: center;
  padding: 2rem;
}

.gallery-preview h2 {
  color: var(--accent-primary);
  font-size: 2.5rem;
  margin-bottom: 4rem;
}

.gallery-stack {
  position: relative;
  height: 400px;
  width: 100vw;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  padding: 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  overflow: visible;
}

.gallery-card-wrapper {
  position: absolute;
  width: 250px;
  height: 350px;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  transform-origin: left center;
  left: 0;
}

.gallery-card {
  position: relative;
  width: 100%;
  height: 100%;
  transform-origin: center center;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(184, 134, 11, 0.15);
  overflow: hidden;
  filter: brightness(0.9);
  background-color: var(--card-bg);
}

.gallery-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.gallery-card.active {
  transform: translateY(-20px) scale(1.1) !important;
  filter: brightness(1);
  box-shadow: 0 20px 40px rgba(184, 134, 11, 0.2);
  position: relative;
  z-index: 1;
}

.gallery-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem;
  background: linear-gradient(to top, var(--overlay-bg), transparent);
  color: #fff;
  text-align: left;
  transform: translateY(100%);
  transition: transform 0.3s ease;
}

.gallery-card.active .gallery-overlay {
  transform: translateY(0);
}

.view-more {
  display: inline-block;
  margin-top: 4rem;
  padding: 1rem 2rem;
  background: var(--button-gradient);
  color: var(--button-text);
  border-radius: 30px;
  font-weight: bold;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(184, 134, 11, 0.2);
}

.view-more:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(184, 134, 11, 0.3);
  background: var(--button-hover);
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
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('/images/gallery/placeholder.jpg') center/cover no-repeat;
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

@media (max-width: 768px) {
  .carousel-container {
    padding: 2rem 1rem;
  }

  .service-item {
    min-width: 300px;
    max-width: 300px;
    padding: 1.5rem;
  }

  .gallery-stack {
    height: 300px;
  }

  .gallery-card-wrapper {
    width: 160px;
    height: 240px;
    left: 0;
  }

  .gallery-card.active {
    transform: scale(1.2) !important;
  }

  .item-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }

  .carousel-button {
    width: 32px;
    height: 32px;
    font-size: 1rem;
  }
  
  .carousel-button.prev {
    left: 0.5rem;
  }
  
  .carousel-button.next {
    right: 0.5rem;
  }
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

/* Add staggered delays for feature cards */
.features.visible .feature-card:nth-child(1) { transition-delay: 0.1s; }
.features.visible .feature-card:nth-child(2) { transition-delay: 0.2s; }
.features.visible .feature-card:nth-child(3) { transition-delay: 0.3s; }

/* Add staggered delays for testimonial cards */
.testimonials.visible .testimonial-card:nth-child(1) { transition-delay: 0.1s; }
.testimonials.visible .testimonial-card:nth-child(2) { transition-delay: 0.2s; }
.testimonials.visible .testimonial-card:nth-child(3) { transition-delay: 0.3s; }

/* Optional: Add different animations for different sections */
.gallery-preview {
  transform: translateY(100px);
}

.cta-section {
  transform: translateY(30px);
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

.cta-button, .view-more {
  background: var(--button-gradient);
  color: var(--button-text);
}

.cta-button:hover, .view-more:hover {
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
</style>
