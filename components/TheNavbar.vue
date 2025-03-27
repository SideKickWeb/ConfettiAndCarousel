<template>
  <header class="header">
    <nav>
      <!-- Logo section - left side -->
      <div class="logo-container">
        <NuxtLink to="/">
          <img class="imglogo" src="../public/images/Logo/LOGO-05.png" alt="Confetti and Carousel Logo">
          <img class="textlogo" src="../public/images/Logo/LOGO-03.png" alt="Confetti and Carousel">
        </NuxtLink>
      </div>
      
      <!-- Mobile menu hamburger -->
      <div class="hamburger" @click="toggleMenu" :class="{ 'active': isMenuOpen }">
        <span></span>
        <span></span>
        <span></span>
      </div>

      <!-- Main navigation links -->
      <ul class="nav-links" :class="{ 'active': isMenuOpen }">
        <li><NuxtLink to="/" @click="closeMenu">Home</NuxtLink></li>
        <li><NuxtLink to="/products" @click="closeMenu">Products</NuxtLink></li>
        <li><NuxtLink to="/gallery" @click="closeMenu">Gallery</NuxtLink></li>
        <li><NuxtLink to="/booking" @click="closeMenu">Book Event</NuxtLink></li>
      </ul>
      
      <!-- Right side items: account and basket -->
      <div class="nav-right">
        <!-- Theme switch first -->
        <ThemeSwitch />
        
        <!-- Account dropdown -->
        <div class="account-container">
          <div v-if="!auth.isAuthenticated">
            <NuxtLink to="/login" class="login-button" @click="closeMenu">Sign In</NuxtLink>
          </div>
          <div v-else class="user-menu">
            <button @click="toggleUserMenu" class="user-button" :class="{ 'active': isUserMenuOpen }">
              {{ auth.firstName || 'Account' }}
              <span class="dropdown-icon" :class="{ 'rotate': isUserMenuOpen }">▼</span>
            </button>
            <transition name="dropdown">
              <div class="dropdown-menu" v-if="isUserMenuOpen">
                <NuxtLink to="/account" class="dropdown-item" @click="closeAllMenus">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="dropdown-icon-item">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  My Account
                </NuxtLink>
                <a v-if="auth.isAdmin" href="http://194.213.3.37:3000" target="_blank" class="dropdown-item" @click="closeAllMenus">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="dropdown-icon-item">
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                  </svg>
                  Admin
                </a>    
                <NuxtLink to="/my-bookings" class="dropdown-item" @click="closeAllMenus">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="dropdown-icon-item">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  My Bookings
                </NuxtLink>
                <button @click="logout" class="dropdown-item logout-button">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="dropdown-icon-item">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  Sign Out
                </button>
              </div>
            </transition>
          </div>
        </div>
        
        <!-- Shopping Basket last -->
        <div class="basket-container">
          <NuxtLink to="/basket" class="basket-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="basket-icon">
              <circle cx="8" cy="21" r="1"></circle>
              <circle cx="19" cy="21" r="1"></circle>
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
            </svg>
            <span v-if="basketCount > 0" class="basket-count">{{ basketCount }}</span>
          </NuxtLink>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'
import { useCartStore } from '../stores/cart'
import { computed, ref, onMounted } from 'vue'

const isMenuOpen = ref(false)
const isUserMenuOpen = ref(false)
const auth = useAuthStore()
const cartStore = useCartStore()

// Compute basket count from cartStore
const basketCount = computed(() => cartStore.itemCount)

// Fetch auth state when component is mounted
onMounted(async () => {
  await auth.fetchUser()
  cartStore.loadFromLocalStorage()
})

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
  if (isMenuOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = 'auto'
  }
}

const toggleUserMenu = (event) => {
  event.stopPropagation()
  isUserMenuOpen.value = !isUserMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
  document.body.style.overflow = 'auto'
}

const closeUserMenu = () => {
  isUserMenuOpen.value = false
}

const closeAllMenus = () => {
  closeMenu()
  closeUserMenu()
}

const logout = async () => {
  const success = await auth.logout()
  if (success) {
    closeAllMenus()
    // Redirect to home page
    navigateTo('/')
  }
}

// Close user menu when clicking outside
onMounted(() => {
  document.addEventListener('click', (event) => {
    if (isUserMenuOpen.value) {
      closeUserMenu()
    }
  })
})
</script>

