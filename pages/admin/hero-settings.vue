<template>
  <div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6">Hero Settings</h1>
    
    <div v-if="loading" class="text-center py-10">
      <div class="loader"></div>
      <p class="mt-4">Loading hero settings...</p>
    </div>
    
    <div v-else class="bg-white rounded-lg shadow-md p-6">
      <form @submit.prevent="saveSettings">
        <!-- Hero Image URL -->
        <div class="mb-4">
          <label for="imageUrl" class="block text-sm font-medium text-gray-700">Hero Image URL</label>
          <input 
            id="imageUrl" 
            v-model="form.imageUrl" 
            type="text" 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand focus:ring focus:ring-brand focus:ring-opacity-50" 
            required
          />
          <p class="text-sm text-gray-500 mt-1">Enter the URL for the hero image (ideally 1920x1080px)</p>
        </div>
        
        <!-- Title -->
        <div class="mb-4">
          <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
          <input 
            id="title" 
            v-model="form.title" 
            type="text" 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand focus:ring focus:ring-brand focus:ring-opacity-50" 
            required
          />
        </div>
        
        <!-- Description -->
        <div class="mb-4">
          <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
          <textarea 
            id="description" 
            v-model="form.description" 
            rows="3" 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand focus:ring focus:ring-brand focus:ring-opacity-50"
            required
          ></textarea>
        </div>
        
        <!-- Button Text -->
        <div class="mb-4">
          <label for="buttonText" class="block text-sm font-medium text-gray-700">Button Text</label>
          <input 
            id="buttonText" 
            v-model="form.buttonText" 
            type="text" 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand focus:ring focus:ring-brand focus:ring-opacity-50" 
            required
          />
        </div>
        
        <!-- Button Link -->
        <div class="mb-4">
          <label for="buttonLink" class="block text-sm font-medium text-gray-700">Button Link</label>
          <input 
            id="buttonLink" 
            v-model="form.buttonLink" 
            type="text" 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand focus:ring focus:ring-brand focus:ring-opacity-50" 
            required
          />
        </div>
        
        <!-- Text Position -->
        <div class="mb-4">
          <label for="textPosition" class="block text-sm font-medium text-gray-700">Text Position</label>
          <select 
            id="textPosition" 
            v-model="form.textPosition" 
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-brand focus:ring focus:ring-brand focus:ring-opacity-50"
            required
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>
        
        <!-- Active Status -->
        <div class="mb-6">
          <label class="inline-flex items-center">
            <input 
              type="checkbox" 
              v-model="form.active" 
              class="rounded border-gray-300 text-brand shadow-sm focus:border-brand focus:ring focus:ring-brand focus:ring-opacity-50"
            />
            <span class="ml-2">Active</span>
          </label>
          <p class="text-sm text-gray-500 mt-1">Only one hero setting can be active at a time</p>
        </div>
        
        <!-- Preview -->
        <div class="mb-6">
          <h3 class="text-lg font-medium mb-3">Preview</h3>
          <div class="border rounded-lg overflow-hidden">
            <div class="relative h-48 bg-gray-200">
              <img v-if="form.imageUrl" :src="form.imageUrl" class="w-full h-full object-cover" />
              <div 
                class="absolute inset-0 p-6 flex items-center"
                :class="{
                  'justify-start': form.textPosition === 'left',
                  'justify-center': form.textPosition === 'center',
                  'justify-end': form.textPosition === 'right'
                }"
              >
                <div class="bg-white bg-opacity-80 p-4 rounded-lg shadow-md max-w-md">
                  <h2 class="text-xl font-bold">{{ form.title || 'Hero Title' }}</h2>
                  <p class="mt-1">{{ form.description || 'Hero description text' }}</p>
                  <button class="mt-2 bg-brand text-white px-4 py-2 rounded-md">
                    {{ form.buttonText || 'Button Text' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Submit Button -->
        <div class="flex justify-end">
          <button 
            type="submit" 
            class="px-6 py-2 text-white bg-brand rounded-md hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-brand focus:ring-opacity-50"
            :disabled="saving"
          >
            {{ saving ? 'Saving...' : 'Save Settings' }}
          </button>
        </div>
      </form>
    </div>
    
    <!-- Status Messages -->
    <div v-if="successMessage" class="mt-4 p-4 bg-green-100 text-green-800 rounded-md">
      {{ successMessage }}
    </div>
    <div v-if="errorMessage" class="mt-4 p-4 bg-red-100 text-red-800 rounded-md">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useAuthStore } from '../../stores/auth';

const authStore = useAuthStore();
const loading = ref(true);
const saving = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const form = ref({
  id: null,
  imageUrl: '',
  title: '',
  description: '',
  buttonText: '',
  buttonLink: '',
  textPosition: 'left',
  active: true
});

// Load existing hero settings
onMounted(async () => {
  try {
    const data = await $fetch('/api/hero');
    
    if (data) {
      form.value = {
        id: data.id,
        imageUrl: data.imageUrl,
        title: data.title,
        description: data.description,
        buttonText: data.buttonText,
        buttonLink: data.buttonLink || '/products',
        textPosition: data.textPosition || 'left',
        active: data.active !== false
      };
    }
  } catch (error) {
    console.error('Error loading hero settings:', error);
    errorMessage.value = 'Failed to load hero settings';
  } finally {
    loading.value = false;
  }
});

// Save hero settings
async function saveSettings() {
  saving.value = true;
  successMessage.value = '';
  errorMessage.value = '';
  
  try {
    // Map form.active to isActive for API compatibility
    const requestData = {
      ...form.value,
      isActive: form.value.active
    };
    
    const response = await $fetch('/api/admin/hero-settings', {
      method: 'POST',
      body: requestData
    });
    
    if (response.success) {
      successMessage.value = 'Hero settings saved successfully!';
      form.value.id = response.data.id;
    } else {
      errorMessage.value = response.error || 'Failed to save hero settings';
    }
  } catch (error) {
    console.error('Error saving hero settings:', error);
    errorMessage.value = 'Failed to save hero settings';
  } finally {
    saving.value = false;
  }
}

// Check if user is admin
const checkAdmin = () => {
  if (!authStore.isAuthenticated || !authStore.isAdmin) {
    navigateTo('/login');
  }
};

onMounted(async () => {
  await authStore.fetchUser();
  checkAdmin();
});
</script>

<style scoped>
.loader {
  border: 5px solid #f3f3f3;
  border-top: 5px solid var(--color-brand);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style> 