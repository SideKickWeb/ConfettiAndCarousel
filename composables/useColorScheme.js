export const useColorScheme = () => {
  const colorScheme = useState('colorScheme', () => {
    // Default to system preference
    if (import.meta.client) {
      const savedScheme = localStorage.getItem('colorScheme')
      if (savedScheme) return savedScheme
      
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'light'
  })

  const toggleColorScheme = () => {
    colorScheme.value = colorScheme.value === 'light' ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', colorScheme.value)
    localStorage.setItem('colorScheme', colorScheme.value)
  }

  const initColorScheme = () => {
    if (import.meta.client) {
      // Listen for system theme changes
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      
      const handleChange = (e) => {
        const savedScheme = localStorage.getItem('colorScheme')
        // Only update if user hasn't manually set a preference
        if (!savedScheme) {
          colorScheme.value = e.matches ? 'dark' : 'light'
          document.documentElement.setAttribute('data-theme', colorScheme.value)
        }
      }

      // Set initial theme
      const savedScheme = localStorage.getItem('colorScheme')
      if (savedScheme) {
        colorScheme.value = savedScheme
      } else {
        colorScheme.value = mediaQuery.matches ? 'dark' : 'light'
      }
      document.documentElement.setAttribute('data-theme', colorScheme.value)

      // Add listener for system theme changes
      mediaQuery.addEventListener('change', handleChange)

      // Cleanup
      onUnmounted(() => {
        mediaQuery.removeEventListener('change', handleChange)
      })
    }
  }

  return {
    colorScheme,
    toggleColorScheme,
    initColorScheme
  }
} 