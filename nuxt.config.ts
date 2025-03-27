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
    },
    build: {
      rollupOptions: {
        external: ['bcryptjs', 'crypto', '@prisma/client', '.prisma/client']
      }
    },
    optimizeDeps: {
      exclude: ['bcryptjs', 'jsonwebtoken', '@prisma/client']
    },
    ssr: {
      noExternal: ['bcryptjs', 'jsonwebtoken'],
      external: ['@prisma/client']
    }
  },
  runtimeConfig: {
    jwtSecret: process.env.JWT_SECRET || 'development-secret-key',
    public: {
      apiBase: process.env.API_BASE || ''
    }
  },
  nitro: {
    externals: {
      inline: ['uuid']
    },
    moduleSideEffects: [
      '@prisma/client',
      'bcryptjs',
      'jsonwebtoken'
    ]
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
