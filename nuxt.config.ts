import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  modules: [
    '@pinia/nuxt'
  ],
  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET || 'your-fallback-secret-key',
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3000'
      }
    },
  // Nitro configuration for Vercel
  nitro: {
    preset: 'vercel',
    experimental: {
      wasm: true
    }
  },
  // Server-side rendering options
  ssr: true,
  // Additional security configurations
  experimental: {
    payloadExtraction: false // Prevents payload extraction attacks
  },
  // Additional route rules for security
  routeRules: {
    // Add security headers to all routes
    '/**': {
      headers: {
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'X-XSS-Protection': '1; mode=block',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
      }
    },
    // API routes should have additional security
    '/api/**': {
      headers: {
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'no-store, no-cache, must-revalidate'
      }
    }
  },
  vue: {
    compilerOptions: {
      isCustomElement: (tag: string) => ['swiper-container', 'swiper-slide'].includes(tag)
    }
  },
  vite: {
    optimizeDeps: {
      exclude: ['@prisma/client']
    }
  },
  compatibilityDate: '2024-11-01'
})