<style scoped>
.header {
  background-color: var(--nav-bg);
  padding: 0.5rem 0;
  box-shadow: 0 2px 4px var(--shadow-color);
  position: fixed;
  width: 100%;
  z-index: 1000;
  border-bottom: 2px solid var(--border-color);
  transition: all 0.3s ease;
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: 0 1rem;
  position: relative;
}

.logo-container {
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  margin-right: 1rem;
}

.logo-container a {
  display: flex;
  align-items: center;
}

.imglogo {
  height: 60px;
  width: auto;
  object-fit: contain;
  margin-right: 0.5rem;
}

.textlogo {
  height: 60px;
  width: auto;
  object-fit: contain;
}

.nav-links {
  display: flex;
  list-style: none;
  flex: 1 1 auto;
  justify-content: center;
  gap: 3rem;
  padding: 0;
  margin: 0 auto;
}

.nav-links li {
  position: relative;
  padding: 0.25rem 0.5rem;
}

.nav-links a {
  color: var(--nav-text);
  font-weight: 500;
  transition: color 0.3s ease;
  font-size: 1rem;
  white-space: nowrap;
}

.nav-links a:hover {
  color: var(--accent-secondary);
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: auto;
  flex: 0 0 auto;
}

.login-button {
  color: var(--nav-text);
  font-weight: 500;
  transition: color 0.3s ease;
}

.login-button:hover {
  color: var(--accent-secondary);
}

.hamburger {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 21px;
  cursor: pointer;
  z-index: 1200;
  position: relative;
}

.hamburger span {
  display: block;
  height: 3px;
  width: 100%;
  background-color: var(--accent-primary);
  transition: all 0.3s ease;
  position: absolute;
  left: 0;
  border-radius: 2px;
}

.hamburger span:nth-child(1) {
  top: 0;
  transform-origin: center;
}

.hamburger span:nth-child(2) {
  top: 9px;
  transform-origin: center;
}

.hamburger span:nth-child(3) {
  bottom: 0;
  transform-origin: center;
}

/* X animation styles */
.hamburger.active span:nth-child(1) {
  transform: translateY(9px) rotate(45deg);
  background-color: var(--accent-secondary);
}

.hamburger.active span:nth-child(2) {
  opacity: 0;
  transform: translateX(-20px);
}

.hamburger.active span:nth-child(3) {
  transform: translateY(-9px) rotate(-45deg);
  background-color: var(--accent-secondary);
}

.account-container {
  position: relative;
  transition: transform 0.2s ease;
}

.account-container:hover {
  transform: translateY(-2px);
}

.user-menu {
  position: relative;
}

.user-button {
  background: none;
  border: none;
  color: var(--nav-text);
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.user-button:hover, .user-button.active {
  color: var(--accent-secondary);
  background-color: var(--hover-bg, rgba(255, 255, 255, 0.1));
}

.dropdown-icon {
  font-size: 0.7rem;
  transition: transform 0.3s ease;
}

.dropdown-icon.rotate {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  min-width: 220px;
  background-color: var(--card-bg);
  border-radius: 12px;
  box-shadow: 0 5px 20px var(--shadow-color);
  padding: 0.75rem 0;
  z-index: 1001;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-color);
  overflow: hidden;
}

.dropdown-item {
  padding: 0.75rem 1.25rem;
  color: var(--text-primary);
  text-decoration: none;
  text-align: left;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.dropdown-item:hover {
  background-color: var(--hover-bg);
  transform: translateX(5px);
}

.dropdown-icon-item {
  color: var(--text-secondary);
  flex-shrink: 0;
}

.dropdown-item:hover .dropdown-icon-item {
  color: var(--accent-secondary);
}

.logout-button {
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  color: var(--text-primary);
  font-weight: 500;
  width: 100%;
}

.logout-button:hover {
  color: #d64045;
}

.logout-button:hover .dropdown-icon-item {
  color: #d64045;
}

/* Dropdown animation */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.3s, transform 0.3s;
  transform-origin: top center;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

.basket-container {
  position: relative;
  transition: transform 0.2s ease;
}

.basket-container:hover {
  transform: translateY(-2px);
}

.basket-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 0.4rem;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}

.basket-link:hover {
  background-color: var(--hover-bg, rgba(255, 255, 255, 0.1));
}

.basket-icon {
  color: var(--nav-text);
  stroke: var(--nav-text);
  stroke-width: 2;
  transition: color 0.3s ease, stroke 0.3s ease;
}

.basket-link:hover .basket-icon {
  color: var(--accent-secondary);
  stroke: var(--accent-secondary);
}

