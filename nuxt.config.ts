// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: process.env.NODE_ENV !== 'production' },
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
    optimizeDeps: {
      exclude: ['@prisma/client']
    },
    build: {
      rollupOptions: {
        external: ['@prisma/client']
      }
    }
  },
  nitro: {
    esbuild: {
      options: {
        target: 'es2019'
      }
    },
    // Add serverless configuration
    preset: 'vercel-edge',
    // Increase function timeout for Vercel
    vercel: {
      functionMemory: 1024, // 1 GB (max for hobby plan)
      functions: {
        // Increase timeout for all API routes
        'server/api/**': {
          memory: 1024, // 1GB
        }
      },
      // Add direct configuration for Node.js dependency resolution
      buildCommand: 'npm run vercel-build'
    },
    // These options help optimize your application for serverless environments
    experimental: {
      asyncContext: true,
    },
    timing: true,
    storage: {
      redis: {
        driver: 'redis',
        /* Redis connection options */
        url: process.env.REDIS_URL
      }
    },
    devStorage: {
      redis: {
        driver: 'memory'
      }
    },
    // Optimize for serverless
    minify: true,
    compressPublicAssets: {
      gzip: true,
      brotli: true
    },
    // Configure API routes to use ISR (Incremental Static Regeneration)
    routeRules: {
      '/api/hero': { 
        swr: 60 * 15, // 15 minutes
        cache: {
          maxAge: 60 * 5 // 5 minutes
        }
      },
      '/api/products': { 
        swr: 60 * 60, // 1 hour
        cache: {
          maxAge: 60 * 10 // 10 minutes
        }
      },
      '/api/products/categories': { 
        swr: 60 * 60 * 3, // 3 hours
        cache: {
          maxAge: 60 * 30 // 30 minutes
        }
      },
      '/api/instagram': { 
        swr: 60 * 60 * 2, // 2 hours
        cache: {
          maxAge: 60 * 30 // 30 minutes
        }
      },
      '/api/products/**': {
        swr: 60 * 60, // 1 hour
        cache: {
          maxAge: 60 * 10 // 10 minutes
        }
      }
    },
    // Add explicit dependency resolution
    externals: {
      inline: ['ufo']
    }
  },
  typescript: {
    tsConfig: {
      compilerOptions: {
        moduleResolution: "Node16",
        strict: true,
        target: "ESNext",
        module: "ESNext"
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
    },
    // Configure build optimization for the app
    buildAssetsDir: '/_nuxt/',
    cdnURL: '',
  },
  // Performance optimization
  experimental: {
    payloadExtraction: true,
    treeshakeClientOnly: true,
    componentIslands: false,
    renderJsonPayloads: true,
  },
  routeRules: {
    // Rules for client-facing routes
    '/': { swr: 60 * 5 }, // 5 minutes
    '/products': { swr: 60 * 30 }, // 30 minutes
    '/product/**': { swr: 60 * 60 }, // 1 hour
    '/gallery': { swr: 60 * 60 }, // 1 hour
    '/services': { swr: 60 * 60 * 12 }, // 12 hours
  },
  compatibilityDate: '2024-11-01'
})
