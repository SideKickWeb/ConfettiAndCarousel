<template>
  <div class="container">
    <TheNavbar />
    <main class="content">
      <div class="packages-header">
        <h1>Event Packages</h1>
        <p>Choose from our carefully curated packages designed to make your special occasion unforgettable.</p>
      </div>
      
      <div class="packages-grid">
        <div class="package-card">
          <div class="package-header">
            <h2>Essential Package</h2>
            <div class="package-price">$1,500</div>
          </div>
          <div class="package-content">
            <ul class="package-features">
              <li>Basic event setup and decoration</li>
              <li>Standard balloon arrangements</li>
              <li>Basic table settings for up to 50 guests</li>
              <li>Simple backdrop design</li>
              <li>2-hour venue styling consultation</li>
            </ul>
            <NuxtLink to="/booking" class="book-button">Book This Package</NuxtLink>
          </div>
        </div>
        
        <div class="package-card featured">
          <div class="package-tag">Most Popular</div>
          <div class="package-header">
            <h2>Premium Package</h2>
            <div class="package-price">$3,000</div>
          </div>
          <div class="package-content">
            <ul class="package-features">
              <li>Premium venue styling and decoration</li>
              <li>Custom balloon installations</li>
              <li>Elegant table settings for up to 100 guests</li>
              <li>Customized backdrop with lighting</li>
              <li>Floral arrangements for main tables</li>
              <li>4-hour venue styling consultation</li>
              <li>Setup and teardown service</li>
            </ul>
            <NuxtLink to="/booking" class="book-button">Book This Package</NuxtLink>
          </div>
        </div>
        
        <div class="package-card">
          <div class="package-header">
            <h2>Luxury Package</h2>
            <div class="package-price">$5,000</div>
          </div>
          <div class="package-content">
            <ul class="package-features">
              <li>Complete luxury venue transformation</li>
              <li>Extravagant balloon and prop installations</li>
              <li>Premium table settings for up to 200 guests</li>
              <li>Custom designed backdrop with premium lighting</li>
              <li>Elaborate floral arrangements throughout venue</li>
              <li>Custom signage and personalized details</li>
              <li>Full-day venue styling consultation</li>
              <li>Setup, event supervision, and teardown service</li>
            </ul>
            <NuxtLink to="/booking" class="book-button">Book This Package</NuxtLink>
          </div>
        </div>
      </div>
      
      <div class="custom-option">
        <h2>Looking for something unique?</h2>
        <p>We also offer custom packages tailored to your specific needs and vision.</p>
        <NuxtLink to="/booking" class="custom-button">Request Custom Package</NuxtLink>
      </div>
    </main>
    <TheFooter />
  </div>
</template> 

<style scoped>
.container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  padding: 120px 20px 60px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.packages-header {
  text-align: center;
  margin-bottom: 60px;
}

.packages-header h1 {
  font-size: 2.5rem;
  color: var(--accent-primary);
  margin-bottom: 16px;
}

.packages-header p {
  font-size: 1.2rem;
  max-width: 800px;
  margin: 0 auto;
  color: var(--text-secondary);
}

.packages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 60px;
}

.package-card {
  background: var(--card-bg);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 15px var(--shadow-color);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  border: 1px solid var(--border-color);
}

.package-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 15px 30px var(--shadow-color);
}

.package-card.featured {
  transform: scale(1.05);
  border: 2px solid var(--accent-primary);
}

.package-card.featured:hover {
  transform: scale(1.05) translateY(-10px);
}

.package-tag {
  position: absolute;
  top: 12px;
  right: 12px;
  background: var(--accent-primary);
  color: white;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
}

.package-header {
  padding: 25px 20px;
  background: var(--service-card-bg);
  text-align: center;
  border-bottom: 1px solid var(--border-color);
}

.package-header h2 {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: var(--accent-primary);
}

.package-price {
  font-size: 2rem;
  font-weight: bold;
  color: var(--text-primary);
}

.package-content {
  padding: 25px;
}

.package-features {
  list-style-type: none;
  margin-bottom: 25px;
}

.package-features li {
  padding: 10px 0;
  position: relative;
  padding-left: 25px;
  border-bottom: 1px solid var(--border-color);
}

.package-features li::before {
  content: "✓";
  position: absolute;
  left: 0;
  color: var(--accent-primary);
  font-weight: bold;
}

.book-button {
  display: block;
  width: 100%;
  padding: 12px;
  background: var(--button-gradient);
  color: var(--button-text);
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  text-align: center;
  transition: background 0.3s ease;
  text-decoration: none;
}

.book-button:hover {
  background: var(--button-hover);
}

.custom-option {
  text-align: center;
  padding: 40px;
  background: var(--cta-bg);
  border-radius: 12px;
  margin-top: 40px;
  border: 1px solid var(--border-color);
}

.custom-option h2 {
  font-size: 1.8rem;
  margin-bottom: 15px;
  color: var(--accent-primary);
}

.custom-option p {
  margin-bottom: 25px;
  font-size: 1.1rem;
}

.custom-button {
  display: inline-block;
  padding: 12px 30px;
  background: var(--button-gradient);
  color: var(--button-text);
  border: none;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-decoration: none;
}

.custom-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  background: var(--button-hover);
}

@media (max-width: 768px) {
  .packages-grid {
    grid-template-columns: 1fr;
  }
  
  .package-card.featured {
    transform: scale(1);
    order: -1;
  }
  
  .package-card.featured:hover {
    transform: translateY(-10px);
  }
}
</style> 