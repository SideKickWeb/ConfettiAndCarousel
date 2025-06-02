<template>
  <div class="error-container" :class="[`error-${category}`, { 'error-compact': compact }]">
    <div class="error-content">
      <!-- Error Icon -->
      <div class="error-icon" :class="`icon-${category}`">
        <svg v-if="category === 'authentication'" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 12l2 2 4-4"></path>
          <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3"></path>
          <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3"></path>
        </svg>
        <svg v-else-if="category === 'validation'" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <svg v-else-if="category === 'permission'" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <circle cx="12" cy="16" r="1"></circle>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
        <svg v-else-if="category === 'not_found'" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
          <path d="M16 8l-8 8"></path>
          <path d="M8 8l8 8"></path>
        </svg>
        <svg v-else-if="category === 'rate_limit'" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12,6 12,12 16,14"></polyline>
        </svg>
        <svg v-else width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>

      <!-- Error Message -->
      <div class="error-message">
        <h3 class="error-title">{{ errorTitle }}</h3>
        <p class="error-description">{{ message }}</p>
        
        <!-- Additional Details -->
        <div v-if="details && Object.keys(details).length > 0" class="error-details">
          <div v-if="details.fields && details.fields.length > 0" class="validation-errors">
            <p class="details-title">Please check the following:</p>
            <ul class="error-list">
              <li v-for="field in details.fields" :key="field">{{ field }}</li>
            </ul>
          </div>
          
          <div v-if="details.waitTime" class="wait-time-info">
            <p>Please wait {{ details.waitTime }} minute{{ details.waitTime > 1 ? 's' : '' }} before trying again.</p>
          </div>
          
          <div v-if="details.timestamp" class="error-timestamp">
            <p class="timestamp">{{ formatTimestamp(details.timestamp) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div v-if="showActions" class="error-actions">
      <button 
        v-if="category === 'authentication'" 
        @click="goToLogin"
        class="action-button primary"
      >
        Sign In
      </button>
      
      <button 
        v-if="category === 'not_found'" 
        @click="goHome"
        class="action-button primary"
      >
        Go Home
      </button>
      
      <button 
        v-if="canRetry" 
        @click="$emit('retry')"
        class="action-button secondary"
      >
        Try Again
      </button>
      
      <button 
        v-if="showSupport" 
        @click="contactSupport"
        class="action-button secondary"
      >
        Contact Support
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  message: {
    type: String,
    required: true
  },
  category: {
    type: String,
    default: 'server_error'
  },
  errorCode: {
    type: String,
    default: null
  },
  details: {
    type: Object,
    default: () => ({})
  },
  compact: {
    type: Boolean,
    default: false
  },
  showActions: {
    type: Boolean,
    default: true
  },
  canRetry: {
    type: Boolean,
    default: false
  },
  showSupport: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['retry'])

const errorTitle = computed(() => {
  switch (props.category) {
    case 'authentication':
      return 'Authentication Required'
    case 'validation':
      return 'Invalid Information'
    case 'permission':
      return 'Access Denied'
    case 'not_found':
      return 'Not Found'
    case 'rate_limit':
      return 'Too Many Requests'
    case 'database':
      return 'Service Temporarily Unavailable'
    case 'external_service':
      return 'External Service Error'
    default:
      return 'Something Went Wrong'
  }
})

const formatTimestamp = (timestamp) => {
  return new Date(timestamp).toLocaleString()
}

const goToLogin = () => {
  navigateTo('/login')
}

const goHome = () => {
  navigateTo('/')
}

const contactSupport = () => {
  // You can customize this based on your support system
  window.location.href = 'mailto:support@confettiandcarousel.com?subject=Error Report'
}
</script>

<style scoped>
.error-container {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 12px var(--shadow-color);
  text-align: center;
  max-width: 500px;
  margin: 0 auto;
}

.error-compact {
  padding: 1rem;
  text-align: left;
}

.error-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.error-compact .error-content {
  flex-direction: row;
  text-align: left;
  gap: 1rem;
}

.error-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.error-compact .error-icon {
  width: 48px;
  height: 48px;
}

.icon-authentication {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.icon-validation {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.icon-permission {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.icon-not_found {
  background: rgba(107, 114, 128, 0.1);
  color: #6b7280;
}

.icon-rate_limit {
  background: rgba(168, 85, 247, 0.1);
  color: #a855f7;
}

.icon-database,
.icon-server_error,
.icon-external_service {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.error-message {
  flex: 1;
}

.error-title {
  color: var(--text-primary);
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.error-compact .error-title {
  font-size: 1.2rem;
  margin-bottom: 0.25rem;
}

.error-description {
  color: var(--text-secondary);
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.error-compact .error-description {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.error-details {
  text-align: left;
  margin-top: 1rem;
}

.details-title {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.error-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.error-list li {
  color: var(--text-secondary);
  font-size: 0.85rem;
  padding: 0.25rem 0;
  padding-left: 1rem;
  position: relative;
}

.error-list li::before {
  content: '•';
  color: #ef4444;
  position: absolute;
  left: 0;
}

.validation-errors {
  background: rgba(239, 68, 68, 0.05);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.wait-time-info {
  background: rgba(168, 85, 247, 0.05);
  border: 1px solid rgba(168, 85, 247, 0.2);
  border-radius: 6px;
  padding: 1rem;
  color: #a855f7;
  font-weight: 500;
  margin-bottom: 1rem;
}

.error-timestamp {
  margin-top: 1rem;
}

.timestamp {
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-style: italic;
}

.error-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
  flex-wrap: wrap;
}

.error-compact .error-actions {
  margin-top: 1rem;
}

.action-button {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  font-size: 0.9rem;
}

.action-button.primary {
  background: linear-gradient(to right, var(--accent-primary), var(--accent-secondary));
  color: white;
}

.action-button.primary:hover {
  background: linear-gradient(to right, var(--accent-secondary), var(--accent-primary));
  transform: translateY(-1px);
}

.action-button.secondary {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.action-button.secondary:hover {
  background: var(--hover-bg);
}

/* Error type specific styling */
.error-authentication {
  border-left: 4px solid #3b82f6;
}

.error-validation {
  border-left: 4px solid #f59e0b;
}

.error-permission {
  border-left: 4px solid #ef4444;
}

.error-not_found {
  border-left: 4px solid #6b7280;
}

.error-rate_limit {
  border-left: 4px solid #a855f7;
}

.error-database,
.error-server_error,
.error-external_service {
  border-left: 4px solid #ef4444;
}

/* Responsive design */
@media (max-width: 640px) {
  .error-container {
    padding: 1.5rem;
    margin: 1rem;
  }
  
  .error-actions {
    flex-direction: column;
  }
  
  .action-button {
    width: 100%;
  }
}
</style> 