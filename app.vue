<template>
  <NuxtPage />
</template>

<style>
:root {
  /* Light theme */
  --bg-primary: #fffdf5;
  --bg-secondary: #fff;
  --text-primary: #333;
  --text-secondary: #666;
  --accent-primary: #b8860b;
  --accent-secondary: #daa520;
  --border-color: #ffd70033;
  --shadow-color: rgba(184, 134, 11, 0.1);
  --card-bg: #fff;
  --nav-bg: #fff;
  --nav-text: #8b7355;
  --hover-bg: #fff6e6;
  --error-color: #ef4444;
  --overlay-bg: rgba(0, 0, 0, 0.3);
  --service-card-bg: linear-gradient(135deg, #fff6e6, #fff9e6);
  --cta-bg: linear-gradient(135deg, #fff6e6, #fff9e6);
  --button-gradient: linear-gradient(135deg, #daa520, #b8860b);
  --button-hover: linear-gradient(135deg, #b8860b, #daa520);
  --hero-bg: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3));
  
  /* Responsive layout variables */
  /*--container-width-xs: 100%;
  --container-width-sm: 540px;
  --container-width-md: 720px;
  --container-width-lg: 960px;
  --container-width-xl: 1140px;
  --container-width-xxl: 1320px;*/
  --container-width-xs: 100%;
  --container-width-sm: 100%;
  --container-width-md: 100%;
  --container-width-lg: 100%;
  --container-width-xl: 100%;
  --container-width-xxl: 100%;
  
  /* Spacing and sizing */
  --section-padding-xs: 2rem 1rem;
  --section-padding-sm: 3rem 1.5rem;
  --section-padding-md: 4rem 2rem;
  --section-padding-lg: 5rem 2rem;
  
  /* Content width constraints */
  --content-max-width: 100%;
  --content-reading-width: 100%;
  
  /* Viewport corrections */
  --viewport-padding: max(env(safe-area-inset-left), env(safe-area-inset-right), 0.5rem);
  --viewport-full-width: 100vw;
  --viewport-safe-width: calc(100vw - (var(--viewport-padding) * 2));

  /* Ensure proper emoji rendering across browsers and devices */
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}

[data-theme="dark"] {
  /* Dark theme - luxurious and sophisticated */
  --bg-primary: #181818;
  --bg-secondary: #202020;
  --text-primary: #ffffff;
  --text-secondary: #e0e0e0;
  --accent-primary: #B89457;
  --accent-secondary: #D4B76B;
  --border-color: #333333;
  --shadow-color: rgba(0, 0, 0, 0.4);
  --card-bg: #302d29;
  --nav-bg: #282828;
  --nav-text: #ffffff;
  --hover-bg: #383838;
  --button-text: #181818;
  --error-color: #ef5350;
  --overlay-bg: rgba(0, 0, 0, 0.7);
  --service-card-bg: linear-gradient(135deg, #282828, #302d29);
  --cta-bg: linear-gradient(135deg, #3a3734, #302d29);
  --button-gradient: linear-gradient(135deg, #D4B76B, #B89457);
  --button-hover: linear-gradient(135deg, #B89457, #D4B76B);
  --hero-bg: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5));
  --hero-text: #ffffff;
  --card-text: #ffffff;
}

body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition: background-color 0.3s ease;
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
  margin: 0;
  padding: 0;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Update transitions to exclude color */
* {
  transition: background-color 0.3s ease,
              border-color 0.3s ease,
              box-shadow 0.3s ease;
  box-sizing: border-box;
}

/* Remove text-specific transitions */
/* p, h1, h2, h3, h4, h5, h6, span, a {
  transition: color 0.15s ease;
} */

/* Keep transitions for non-text properties */
[class*="gradient"],
[class*="button"] {
  transition: background 0.3s ease,
              transform 0.3s ease,
              box-shadow 0.3s ease;
}

/* Responsive containers */
.container, .page-wrapper {
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
  margin: 0;
  padding: 0;
}

/* Full-width utility */
.full-width {
  width: var(--viewport-full-width);
  max-width: 100%;
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
}

@media (min-width: 576px) {
  .container {
    max-width: var(--container-width-sm);
  }
}

@media (min-width: 768px) {
  .container {
    max-width: var(--container-width-md);
  }
}

@media (min-width: 992px) {
  .container {
    max-width: var(--container-width-lg);
  }
}

@media (min-width: 1200px) {
  .container {
    max-width: var(--container-width-xl);
  }
}

@media (min-width: 1400px) {
  .container {
    max-width: var(--container-width-xxl);
  }
}

/* Safari-specific viewport fix */
@supports (-webkit-touch-callout: none) {
  .hero-section, .full-width, .container, .page-wrapper {
    width: 100%;
    left: 0;
    right: 0;
    margin-left: 0;
    margin-right: 0;
  }
}

/* Content alignment inside containers */
.content, .container-content {
  width: 100%;
  max-width: var(--content-max-width);
  margin-left: auto;
  margin-right: auto;
  padding-left: var(--viewport-padding);
  padding-right: var(--viewport-padding);
}
</style> 