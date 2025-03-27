<template>
  <div class="theme-switch-wrapper">
    <button 
      class="theme-switch" 
      :class="{ 'dark': colorScheme === 'dark' }"
      @click="toggleColorScheme"
      :aria-label="colorScheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
    >
      <div class="switch-content">
        <div class="icon-wrapper">
          <div class="icons">
            <div class="sun">
              <span class="ray" v-for="n in 8" :key="n" :style="{ transform: `rotate(${n * 45}deg)` }"></span>
              <div class="center"></div>
            </div>
            <div class="moon">
              <div class="crater" v-for="n in 3" :key="n"></div>
            </div>
          </div>
        </div>
        <span class="theme-label">{{ colorScheme === 'dark' ? 'Light Theme' : 'Dark Theme' }}</span>
      </div>
    </button>
  </div>
</template>

<script setup>
const { colorScheme, toggleColorScheme, initColorScheme } = useColorScheme()

onMounted(() => {
  initColorScheme()
})
</script>

<style scoped>
.theme-switch-wrapper {
  margin-left: 2rem;
}

.theme-switch {
  padding: 0.5rem 1rem;
  border-radius: 25px;
  background: var(--bg-secondary);
  border: 2px solid var(--border-color);
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--text-primary);
}

.switch-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.icon-wrapper {
  width: 24px;
  height: 24px;
}

.icons {
  width: 100%;
  height: 100%;
  position: relative;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.sun, .moon {
  position: absolute;
  width: 100%;
  height: 100%;
  transition: opacity 0.5s ease;
}

.sun {
  opacity: 1;
}

.moon {
  opacity: 0;
}

.sun .center {
  position: absolute;
  width: 12px;
  height: 12px;
  background: var(--accent-primary);
  border-radius: 50%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.sun .ray {
  position: absolute;
  width: 2px;
  height: 6px;
  background: var(--accent-primary);
  left: 50%;
  top: 50%;
  transform-origin: 0 0;
}

.moon .crater {
  position: absolute;
  background: var(--text-secondary);
  border-radius: 50%;
}

.moon .crater:nth-child(1) {
  width: 6px;
  height: 6px;
  top: 25%;
  left: 25%;
}

.moon .crater:nth-child(2) {
  width: 4px;
  height: 4px;
  top: 45%;
  right: 25%;
}

.moon .crater:nth-child(3) {
  width: 3px;
  height: 3px;
  bottom: 25%;
  left: 40%;
}

.theme-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-primary);
  white-space: nowrap;
}

.theme-switch:hover {
  background: var(--bg-primary);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px var(--shadow-color);
}

.theme-switch.dark .icons {
  transform: rotate(180deg);
}

.theme-switch.dark .sun {
  opacity: 0;
}

.theme-switch.dark .moon {
  opacity: 1;
}

@media (max-width: 768px) {
  .theme-switch-wrapper {
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    margin-left: 0;
    z-index: 100;
  }

  .theme-switch {
    padding: 0.75rem;
    border-radius: 50%;
    background: var(--bg-secondary);
    border: 2px solid var(--border-color);
    box-shadow: 0 2px 10px var(--shadow-color);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .theme-label {
    display: none;
  }
  
  .icon-wrapper {
    width: 24px;
    height: 24px;
    margin: 0;
  }

  .switch-content {
    gap: 0;
  }
}

/* Add specific styles for 1024-1130px viewport width */
@media (min-width: 1024px) and (max-width: 1130px) and (min-height: 1280px) {
  .theme-switch-wrapper {
    margin-left: 1rem;
  }

  .theme-switch {
    padding: 0.4rem 0.8rem;
  }

  .switch-content {
    gap: 0.5rem;
  }

  .theme-label {
    font-size: 0.8rem;
  }

  .icon-wrapper {
    width: 20px;
    height: 20px;
  }
}
</style> 