// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  components: true,
  css: [
    '~/assets/css/main.css',
  ],
  modules: [
    '@pinia/nuxt',
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  vite: {
    vue: {
      script: {
        defineModel: true,
        propsDestructure: true
      }
    }
  },
  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET || 'development-secret-key',
    public: {
      apiBase: process.env.API_BASE || ''
    }
  },
  app: {
    head: {
      title: 'My Nuxt Website',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'theme-color', content: '#b8860b' }
      ],
      link: [],
      style: [],
      script: [],
      noscript: []
    }
  },
  compatibilityDate: '2024-11-01'
})