.basket-count {
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: var(--accent-primary);
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* Responsive styles - organized by breakpoint */
@media (max-width: 400px) {
  .textlogo {
    display: none;
  }
  
  .imglogo {
    height: 50px;
  }
  
  nav {
    padding: 0 0.5rem;
  }
}

@media (max-width: 767px) {
  nav {
    padding: 0 0.75rem;
  }

  .hamburger {
    display: flex;
    order: 3;
    margin-left: 0.75rem;
    position: relative;
    top: auto;
    right: auto;
    z-index: 1200;
  }
  
  /* Add specific style for when menu is open to keep hamburger visible */
  .hamburger.active {
    position: fixed;
    top: 20px;
    right: 15px;
  }

  nav {
    flex-wrap: wrap;
  }

  .logo-container {
    order: 1;
    flex: 0 1 auto;
    margin-right: 0;
  }
  
  .logo-container a {
    display: flex;
    align-items: center;
  }

  .nav-right {
    order: 2;
    gap: 0.5rem;
    margin-left: auto;
    z-index: 1050;
    position: relative;
  }
  
  .account-container {
    position: static;
  }
  
  .user-menu {
    position: static;
  }
  
  .dropdown-menu {
    position: fixed;
    top: 70px; /* Adjust based on your navbar height */
    left: 0;
    right: 0;
    width: 100%;
    max-width: 100%;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    margin-top: 0;
    border-radius: 0;
    border-top: 1px solid var(--border-color);
    border-bottom: 1px solid var(--border-color);
    z-index: 1300;
    background-color: var(--card-bg);
  }
  
  /* Handle dropdown animation for mobile */
  .dropdown-enter-active,
  .dropdown-leave-active {
    transition: opacity 0.2s, transform 0.2s;
  }
  
  .dropdown-enter-from,
  .dropdown-leave-to {
    opacity: 0;
    transform: translateY(-10px);
  }

  .nav-links {
    position: fixed;
    top: 0;
    right: -100%;
    height: 100vh;
    width: 100%;
    background-color: var(--nav-bg);
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1.5rem;
    transition: right 0.3s ease;
    padding: 1rem;
    order: 4;
    flex-basis: 100%;
    margin: 0;
    z-index: 1100;
  }

  .nav-links.active {
    right: 0;
  }

  .nav-links li {
    padding: 0.75rem 1.5rem;
    width: 100%;
    text-align: center;
    opacity: 0;
    transform: translateX(50px);
    transition: all 0.3s ease;
  }

  .nav-links.active li {
    opacity: 1;
    transform: translateX(0);
  }

  .nav-links a {
    font-size: 1.5rem;
    display: block;
    width: 100%;
  }
}

/* Tablet breakpoint */
@media (min-width: 768px) and (max-width: 991px) {
  nav {
    padding: 0 1rem;
  }

  .nav-links {
    gap: 1.5rem;
  }

  .nav-links a {
    font-size: 0.9rem;
  }
  
  .imglogo, .textlogo {
    height: 50px;
  }
  
  .nav-right {
    gap: 0.5rem;
    flex-wrap: nowrap;
    display: flex !important; /* Ensure display remains flex */
  }
  
  .theme-switch {
    margin-right: 0.3rem;
  }
  
  .login-button, .user-button {
    font-size: 0.9rem;
    padding: 0.3rem 0.6rem;
  }
  
  .basket-link {
    padding: 0.3rem;
  }
}

/* iPad-specific fixes */
@media (min-width: 768px) and (max-width: 834px) and (min-height: 1024px) and (max-height: 1180px) {
  nav {
    padding: 0 0.5rem;
    justify-content: space-between !important;
  }
  
  .nav-right {
    display: flex !important;
    gap: 0.25rem !important;
    margin-left: 0 !important;
    flex: 0 0 auto !important;
    flex-wrap: nowrap !important;
  }
  
  .nav-links {
    gap: 0.75rem;
    flex: 0 1 auto !important;
    margin: 0 0.5rem !important;
  }
  
  .nav-links a {
    font-size: 0.85rem;
  }
  
  .login-button, .user-button {
    font-size: 0.8rem !important;
    white-space: nowrap;
    padding: 0.25rem 0.4rem !important;
    min-width: auto !important;
  }
  
  .basket-link {
    padding: 0.25rem !important;
  }
  
  .theme-switch {
    transform: scale(0.85) !important;
    margin-right: 0.2rem !important;
  }
  
  .basket-icon {
    width: 18px !important;
    height: 18px !important;
  }
  
  .imglogo, .textlogo {
    height: 45px !important;
  }
  
  .logo-container {
    margin-right: 0.25rem !important;
  }
}

/* iPad Air specific fix (exact dimensions) */
@media (width: 820px) and (height: 1180px) {
  .nav-right {
    gap: 0.2rem !important;
  }
  
  .logo-container {
    flex: 0 0 auto !important;
    max-width: 35% !important; 
  }
  
  .nav-links {
    flex: 0 1 auto !important;
    gap: 0.5rem !important;
  }
  
  .nav-links a {
    font-size: 0.8rem !important;
  }
  
  .theme-switch {
    transform: scale(0.8) !important;
  }
  
  .basket-icon {
    width: 16px !important;
    height: 16px !important;
  }
}

/* iPad Air horizontal specific fix */
@media (width: 1180px) and (height: 820px) {
  .nav-right {
    display: flex !important;
  }
  
  .theme-switch {
    display: block !important;
  }
}

/* Small desktop breakpoint */
@media (min-width: 992px) and (max-width: 1199px) {
  nav {
    padding: 0 1.5rem;
  }

  .nav-links {
    gap: 2rem;
  }
  
  .imglogo, .textlogo {
    height: 55px;
  }
}

/* Large desktop breakpoint */
@media (min-width: 1200px) {
  nav {
    padding: 0 2rem;
  }
  
  .nav-links {
    gap: 3rem;
  }
}

/* Special device-specific fixes */
/* iPad Pro Landscape */
@media (min-width: 1024px) and (max-width: 1366px) and (min-height: 768px) and (max-height: 1024px) {
  .nav-links {
    gap: 2rem;
  }
  
  .imglogo, .textlogo {
    height: 55px;
  }
}

/* iPhone landscape mode fixes */
@media (max-height: 500px) and (orientation: landscape) {
  .nav-links.active {
    padding-top: 60px;
    overflow-y: auto;
  }
  
  .nav-links li {
    padding: 0.5rem 1rem;
  }
  
  .nav-links a {
    font-size: 1.2rem;
  }
  
  .imglogo {
    height: 45px;
  }
  
  .textlogo {
    display: none;
  }
}

/* iPad Pro 11" fix (853x1280) - Portrait mode */
@media (min-width: 850px) and (max-width: 860px) and (min-height: 1270px) and (max-height: 1290px) {
  .nav-right {
    gap: 0.2rem !important;
    margin-left: 0.25rem !important;
  }
  
  .logo-container {
    flex: 0 0 auto !important;
    max-width: 30% !important;
  }
  
  .nav-links {
    flex: 0 1 auto !important;
    gap: 0.4rem !important;
    margin: 0 0.25rem !important;
  }
  
  .nav-links a {
    font-size: 0.8rem !important;
    padding: 0.15rem 0.2rem !important;
  }
  
  .theme-switch {
    transform: scale(0.8) !important;
    margin-right: 0.1rem !important;
  }
  
  .login-button, .user-button {
    font-size: 0.8rem !important;
    padding: 0.2rem 0.35rem !important;
    white-space: nowrap !important;
  }
  
  .basket-icon {
    width: 16px !important;
    height: 16px !important;
  }
  
  .basket-link {
    padding: 0.2rem !important;
  }
  
  .imglogo, .textlogo {
    height: 42px !important;
  }
  
  nav {
    padding: 0 0.3rem !important;
  }
}

/* iPad Pro 11" - both orientations */
@media (width: 853px), (height: 853px) {
  .account-container {
    position: relative !important;
  }
  
  .user-menu {
    position: relative !important;
  }
  
  .dropdown-menu {
    position: absolute !important;
    top: calc(100% + 0.5rem) !important;
    right: -10px !important;
    max-width: 220px !important;
    width: auto !important;
    box-shadow: 0 5px 20px var(--shadow-color) !important;
    border-radius: 12px !important;
    border: 1px solid var(--border-color) !important;
    z-index: 1500 !important;
    margin-left: auto !important;
    left: auto !important;
  }
  
  /* Ensure basket doesn't get cut off */
  .basket-container {
    margin-right: 0.25rem !important;
  }
  
  /* Ensure both nav-right elements stay visible */
  .nav-right {
    flex-wrap: nowrap !important;
    min-width: fit-content !important;
  }
}
</style> 