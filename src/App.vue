<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import GardenScene from './components/GardenScene.vue'
import GardenPanel from './components/GardenPanel.vue'
import PlaybackControl from './components/PlaybackControl.vue'
import AboutModal from './components/AboutModal.vue'

const mobileQuery = window.matchMedia('(width < 768px)')
const isMobile = ref(mobileQuery.matches)
const uiVisible = ref(true)
const sceneViewport = ref<HTMLDivElement | null>(null)
const sceneContent = ref<HTMLDivElement | null>(null)
const sceneTrigger = ref<HTMLButtonElement | null>(null)
const panelOpen = ref(!isMobile.value)
const panelTrigger = ref<HTMLButtonElement | null>(null)
const aboutOpen = ref(false)
const aboutTrigger = ref<HTMLButtonElement | null>(null)
let sceneResizeObserver: ResizeObserver | undefined
let sceneWidth = 0
let viewportWidth = 0
let horizontalPosition = 0.5

function restoreScenePosition(): void {
  const viewport = sceneViewport.value
  if (!viewport) return

  viewport.scrollLeft = horizontalPosition * Math.max(0, viewport.scrollWidth - viewport.clientWidth)
  sceneWidth = viewport.scrollWidth
  viewportWidth = viewport.clientWidth
}

function rememberScenePosition(): void {
  const viewport = sceneViewport.value
  if (!viewport || viewport.scrollWidth !== sceneWidth || viewport.clientWidth !== viewportWidth) return

  const horizontalRange = viewport.scrollWidth - viewport.clientWidth
  if (horizontalRange > 0) horizontalPosition = viewport.scrollLeft / horizontalRange
}

function handleSceneWheel(event: WheelEvent): void {
  const viewport = sceneViewport.value
  if (!viewport || viewport.scrollWidth <= viewport.clientWidth ||
    Math.abs(event.deltaX) > Math.abs(event.deltaY) * 0.25) return

  const distance = event.deltaY * (event.deltaMode === WheelEvent.DOM_DELTA_LINE
    ? 16
    : event.deltaMode === WheelEvent.DOM_DELTA_PAGE ? viewport.clientWidth : 1)
  const nextPosition = Math.max(0, Math.min(
    viewport.scrollWidth - viewport.clientWidth,
    viewport.scrollLeft + distance,
  ))
  if (nextPosition === viewport.scrollLeft) return

  event.preventDefault()
  viewport.scrollLeft = nextPosition
}

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

onMounted(() => {
  mobileQuery.addEventListener('change', updateViewport)
  restoreScenePosition()
  sceneResizeObserver = new ResizeObserver(restoreScenePosition)
  if (sceneViewport.value) sceneResizeObserver.observe(sceneViewport.value)
  if (sceneContent.value) sceneResizeObserver.observe(sceneContent.value)
})
onBeforeUnmount(() => {
  mobileQuery.removeEventListener('change', updateViewport)
  sceneResizeObserver?.disconnect()
})
</script>

<template>
  <main class="garden-app" :class="{ 'garden-drawer-open': uiVisible && panelOpen }">
    <div ref="sceneViewport" class="garden-viewport" role="region" aria-label="Jardin défilable horizontalement" tabindex="0" @scroll="rememberScenePosition" @wheel="handleSceneWheel">
      <div ref="sceneContent" class="garden-scroll-content">
        <GardenScene />
        <button
          ref="sceneTrigger"
          type="button"
          class="scene-ui-toggle"
          :aria-label="uiVisible ? 'Masquer l’interface' : 'Afficher l’interface'"
          @click="toggleUi"
        />
      </div>
    </div>
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
    <GardenPanel :open="uiVisible && panelOpen" :is-mobile="isMobile" @close="closePanel" />
    <AboutModal :open="uiVisible && aboutOpen" @close="closeAbout" />
  </main>
</template>
