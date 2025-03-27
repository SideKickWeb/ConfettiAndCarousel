<template>
  <div class="container">
    <TheNavbar />
    <main class="content">
      <div class="auth-container">
        <div class="auth-card">
          <h1>{{ isLogin ? 'Sign In' : 'Create Account' }}</h1>
          
          <div v-if="auth.error" class="error-message">
            {{ auth.error }}
          </div>
          
          <form @submit.prevent="submitForm">
            <!-- Registration fields -->
            <template v-if="!isLogin">
              <div class="form-group">
                <label for="firstName">First Name</label>
                <input 
                  id="firstName" 
                  v-model="form.firstName" 
                  type="text" 
                  required
                  placeholder="Enter your first name"
                />
              </div>
              
              <div class="form-group">
                <label for="lastName">Last Name</label>
                <input 
                  id="lastName" 
                  v-model="form.lastName" 
                  type="text" 
                  required
                  placeholder="Enter your last name"
                />
              </div>
            </template>
            
            <div class="form-group">
              <label for="email">Email</label>
              <input 
                id="email" 
                v-model="form.email" 
                type="email" 
                required
                placeholder="Enter your email"
              />
            </div>
            
            <div class="form-group">
              <label for="password">Password</label>
              <input 
                id="password" 
                v-model="form.password" 
                type="password" 
                required
                placeholder="Enter your password"
              />
            </div>
            
            <button 
              type="submit" 
              class="submit-button"
              :disabled="auth.loading"
            >
              {{ isLogin ? 'Sign In' : 'Create Account' }}
              <span v-if="auth.loading"> ...</span>
            </button>
          </form>
          
          <div class="auth-switch">
            <p v-if="isLogin">
              Don't have an account?
              <button @click="isLogin = false" class="switch-button">Create one</button>
            </p>
            <p v-else>
              Already have an account?
              <button @click="isLogin = true" class="switch-button">Sign in</button>
            </p>
          </div>
        </div>
      </div>
    </main>
    <TheFooter />
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'

const isLogin = ref(true)
const router = useRouter()
const auth = useAuthStore()

const form = ref({
  email: '',
  password: '',
  firstName: '',
  lastName: ''
})

const submitForm = async () => {
  auth.clearError()
  
  if (isLogin.value) {
    const success = await auth.login(form.value.email, form.value.password)
    if (success) {
      router.push('/')
    }
  } else {
    const success = await auth.register({
      email: form.value.email,
      password: form.value.password,
      firstName: form.value.firstName,
      lastName: form.value.lastName
    })
    if (success) {
      router.push('/')
    }
  }
}
</script>

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

.auth-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem 0;
}

.auth-card {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 2.5rem;
  box-shadow: 0 4px 20px var(--shadow-color);
  border: 1px solid var(--border-color);
}

.auth-card h1 {
  margin-bottom: 2rem;
  color: var(--accent-primary);
  text-align: center;
  font-size: 2rem;
}

.error-message {
  background-color: #ffebee;
  color: #d32f2f;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-primary);
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: var(--accent-primary);
}

.submit-button {
  width: 100%;
  padding: 0.75rem;
  background: var(--button-gradient);
  color: var(--button-text);
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.submit-button:hover {
  background: var(--button-hover);
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.auth-switch {
  margin-top: 2rem;
  text-align: center;
  color: var(--text-secondary);
}

.switch-button {
  background: none;
  border: none;
  color: var(--accent-primary);
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  font-size: inherit;
  transition: color 0.3s ease;
}

.switch-button:hover {
  color: var(--accent-secondary);
  text-decoration: underline;
}
</style> 