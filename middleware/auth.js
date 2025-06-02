export default defineNuxtRouteMiddleware((to, from) => {
  // Import the auth store
  const authStore = useAuthStore()
  
  // Check if user is authenticated
  if (!authStore.isAuthenticated) {
    console.log('Auth middleware: User not authenticated, redirecting to login')
    
    // If not authenticated, redirect to login page
    return navigateTo('/login')
  }
  
  console.log('Auth middleware: User authenticated, allowing access')
}) 