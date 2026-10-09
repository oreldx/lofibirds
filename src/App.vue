<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import GardenScene from './components/GardenScene.vue'
import GardenPanel from './components/GardenPanel.vue'
import PlaybackControl from './components/PlaybackControl.vue'
import AboutModal from './components/AboutModal.vue'

const mobileQuery = window.matchMedia('(width < 768px)')
const isMobile = ref(mobileQuery.matches)
const uiVisible = ref(true)
const sceneTrigger = ref<HTMLButtonElement | null>(null)
const panelOpen = ref(!isMobile.value)
const panelTrigger = ref<HTMLButtonElement | null>(null)
const aboutOpen = ref(false)
const aboutTrigger = ref<HTMLButtonElement | null>(null)

function updateViewport(): void {
  isMobile.value = mobileQuery.matches
}

async function toggleUi(): Promise<void> {
  uiVisible.value = !uiVisible.value
  await nextTick()
  sceneTrigger.value?.focus({ preventScroll: true })
}

async function closePanel(): Promise<void> {
  panelOpen.value = false
  await nextTick()
  panelTrigger.value?.focus()
}

async function closeAbout(): Promise<void> {
  aboutOpen.value = false
  await nextTick()
  aboutTrigger.value?.focus({ preventScroll: true })
}

onMounted(() => mobileQuery.addEventListener('change', updateViewport))
onBeforeUnmount(() => mobileQuery.removeEventListener('change', updateViewport))
</script>

<template>
  <main class="garden-app" :class="{ 'garden-drawer-open': uiVisible && panelOpen }">
    <div class="garden-viewport">
      <GardenScene />
      <button
        ref="sceneTrigger"
        type="button"
        class="scene-ui-toggle"
        :aria-label="uiVisible ? 'Masquer l’interface' : 'Afficher l’interface'"
        @click="toggleUi"
      />
      <header v-show="uiVisible" class="page-header">
        <h1 class="wordmark">Lofibirds</h1>
      </header>
      <div v-show="uiVisible" class="scene-controls">
        <div class="scene-actions">
          <PlaybackControl />
          <button
            v-show="!panelOpen"
            ref="panelTrigger"
            type="button"
            class="drawer-button"
            aria-label="Ouvrir les réglages"
            aria-controls="garden-panel"
            :aria-expanded="panelOpen"
            @click="panelOpen = true"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M4 6h16M4 12h16M4 18h16M9 3v6M15 9v6M9 15v6" />
            </svg>
            <span class="drawer-button-label">Réglages</span>
          </button>
        </div>
      </div>
      <button
        v-show="uiVisible"
        ref="aboutTrigger"
        type="button"
        class="about-button"
        aria-label="À propos et crédits"
        aria-haspopup="dialog"
        aria-controls="about-modal"
        @click="aboutOpen = true"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v6" />
          <circle cx="12" cy="7" r="1" fill="currentColor" stroke="none" />
        </svg>
      </button>
    </div>
    <GardenPanel :open="uiVisible && panelOpen" :is-mobile="isMobile" @close="closePanel" />
    <AboutModal :open="uiVisible && aboutOpen" @close="closeAbout" />
  </main>
</template>
